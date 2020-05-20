<template>
    <div class="new-trip-component container">
        <div class="newtripcontentContainer">
        <div class="header">
            <div class="headercontent">
            <h2 class="header-title">Offer a new ride</h2>
            <div id="carmodelandbutton">
                <span style="display:flex; flex-direction: row;">
                    <p style="margin:0;padding:0;"> Car Model: {{this.user.cartype}} </p>
                </span>
                <div id="updatecarbutton">
        <router-link :to="{name:'profile_update'}"> <p id="editbuttontext">Edit Profile</p></router-link>
                </div>
            </div>
            </div>
        </div>
        <div class="form">
            <p style="margin:0;padding:0;position:relative; margin-left:20px;font-size: 11px;">TRIP DETAILS</p>
                    <div class="new-left trip_points col-sm-13 col-md-15">
                                <div v-for="(m, index) in points" class="trip_points gmap-autocomplete" :class="{'trip-error' : m.error.state}" :key="index">
                                    <span v-if="index == 0" class="sr-only">Origin</span>
                                    <span v-if="index == points.length - 1" class="sr-only">Destination</span>
                                    <OsmAutocomplete :placeholder="getPlaceholder(index)" name="'input-' + index" ref="'input-' + index" :value="m.name" v-on:place_changed="(data) => getPlace(index, data)" :classes="'form-control form-control-with-icons form-control-map-autocomplete'" :country="allowForeignPoints ? null : 'JO'"  :class="{'has-error': m.error.state}"></OsmAutocomplete>
                                    <!-- <GmapAutocomplete  :selectFirstOnEnter="true" :types="['(cities)']" :componentRestrictions="allowForeignPoints ? null : {country: 'JO'}" :placeholder="getPlaceholder(index)"  :value="m.name" :name="'input-' + index" :ref="'input-' + index" v-on:place_changed="(data) => getPlace(index, data)" class="form-control form-control-with-icons form-control-map-autocomplete" :class="{'has-error': m.error.state}"> </GmapAutocomplete> -->
                                    <div @click="m.name = ''" class="date-picker--cross"><i aria-hidden="true" class="fa fa-times"></i></div>
                                    <span class="error" v-if="m.error.state"> {{m.error.message}} </span>
                                </div>
                    </div>

                <div class="datetimecontainer">
                      <DatePicker
                       :value="date"
                       :minDate="minDate"
                       :class="{'has-error': dateError.state}"
                        v-on:date_changed="(date) => this.dateAnswer = date">
                        </DatePicker>
                    <span class="error" v-if="dateError.state"> {{dateError.message}} </span>
                    <div id="datetime">
                         <input type="time" v-mask="'##:##'" v-model="time" class="form-control form-control-with-icon form-control-time" id="time" :class="{'has-error': timeError.state}" placeholder="Hour (12:00)" >
                         <span class="error" v-if="timeError.state"> {{timeError.message}} </span>
                    </div>
                </div>
               <div class="trip_seats-available">
                                <fieldset>
                                    <legend class="label-for-group">Places available</legend>
                                    <span class="radio-inline">
                                        <input type="radio" id="seats-one" value="1" v-model="trip.total_seats">
                                        <label for="seats-one">1</label>
                                    </span>
                                    <span class="radio-inline">
                                        <input type="radio" id="seats-two" value="2" v-model="trip.total_seats">
                                        <label for="seats-two">2</label>
                                    </span>
                                    <span class="radio-inline">
                                        <input type="radio" id="seats-three" value="3" v-model="trip.total_seats">
                                        <label for="seats-three">3</label>
                                    </span>
                                    <span class="radio-inline">
                                        <input type="radio" id="seats-four" value="4" v-model="trip.total_seats">
                                        <label for="seats-four">4</label>
                                    </span>
                                </fieldset>
                                <span class="error" v-if="seatsError.state"> {{seatsError.message}} </span>
                            </div>

                <div class="trip-comment">
                                <label for="trip_comment"  class="label-for-group"> <p style="color:rgba(28, 137, 131, 1);">NOTES</p><h6>(let the passengers know where you’ll be waiting) </h6></label>
                                <textarea placeholder="Write a note for your passengers" maxlength="1000" v-model="trip.description" id="trp_comment" class="form-control"></textarea>
                                <span class="error" v-if="commentError.state"> {{commentError.message}} </span>
                            </div>
                </div>
                <div id="button">
                        <fieldset class="trip-privacity">
                            <legend class="label-for-group"> Travel privacy </legend>
                            <ul class="no-bullet">
                                <li>
                                    <input type="radio" id="privacity-public" value="2" v-model="trip.friendship_type_id">
                                    <label for="privacity-public" class="label-soft">Public</label>
                                </li>
                                <li>
                                    <input type="radio" id="privacity-friendofriend" value="1" v-model="trip.friendship_type_id">
                                    <label for="privacity-friendofriend" class="label-soft">Friends of Friends</label>
                                </li>
                                <li>
                                    <input type="radio" id="privacity-friend" value="0" v-model="trip.friendship_type_id">
                                    <label for="privacity-friend" class="label-soft"> Friends Only</label>
                                </li>
                            </ul>


                        </fieldset>
             <div class="submit">
                  <div class="trip_terms">
                        <input type="checkbox" id="no-profit" v-model="no_profit" checked />
                        <div>
                            <label for="no-profit" class="trip_terms_label" :class="{'has-error': profitError.state }"  >
                                I promise not to profit with the trip.
                                <span class="tooltip-bottom" data-tooltip="When requesting a contribution above the maximum, it is possible that the trip is considered for profit and therefore an illegal transport of passengers, and the individual automotive insurance and associated third party coverage may be invalidated. Let's have a good trip taking care of us all :-D ">
                                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                                </span>
                                <br />
                                <small>The maximum contribution is equal to fuel costs + tolls divided by the number of people traveling in the car. During the pre-trip coordination, anyone can ask to do the division with fuel and toll tickets in hand. </small>
                            </label>
                        </div>

                        </div>
                            <button v-if="!showReturnTrip" class="trip-create btn btn-primary btn-lg btn-shadowed" @click="save" :disabled="saving">
                                <span v-if="!updatingTrip">LessGo!</span>
                                <span v-else>Update</span>
                            </button>
                <div id="footerNote">
                    <p style="margin:0;padding:0;color:rgba(230, 90, 91, 1);">By pressing “LessGo!” you promise not to profit from this trip and divide all expenses equally with the passengers.</p>
                  </div>
                </div>

                <!-- <div class="femalenote">
                    <div style="display:flex;flex-direction:row;">
                        <div>Icon</div>
                        <div>Only offer this ride to females</div>
                    </div>
                    <div>CheckBox</div>
                </div> -->



            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { parseOsmStreet } from '../../services/maps.js';
