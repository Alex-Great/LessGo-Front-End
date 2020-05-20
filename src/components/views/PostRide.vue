<template>
    <div class="post-ride">
        <div class="detail">
            <div class="car-img"></div>
            <span class="car-type">{{ detail.carType }}</span>
            <span class="plate-id">{{ detail.plateId }}</span>
            <router-link :to="{name: 'setCarAndId'}" class="return-route" >Update...</router-link>
            <closeIcon :size="10" style="position: absolute; right: 9%; top: 9%; cursor: pointer;" />
        </div>

        <!-- ride body -->
        <div class="addictional">
            <span>
                NO. OF PASSENGERS
            </span>
            <div class="car-seat-area">
                <div class="seat-number">
                    <img :src="seat_img" />
                    <p>{{ seat_count }}</p>
                </div>
                <div @click="selectSeat(-1)" class="car-minus">
                    <minusIcon :size="15" :color="'#abe5c4'" style="margin-top: 3px" />
                </div>
                <div @click="selectSeat(1)" class="car-plus">
                    <plusIcon :size="15" :color="'#abe5c4'" style="margin-top: 3px" />
                </div>
            </div>

            <!-- select preferences area -->
            <div class="preferences">
                <span>PREFERENCES</span>
                <preferences @preference="getPreferences" :offerFlag="true" />    
            </div>

            <!-- select amenities area -->
            <div class="select-amenities">
                <span>AMENITIES</span>
                <amenities @amenities="getAmenities" :offerFlag="true" />
            </div>
            
            <!-- select usage for female -->
            <div class="female-usage">
                <v-icon icon="venus" class="usage-female-icon" />
                <h2>Share this ride with {{ user.gender }}s only</h2>
                <switchBtn @toggle="toggleBtn" />
            </div>

            <!-- notes -->
            <span>
                NOTES
                <span class="note-comment">&nbsp;(let the passengers know where you'll be wating)</span>
            </span>

            <!-- writing input -->
            <div class="writing-input">
                <input type="text" v-model="write_detail" placeholder="Write a note for your passengers" />
                <b>{{ bio_count }}/{{ text_counter }}</b>
            </div>
        </div>

        <!-- post btn -->
        <div class="button-area" style="padding-right: 15px; padding-left: 20px; display: flex;">
            <p>By pressing "Post Ride!" you promise not to profit from trips and divide all expenses equally with passengers.</p>
            <button @click="postRide" class="offer-ride" style="margin-right: 0">
                <carIcon :size="20" :color="'#D5E9E8'" style="margin-top: -3px;" />
                <span style="color: white">Post ride!</span>
                <spinner v-if="postFlag" class="loading" />
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';

/* import components for this */
import closeIcon from '../../icon/CloseIcon';
import minusIcon from '../../icon/MinusIcon';
import plusIcon from '../../icon/PlusIcon';
import amenities from '../sections/Amenties';
import switchBtn from '../elements/SwitchBtn';
import carIcon from '../../icon/CarIcon'
import spinner from '../Spinner';

// for test
import preferences from '../sections/Preferences';

export default {
    name: 'postRide',
    data () {
        return {
            seat_count: 1,
            write_detail: '',
            bio_count: 0,
            text_counter: 150,
            tripData: null,
            postFlag: false,
            latestTripId: 0,
            genderFlag: false,
            preferences: {
                is_smoker: 0,
                pets: 0,
                luggage: 0,
                food: 0,
                speaking: 0,
                protection: 0
            },
            amenities: {
                wifi: 0,
                aux: 0,
                xcomfort: 0,
                sanitizer: 0,
                charger: 0,
                snacks: 0
            },
            seat_img: process.env.ROUTE_BASE + 'static/img/seat.png',
            usage: 1
        };
    },
    computed: {
        ...mapGetters({
            detail: 'cars/getDetail',
            cars: 'cars/cars',
            user: 'auth/user',
            trips: 'myTrips/myTrips'
        })
    },
    methods: {
        ...mapActions({
            'createTrip': 'trips/create',
            'updateTrip': 'trips/update'
        }),
        getPreferences: function (Preferences) {
            for (let i = 0; i < Object.keys(this.preferences).length; i++) {
                this.preferences[Object.keys(this.preferences)[i]] = Preferences[Object.keys(this.preferences)[i]] ? 1 : 0;
            }
        },
        getAmenities: function (Amenities) {
            for (let i = 0; i < Object.keys(this.amenities).length; i++) {
                this.amenities[Object.keys(this.amenities)[i]] = Amenities[Object.keys(this.amenities)[i]] ? 1 : 0;
            }
        },
        selectSeat: function (count) {
            let maxcount = 4;
            let currentcount = this.seat_count;
            currentcount += count;
            if (currentcount > maxcount) {
                this.seat_count = 1;
            } else if (currentcount === 0) {
                this.seat_count = maxcount;
            } else {
                this.seat_count = currentcount;
            }
        },
        toggleBtn: function (param) {
            if (param) {
                this.usage = 2;
            } else {
                this.usage = 1;
            }
        },
        postRide: function () {
            // postRide by rideMode (Ex: Weekly, Specific or Just Once)
            switch (this.tripData.rideMode) {
            case 'Weekdays':
                // save by trip mode
                if (this.tripData.tripMode === 'Round') {
                    this.postFlag = true;
                    this.tripData.days.forEach(async day => {
                        let rideData = {
                            'is_passenger': 0,
                            'total_seats': this.seat_count.toString(),
                            'friendship_type_id': 2,
                            'is_female_only': this.usage === 2 ? 1 : 0,
                            'estimated_time': this.tripData.areas[3],
                            'distance': parseFloat(this.tripData.areas[2]),
                            'co2': parseFloat(this.tripData.areas[4]),
                            'description': this.write_detail,
                            'car_id': this.cars.length > 0 ? this.cars[0].id : undefined,
                            'enc_path': '123',
                            'community': this.user.community,
                            'second_community': this.user.second_community === null ? '' : this.user.second_community,
                            'rating': this.user.positive_ratings + this.user.negative_ratings,
                            'payment': 2,
                            'availability': 'false',
                            'is_active': 0,
                            'is_recurring': 1,
                            'is_smoker': this.preferences['is_smoker'],
                            'pets': this.preferences['pets'],
                            'luggage': this.preferences['luggage'],
                            'food': this.preferences['food'],
                            'speaking': this.preferences['speaking'],
                            'protection': this.preferences['protection'],
                            'sanitizer': this.amenities['sanitizer'],
                            'xcomfort': this.amenities['xcomfort'],
                            'aux': this.amenities['aux'],
                            'wifi': this.amenities['wifi'],
                            'charger': this.amenities['charger'],
                            'snacks': this.amenities['snacks'],
                            'image_url': this.tripData.areas[5],
                            'trip_type': this.tripData.tripMode,
                            'from_town': this.tripData.areas[0].address,
                            'to_town': this.tripData.areas[1].address,
                            'points': [
                                this.tripData.areas[0], this.tripData.areas[1]
                            ],
                            'trip_date': '2022-12-31 ' + day.firstTime,
                            'days': day.day
                        };

                        // create first trip
                        await this.createTrip(rideData).then(async result => {
                            // set return trip data
                            let returnTrip = {
                                'is_passenger': 0,
                                'total_seats': this.seat_count.toString(),
                                'friendship_type_id': 2,
                                'is_female_only': this.usage === 2 ? 1 : 0,
                                'estimated_time': this.tripData.areas[3],
                                'distance': parseFloat(this.tripData.areas[2]),
                                'co2': parseFloat(this.tripData.areas[4]),
                                'description': this.write_detail,
                                'car_id': this.cars.length > 0 ? this.cars[0].id : undefined,
                                'enc_path': '123',
                                'community': this.user.community,
                                'second_community': this.user.second_community === null ? '' : this.user.second_community,
                                'rating': this.user.positive_ratings + this.user.negative_ratings,
                                'payment': 2,
                                'availability': 'false',
                                'is_active': 0,
                                'is_recurring': 1,
                                'is_smoker': this.preferences['is_smoker'],
                                'pets': this.preferences['pets'],
                                'luggage': this.preferences['luggage'],
                                'food': this.preferences['food'],
                                'speaking': this.preferences['speaking'],
                                'protection': this.preferences['protection'],
                                'sanitizer': this.amenities['sanitizer'],
                                'xcomfort': this.amenities['xcomfort'],
                                'aux': this.amenities['aux'],
                                'wifi': this.amenities['wifi'],
                                'charger': this.amenities['charger'],
                                'snacks': this.amenities['snacks'],
                                'image_url': this.tripData.areas[5],
                                'trip_type': this.tripData.tripMode,
                                'from_town': this.tripData.areas[1].address,
                                'to_town': this.tripData.areas[0].address,
                                'points': [
                                    this.tripData.areas[1], this.tripData.areas[0]
                                ],
                                'trip_date': '2022-12-31 ' + day.returnTime,
                                'days': day.day
                            };
                            // create retrun trip
                            await this.createTrip(returnTrip).then(result => {
                                console.log('success', result);
                            }).catch(err => {
                                console.log('err', err);
                            });
                        }).catch(err => {
                            console.log('err', err);
                        });
                    });

                    this.postFlag = false;
                    this.$router.push({name: 'your-trips'});
                } else {
                    this.postFlag = true;
                    this.tripData.days.forEach(async day => {
                        let rideData = {
                            'is_passenger': 0,
                            'from_town': this.tripData.areas[0].address,
                            'to_town': this.tripData.areas[1].address,
                            'total_seats': this.seat_count.toString(),
                            'friendship_type_id': 2,
                            'is_female_only': this.usage === 2 ? 1 : 0,
                            'estimated_time': this.tripData.areas[3],
                            'distance': parseFloat(this.tripData.areas[2]),
                            'co2': parseFloat(this.tripData.areas[4]),
                            'description': this.write_detail,
                            'car_id': this.cars.length > 0 ? this.cars[0].id : undefined,
                            'enc_path': '123',
                            'community': this.user.community,
                            'second_community': this.user.second_community === null ? '' : this.user.second_community,
                            'rating': this.user.positive_ratings + this.user.negative_ratings,
                            'payment': 2,
                            'availability': 'false',
                            'points': [
                                this.tripData.areas[0], this.tripData.areas[1]
                            ],
                            'is_active': 0,
                            'is_recurring': 1,
                            'is_smoker': this.preferences['is_smoker'],
                            'pets': this.preferences['pets'],
                            'luggage': this.preferences['luggage'],
                            'food': this.preferences['food'],
                            'speaking': this.preferences['speaking'],
                            'protection': this.preferences['protection'],
                            'sanitizer': this.amenities['sanitizer'],
                            'xcomfort': this.amenities['xcomfort'],
                            'aux': this.amenities['aux'],
                            'wifi': this.amenities['wifi'],
                            'charger': this.amenities['charger'],
                            'snacks': this.amenities['snacks'],
                            'image_url': this.tripData.areas[5],
                            'trip_type': this.tripData.tripMode,
                            'trip_date': '2022-12-31 ' + day.singleTime,
                            'days': day.day
                        };

                        // create trip
                        await this.createTrip(rideData).then(result => {
                            console.log('success', result);
                        }).catch(err => {
                            console.log('err', err);
                        });
                    });

                    this.postFlag = false;
                    this.$router.push({name: 'your-trips'});
                }
                break;
            case 'Specific':
                // save by trip mode
                if (this.tripData.tripMode === 'Round') {
                    this.postFlag = true;
                    this.tripData.days.forEach(async day => {
                        let rideData = {
                            'is_passenger': 0,
                            'total_seats': this.seat_count.toString(),
                            'friendship_type_id': 2,
                            'is_female_only': this.usage === 2 ? 1 : 0,
                            'estimated_time': this.tripData.areas[3],
                            'distance': parseFloat(this.tripData.areas[2]),
                            'co2': parseFloat(this.tripData.areas[4]),
                            'description': this.write_detail,
                            'car_id': this.cars.length > 0 ? this.cars[0].id : undefined,
                            'enc_path': '123',
                            'community': this.user.community,
                            'second_community': this.user.second_community === null ? '' : this.user.second_community,
                            'rating': this.user.positive_ratings + this.user.negative_ratings,
                            'payment': 2,
                            'availability': 'false',
                            'is_active': 0,
                            'is_recurring': 1,
                            'is_smoker': this.preferences['is_smoker'],
                            'pets': this.preferences['pets'],
                            'luggage': this.preferences['luggage'],
                            'food': this.preferences['food'],
                            'speaking': this.preferences['speaking'],
                            'protection': this.preferences['protection'],
                            'sanitizer': this.amenities['sanitizer'],
                            'xcomfort': this.amenities['xcomfort'],
                            'aux': this.amenities['aux'],
                            'wifi': this.amenities['wifi'],
                            'charger': this.amenities['charger'],
                            'snacks': this.amenities['snacks'],
                            'image_url': this.tripData.areas[5],
                            'trip_type': this.tripData.tripMode,
                            'from_town': this.tripData.areas[0].address,
                            'to_town': this.tripData.areas[1].address,
                            'points': [
                                this.tripData.areas[0], this.tripData.areas[1]
                            ],
                            'trip_date': day.realDay + ' ' + day.firstTime
                        };

                        // create first trip
                        await this.createTrip(rideData).then(async result => {
                            // set return trip data
                            let returnTrip = {
                                'is_passenger': 0,
                                'total_seats': this.seat_count.toString(),
                                'friendship_type_id': 2,
                                'is_female_only': this.usage === 2 ? 1 : 0,
                                'estimated_time': this.tripData.areas[3],
                                'distance': parseFloat(this.tripData.areas[2]),
                                'co2': parseFloat(this.tripData.areas[4]),
                                'description': this.write_detail,
                                'car_id': this.cars.length > 0 ? this.cars[0].id : undefined,
                                'enc_path': '123',
                                'community': this.user.community,
                                'second_community': this.user.second_community === null ? '' : this.user.second_community,
                                'rating': this.user.positive_ratings + this.user.negative_ratings,
                                'payment': 2,
                                'availability': 'false',
                                'is_active': 0,
                                'is_recurring': 1,
                                'is_smoker': this.preferences['is_smoker'],
                                'pets': this.preferences['pets'],
                                'luggage': this.preferences['luggage'],
                                'food': this.preferences['food'],
                                'speaking': this.preferences['speaking'],
                                'protection': this.preferences['protection'],
                                'sanitizer': this.amenities['sanitizer'],
                                'xcomfort': this.amenities['xcomfort'],
                                'aux': this.amenities['aux'],
                                'wifi': this.amenities['wifi'],
                                'charger': this.amenities['charger'],
                                'snacks': this.amenities['snacks'],
                                'image_url': this.tripData.areas[5],
                                'trip_type': this.tripData.tripMode,
                                'from_town': this.tripData.areas[1].address,
                                'to_town': this.tripData.areas[0].address,
                                'points': [
                                    this.tripData.areas[1], this.tripData.areas[0]
                                ],
                                'trip_date': day.realDay + ' ' + day.returnTime
                            };
                            // create retrun trip
                            await this.createTrip(returnTrip).then(result => {
                                console.log('success', result);
                            }).catch(err => {
                                console.log('err', err);
                            });
                        }).catch(err => {
                            console.log('err', err);
                        });
                    });

                    this.postFlag = false;
                    this.$router.push({name: 'your-trips'});
                } else {
                    this.postFlag = true;
                    this.tripData.days.forEach(async day => {
                        let rideData = {
                            'is_passenger': 0,
                            'from_town': this.tripData.areas[0].address,
                            'to_town': this.tripData.areas[1].address,
                            'total_seats': this.seat_count.toString(),
                            'friendship_type_id': 2,
                            'is_female_only': this.usage === 2 ? 1 : 0,
                            'estimated_time': this.tripData.areas[3],
                            'distance': parseFloat(this.tripData.areas[2]),
                            'co2': parseFloat(this.tripData.areas[4]),
                            'description': this.write_detail,
                            'car_id': this.cars.length > 0 ? this.cars[0].id : undefined,
                            'enc_path': '123',
                            'community': this.user.community,
                            'second_community': this.user.second_community === null ? '' : this.user.second_community,
                            'rating': this.user.positive_ratings + this.user.negative_ratings,
                            'payment': 2,
                            'availability': 'false',
                            'points': [
                                this.tripData.areas[0], this.tripData.areas[1]
                            ],
                            'is_active': 0,
                            'is_recurring': 1,
                            'is_smoker': this.preferences['is_smoker'],
                            'pets': this.preferences['pets'],
                            'luggage': this.preferences['luggage'],
                            'food': this.preferences['food'],
                            'speaking': this.preferences['speaking'],
                            'protection': this.preferences['protection'],
                            'sanitizer': this.amenities['sanitizer'],
                            'xcomfort': this.amenities['xcomfort'],
                            'aux': this.amenities['aux'],
                            'wifi': this.amenities['wifi'],
                            'charger': this.amenities['charger'],
                            'snacks': this.amenities['snacks'],
                            'image_url': this.tripData.areas[5],
                            'trip_type': this.tripData.tripMode,
                            'trip_date': day.realDay + ' ' + day.singleTime
                        };

                        // create trip
                        await this.createTrip(rideData).then(result => {
                            console.log('success', result);
                        }).catch(err => {
                            console.log('err', err);
                        });
                    });

                    this.postFlag = false;
                    this.$router.push({name: 'your-trips'});
                }
                break;
            case 'Once':
                // save by trip mode
                if (this.tripData.tripMode === 'Round') {
                    let rideData = {
                        'is_passenger': 0,
                        'from_town': this.tripData.areas[0].address,
                        'to_town': this.tripData.areas[1].address,
                        'trip_date': this.tripData.tripTime.date + ' ' + this.tripData.tripTime.time.firstTime,
                        'total_seats': this.seat_count.toString(),
                        'friendship_type_id': 2,
                        'is_female_only': this.usage === 2 ? 1 : 0,
                        'estimated_time': this.tripData.areas[3],
                        'distance': parseFloat(this.tripData.areas[2]),
                        'co2': parseFloat(this.tripData.areas[4]),
                        'description': this.write_detail,
                        'car_id': this.cars.length > 0 ? this.cars[0].id : undefined,
                        'enc_path': '123',
                        'community': this.user.community,
                        'second_community': this.user.second_community === null ? '' : this.user.second_community,
                        'rating': this.user.positive_ratings + this.user.negative_ratings,
                        'payment': 2,
                        'availability': 'false',
                        'points': [
                            this.tripData.areas[0], this.tripData.areas[1]
                        ],
                        'is_active': 0,
                        'is_recurring': 1,
                        'is_smoker': this.preferences['is_smoker'],
                        'pets': this.preferences['pets'],
                        'luggage': this.preferences['luggage'],
                        'food': this.preferences['food'],
                        'speaking': this.preferences['speaking'],
                        'protection': this.preferences['protection'],
                        'sanitizer': this.amenities['sanitizer'],
                        'xcomfort': this.amenities['xcomfort'],
                        'aux': this.amenities['aux'],
                        'wifi': this.amenities['wifi'],
                        'charger': this.amenities['charger'],
                        'snacks': this.amenities['snacks'],
                        'image_url': this.tripData.areas[5],
                        'trip_type': this.tripData.tripMode
                    };
                    this.postFlag = true;
                    this.createTrip(rideData).then(trip => {
                        let returnTrip = {
                            'is_passenger': 0,
                            'from_town': this.tripData.areas[1].address,
                            'to_town': this.tripData.areas[0].address,
                            'trip_date': this.tripData.tripTime.date + ' ' + this.tripData.tripTime.time.returnTime,
                            'total_seats': this.seat_count.toString(),
                            'friendship_type_id': 2,
                            'is_female_only': this.usage === 2 ? 1 : 0,
                            'estimated_time': this.tripData.areas[3],
                            'distance': parseFloat(this.tripData.areas[2]),
                            'co2': parseFloat(this.tripData.areas[4]),
                            'description': this.write_detail,
                            'car_id': this.cars.length > 0 ? this.cars[0].id : undefined,
                            'enc_path': '123',
                            'community': this.user.community,
                            'second_community': this.user.second_community === null ? '' : this.user.second_community,
                            'rating': this.user.positive_ratings + this.user.negative_ratings,
                            'payment': 2,
                            'availability': 'false',
                            'points': [
                                this.tripData.areas[1], this.tripData.areas[0]
                            ],
                            'is_active': 0,
                            'is_recurring': 1,
                            'is_smoker': this.preferences['is_smoker'],
                            'pets': this.preferences['pets'],
                            'luggage': this.preferences['luggage'],
                            'food': this.preferences['food'],
                            'speaking': this.preferences['speaking'],
                            'protection': this.preferences['protection'],
                            'sanitizer': this.amenities['sanitizer'],
                            'xcomfort': this.amenities['xcomfort'],
                            'aux': this.amenities['aux'],
                            'wifi': this.amenities['wifi'],
                            'charger': this.amenities['charger'],
                            'snacks': this.amenities['snacks'],
                            'image_url': this.tripData.areas[5],
                            'parent_trip_id': trip.id,
                            'trip_type': this.tripData.tripMode
                        };

                        // create retrun trip
                        this.createTrip(returnTrip).then(result => {
                            console.log('success', result);
                        }).catch(err => {
                            console.log('err', err);
                        });

                        let updateTrip = trip;
                        updateTrip['return_trip_id'] = trip.id + 1;
                        if (updateTrip.is_passenger) {
                            updateTrip.is_passenger = 1;
                        } else {
                            updateTrip.is_passenger = 0;
                        }
                        updateTrip.payment = updateTrip.payment.toString();
                        updateTrip.image_url = this.tripData.areas[5];

                        // update first trip
                        this.updateTrip(updateTrip).then(result => {
                            console.log('success', result);
                        }).catch(err => {
                            console.log('err', err);
                        });
                        this.postFlag = false;
                        this.$router.push({name: 'your-trips'});
                    }).catch(error => { this.postFlag = false; });
                } else {
                    let rideData = {
                        'is_passenger': 0,
                        'from_town': this.tripData.areas[0].address,
                        'to_town': this.tripData.areas[1].address,
                        'trip_date': this.tripData.tripTime.date + ' ' + this.tripData.tripTime.time.time,
                        'total_seats': this.seat_count.toString(),
                        'friendship_type_id': 2,
                        'is_female_only': this.usage === 2 ? 1 : 0,
                        'estimated_time': this.tripData.areas[3],
                        'distance': parseFloat(this.tripData.areas[2]),
                        'co2': parseFloat(this.tripData.areas[4]),
                        'description': this.write_detail,
                        'car_id': this.cars.length > 0 ? this.cars[0].id : undefined,
                        'enc_path': '123',
                        'community': this.user.community,
                        'second_community': this.user.second_community === null ? '' : this.user.second_community,
                        'rating': this.user.positive_ratings + this.user.negative_ratings,
                        'payment': 2,
                        'points': [
                            this.tripData.areas[0], this.tripData.areas[1]
                        ],
                        'availability': 'false',
                        'is_active': 0,
                        'is_recurring': 1,
                        'is_smoker': this.preferences['is_smoker'],
                        'pets': this.preferences['pets'],
                        'luggage': this.preferences['luggage'],
                        'food': this.preferences['food'],
                        'speaking': this.preferences['speaking'],
                        'protection': this.preferences['protection'],
                        'sanitizer': this.amenities['sanitizer'],
                        'xcomfort': this.amenities['xcomfort'],
                        'aux': this.amenities['aux'],
                        'wifi': this.amenities['wifi'],
                        'charger': this.amenities['charger'],
                        'snacks': this.amenities['snacks'],
                        'image_url': this.tripData.areas[5],
                        'trip_type': this.tripData.tripMode
                    };
                    this.postFlag = true;
                    this.createTrip(rideData).then(trip => {
                        this.postFlag = false;
                        this.$router.push({name: 'your-trips'});
                    }).catch(error => { this.postFlag = false; });
                }
                break;
            default:
                break;
            }
        }
    },
    watch: {
        write_detail: function () {
            this.bio_count = this.write_detail.length;
            let desCount = this.bio_count;
            if ((desCount % 150) >= 75) {
                this.text_counter = 150 * ((desCount / 150).toFixed());
            } else if ((desCount % 150) === 0 && desCount !== 0) {
                this.text_counter = 150 * ((desCount / 150).toFixed());
            } else if ((desCount % 150) === 0 && desCount === 0) {
                this.text_counter = 150;
            } else {
                this.text_counter = 150 * (parseInt((desCount / 150).toFixed()) + 1);
            }
        }
    },
    components: {
        closeIcon,
        minusIcon,
        plusIcon,
        amenities,
        switchBtn,
        spinner,
        carIcon,
        preferences
    },
    mounted () {
        console.log('---------user----------', this.user);
        // set for male or female
        if (this.user.gender === 'male') {
            this.genderFlag = true;
        } else {
            this.genderFlag = false;
        }
        this.tripData = this.data;
    },
    props: {
        data: {
            type: Object,
            required: false,
            default: null
        }
    }
};
</script>