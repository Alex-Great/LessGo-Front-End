<template>
    <div class="trip-detail">
        <svg class="shadow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="260px" viewBox="0 0 418 268.001" preserveAspectRatio="none">
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
        <div class="trip-board" style="top: -19em; width: 85.5%">
            <!-- left -->
            <div class="col-xs-16">
                <div style="display: flex;">
                    <div @click="showProfile" class="img-circle" v-imgSrc:profile="getImage()"></div>
                    <!-- user detail -->
                    <div class="trip-user-detail">
                        <h3>{{ trip.user.name }}</h3>
                        <div v-for="num in redRating" style="float: left; margin-right: 5px;">
                            <ratingStarIcon :size="10" :color="'#e65a5b'" />
                        </div>
                        <div v-if="this.greyRating.length !== 0" v-for="num in greyRating" style="float: left; margin-right: 5px;">
                            <ratingStarIcon :size="10" />
                        </div>
                        <div v-if="this.greyRating.length === 0">
                            <span>No Reviews</span>
                        </div>
                    </div>
                </div>
                <!-- from and to town -->
                <div class="fromTo">
                    <div>
                        <fromIcon :size="11" :color="'#b7b5b5'" />
                        <span>
                            {{ this.trip.from_town }}
                        </span>
                    </div>
                    <div>
                        <toIcon :size="11" :color="'#b7b5b5'" />
                        <span>
                            {{ this.trip.to_town }}
                        </span>
                    </div>
                </div>
                <!-- trip date -->
                <div class="trip-date">
                    <calenderIcon :size="15" :color="'black'" />
                    <span style="margin-left: 10px;">{{ rideDay }}</span>
                    <span style="margin-right: 15px">{{ rideMonth }}</span>
                    <clockIcon :size="15" :color="'black'" />
                    <span>{{ rideTime }}</span>
                </div>
            </div>
            <!-- stick -->
            <div class="divide-stick"></div>

            <!-- right -->
            <div class="col-xs-8 right-side">
                <span class="in-progress">In Progress</span>
                <div class="dots-icon" style="display: inline-block;">
                    <dotsIcon :size="10" :color="'#b2b2b4'" />
                </div>
                <button v-if="tripActiveFlag || keyWord === 'history'" class="edit-btn" style="opacity: .4;" disabled>Edit/Delete</button>
                <button @click="editAndDelete(trip.id)" v-if="!tripActiveFlag && keyWord !== 'history'" class="edit-btn">Edit/Delete</button>
                 
                <button @click="editAndDelete(trip.id)" v-if="tripActiveFlag" class="action-btn">Finish</button>
                <!-- <button @click="moreDetail('info')" class="info-btn">
                    <alignInfoIcon :size="15" :color="'#a8adac'" />
                    <span>Info</span>
                </button> -->

                <button @click="startRide" v-if="!tripActiveFlag && keyWord !== 'history'" class="action-btn" :style="(!tripActiveFlag && keyWord !== 'history' && startAvailable === true)? '': 'opacity: 0.4'" :disabled="!startAvailable">Start Ride</button>
                <button @click="editAndDelete(trip.id)" class="history-info" v-if="keyWord === 'history'">Info</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import moment from 'moment';
import dialogs from '../../services/dialogs.js';

// import components for this
import ratingStarIcon from '../../icon/RatingStarIcon.vue';
import fromIcon from '../../icon/FromIcon.vue';
import toIcon from '../../icon/ToIcon.vue';
import calenderIcon from '../../icon/CalenderIcon.vue';
import clockIcon from '../../icon/ClockIcon.vue';
import dotsIcon from '../../icon/DotsIcon.vue';

let totalCount = 5;
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default {
    name: 'tripDetail',
    data () {
        return {
            redRating: [],
            greyRating: [],
            rideMonth: '',
            rideDay: '',
            rideTime: '',
            startAvailable: false
        };
    },
    props: {
        user: {
            type: Object,
            required: false,
            default: null
        },
        trip: {
            type: Object,
            required: false,
            default: null
        },
        tripActiveFlag: {
            type: Boolean,
            required: false,
            default: false
        },
        keyWord: {
            type: String,
            required: false,
            default: ''
        }
    },
    mounted () {
        console.log('trip', this.trip);
        console.log('user', this.user);
        console.log('keyWord', this.keyWord);

        // set start ride status
        this.startAvailable = this.trip.start_available;

        this.redRating = [];
        this.greyRating = [];
        // rating count
        let ratingCount = this.trip.user.positive_ratings + this.trip.user.negative_ratings;

        if (ratingCount !== 0) {
            for (let i = 0; i < ratingCount; i++) {
                this.redRating.push(i);
            }

            for (let j = 0; j < (totalCount - ratingCount); j++) {
                this.greyRating.push(j);
            }
        }

        // search weekly trip or others
        if (this.trip.days === '') {
            // month, day and time
            this.rideMonth = months[moment(this.trip.trip_date.split(' ')[0]).toDate().getMonth()];
            this.rideDay = moment(this.trip.trip_date.split(' ')[0]).toDate().getDate();
            let hourMinute = this.trip.trip_date.split(' ')[1];
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
            this.rideMonth = this.trip.days;
            let hour = this.trip.trip_date.split(' ')[1];
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
    },
    methods: {
        ...mapActions({
            updateTrip: 'trips/update'
        }),
        showProfile: function () {
            let id = this.trip.user.id.toString();
            this.$router.push({name: 'profileDetail', params: {id: id, titleText: 'yourTrips'}});
        },
        editAndDelete: function (id) {
            let detailData = {
                'trip': this.trip,
                'user': this.user,
                'keyWord': this.keyWord
            };
            this.$router.push({name: 'tripInfo', params: {id: detailData.trip.id, data: detailData}});
        },
        getImage: function () {
            return this.user.id === this.trip.user.id ? this.user.image : this.trip.user.image;
        },
        startRide: function () {
            if (this.trip.active_available) {
                delete this.trip['start_available'];
                delete this.trip['active_available'];
                this.trip.availability = 'true';
                if (this.trip.is_passenger) {
                    this.trip.is_passenger = 1;
                } else {
                    this.trip.is_passenger = 0;
                }

                this.trip.estimated_time = this.trip.estimated_time.toString();
                this.trip.community = this.trip.community.toString();
                this.trip.payment = this.trip.payment.toString();
                console.log('trip', this.trip);
                let data = this.trip;
                this.updateTrip(data).then(() => {
                    this.$router.redirect({name: 'your-trips'});
                }).catch(error => { console.log('error', error); });
            } else {
                dialogs.message('You can not start this trip before finishing current active trip.', { duration: 10, state: 'error' });
                return;
            }
        },
        finishRide: function () {
            console.log('finishRide');
        }
    },
    components: {
        ratingStarIcon,
        fromIcon,
        toIcon,
        calenderIcon,
        clockIcon,
        dotsIcon
    }
};
</script>