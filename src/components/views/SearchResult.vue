<template>
    <div class="searchResult">
        <!-- trip search head -->
        <div class="messages-area">
            <closeIcon :size="10" :classes="'close-message'" />

            <!-- search title -->
            <div class="search-trip-title">
                <span>{{ this.from_town }}</span>
                <arrowIcon v-if="!allFlag" :color="'#abe5c4'" />
                <span v-else style="font-size: 15px;">All Trips</span>
                <span>{{ this.to_town }}</span>
            </div>

            <!-- time and users -->
            <div class="search-trip-date-user">
                <DatePicker
                    ref="datepicker"
                    @onChange="changeDate"
                    :value="date"
                    :format="'D dd MMM'"
                />
                <div class="user-plus">
                    <v-icon :icon="['fas', 'user']" class="v-icon-user" />
                    <span style="padding-right: 5px; font-size: 16px;">{{ searchCounut }}</span>
                </div>
                <v-icon icon="minus" @click="searchTrip(-1)" class="v-icon-maths" />
                <v-icon icon="plus" @click="searchTrip(1)" class="v-icon-maths" />
            </div>

          
        </div>

        <!-- searched drivers detail -->
        <div class="search-trip-area">
            
            <!-- drivers -->
        <Loading :data="trips">
                <profileTicketIcon :allData="data" :searchTitle="status" v-for="trip in trips" :infoFlag="true" :data="trip" @driver-detail="driverDetail" />
                <p slot="no-data" class="alert alert-warning" role="alert">There aren't some trips by another users.</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                    Loading trips ...
                </p>
            </Loading>

                  <!-- return btn area -->
            <div class="not-found" style="text-align: center;">
                <span class="return-title">
                    That's the end of this search <span style="font-size: 15px">:&nbsp;(</span>
                </span>
                <button @click="returnMain" class="return-btn">Search for somewhere else?</button>
            </div>

        
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

// import components for this
import profileTicketIcon from '../../icon/ProfileTicketIcon';
import closeIcon from '../../icon/CloseIcon';
import arrowIcon from '../../icon/ArrowIcon';
import calendarBlueIcon from '../../icon/CalendarBlueIcon';
import Loading from '../Loading';
import DatePicker from '../DatePicker';

// days, months and totalCount for ratings
let totalCount = 5;
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let days = ['Sun', 'Mon', 'Tus', 'Wen', 'Thu', 'Fri', 'Sat'];
let currentDay = new Date();

export default {
    name: 'searchResult',
    data () {
        return {
            from_town: '',
            to_town: '',
            trips: null,
            searchCounut: 1,
            allFlag: false,
            sourceTrips: null,
            date: ''
        }
    },
    async mounted () {
        await this.getAllUsers();
        // check this is a search from popular or standard
        if (this.status === 'popular') {
            this.from_town = this.data.from;
            this.to_town = this.data.to;
            this.date = currentDay.toString();

            let driverTrips = this.data.trips;

            // save cartype each user
            driverTrips.forEach(trip => {
                this.allUsers.forEach(user => {
                    if (trip.user.id === user.id) {
                        trip['cartype'] = user.cartype;
                    }
                });
            });

            this.trips = driverTrips;
            this.sourceTrips = driverTrips;
        } else {
            this.from_town = this.data.from_town;
            this.to_town = this.data.to_town;
            let searchTrips = [];
            let driverTrips = this.getOtherUsersTripsAsDriver;
            let postTripsData = [];
            driverTrips.forEach(trip => {
                if ((this.user.community === trip.community || this.user.community === trip.second_community) || (this.user.second_community === trip.community || this.user.second_community === trip.second_community)) {
                    postTripsData.push(trip);
                }
            });

            if (this.data.from_town === '' && this.data.to_town === '') { // all trips
                this.allFlag = true;
                this.date = currentDay.toString();

                // save cartype each user
                postTripsData.forEach(trip => {
                    this.allUsers.forEach(user => {
                        if (trip.user.id === user.id) {
                            trip['cartype'] = user.cartype;
                        }
                    });
                });
                this.trips = postTripsData;
                this.sourceTrips = postTripsData;
            } else { // searched trips
                postTripsData.forEach(trip => {
                    if (trip.from_town === this.from_town && trip.to_town === this.to_town && moment(this.data.date).toDate() < moment(trip.trip_date).toDate()) {
                        searchTrips.push(trip);
                    }
                });
                // save cartype each user
                searchTrips.forEach(trip => {
                    this.allUsers.forEach(user => {
                        if (trip.user.id === user.id) {
                            trip['cartype'] = user.cartype;
                        }
                    });
                });
                this.trips = searchTrips;
                this.sourceTrips = searchTrips;
                this.date = this.data.date.toString();
            }
        }
        this.deleteAllTrips();
    },
    computed: {
        ...mapGetters({
            getOtherUsersTripsAsDriver: 'userTrips/driverTrip',
            allUsers: 'auth/users',
            user: 'auth/user'
        })
    },
    methods: {
        ...mapActions({
            getAllUsers: 'auth/getAllUsers',
            deleteAllTrips: 'userTrips/deleteAllTrips'
        }),
        returnMain: function () {
            this.$router.push({name: 'main'});
        },
        driverDetail: function (name) {
            let data = this.data;
            this.$router.push({name: 'detail', params: {name: name, data: data, closeTitle: this.status}});
        },
        searchTrip: function (value) {
            let maxcount = 4;
            let currentcount = this.searchCounut;
            currentcount += value;
            if (currentcount > maxcount) {
                this.searchCounut = 1;
            } else if (currentcount < 1) {
                this.searchCounut = maxcount;
            } else {
                this.searchCounut = currentcount;
            }
        },
        changeDate: function (value) {
            let dateTrips = [];
            if (value !== null) {
                this.sourceTrips.forEach(trip => {
                    console.log('--------hello---------', moment(trip.trip_date).toDate() > moment(value).toDate());
                    if (moment(trip.trip_date).toDate() > moment(value).toDate()) {
                        dateTrips.push(trip);
                    }
                });
                console.log('-------serarchedTrips------', dateTrips);
                this.trips = dateTrips;
            }
        }
    },
    watch: {
        searchCounut: function () {
            this.trips = null;
            let searchedTrips = [];
            this.sourceTrips.forEach(trip => {
                if (trip.seats_available === this.searchCounut) {
                    searchedTrips.push(trip);
                }
            });

            this.trips = searchedTrips;
        }
    },
    props: {
        data: {
            type: Object,
            required: false,
            default: null
        },
        status: {
            type: String,
            required: false,
            default: ''
        }
    },
    components: {
        profileTicketIcon,
        closeIcon,
        arrowIcon,
        calendarBlueIcon,
        Loading,
        DatePicker
    }
};
</script>