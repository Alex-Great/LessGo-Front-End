<template>

    <div class="trips container" :class="!user ? 'not-logged' : ''">
        <div class="trips_title" v-show="!isMobile">
            <h1>Search with whom to share your next trip!</h1>
            <h3>Choose date, origin or destination and find it!</h3>
        </div>
        <template v-if="appConfig && appConfig.banner && appConfig.banner.url">
            <a :href="appConfig.banner.url" target="_blank" class="banner">
                <img alt="" :src="appConfig.banner.image" />
            </a>
        </template>
        <div v-show="!user && isMobile">
        </div>
        <SearchBox :params="searchParams" v-on:trip-search="research" v-show="!isMobile || lookSearch" ref="searchBox"></SearchBox>
        <Loading :data="trips" v-if="showingTrips">
            <div class="trips-list-search row">
                <modal :name="'modal'" v-if="showModal" @close="showModal = false" :title="'Test'" :body="'Body'">
                    <h3 slot="header">
                        <span>Give to LessGo</span>
                        <br class="hidden-sm hidden-md hidden-lg">
                        <small>un proyecto de </small>
                        <img width="90" alt="LessGo" src="https://lessgo.app/app/img/logo_sts_nuevo_color.png">
                    </h3>

                </modal>
                <template v-for="(trip, index) in trips">
                    <template v-if="isComplementary(trip, searchParams, index)">
                        <div class="trip-complementary">
                        </div>
                    </template>
                    <!-- <Trip :trip="trip" :user="user"></Trip>      -->
                    <ProfileTicket :user='user' :trip='trip'></ProfileTicket>

                </template>
            </div>
            <div class="row">
                <p class="notice notice-warning"  role="alert"  :class="isMobile ? 'mobile-alert-info' : ''" v-if="resultaOfSearch && !alreadySubscribe">
                    <!-- <span class="sentence">Oops! There are no trips with the criteria indicated in the search.</span> -->

                    <span class="sentence">
                        <strong :class="isMobile ? 'sentence' : ''">Now you can subscribe to be notified when there is a new trip that matches what you are looking for. </strong>
                    <button class="btn btn-primary notice" v-if="user" @click="subscribeSearch" >Notify me when a ride is offered</button>
                      <div v-show="!user && isMobile">
                     <router-link :to="{name: 'login'}" class="login_usuario"> Login with your user or register <span class='underline'>Here</span> !</router-link>
                    </div>
                    </span>
                </p>
            </div>
            <!--
            <div v-if="morePages">
                <button class="btn btn-primary" @click="nextPage">More results</button>
            </div>
            -->
            <div v-if="runningSearch" class="more-trips-loading">
                <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                Loading more results
            </div>
            <p slot="no-data"   role="alert"  :class="isMobile ? 'mobile-alert' : ''">
                   <span class="no-result-image">
                                        <img src="/static/svg/no_result.svg" alt="" class="no-result" />
                    </span>
                <span class="sentence" id="no-result-text">No rides were found :( 
                      <div v-show="!user && isMobile">              
                       <router-link :to="{name: 'login'}" class="login_usuario"> Login with your user or register <span class='underline'>Here</span> !</router-link>
                       </div>
                    </span>

                <span class="sentence" v-if="!alreadySubscribe">
                    <button class="btn btn-primary alert" v-if="user" @click="subscribeSearch" >Notify me when a ride is offered</button>
                    <router-link class="btn btn-primary request" v-if="user" :to="{name:'new-trip'}"> <p id="editbuttontext">Post a request to nearby drivers</p></router-link>


                </span>
            </p>
            <p slot="loading" class="alert alert-info" role="alert">
                <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                Loading trips ...
            </p>
        </Loading>
    </div>
</template>
<style scoped>


a.btn.btn-primary.request {
    height: 3em;
    color: #5B5B5B;
    background-color: transparent;
    border-radius: 10px;
    width: 100%;
    border: 1px solid #5B5B5B;
    margin-bottom: 10px;
}

p#editbuttontext {
    margin: 24px 0;
    margin: 0.7rem 0;
    font-size: 14.4px;
    font-size: 1em;
    line-height: 0px;
}
.sentence {
    display: block;
    margin-bottom: .5em;
}
.mobile-alert .sentence {
    margin-bottom: 1em;
}
.mobile-alert .btn {
    margin: 0 auto;
    display: block;
}
</style>