import DatePicker from '../DatePicker';
import dialogs from '../../services/dialogs.js';
import moment from 'moment';
import { last } from 'lodash';
import OsmApi from '../../services/api/Osm';
import OsmAutocomplete from '../OsmAutocomplete';
import bus from '../../services/bus-event';
import router from '../../router';

let osmApi = new OsmApi();

class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'new-trip',
    props: {
        'id': {
            type: [String, Number],
            required: false
        }
    },
    components: {
        DatePicker,
        OsmAutocomplete
    },
    data () {
        return {
            minDate: moment().toDate(),
            profitError: new Error(),
            dateError: new Error(),
            timeError: new Error(),
            commentError: new Error(),
            seatsError: new Error(),
            no_profit: false,
            sameCity: false,
            zoom: 4,
            center: [-29.0, -60.0],
            points: [
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    error: new Error()
                },
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    error: new Error()
                }
            ],
            date: '',
            dateAnswer: this.date,
            time: '12:00',
            duration: 0,
            passengers: 0,
            trip: {
                'is_passenger': 0,
                'from_town': '',
                'to_town': '',
                'trip_date': '',
                'total_seats': 1,
                'friendship_type_id': 2,
                'estimated_time': '00:00',
                'distance': 0.0,
                'co2': 0.0,
                'description': '',
                'car_id': null,
                'enc_path': '123',
                'points': [] /* address json_address lat lng */
            },
            updatingTrip: null,
            saving: false,
            allowForeignPoints: false,
            url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            showReturnTrip: false,
            otherTrip: {
                minDate: moment().toDate(),
                dateError: new Error(),
                timeError: new Error(),
                commentError: new Error(),
                seatsError: new Error(),
                no_profit: false,
                sameCity: false,
                zoom: 4,
                center: [-29.0, -60.0],
                points: [
                    {
                        name: '',
                        place: null,
                        json: null,
                        location: null,
                        error: new Error()
                    },
                    {
                        name: '',
                        place: null,
                        json: null,
                        location: null,
                        error: new Error()
                    }
                ],
                date: '',
                dateAnswer: this.date,
                time: '12:00',
                duration: 0,
                passengers: 0,
                trip: {
                    'is_passenger': 0,
                    'from_town': '',
                    'to_town': '',
                    'trip_date': '',
                    'total_seats': 2,
                    'friendship_type_id': 2,
                    'estimated_time': '00:00',
                    'distance': 0.0,
                    'co2': 0.0,
                    'description': '',
                    'car_id': null,
                    'enc_path': '123',
                    'points': [] /* address json_address lat lng */
                }
            }
        };
    },
    mounted () {
        bus.on('clear-click', this.onClearClick);
        let self = this;
        this.time = moment().add(1, 'hours').format('HH:00');
        this.otherTrip.time = moment().add(2, 'hours').format('HH:00');
        /* this.$refs.map.$mapCreated.then(() => {
            console.log('Map was created');
            / * eslint-disable no-undef * /
            this.directionsService = new google.maps.DirectionsService();
            this.directionsDisplay = new google.maps.DirectionsRenderer();
            this.directionsDisplay.setMap(this.$refs.map.$mapObject);
            if (self.id) {
                self.loadTrip();
            }
        }); */
        if (self.id) {
            self.loadTrip();
        }
    },

    computed: {
        ...mapGetters({
            user: 'auth/user',
            cars: 'cars/cars',
            isMobile: 'device/isMobile'
        }),
        distanceString () {
            return Math.floor(this.trip.distance / 1000) + ' Km';
        },
        estimatedTimeString () {
            const totalMinutes = Math.floor(this.duration / 60);
            const minutes = Math.floor(totalMinutes % 60);
            const hour = Math.floor(totalMinutes / 60);
            return (hour < 10 ? '0' : '') + hour + ':' + (minutes < 10 ? '0' : '') + minutes;
        },
        CO2String () {
            return Math.floor(this.trip.distance / 1000) * 1.5 + ' Kg';
        },
        otherTripDistanceString () {
            return Math.floor(this.otherTrip.trip.distance / 1000) + ' Km';
        },
        otherTripEstimatedTimeString () {
            const totalMinutes = Math.floor(this.otherTrip.duration / 60);
            const minutes = Math.floor(totalMinutes % 60);
            const hour = Math.floor(totalMinutes / 60);
            return (hour < 10 ? '0' : '') + hour + ':' + (minutes < 10 ? '0' : '') + minutes;
        },
        otherTripCO2String () {
            return Math.floor(this.otherTrip.trip.distance / 1000) * 1.5 + ' Kg';
        }
    },
    watch: {
        'no_profit': function () {
            this.profitError.state = false;
        },
        'dateAnswer': function (value) {
            if (!this.showReturnTrip || !this.otherTrip.dateAnswer) {
            }
        },
        'time': function () {
            this.timeError.state = false;
        },
        'otherTrip.dateAnswer': function () {
            this.otherTrip.dateError.state = false;
        },
        'otherTrip.time': function () {
            this.otherTrip.timeError.state = false;
        },
        'trip.friendship_type_id': function () {
            console.log('change');
            this.otherTrip.trip.friendship_type_id = this.trip.friendship_type_id;
        }
    },
    methods: {
        ...mapActions({
            'createTrip': 'trips/create',
            'updateTrip': 'trips/update',
            'getTrip': 'getTrip'
        }),
        restoreData (trip) {
            this.no_profit = true;
            this.points = [];
            console.log(trip);
            trip.points.forEach(p => {
                let point = {
                    name: p.address,
                    json: p.json_address,
                    location: {
                        lat: p.lat,
                        lng: p.lng
                    },
                    place: JSON.stringify(p.json_address),
                    error: new Error()
                };
                this.points.push(point);
            });
            this.date = moment(trip.trip_date.split(' ')[0]).format('YYYY-MM-DD');
            this.time = trip.trip_date.split(' ')[1];
            this.trip.is_passenger = trip.is_passenger ? 1 : 0;
            this.passengers = trip.passenger_count;
            this.trip.total_seats = trip.total_seats;
            this.trip.friendship_type_id = trip.friendship_type_id;
            this.trip.distance = trip.distance;
            this.trip.description = trip.description;
        },

        loadTrip () {
            this.getTrip(this.id).then(trip => {
                if (this.user.id === trip.user.id) {
                    this.updatingTrip = trip;
                    this.restoreData(trip);
                } else {
                    this.$router.replace({ name: 'trips' });
                }
            }).catch(error => {
                console.log(error);
                if (error) {
                    this.$router.replace({ name: 'trips' });
                }
            });
        },

        validate () {
            let globalError = true;
            let foreignPoints = 0;
            let validTime = false;
            let validDate = false;
            let validOtherTripTime = false;
            let validOtherTripDate = false;

            this.points.concat(this.showReturnTrip ? this.otherTrip.points : []).forEach(p => {
                if (!p.json) {
                    p.error.state = false;
                    p.error.message = 'Select a valid location.';
                    globalError = false;
                } else {
                    foreignPoints += (p.json.pais === 'Jordan' ? 0 : 1);
                }
            });

            if (foreignPoints > 1) {
                globalError = false;
                this.points[0].error.state = false;
                this.points[0].error.message = 'The Origin or Destination of your trip has to be in Jordan. ';
            }

            if (!this.time || !moment(this.time, 'HH mm').isValid()) {
                this.timeError.state = false;
                this.timeError.message = 'You did not enter a valid Time. ';
                globalError = false;
            } else {
                validTime = true;
            }

            if (this.points[0].json && last(this.points).json && this.points[0].name === last(this.points).name) {
                this.points[0].error.state = true;
                this.points[0].error.message = 'The location of Origin and Destination should not be the same.';
                last(this.points).error.state = true;
                last(this.points).error.message = 'The location of Origin and Destination should not be the same.';
                this.sameCity = true;
                globalError = true;
            }

            if (!(this.dateAnswer && this.dateAnswer.length) || !moment(this.dateAnswer).isValid()) {
                globalError = true;
                this.dateError.state = true;
                this.dateError.message = 'You have not entered any dates yet. ';
            } else {
                validDate = true;
            }
            if (this.trip.total_seats < this.passengers) {
                globalError = true;
                this.seatsError.state = true;
                this.seatsError.message = 'You already have' + this.trip.passengers + ' uploaded on this trip. You can not change the number of seats by one less than the number of passengers already on board. ';
                dialogs.message('You already have' + this.trip.passengers + ' uploaded on this trip. You can not change the number of seats by one less than the number of passengers already uploaded. ', {status: 'error'});
            } else if (globalError) {
                dialogs.message('Some data entered are not valid. ', {status: 'error'});
            } else if (this.no_profit) {
                this.profitError.state = false;
                globalError = false;
            }
            if (validDate && validTime) {
                console.log('valid date time');
                if (moment(this.dateAnswer).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
                    console.log('es hoy', moment(this.time, 'HH mm').format('HH mm'), moment().format('HH mm'));
                    // the date is today, the Hour should not be previous
                    if (moment(this.time, 'HH mm').format('HH mm') < moment().format('HH mm')) {
                        console.log('Sorry we dont have a time machine !!!!! Contact us at info@lessgo.app if you are intrested in working with us =) ');
                        this.timeError.state = true;
                        this.timeError.message = 'LessGo does not allow trips to the past :), check the date and Hour of your trip.';
                        globalError = true;
                    }
                }
            }

            if (this.showReturnTrip) {
                if (!this.otherTrip.time || !moment(this.otherTrip.time, 'HH mm').isValid()) {
                    this.otherTrip.timeError.state = true;
                    this.otherTrip.timeError.message = 'You did not enter a valid time.';
                    globalError = true;
                } else {
                    validOtherTripTime = true;
                }

                if (this.otherTrip.points[0].json && last(this.otherTrip.points).json && this.otherTrip.points[0].name === last(this.otherTrip.points).name) {
                    this.otherTrip.points[0].error.state = true;
                    this.otherTrip.points[0].error.message = 'The location of Origin and Destination should not be the same. ';
                    last(this.otherTrip.points).error.state = true;
                    last(this.otherTrip.points).error.message = 'The location of Origin and Destination should not be the same. ';
                    this.otherTrip.sameCity = true;
                    globalError = true;
                }

                if (!(this.otherTrip.dateAnswer && this.otherTrip.dateAnswer.length) || !moment(this.otherTrip.dateAnswer).isValid()) {
                    globalError = true;
                    this.otherTrip.dateError.state = true;
                    this.otherTrip.dateError.message = 'You have not entered any dates yet.';
                } else {
                    validOtherTripDate = true;
                }
                if (globalError) {
                    dialogs.message('Some data entered are not valid.', {status: 'error'});
                }

                if (validOtherTripTime && validOtherTripDate) {
                    console.log('valid date time');
                    if (moment(this.otherTrip.dateAnswer).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
                        console.log('es hoy', moment(this.otherTrip.time, 'HH mm').format('HH mm'), moment().format('HH mm'));
                      // the date is today, the time should not be previous
                        if (moment(this.otherTrip.time, 'HH mm').format('HH mm') < moment().format('HH mm')) {
                            console.log(' its before now ');
                            this.otherTrip.timeError.state = true;
                            this.otherTrip.timeError.message = 'LessGo does not allow trips to the past :), check the date and time of your trip. ';
                            globalError = true;
                        }
                    }

                    const tripDate = moment(this.dateAnswer);
                    const otherTripDate = moment(this.otherTrip.dateAnswer);
                    let time = moment(this.time, 'HH:mm');

                    tripDate.set({
                        hour: time.get('hour'),
                        minute: time.get('minute'),
                        second: time.get('second')
                    });

                    time = moment(this.otherTrip.time, 'HH:mm');

                    otherTripDate.set({
                        hour: time.get('hour'),
                        minute: time.get('minute'),
                        second: time.get('second')
                    });

                    if (otherTripDate.isBefore(tripDate) || otherTripDate.isSame(tripDate)) {
                        this.otherTrip.timeError.state = true;
                        this.otherTrip.timeError.message = 'The date and time of your return trip must be greater than the date and time of your outward journey. ';
                        globalError = true;
                    }
                }
            }

            return globalError;
        },

        getSaveInfo (tripObj, estimatedTime) {
            const points = tripObj.points.map(p => {
                return {
                    address: p.name,
                    json_address: p.json,
                    lat: p.location.lat,
                    lng: p.location.lng
                };
            });

            const tripInfo = {
                points,
                from_town: points[0].address,
                to_town: last(points).address,
                trip_date: tripObj.dateAnswer + ' ' + tripObj.time + ':00',
                estimated_time: estimatedTime,
                car_id: this.cars.length > 0 ? this.cars[0].id : undefined
            };

            return Object.assign({}, tripObj.trip, tripInfo);
        },

        save () {
            if (this.validate()) {
                return;
            }
            /* eslint-disable no-unreachable */
            this.saving = true;

            this.trip = this.getSaveInfo(this, this.estimatedTimeString);

            if (!this.updatingTrip) {
                this.createTrip(this.trip).then((t) => {
                    return new Promise((resolve, reject) => {
                        if (!this.showReturnTrip) {
                            return resolve();
                        } else {
                            const otherTrip = this.getSaveInfo(this.otherTrip, this.otherTripEstimatedTimeString);

                            otherTrip.parent_trip_id = t.id;

                            this.createTrip(otherTrip).then((ot) => {
                                return resolve(ot);
                            });
                        }
                    }).then((ot) => {
                        this.saving = false;
                        this.$router.replace({ name: 'detail_trip', params: { id: t.id } });
                    });
                }).catch(() => { this.saving = false; });
            } else {
                console.log(this.trip);
                this.trip.id = this.updatingTrip.id;
                this.updateTrip(this.trip).then(() => {
                    this.saving = false;
                    this.$router.replace({ name: 'detail_trip', params: { id: this.trip.id } });
                }).catch(() => { this.saving = false; });
            }
        },

        getPlace (i, data, type) {
            type = type || 'trip';

            const trip = type === 'trip' ? this : this.otherTrip;

            trip.points[i].place = data;
            trip.points[i].name = data.display_name;
            // TODO: Recordar parseStreet
            trip.points[i].json = parseOsmStreet(data);
            trip.points[i].error.state = false;
            trip.center = trip.points[i].location = {
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lon)
            };

            if ((i === 0 || i === trip.points.length - 1) && trip.sameCity) {
                trip.points[0].error.state = false;
                last(trip.points).error.state = false;
            }

            if (type === 'trip') {
                let point = this.otherTrip.points[0];

                if (i === 0) {
                    point = last(this.otherTrip.points);
                }

                point.place = data;
                point.name = data.display_name;
                point.json = parseOsmStreet(data);
                point.error.state = false;
                this.otherTrip.center = point.location = {
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lon)
                };

                this.calcRoute('returnTrip');
            }

            this.calcRoute(type);
        },

        getPlaceholder (index) {
            if (this.points.length - 1 === index) {
                return 'Destination';
            } else if (index === 0) {
                return 'Origin';
            } else {
                return 'Enter intermediate point';
            }
        },

        calcRoute (type) {
            type = type || 'trip';

            const trip = type === 'trip' ? this : this.otherTrip;

            console.log('calc route', trip.points);

            for (let i = 0; i < trip.points.length; i++) {
                if (!trip.points[i].name) {
                    return;
                }
            }
            let data = {
                origin: trip.points[0].location,
                destiny: last(trip.points).location
            };
            osmApi.route(data).then((result) => {
                console.log('osm route result', result);
                if (result.code === 'Ok' && result.routes && result.routes.length) {
                    let route = result.routes[0];
                    trip.trip.distance = route.distance;
                    trip.duration = route.duration;
                    trip.trip.co2 = route.distance * 0.15;
                }
            });

            if (this.$refs.map && this.$refs.map.mapObject) {
                let map = this.$refs.map.mapObject;

                /* eslint-disable no-undef */
                L.Routing.control({
                    waypoints: [
                        L.latLng(data.origin.lat, data.origin.lng),
                        L.latLng(data.destiny.lat, data.destiny.lng)
                    ]
                }).addTo(map);
            }

            /* this.directionsService.route({
                origin: this.points[0].location,
                destination: this.points[this.points.length - 1].location,
                travelMode: 'DRIVING'
            }, (response, status) => {
                if (status === 'OK') {
                    this.directionsDisplay.setDirections(response);

                    let path = response.routes[0].overview_path;
                    let encodeString = google.maps.geometry.encoding.encodePath(path);
                    this.trip.enc_path = encodeString;

                    let totalDistance = 0;
                    let totalDuration = 0;
                    let legs = response.routes[0].legs;
                    for (let i = 0; i < legs.length; ++i) {
                        totalDistance += legs[i].distance.value;
                        totalDuration += legs[i].duration.value;
                    }
                    this.trip.distance = totalDistance;
                    this.duration = totalDuration;
                    this.trip.co2 = totalDistance * 0.15;
                } else {
                    console.log(this.points[0].name, this.points[this.points.length - 1].name, 'DRIVING');
                    console.log('Directions request failed due to ' + status);
                }
            }); */
        },
        onClearClick () {
            router.back();
        }
    },
    beforeDestroy () {
        bus.off('clear-click', this.onClearClick);
    }
};
</script>

