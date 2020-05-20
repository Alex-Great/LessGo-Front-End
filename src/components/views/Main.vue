<template>
    <div class="main-body">
        <div>
            <img :src="main_bk_img" class="main_img" />
            <dropdownMenu @reverse="reverse" />
            <!-- <div class="go-title">
                <div class="col-xs-6 go-title-margin" style="background: #eb5557">
                    <span style="color: #f4a1a2">GQ</span>
                    <span style="color: white">Pool</span>
                </div>
                <div class="col-xs-8 col-xs-offset-2 go-title-margin" style="padding: 3px">
                    <span style="color: #eb5557">GQ</span>
                    <span>Experiences</span>
                </div>
                <div class="col-xs-8 go-title-margin">
                    <span style="color: #eb5557">GQ</span>
                    <span>FIFA&nbsp;22</span>
                </div>
            </div> -->

            <!-- search area -->
            <div class="searchArea" :style="reserveFlag? 'margin-top: 4em !important; box-shadow: 0px -6px 10px #d9e7e5;': ''">
                <span class="search-title">
                    Where do you want to go?
                </span>
                <span class="trips-head">
                    Popular trips
                </span>

                <!-- popular trips area -->
                <div v-if="showFlag === true" class="trips-area">
                    <!-- posted trips -->
                    <VueSlickCarousel v-bind="settings">
                        <div @click="goDetail(post)" v-for="post in postTrips" class="amman"  :style="{'background': 'url(' + post.image_url + ')'}">
                            <div class="trip-area-title">
                                <span>
                                    {{ post.provinceFrom }}
                                </span>
                                <v-icon class="v-icon-exchange-alt" icon="exchange-alt" />
                                <span>
                                    {{ post.provinceTo }}
                                </span>
                                <span class="JD">
                                    JD&nbsp;{{ post.payment }}
                                </span>
                            </div>
                        </div>
                    </VueSlickCarousel>
                </div>

                <!-- search body -->
                <div class="search-body">
                    <span class="some-span">Somewhere else?</span>
                    <tripSearch @searchResult="result" />
                </div>

                <!-- button areas -->
                <div class="button-area">
                    <button class="search-btn" @click="searchNewTrip">
                        <span>
                            Search
                        </span>
                        <arrowUpIcon />
                    </button>
                    <button class="offer-ride" @click="offerRide">
                        <carIcon :size="20" :color="'#D5E9E8'" style="margin-top: -3px;" />
                        <span>Offer ride</span>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="loading_flag">
            <img class="loading-img" :src="loading_img" />
            <span>Loading Popular Trips</span>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
import moment from 'moment';

// import components for this
import tripSearch from '../sections/TripSearch';
import arrowUpIcon from '../../icon/ArrowUpIcon';
import dropdownMenu from '../../icon/DropdownMenu';
import ratingStarIcon from '../../icon/RatingStarIcon';
import carIcon from '../../icon/CarIcon.vue';

