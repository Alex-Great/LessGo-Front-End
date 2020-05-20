<template>
    <div class="your-trips">
        <!-- trip header -->
        <div class="messages-area">
            <closeIcon :size="12" :classes="'close-message'" style="top: 0 !important;" />

            <!-- title -->
            <div class="trip-title">
                <div @click="setTitle('upcoming')" class="col-xs-12 text-center count-circle">
                    <span :style="setUpcoming? 'color: black': 'color: #a3a3a7'">UPCOMING</span>
                    <div v-if="count !== 0" class="upcoming-count" :style="setUpcoming? 'opacity: 1': 'opacity: .7'">
                        <span>{{ count }}</span>
                    </div>
                </div>
                <div @click="setTitle('history')" class="col-xs-12 text-center">
                    <span :style="setHistory? 'color: black': 'color: #a3a3a7'">HISTORY</span>
                </div>
            </div>
        </div>

        <!-- trip body -->
        <div class="trip-area">
            <!-- upcoming area -->
            <div v-if="setUpcoming" class="upcoming-area">
                <!-- member type bar -->
                <div class="member-type">
                    <div @click="selectItem('passenger')">
                        <userIcon :size="10" :color="selPassenger? '#1C8983': '#c5c6cb'" />
                        <span :style="selPassenger? 'color: #1C8983': ''">PASSENGER</span>
                    </div>
                    <div @click="selectItem('driver')">
                        <carIcon :size="10" :fillcolor="selDriver? '#1C8983': '#c5c6cb'" />
                        <span :style="selDriver? 'color: #1C8983': ''">DRIVER</span>
                    </div>
                </div>

                <!-- trip detail -->
                <!-- as passenger -->
                <div class="animation-div" v-if="selPassenger">
                    <tripDetail v-for="data in upcomingPassengerData" :trip="data" :user="user" :tripActiveFlag="true" keyWord="passenger" />
                    <!-- after trip -->
                    <Loading :data="laterPassengerData">
                        <span class="divide-trip">Later Rides</span>   
                        <tripDetail v-for="data in laterPassengerData" :trip="data" :user="user" keyWord="passenger" />
                        <p slot="no-data" class="alert alert-warning"  role="alert">You Don't have any trips joined as passenger</p>
                        <p slot="loading" class="alert alert-info" role="alert">
                            <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                            Loading trips ...
                        </p>
                    </Loading>
                </div>
                
                <!-- as driver -->
                <div class="driver-animation-div" v-if="selDriver">
                    <tripDetail v-for="data in upcomingDriverData" :trip="data" :user="user" :tripActiveFlag="true" keyWord="driver" />
                    <!-- after trip -->
                    <Loading :data="laterDriverData">
                        <span class="divide-trip">Later Rides</span>
                        <tripDetail v-for="data in laterDriverData" :trip="data" :user="user" keyWord="driver" />
                        <p slot="no-data" class="alert alert-warning"  role="alert">You Don't have any trips created as driver</p>
                        <p slot="loading" class="alert alert-info" role="alert">
                            <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                            Loading trips ...
                        </p>
                    </Loading>
                </div>
            </div>

            <!-- history area -->
            <div v-else="setHistory" class="history-area animation-div">
                <Loading :data="historyData">
                    <tripDetail v-for="data in historyData" :trip="data" :user="user" keyWord="history" />
                    <p slot="no-data" class="alert alert-warning"  role="alert">You Don't have any history trips</p>
                    <p slot="loading" class="alert alert-info" role="alert">
                        <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                        Loading trips ...
                    </p>
                </Loading>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
import Loading from '../Loading.vue';
import ProfileTicket from '../views/ProfileTicket';

// import components for this
import closeIcon from '../../icon/CloseIcon.vue';
import carIcon from '../../icon/CarIcon.vue';
import userIcon from '../../icon/UserIcon.vue';
import tripDetail from '../sections/TripDetail.vue';

let currentDate = new Date();
let passengerCount = 0;
let driverCount = 0;