<style>

.picker.form-control {
    padding: px 1em 0em 0.8em !important;
}




input#time {
    padding: 1em 1em 1em 2em !important;
}


 .form-control-with-icons {

    padding: 1em 0em 1em 3em  !important;
    }

    .trip_points:first-child .form-control-map-autocomplete {
    border-color: none !important;
    background-color: #f0f4f3;
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDQzMC42MDIgNDMwLjYwMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDMwLjYwMiA0MzAuNjAyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+PHNjcmlwdCB4bWxucz0iIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSIiPihmdW5jdGlvbiBpbmplY3QoKSB7CiAgICB3aW5kb3cua3JVMkYgPSB0cnVlOwogICAgY29uc3QgY2hyb21lID0gd2luZG93WydjaHJvbWUnXTsKICAgIGZ1bmN0aW9uIGluamVjdE1lc3NhZ2VQb3J0KCkgewogICAgICAgIGNvbnN0IG5hdGl2ZVJ1bnRpbWUgPSB7CiAgICAgICAgICAgIGNvbm5lY3Q6IGNocm9tZS5ydW50aW1lLmNvbm5lY3QsCiAgICAgICAgICAgIHNlbmRNZXNzYWdlOiBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSwKICAgICAgICB9OwogICAgICAgIGNocm9tZS5ydW50aW1lLmNvbm5lY3QgPSBmdW5jdGlvbiAoZXh0ZW5zaW9uSWQsIGNvbm5lY3RJbmZvKSB7CiAgICAgICAgICAgIGlmIChleHRlbnNpb25JZCA9PT0gJ2tsbmptaWxsZmlsZGJiaW1raW5jbGptZm9lcGZoampqJwogICAgICAgICAgICAgICAgfHwgZXh0ZW5zaW9uSWQgPT09ICdrbWVuZGZhcGdnamVob2RuZGZsbW1nYWdkYmFtaG5mZCcpIHsKICAgICAgICAgICAgICAgIGNvbnN0IGZhbGxiYWNrUG9ydCA9IG5hdGl2ZVJ1bnRpbWUuY29ubmVjdChleHRlbnNpb25JZCwgY29ubmVjdEluZm8pOwogICAgICAgICAgICAgICAgY29uc3QgcmVxdWVzdHMgPSB7fTsKICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0Q291bnRlciA9IDA7CiAgICAgICAgICAgICAgICBjb25zdCBwb3J0ID0gewogICAgICAgICAgICAgICAgICAgIGtyUG9ydDogdHJ1ZSwKICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb25uZWN0SW5mby5uYW1lLAogICAgICAgICAgICAgICAgICAgIG9uRGlzY29ubmVjdDogewogICAgICAgICAgICAgICAgICAgICAgICBhZGRMaXN0ZW5lcihsKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgVE9ETzogaWYgZmFsbGJhY2sgaXMgbm90IG5lY2Vzc2FyeSwgdGhlbgogICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gIGZhbGxiYWNrUG9ydC5vbkRpc2Nvbm5lY3QgbWF5IGJlIGEgZmFsc2UKICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICBmYWlsdXJlIHNpbmNlIEtyeXB0b24gY2FuIHNlcnZpY2UgdGhlIHJlcXVlc3QKICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICByZWdhcmRsZXNzIG9mIHdoZXRoZXIgY29ubmVjdGluZyB0byB0aGUKICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICBmYWxsYmFjayBleHRlbnNpb24gc3VjY2VlZHMKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbGxiYWNrUG9ydC5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIobCk7CiAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICBvbk1lc3NhZ2U6IHsKICAgICAgICAgICAgICAgICAgICAgICAgYWRkTGlzdGVuZXIobCkgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsbGJhY2tQb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihsKTsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2dCkgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldnQub3JpZ2luICE9PSB3aW5kb3cubG9jYXRpb24ub3JpZ2luKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYGV2ZW50IGZyb20gb3JpZ2luICR7ZXZ0Lm9yaWdpbn0sIG5vdCAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59YCk7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VUeXBlcyA9IFsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3UyZl9nZXRfYXBpX3ZlcnNpb25fcmVzcG9uc2UnLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndTJmX3JlZ2lzdGVyX3Jlc3BvbnNlJywKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3UyZl9zaWduX3Jlc3BvbnNlJywKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYmF1dGhuX3JlZ2lzdGVyX3Jlc3BvbnNlJywKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYmF1dGhuX3NpZ25fcmVzcG9uc2UnLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF07CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlVHlwZXMuaW5kZXhPZihldnQuZGF0YS50eXBlKSAmZ3Q7PSAwKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RJZCA9IGV2dC5kYXRhLnJlcXVlc3RJZDsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2dC5kYXRhLnJlc3BvbnNlRGF0YSAmYW1wOyZhbXA7IGV2dC5kYXRhLnJlc3BvbnNlRGF0YS5mYWxsYmFjaykgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RzW3JlcXVlc3RJZF0pIHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxsYmFja1BvcnQucG9zdE1lc3NhZ2UocmVxdWVzdHNbcmVxdWVzdElkXSk7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbChldnQuZGF0YSk7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIChyZXF1ZXN0c1tyZXF1ZXN0SWRdKTsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB0cnVlKTsKICAgICAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgIGRpc2Nvbm5lY3QoKSB7CiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlKG1zZykgewogICAgICAgICAgICAgICAgICAgICAgICBpZiAobXNnLnR5cGUgPT09ICd1MmZfZ2V0X2FwaV92ZXJzaW9uX3JlcXVlc3QnKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0SWQ6IG1zZy5yZXF1ZXN0SWQsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VEYXRhOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzX2FwaV92ZXJzaW9uOiAxLjEsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndTJmX2dldF9hcGlfdmVyc2lvbl9yZXNwb25zZScsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9OwogICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKHJlc3BvbnNlLCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKTsKICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ3UyZl9zaWduX3JlcXVlc3QnCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBtc2cudHlwZSA9PT0gJ3UyZl9yZWdpc3Rlcl9yZXF1ZXN0JwogICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgbXNnLnR5cGUgPT09ICd3ZWJhdXRobl9zaWduX3JlcXVlc3QnKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgZG9uJ3Qgb3ZlcndyaXRlIHJlcXVlc3RJZCBzZXQgYnkgcGFnZQogICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnLnJlcXVlc3RJZCA9IG1zZy5yZXF1ZXN0SWQgfHwgKytyZXF1ZXN0Q291bnRlcjsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RzW21zZy5yZXF1ZXN0SWRdID0gbXNnOwogICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKG1zZywgd2luZG93LmxvY2F0aW9uLm9yaWdpbik7CiAgICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ3VuaGFuZGxlZCBwb3J0IG1lc3NhZ2UgJyArIEpTT04uc3RyaW5naWZ5KG1zZykpOwogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgIH07CiAgICAgICAgICAgICAgICByZXR1cm4gcG9ydDsKICAgICAgICAgICAgfQogICAgICAgICAgICBlbHNlIHsKICAgICAgICAgICAgICAgIHJldHVybiBuYXRpdmVSdW50aW1lLmNvbm5lY3QuYmluZChjaHJvbWUucnVudGltZSkoZXh0ZW5zaW9uSWQsIGNvbm5lY3RJbmZvKTsKICAgICAgICAgICAgfQogICAgICAgIH07CiAgICB9CiAgICBpbmplY3RNZXNzYWdlUG9ydCgpOwp9KSgpOzwvc2NyaXB0PjxzY3JpcHQgeG1sbnM9IiIgY2xhc3M9ImFjdGl2ZS1wYXRoIj48L3NjcmlwdD48Zz4KCTxwYXRoIGQ9Ik0yMTUuMzAxLDYwYzQxLjQ4MiwwLDgwLjQ4MSwxNi4xNTQsMTA5LjgxNCw0NS40ODZjMjkuMzMyLDI5LjMzMiw0NS40ODUsNjguMzMyLDQ1LjQ4NSwxMDkuODE0ICAgYzAsNDEuNDgxLTE2LjE1Myw4MC40ODEtNDUuNDg1LDEwOS44MTNjLTI5LjMzMywyOS4zMzItNjguMzMyLDQ1LjQ4Ni0xMDkuODE0LDQ1LjQ4NmMtNDEuNDgyLDAtODAuNDgxLTE2LjE1NC0xMDkuODE0LTQ1LjQ4NiAgIEM3Ni4xNTUsMjk1Ljc4MSw2MC4wMDEsMjU2Ljc4MSw2MC4wMDEsMjE1LjNjMC00MS40ODIsMTYuMTU0LTgwLjQ4Miw0NS40ODYtMTA5LjgxNEMxMzQuODIsNzYuMTU1LDE3My44MTksNjAsMjE1LjMwMSw2MCAgICBNMjE1LjMwMSwwQzk2LjM5NCwwLDAsOTYuMzk0LDAsMjE1LjMwMXM5Ni4zOTQsMjE1LjMwMSwyMTUuMzAxLDIxNS4zMDFzMjE1LjMwMS05Ni4zOTQsMjE1LjMwMS0yMTUuMzAxUzMzNC4yMDgsMCwyMTUuMzAxLDAgICBMMjE1LjMwMSwweiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIj48L3BhdGg+CjwvZz48L2c+IDwvc3ZnPg==') no-repeat center left #F0F4F3;
    background-size: 1em;
    background-position: 1em !important;
    }

