<template>
    <div :style="activeFlag?'margin-top: -20px; margin-left: -22px': 'margin-left: -22px'" class="profile-ticket">
        <svg class="shadow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="104%" :height="activeFlag?(reviewFlag?'190px': '240px'): '270px'" viewBox="0 0 418 268.001" preserveAspectRatio="none">
            <defs>
                <filter id="card_back" x="0" y="0" width="418" height="268.001" filterUnits="userSpaceOnUse" >
                    <feOffset dy="10" input="SourceAlpha"/>
                    <feGaussianBlur stdDeviation="10" result="blur"/>
                    <feFlood flood-color="#236262" flood-opacity="0.161"/>
                    <feComposite operator="in" in2="blur"/>
                    <feComposite in="SourceGraphic"/>
                </filter>
            </defs>
            <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#card_back)">
                <path id="card_back-2" data-name="card back" d="M1471.025-566.4H1267a14.9,14.9,0,0,1-10.607-4.393A14.9,14.9,0,0,1,1252-581.405v-178a14.9,14.9,0,0,1,4.393-10.606A14.9,14.9,0,0,1,1267-774.405h204.011c-.007.129-.011.265-.011.405a7.008,7.008,0,0,0,7,7,7.008,7.008,0,0,0,7-7c0-.135,0-.271-.011-.405H1595a14.9,14.9,0,0,1,10.607,4.393A14.9,14.9,0,0,1,1610-759.406v178a14.9,14.9,0,0,1-4.393,10.607A14.9,14.9,0,0,1,1595-566.405H1484.975c.016-.192.025-.392.025-.595a7.008,7.008,0,0,0-7-7,7.008,7.008,0,0,0-7,7c0,.2.008.4.025.595Z" transform="translate(-1222 799.41)" fill="#fff"/>
            </g>
        </svg>
        <div class="trip-board" :style="(!joinFlag && !activeFlag && !infoFlag && !reviewFlag)?'top: -34vh': 'top: -34vh'">
            <!-- left -->
            <div class="col-xs-16" style="padding-right: 20px !important">
                <div style="display: flex;">
                    <div @click="showProfile" class="img-circle" v-imgSrc:profile="driver_img"></div>
                    <!-- user detail -->
                    <div class="trip-user-detail">
                        <h3>{{ this.driver_name }}</h3>
                        <div v-for="num in redRating" style="float: left; margin-right: 5px;">
                            <ratingStarIcon :size="10" :color="'#e65a5b'" />
                        </div>
                        <div v-if="!no_review" v-for="num in greyRating" style="float: left; margin-right: 5px;">
                            <ratingStarIcon :size="10" />
                        </div>
                        <div v-if="no_review">
                            <span>No Reviews</span>
                        </div>
                    </div>
                </div>
                <!-- from_town, to_town, car and for -->
                <div class="fromTo">
                    <div v-if="!activeFlag">
                        <carIcon :size="11" :color="'#b7b5b5'" />
                        <span>
                            {{ this.car_type }}
                        </span>
                    </div>
                    <div>
                        <fromIcon :size="11" :color="'#b7b5b5'" />
                        <span>
                            {{ this.from_town }}
                        </span>
                    </div>
                    <div>
                        <toIcon :size="11" :color="'#b7b5b5'" />
                        <span style="color: #828080">
                            {{ this.to_town }}
                        </span>
                    </div>
                    <div v-if="manager_type === 'male' && !activeFlag">
                        <maleIcon :size="11" :color="'#389792'" />
                        <span class="manager-type">
                            {{ this.usage }}
                        </span>
                    </div>
                    <div v-if="manager_type === 'female' && !activeFlag">
                        <femaleIcon :size="11" :color="'#389792'" />
                        <span class="manager-type">
                            {{ this.usage }}
                        </span>
                    </div>
                    <div v-if="manager_type === 'all' && !activeFlag">
                        <v-icon icon="venus-mars" class="both-v-icon" />
                        <span class="manager-type">
                            {{ this.usage }}
                        </span>
                    </div>
                </div>

                <!-- trip finish btn -->
                <button v-if="activeFlag && !reviewFlag" class="finish-btn" @click="finishTrip">Finish</button>
            </div>
            <!-- stick -->
            <div :style="activeFlag?(reviewFlag?'height: 124px; top: 10px': 'height: 153px'): ''" class="divide-stick"></div>

            <!-- right -->
            <div class="col-xs-8 right-side">
                <span v-if="!activeFlag" class="in-open">Open</span>
                <span v-if="activeFlag" class="report-span">Report/Help</span>
                <div class="dots-icon" style="display: inline-block;">
                    <dotsIcon :size="10" :color="'#b2b2b4'" />
                </div>
                <div :style="activeFlag?'margin-top: 60px': ''" class="day-month">
                    <v-icon :icon="['fa', 'calendar-alt']" class="v-icon-calendar" />
                    <span>{{ rideDay }}</span>
                    <span>{{ rideMonth }}</span>
                </div>
                <div>
                    <v-icon :icon="['fa','clock']" class="v-icon-calendar" />
                    <span>{{ rideTime }}</span>
                </div>

                <!-- per seat -->
                <div v-if="!activeFlag" class="per-seat">
                    <h4>
                        {{ this.seat_price }}&nbsp;JD
                    </h4>
                    <p>
                        Per Seat
                    </p>
                </div>
                <div v-if="!activeFlag" class="seat-icon" :style="(!joinFlag && !activeFlag && !infoFlag && !reviewFlag)?'bottom: 40px': ''">
                    <img :src="seat_img" />
                    <span class="seat-num">
                        {{ this.available_seats }}
                    </span>
                </div>
                <button v-if="infoFlag" @click="moreDetail('info')" class="info-btn">
                    <alignInfoIcon :size="15" :color="'#a8adac'" />
                    <span>Info</span>
                </button>
                <button v-if="joinFlag" @click="moreDetail('join')" class="info-btn">
                    <carIcon :size="15" :color="'#a8adac'" />
                    <span>Join</span>
                </button>
                <button v-if="activeFlag && !reviewFlag" class="Track-btn">Track</button>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';