export default {
    name: 'yourTrips',
    data () {
        return {
            upcomingPassengerData: null,
            laterPassengerData: null,
            upcomingDriverData: null,
            laterDriverData: null,
            historyData: null,
            setUpcoming: true,
            setHistory: false,
            selPassenger: false,
            selDriver: true,
            count: 0
        };
    },
    async mounted () {
        await this.tripAsDriver();
        await this.tripAsPassenger();
        await this.pendingRate();
        await this.getPendingRequest();
        await this.oldTripsAsDriver();
        await this.oldTripsAsPassenger();
        await this.findSubscriptions();

        console.log('trips', this.trips);
        console.log('passengerTrips', this.passengerTrips);
        console.log('subscriptions', this.subscriptions);
        if (this.trips.length !== 0) {
            let driverTrip = [];
            let upcomingDriverTrip = [];

            this.trips.forEach(trip => {
                if (trip.availability === 'true') { // active driver trip
                    driverTrip.push(trip);
                } else { // later driver trips
                    if (upcomingDriverTrip.length === 0) {
                        trip['start_available'] = true;
                    } else {
                        trip['start_available'] = false;
                    }
                    upcomingDriverTrip.push(trip);
                }
            });

            this.upcomingDriverData = driverTrip;
            if (driverTrip.length !== 0) {
                upcomingDriverTrip.forEach(trip => {
                    trip['active_available'] = false;
                });
            } else {
                upcomingDriverTrip.forEach(trip => {
                    trip['active_available'] = true;
                });
            }
            this.laterDriverData = upcomingDriverTrip;    
        } else {
            this.upcomingDriverData = [];
            this.laterDriverData = [];
        }
        
        // history driver trips
        if (this.oldTrips.length !== 0) {
            if (this.oldPassengerTrips.length !== 0) {
                this.historyData = this.oldTrips.concat(this.oldPassengerTrips);
            } else {
                this.historyData = this.oldTrips;
            }
        } else {
            if (this.oldPassengerTrips.length !== 0) {
                this.historyData = this.oldPassengerTrips;
            } else {
                this.historyData = [];
            }
        }

        if (this.passengerTrips.length !== 0) {
            let passTrip = [];
            let allPassTrip = [];

            this.passengerTrips.forEach(trip => {
                if (trip.availability === 'true') { // active passenger trip
                    passTrip.push(trip);
                } else { // later passenger trips
                    if (allPassTrip.length === 0) {
                        trip['start_available'] = true;
                    } else {
                        trip['start_available'] = false;
                    }
                    allPassTrip.push(trip);
                }
            });

            this.count = allPassTrip.length;
            this.upcomingPassengerData = passTrip;
            this.laterPassengerData = allPassTrip;
        } else {
            this.upcomingPassengerData = [];
            this.laterPassengerData = [];
        }
    },
    computed: {
        ...mapGetters({
            trips: 'myTrips/myTrips',
            passengerTrips: 'myTrips/passengerTrips',
            pendingRates: 'rates/pendingRates',
            pendingRequest: 'passenger/pendingRequest',
            user: 'auth/user',
            oldTrips: 'myTrips/myOldTrips',
            oldPassengerTrips: 'myTrips/passengerOldTrips',
            subscriptions: 'subscriptions/subscriptions',
            appConfig: 'auth/appConfig'
        })
    },
    methods: {
        ...mapActions({
            tripAsDriver: 'myTrips/tripAsDriver',
            tripAsPassenger: 'myTrips/tripAsPassenger',
            pendingRate: 'rates/pendingRates',
            getPendingRequest: 'passenger/getPendingRequest',
            oldTripsAsDriver: 'myTrips/oldTripsAsDriver',
            oldTripsAsPassenger: 'myTrips/oldTripsAsPassenger',
            findSubscriptions: 'subscriptions/index'
        }),
        goDetail: function (data) {
            console.log('data', data);
            this.setSelectedTrip(data);

            // go search result page
            let status = 'popular';
            this.$router.push({name: 'searchResult', params: { data: data, status: status }});
        },
        setTitle: function (type) {
            if (type === 'upcoming') {
                this.setUpcoming = true;
                this.setHistory = false;
            } else {
                this.setUpcoming = false;
                this.setHistory = true;
            }
        },
        selectItem: function (item) {
            if (item === 'passenger') {
                this.selPassenger = true;
                this.selDriver = false;
                this.count = this.laterPassengerData.length;
            } else {
                this.selPassenger = false;
                this.selDriver = true;
                this.count = this.laterDriverData.length;
            }
        },
        moreDetail: function (title) {
            if (title === 'info') {
                console.log('driverData', this.driverData);
                let name = this.driverData.user.name;
                let newName = name.replace(/ /gi, '');
                this.setSelectedTrip(this.driverData);
                this.$emit('driver-detail', newName);
            } else {
                this.$emit('join');
            }
        }
    },
    components: {
        closeIcon,
        carIcon,
        userIcon,
        tripDetail,
        Loading,
        ProfileTicket
    }
};
</script>