.trip_points:last-child .form-control-map-autocomplete
{
     border-color: none !important;
    background-color: #f0f4f3;
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+PGc+PHNjcmlwdCB4bWxucz0iIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSIiPihmdW5jdGlvbiBpbmplY3QoKSB7CiAgICB3aW5kb3cua3JVMkYgPSB0cnVlOwogICAgY29uc3QgY2hyb21lID0gd2luZG93WydjaHJvbWUnXTsKICAgIGZ1bmN0aW9uIGluamVjdE1lc3NhZ2VQb3J0KCkgewogICAgICAgIGNvbnN0IG5hdGl2ZVJ1bnRpbWUgPSB7CiAgICAgICAgICAgIGNvbm5lY3Q6IGNocm9tZS5ydW50aW1lLmNvbm5lY3QsCiAgICAgICAgICAgIHNlbmRNZXNzYWdlOiBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSwKICAgICAgICB9OwogICAgICAgIGNocm9tZS5ydW50aW1lLmNvbm5lY3QgPSBmdW5jdGlvbiAoZXh0ZW5zaW9uSWQsIGNvbm5lY3RJbmZvKSB7CiAgICAgICAgICAgIGlmIChleHRlbnNpb25JZCA9PT0gJ2tsbmptaWxsZmlsZGJiaW1raW5jbGptZm9lcGZoampqJwogICAgICAgICAgICAgICAgfHwgZXh0ZW5zaW9uSWQgPT09ICdrbWVuZGZhcGdnamVob2RuZGZsbW1nYWdkYmFtaG5mZCcpIHsKICAgICAgICAgICAgICAgIGNvbnN0IGZhbGxiYWNrUG9ydCA9IG5hdGl2ZVJ1bnRpbWUuY29ubmVjdChleHRlbnNpb25JZCwgY29ubmVjdEluZm8pOwogICAgICAgICAgICAgICAgY29uc3QgcmVxdWVzdHMgPSB7fTsKICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0Q291bnRlciA9IDA7CiAgICAgICAgICAgICAgICBjb25zdCBwb3J0ID0gewogICAgICAgICAgICAgICAgICAgIGtyUG9ydDogdHJ1ZSwKICAgICAgICAgICAgICAgICAgICBuYW1lOiBjb25uZWN0SW5mby5uYW1lLAogICAgICAgICAgICAgICAgICAgIG9uRGlzY29ubmVjdDogewogICAgICAgICAgICAgICAgICAgICAgICBhZGRMaXN0ZW5lcihsKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgVE9ETzogaWYgZmFsbGJhY2sgaXMgbm90IG5lY2Vzc2FyeSwgdGhlbgogICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gIGZhbGxiYWNrUG9ydC5vbkRpc2Nvbm5lY3QgbWF5IGJlIGEgZmFsc2UKICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICBmYWlsdXJlIHNpbmNlIEtyeXB0b24gY2FuIHNlcnZpY2UgdGhlIHJlcXVlc3QKICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICByZWdhcmRsZXNzIG9mIHdoZXRoZXIgY29ubmVjdGluZyB0byB0aGUKICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICBmYWxsYmFjayBleHRlbnNpb24gc3VjY2VlZHMKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbGxiYWNrUG9ydC5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIobCk7CiAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICBvbk1lc3NhZ2U6IHsKICAgICAgICAgICAgICAgICAgICAgICAgYWRkTGlzdGVuZXIobCkgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsbGJhY2tQb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihsKTsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2dCkgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldnQub3JpZ2luICE9PSB3aW5kb3cubG9jYXRpb24ub3JpZ2luKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYGV2ZW50IGZyb20gb3JpZ2luICR7ZXZ0Lm9yaWdpbn0sIG5vdCAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59YCk7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VUeXBlcyA9IFsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3UyZl9nZXRfYXBpX3ZlcnNpb25fcmVzcG9uc2UnLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndTJmX3JlZ2lzdGVyX3Jlc3BvbnNlJywKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3UyZl9zaWduX3Jlc3BvbnNlJywKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYmF1dGhuX3JlZ2lzdGVyX3Jlc3BvbnNlJywKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYmF1dGhuX3NpZ25fcmVzcG9uc2UnLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF07CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlVHlwZXMuaW5kZXhPZihldnQuZGF0YS50eXBlKSAmZ3Q7PSAwKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RJZCA9IGV2dC5kYXRhLnJlcXVlc3RJZDsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2dC5kYXRhLnJlc3BvbnNlRGF0YSAmYW1wOyZhbXA7IGV2dC5kYXRhLnJlc3BvbnNlRGF0YS5mYWxsYmFjaykgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RzW3JlcXVlc3RJZF0pIHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxsYmFja1BvcnQucG9zdE1lc3NhZ2UocmVxdWVzdHNbcmVxdWVzdElkXSk7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbChldnQuZGF0YSk7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIChyZXF1ZXN0c1tyZXF1ZXN0SWRdKTsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB0cnVlKTsKICAgICAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgIGRpc2Nvbm5lY3QoKSB7CiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsKICAgICAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlKG1zZykgewogICAgICAgICAgICAgICAgICAgICAgICBpZiAobXNnLnR5cGUgPT09ICd1MmZfZ2V0X2FwaV92ZXJzaW9uX3JlcXVlc3QnKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0SWQ6IG1zZy5yZXF1ZXN0SWQsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VEYXRhOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzX2FwaV92ZXJzaW9uOiAxLjEsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndTJmX2dldF9hcGlfdmVyc2lvbl9yZXNwb25zZScsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9OwogICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKHJlc3BvbnNlLCB3aW5kb3cubG9jYXRpb24ub3JpZ2luKTsKICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChtc2cudHlwZSA9PT0gJ3UyZl9zaWduX3JlcXVlc3QnCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBtc2cudHlwZSA9PT0gJ3UyZl9yZWdpc3Rlcl9yZXF1ZXN0JwogICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgbXNnLnR5cGUgPT09ICd3ZWJhdXRobl9zaWduX3JlcXVlc3QnKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgZG9uJ3Qgb3ZlcndyaXRlIHJlcXVlc3RJZCBzZXQgYnkgcGFnZQogICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnLnJlcXVlc3RJZCA9IG1zZy5yZXF1ZXN0SWQgfHwgKytyZXF1ZXN0Q291bnRlcjsKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RzW21zZy5yZXF1ZXN0SWRdID0gbXNnOwogICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKG1zZywgd2luZG93LmxvY2F0aW9uLm9yaWdpbik7CiAgICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ3VuaGFuZGxlZCBwb3J0IG1lc3NhZ2UgJyArIEpTT04uc3RyaW5naWZ5KG1zZykpOwogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgIH07CiAgICAgICAgICAgICAgICByZXR1cm4gcG9ydDsKICAgICAgICAgICAgfQogICAgICAgICAgICBlbHNlIHsKICAgICAgICAgICAgICAgIHJldHVybiBuYXRpdmVSdW50aW1lLmNvbm5lY3QuYmluZChjaHJvbWUucnVudGltZSkoZXh0ZW5zaW9uSWQsIGNvbm5lY3RJbmZvKTsKICAgICAgICAgICAgfQogICAgICAgIH07CiAgICB9CiAgICBpbmplY3RNZXNzYWdlUG9ydCgpOwp9KSgpOzwvc2NyaXB0PjxzY3JpcHQgeG1sbnM9IiIgY2xhc3M9ImFjdGl2ZS1wYXRoIj48L3NjcmlwdD48Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0yNTYsMEMxNTMuNzU1LDAsNzAuNTczLDgzLjE4Miw3MC41NzMsMTg1LjQyNmMwLDEyNi44ODgsMTY1LjkzOSwzMTMuMTY3LDE3My4wMDQsMzIxLjAzNSAgICBjNi42MzYsNy4zOTEsMTguMjIyLDcuMzc4LDI0Ljg0NiwwYzcuMDY1LTcuODY4LDE3My4wMDQtMTk0LjE0NywxNzMuMDA0LTMyMS4wMzVDNDQxLjQyNSw4My4xODIsMzU4LjI0NCwwLDI1NiwweiBNMjU2LDI3OC43MTkgICAgYy01MS40NDIsMC05My4yOTItNDEuODUxLTkzLjI5Mi05My4yOTNTMjA0LjU1OSw5Mi4xMzQsMjU2LDkyLjEzNHM5My4yOTEsNDEuODUxLDkzLjI5MSw5My4yOTNTMzA3LjQ0MSwyNzguNzE5LDI1NiwyNzguNzE5eiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIj48L3BhdGg+Cgk8L2c+CjwvZz48L2c+IDwvc3ZnPg==') no-repeat center left #F0F4F3;
    background-size: 1em;
    background-position: 1em !important;
}