// import components for this
import ratingStarIcon from './RatingStarIcon.vue';
import fromIcon from './FromIcon.vue';
import toIcon from './ToIcon.vue';
import calenderIcon from './CalenderIcon.vue';
import clockIcon from './ClockIcon.vue';
import dotsIcon from './DotsIcon.vue';
import carIcon from './CarIcon';
import maleIcon from './MaleIcon';
import femaleIcon from './FemaleIcon';
import seatIcon from './SeatIcon';
import alignInfoIcon from './AlignInfoIcon';

let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default {
    name: 'profileTicketIcon',
    data () {
        return {
            redRating: [],
            greyRating: [],
            rideMonth: '',
            rideDay: '',
            rideTime: '',
            driver_img: '',
            driver_name: '',
            from_town: '',
            to_town: '',
            no_review: false,
            car_type: '',
            manager_type: '',
            seat_price: '',
            available_seats: null,
            driverData: null,
            usage: '',
            seat_img: process.env.ROUTE_BASE + 'static/img/car-seat.png'
        };
    },
    props: {
        allData: {
            type: Object,
            required: false,
            default: null
        },
        data: {
            type: Object,
            required: false,
            default: null
        },
        joinFlag: {
            type: Boolean,
            required: false,
            default: false
        },
        infoFlag: {
            type: Boolean,
            required: false,
            default: false
        },
        activeFlag: {
            type: Boolean,
            required: false,
            default: false
        },
        reviewFlag: {
            type: Boolean,
            required: false,
            default: false
        },
        searchTitle: {
            type: String,
            required: false,
            default: ''
        }
    },
    async mounted () {
        await this.searchUser(this.data.user.id);
        this.redRating = [];
        this.greyRating = [];
        this.no_review = false;
        let tripData = this.data;
        console.log('profileTicket', this.data);
        if ((tripData.user.positive_ratings + tripData.user.negative_ratings) === 0) {
            this.no_review = true;
        } else {
            // red rating count
            for (let i = 0; i < tripData.user.positive_ratings; i++) {
                this.redRating.push(i);
            }

            // grey rating count
            for (let i = 0; i < tripData.user.negative_ratings; i++) {
                this.redRating.push(i);
            }
        }

        // search weekly trip or others
        if (tripData.days === '') {
            // month, day and time
            this.rideMonth = months[moment(tripData.trip_date.split(' ')[0]).toDate().getMonth()];
            this.rideDay = moment(tripData.trip_date.split(' ')[0]).toDate().getDate();
            let hourMinute = tripData.trip_date.split(' ')[1];
            let splitTime = hourMinute.split(':');
            if (splitTime[0] % 12 !== 0) {
                if (splitTime[0] > 12) {
                    this.rideTime = (splitTime[0] % 12) + ':' + splitTime[1] + ' PM';
                } else {
                    this.rideTime = splitTime[0] + ':' + splitTime[1] + ' AM';
                }
            } else {
                if (splitTime[0] === 12) {
                    this.rideTime = '12:' + splitTime[1] + ' AM';
                } else {
                    this.rideTime = '12:' + splitTime[1] + ' PM';
                }
            }
        } else {
            this.rideDay = 'Every';
            this.rideMonth = tripData.days;
            let hour = tripData.trip_date.split(' ')[1];
            let splitTime = hour.split(':');
            if (splitTime[0] % 12 !== 0) {
                if (splitTime[0] > 12) {
                    this.rideTime = (splitTime[0] % 12) + ':' + splitTime[1] + ' PM';
                } else {
                    this.rideTime = splitTime[0] + ':' + splitTime[1] + ' AM';
                }
            } else {
                if (splitTime[0] === 12) {
                    this.rideTime = '12:' + splitTime[1] + ' AM';
                } else {
                    this.rideTime = '12:' + splitTime[1] + ' PM';
                }
            }
        }

        // trip details
        this.driver_name = tripData.user.name;
        this.driver_img = tripData.user.image;
        this.from_town = tripData.from_town;
        this.to_town = tripData.to_town;
        this.seat_price = tripData.payment;
        this.available_seats = tripData.seats_available;
        this.car_type = tripData.cartype;
        // usuage (male or female)
        if (tripData.is_female_only === '1') {
            if (this.searchedUser.gender === 'male') {
                this.usage = 'Males Only';
                this.manager_type = 'male';
            } else {
                this.manager_type = 'female';
                this.usage = 'Females Only';
            }
        } else {
            this.manager_type = 'all';
            this.usage = 'All';
        }

        // for join ride
        this.$emit('joinStatus', this.manager_type);
        this.driverData = tripData;
    },
    methods: {
        ...mapActions({
            setSelectedTrip: 'trips/setSelectedTrip',
            searchUser: 'auth/searchUser'
        }),
        showProfile: function () {
            let id = this.data.user.id.toString();
            this.$router.push({name: 'profileDetail', params: { id: id, titleText: 'searchResult', data: this.allData, closeTitle: this.searchTitle }});
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
        },
        finishTrip: function () {
            this.$emit('finish-trip');
        }
    },
    computed: {
        ...mapGetters({
            searchedUser: 'auth/searchUser'
        })
    },
    components: {
        ratingStarIcon,
        fromIcon,
        toIcon,
        calenderIcon,
        clockIcon,
        dotsIcon,
        carIcon,
        maleIcon,
        femaleIcon,
        seatIcon,
        alignInfoIcon
    }
};
</script>