export default {
    name: 'main',
    data () {
        return {
            main_bk_img: '/static/img/landing-bg.png',
            loading_img: process.env.ROUTE_BASE + 'static/svg/loaderr.gif',
            test_img: process.env.ROUTE_BASE + 'static/img/amman.jpg',
            from_town: '',
            to_town: '',
            date: '',
            reserveFlag: false,
            postTrips: null,
            loading_flag: true,
            settings: {
                'dots': true,
                'autoplay': true,
                'autoplaySpeed': 1000,
                'speed': 2000,
                'pauseOnDotsHover': true,
                'pauseOnFocus': true,
                'pauseOnHover': true,
                'variableWidth': true,
                'arrows': true,
                'rtl': true
            },
            showFlag: false
        };
    },
    components: {
        tripSearch,
        arrowUpIcon,
        dropdownMenu,
        ratingStarIcon,
        carIcon,
        VueSlickCarousel
    },
    methods: {
        ...mapActions({
            getAllUsers: 'auth/getAllUsers',
            tripAsDriver: 'myTrips/tripAsDriver',
            tripAsPassenger: 'myTrips/tripAsPassenger',
            deleteAllTrips: 'userTrips/deleteAllTrips',
            review: 'rates/vote',
            setSelectedTrip: 'trips/setSelectedTrip'
        }),
        goDetail: function (data) {
            this.setSelectedTrip(data);

            // go search result page
            let status = 'popular';
            this.$router.push({name: 'searchResult', params: { data: data, status: status }});
        },
        offerRide: function () {
            this.$router.push({name: 'setCarAndId'});
        },
        searchNewTrip: function () {
            let data = {
                from_town: this.from_town,
                to_town: this.to_town,
                date: this.date
            };

            this.$router.push({name: 'searchResult', params: {data}});
        },
        result: function (obj) {
            this.from_town = obj.from_town;
            this.to_town = obj.to_town;
            this.date = obj.date;
        },
        reverse: function () {
            this.reserveFlag = !this.reserveFlag;
        }
    },
    computed: {
        ...mapGetters({
            trips: 'myTrips/myTrips',
            passengerTrips: 'myTrips/passengerTrips',
            getOtherUsersTripsAsDriver: 'userTrips/driverTrip',
            user: 'auth/user'
        })
    },
    async mounted () {
        await this.deleteAllTrips();
        await this.getAllUsers();
        await this.tripAsDriver();
        await this.tripAsPassenger();
        this.loading_flag = false;
        this.showFlag = true;

        let searchedTrip = this.getOtherUsersTripsAsDriver;
        console.log('------------', this.getOtherUsersTripsAsDriver);
        let postTripsData = [];
        searchedTrip.forEach(trip => {
            if ((this.user.community === trip.community || this.user.community === trip.second_community) || (this.user.second_community === trip.community || this.user.second_community === trip.second_community)) {
                postTripsData.push(trip);
            }
        });
        let allTrips = [];
        // reverse trip search
        if (postTripsData.length !== 0) {
            let fromKey = '';
            let toKey = '';
            let keys = [
                {'first': fromKey, 'second': toKey}
            ];

            postTripsData.forEach(first => {
                let repeatFlag = false;
                keys.forEach(key => {
                    if ((key.first === first.from_town && key.second === first.to_town) || (key.first === first.to_town && key.second === first.from_town)) {
                        repeatFlag = true;
                    }
                });

                if (!repeatFlag) {
                    // reset reverse Keys
                    fromKey = first.from_town;
                    toKey = first.to_town;
                    let keyData = {
                        'first': fromKey,
                        'second': toKey
                    };
                    keys.push(keyData);
                    let commonTrip = {
                        trips: []
                    };
                    commonTrip['from'] = fromKey;
                    commonTrip['to'] = toKey;
                    commonTrip['provinceFrom'] = first.points[0].json_address.province;
                    commonTrip['provinceTo'] = first.points[1].json_address.province;
                    commonTrip['payment'] = first.payment;
                    commonTrip['image_url'] = first.image_url;
                    postTripsData.forEach(second => {
                        if ((second.from_town === fromKey && second.to_town === toKey) || (second.to_town === fromKey && second.from_town === toKey)) {
                            commonTrip.trips.push(second);
                        }
                    });

                    allTrips.push(commonTrip);
                }
            });
        }
        // this.postTrips = postTripsData;
        this.postTrips = allTrips;
    }
};
</script>

<style>
img.loading-img {
    width: 38em !important;
    left: -4em;
    top: 20em;
}
    .main-body {
        position: relative;
    }
    .main-body img {
        width: 100%;
        height: auto;
    }
    .go-title {
        padding: 8px;
        background: #dad8d8;
        border: none;
        border-radius: 20px;
        position: absolute;
        bottom: 6vh;
        left: 5%;
        width: 90%;
        opacity: .9;
    }
    .go-title-margin {
        border-radius: 20px;
        text-align: center;
        color: #000000;
        padding: 3px;
        font-weight: bold;
    }
    .go-title> :last-child {
        margin-right: 0;
        padding-left: 0;
    }
    .searchArea {
        margin-top: -2em !important;
        background: white;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        z-index: 3;
        position: absolute;
        width: 100%;
    }
</style>