input#time {
    background-position: 0 4px !important;
    padding-top: 0;
    background-size: 1em;
    background-position: 0.5em !important;
    padding-bottom: 0;
}

.form-control.form-control-with-icon.form-control-date:before {
    content: "\F073";
    font-family: fontawesome;
}



span.vdp-datepicker__calendar-button {
    color: #a4a5a5;
}

</style>

<style scoped >
@import url('https://fonts.googleapis.com/css?family=Comfrotaa|Oswald');
.picker.form-control {
    padding: .1em .6em;
    height: 30px;
}

.newtripcontentContainer{
    /* border: solid 1px black; */
    height: 100%;
    margin-top:5em
}
#footerNote{
      /* border: solid black 1px; */
    position: relative;
    width: 100%;
    -ms-flex-item-align: center;
    -ms-grid-row-align: center;
    align-self: center;
    justify-content: center;
    text-align: center;
    margin-bottom: 2em;
    padding: 2em;
}
.lessgobutton{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-self: center;
    width: 87%;
    background-color: rgba(230, 90, 91, 1);
    border-radius: 10px;
    position: relative;
    top: 38px;
    height: 47px;
    box-shadow: 0px 0px 8px rgba(235, 85, 87, 0.8);
    /* color: white; */
}
.femalenote{
    /* border: solid 1px black; */
    display: flex;
    flex-direction: row;
    position: relative;
    top: 30px;
    align-self: center;
    width: 87%;
    height: 35px;
    align-items: center;
    justify-content: space-between;
}
.notesHolder textarea{
    background-color: rgba(240, 244, 243, 1);
    border: none;
    border-radius: 5px;
    height: 100px;
}
.notesHolder{
    position: relative;
    align-self:center;
    top: 20px;
    width: 87%;

}
#notesspan{
    height: 20%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