<script>
import ProfileTicket from '../views/ProfileTicket';
import Trip from '../sections/Trip.vue';
import SearchBox from '../sections/SearchTrip.vue';
import Loading from '../Loading.vue';
import bus from '../../services/bus-event.js';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import router from '../../router';
import dialogs from '../../services/dialogs.js';
import modal from '../Modal';

export default {
    name: 'search',
    data () {
        return {
            lookSearch: true,
            filtered: false,
            runningSearch: false,
            alreadySubscribe: false,
            resultaOfSearch: false,
            showModal: false
        };
    },
    props: [
        'clearSearch', 'keepSearch'
    ],
    methods: {
        ...mapActions({
            search: 'trips/tripsSearch',
            refreshTrips: 'trips/refreshList',
            subscribeToSearch: 'subscriptions/create',
            findSubscriptions: 'subscriptions/index',
            morePagesActions: 'trips/tripMorePage',
            setActionButton: 'actionbars/setHeaderButtons'
        }),
        research (params) {
            console.log('research', params);
            this.resultaOfSearch = true;
            this.lookSearch = false;
            this.filtered = true;
            this.readySub = false;
            this.alreadySubscribe = false;
            this.search(params);
            this.findSubscriptions();
            this.setActionButton(['clear']);
        },
        nextPage () {
            this.search({next: true});
        },
        isComplementary (trip, searchParams, index) {
            let isComplementary = false;
            if (searchParams.data && searchParams.data.date) {
                var searchDate = moment(searchParams.data.date).toDate();
                var tripDate = moment(trip.trip_date).toDate();
                tripDate.setHours(0);
                tripDate.setMinutes(0);
                tripDate.setSeconds(0);
                if (searchDate.getTime() === tripDate.getTime()) {
                    isComplementary = false;
                } else {
                    isComplementary = true;
                }
            }
            return isComplementary;
        },

        onSearchButton () {
            console.log('onSearchButton');
            this.lookSearch = true;
            this.setActionButton(['clear']);
            bus.on('backbutton', this.onBackBottom);
        },
        onClearButton () {
            bus.off('backbutton', this.onBackBottom);
            bus.on('scroll-bottom', this.onScrollBottom);
            this.setActionButton(['']);
            this.filtered = false;
            this.lookSearch = true;
            this.alreadySubscribe = false;
            this.search({ is_passenger: false });
            if (this.$refs.searchBox) {
                this.$refs.searchBox.clear();
            }
        },
        onScrollBottom () {
            if (this.morePages && !this.lookSearch) {
                if (!this.runningSearch) {
                    this.runningSearch = true;
                    let done = () => {
                        this.runningSearch = false;
                    };
                    this.search({next: true}).then(done, done);
                }
            }
        },
        onBackBottom () {
            bus.off('backbutton', this.onBackBottom);
            this.lookSearch = false;
            this.alreadySubscribe = false;
        },
        onOpenLink (link) {
            window.open(link, '_blank');
        },
        subscribeSearch () {
            let params = this.searchParams.data;
            let data = {};
            if (params.date) {
                data.trip_date = params.date;
            }
            if (params.origin_name) {
                data.from_address = params.origin_name;
                data.from_lat = params.origin_lat;
                data.from_lng = params.origin_lng;
                data.from_radio = params.origin_radio;
                data.from_json_address = [];
            }
            if (params.destination_name) {
                data.to_address = params.destination_name;
                data.to_lat = params.destination_lat;
                data.to_lng = params.destination_lng;
                data.to_radio = params.destination_radio;
                data.to_json_address = [];
            }

            data.is_passenger = params.is_passenger;

            this.subscribeToSearch(data).then(() => {
                this.alreadySubscribe = true;
                dialogs.message('You subscribed correctly. We will notify you when there are similar trips', { duration: 10, state: 'success' });
            }).catch((response) => {
                console.log(response);
                if (response.data.errors && response.data.errors.error) {
                    if (response.data.errors.error[0] === 'subscription_exist') {
                        dialogs.message('You already have a subscription for this search.', { duration: 10, state: 'error' });
                    }
                }
            });
        }
    },
    mounted () {
        // Clear search
        if (this.clearSearch) {
            this.onClearButton();
        } else {
            // Tendria que recargar desde la búsqueda anterior
            if (this.$refs.searchBox) {
                this.$refs.searchBox.loadParams(this.searchParams.data);
            }
        }
        if (!this.keepSearch) {
            this.$refs.searchBox.clear();
        }

        // bus.event
        bus.off('search-click', this.onSearchButton);
        bus.on('search-click', this.onSearchButton);
        bus.off('clear-click', this.onClearButton);
        bus.on('clear-click', this.onClearButton);
        bus.off('scroll-bottom', this.onScrollBottom);
        bus.on('scroll-bottom', this.onScrollBottom);

        router.stack = [];
    },
    updated (a) {

        // Pendiente, no se limpia el buscador, si los search params están vacios
    },
    beforeDestroy () {
        bus.off('search-click', this.onSearchButton);
        bus.off('clear-click', this.onClearButton);
        bus.off('scroll-bottom', this.onScrollBottom);
        bus.off('backbutton', this.onBackBottom);
    },
    watch: {
        search: function (params) {
            if (this.refreshList) {
                this.refreshTrips(false);
                this.lookSearch = false;
                this.resultaOfSearch = false;
                this.$refs.searchBox.clear();
            }
        }
    },
    computed: {
        ...mapGetters({
            trips: 'trips/trips',
            morePages: 'trips/tripsMorePage',
            user: 'auth/user',
            searchParams: 'trips/tripsSearchParam',
            isMobile: 'device/isMobile',
            isBrowser: 'device/isBrowser',
            refreshList: 'trips/refreshList',
            subscriptions: 'subscriptions/subscriptions',
            appConfig: 'auth/appConfig'
        }),

        showingTrips () {
            return !this.isMobile || !this.lookSearch;
        }
    },
    components: {
        Trip,
        Loading,
        SearchBox,
        modal,
        ProfileTicket
    }
};
</script>

<style>
.search-section {
    margin-top: 25% !important;
}

.container {
    padding-left: 0px !important;
    padding-right: 0px !important;
}
</style>

<style scoped>
div#infoText {
    font-size: 11px;
}
#ticketButton{
    right: -10%;
}
.banner {
    display: block;
    margin: -1em auto 1em;
    text-align: center;
}
.banner img {
    border: 1px solid #999;
    width: 100%;
    max-width: 934px;
}
.btn-donar {
    margin-left: 2em;
    margin-right: 2em;
    margin-top: 1em;
    padding: 1em 2em;
    font-size: 1.3em;
}
.shadow{
    width: 100%;
}

.no-result-image {
    display: flex;
    align-content: center;
    justify-content: flex-start;;
}

#no-result-text{
    color: #000000;
    font-size:18px;
    margin-top: 7em;
    font-weight: bolder;
}

p.mobile-alert {
    margin-top: 2em;
    flex-wrap: wrap;
    display: flex;
    justify-content: center;
    padding: 2em;
    flex-direction: column;
    text-align: left;
}

a.btn.btn-primary.request {
    min-height: 48px;
}

button.btn.btn-primary.alert {
    color: white;
    background-color: #E65A5B;
    border-radius: 10px;
    width: 100%;
    margin-bottom:10px;
    box-shadow: 0px 0px 10px 0px #EB5557;
}

button.btn.btn-primary.request {
    color: #5B5B5B;
    border-radius: 10px;
    border: 1px solid #5B5B5B;
    background-color: transparent;
    border-radius: 10px;
    width: 100%;
}

img.no-result {
    height: 30%;
    width: 100%;
    margin-top: 1em;
    }

p.alert.alert-warning.mobile-alert-info {
    background-color: transparent;
    padding: 3em;
    color: black;
    font-size: 14px;
    text-align: center;
    border: none;
}

.sentence {
    display: block;
    margin-bottom: 1.5em;
}


p.notice.notice-warning.mobile-alert-info {
    padding: 1em;
    text-align: center;
    margin-bottom: 4em;
}
</style>