#listPickercontainer{
    display: flex;
    flex-direction: row;
    background-color: rgba(240, 244, 243, 1);
    width: 20%;
    height: 27px;
    border: none;
    border-radius: 5px;
}
.numberofpassengers{
    width: 89%;
    align-self: center;
    position: relative;
    top: 10px;
    display: flex;
    flex-direction: row;

}
#datetimeinput{
    display:flex;
    flex-direction:row;
    align-items:center;
    width: 80%;
}
.datetimecontainer{
    width: 95%;
    margin-bottom: 5px;
    display: flex;
    flex-direction: row;
    margin-top: 5px;
    align-self: center;
    justify-content: space-between;
}
#datetime{
    background-color: rgba(240, 244, 243, 1);
    width: 41%;
    border-radius: 5px;
    display: -ms-flexbox;
    margin-left: 1em;
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    height: 39px;
}
#icontextinput{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    /* border: solid 1px black; */
    width:7%;
    margin-right: 5px;
}
p{
    color: rgba(28, 137, 131, 1);
}
#inputContainer{
    display: flex;
    flex-direction: row;justify-content: center;
    background-color: rgba(240, 244, 243, 1);
    height: 30px;
    width: 90%;
    align-self: center;
    margin-bottom: 10px;
}
section{
    background-color: white;
}
#input{
    border: none;
    border-radius: 5px;
    background-color: rgba(240, 244, 243, 1);
    width: 90%;
}
.form{
    /* border: solid 1px black; */
    position: relative;
     box-shadow: none !important;
    width: 100%;
    display: flex;
    flex-direction: column;
}
#updatecarbutton{
    border: solid 1px rgba(91, 91, 91, 1);
    width: 130px;
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 18px;
    color: rgba(91, 91, 91, 1);
    font-weight: bold;
    position: relative;
    bottom: 10px;
}
#carmodelandbutton{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.headercontent{
    margin: 10px;
}
h1, h2, h3, h4, h5, p{
    font-family: 'Poppins', sans-serif;
    color:rgba(28, 137, 131, 1);
    font-weight: bold;
}
.header{
   background-color: white;
    width: 100%;
    margin-top: 0;
    box-shadow: 0 0px 20px 0 rgba(35, 98, 98, .16);
    position: relative;
    height: 100px ;
    padding: 1px 0px 0em 0px;
    margin-bottom: 1em;
}
.container{
    height: 100%;
    overflow-x: visible;
}


@media only screen
and (min-device-width: 414px)
and (max-device-width: 736px)
and (-webkit-min-device-pixel-ratio: 3)
and (orientation: portrait){
        .form{
            top: 7em;
        }
    }
    

@media screen and (min-height: 667px) and (max-height: 677px){
        .header{
           height: 100px;
        }
       
    }
@media screen and (max-height: 731px){
        .container{
               height: 100% ;
               padding-bottom: 5em;
        }
        .header{
            height: 100px;
        }
    }
    @media screen and (max-height: 640px){
        .container{
            /* border: solid 1px black; */
            height: 100%;
        }
        .header{
           height: 100px;
        }
    }
    .container {
        /* border: solid 1px black; */
    }
    .trip-type-selection {
        margin-top: 1.4rem;
    }
    span.error {
        display: block;
        font-size: 12px;
        margin-top: -5px;
        font-weight: bold;
        color: red;
        margin-bottom: .4em;
    }
    span.error.textarea {
        margin-top: .8em;
    }
    @media only screen and (min-width: 768px) {
        .container {
            padding-top: 1.5em;
        }
        .trip-type-selection {
            margin-top: 0;
        }
        span.error {
            font-weight: 300;
        }
    }
    .tooltip-bottom {
        color: #D72521;
    }
    .row-showReturnTrip {
        margin-bottom: 1.5rem;
    }

.trip_seats-available {
    margin: 10px;
    margin-left: 1em;
}

label.label-for-group {
    margin: 1rem 0;
    margin-left: 1em;
}
textarea#trp_comment {
    width: 93%;
    height: 7em;
    margin-left: 1em;
}

label.label-for-group p {
    float: left;
    margin: 0.2rem 0;

}
label.label-for-group h6 {
    float: left;
    color: rgba(91, 91, 91, .3);
    margin-left: 4px;
}

fieldset.trip-privacity {
    display: none;
}

button.trip-create.btn.btn-primary.btn-lg.btn-shadowed {
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    border: none;
    -ms-flex-item-align: center;
    align-self: center;
    width: 100%;
    background-color: rgba(230, 90, 91, 1);
    border-radius: 10px;
    position: relative;
    top: 2px;
    height: 47px;
    box-shadow: 0px 0px 8px rgba(235, 85, 87, .8);
    /* color: white; */
}

.trip_allow-foreign, .trip_terms{
    display: none;
}

h6, .h6 {
    font-size: 9px;
}
.submit {
    position: relative;
}

.header-title{
    color:black;
    font-size: 20px
}
</style>

