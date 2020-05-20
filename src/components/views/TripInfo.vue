<template>
    <div class="driver-detail">
        <div>
            <div class="driver-detail-area">
                <closeIcon :size="10" :classes="'close-message'" title="yourTrips" />
            </div>

            <!-- driver ticket -->
            <div class="driver-ticket">
                <TripTicket :data="tripDetail" />
            </div>

            <!-- map -->
            <div style="margin-top: 40px">
                <gmap-map
                    :center="center"
                    :zoom="12"
                    :class="!zoomFlag?'driver-map': 'zoom-driver-map'"
                >
                    <GmapMarker :position="from_town_latlng" label="Origin" />
                    <GmapMarker :position="to_town_latlng" label="Destination" />
                    <gmap-polyline v-bind:path.sync="path" v-bind:options="{ strokeColor:'#f7645e'}">
                    </gmap-polyline>
                </gmap-map>
            </div>
            
            <!-- details area -->
            <div class="details">
                <!-- map down icon -->
                <div @click="zoomMap" :class="!zoomFlag?'arrow-down-icon': 'arrow-up-icon'">
                    <arrowDownIcon :size="15" :color="'#ec5f61'" :class="'down-icon'" />
                </div>

                <div v-if="!zoomFlag" class="details-body">
                    <h3>NOTES</h3>
                    <span>
                        {{ this.data.trip.description }}
                    </span>
                    
                    <!-- preferences -->
                    <h3>PREFERENCES</h3>
                    <detailPreferences :data="preferences" />
                    
                    <!-- amenties -->
                    <h3>AMENTIES</h3>
                    <detailAmenities :data="amenities" />

                    <!-- passengers -->
                    <h3>PASSENGERS</h3>
                    <div class="details-body-common">
                        <div v-for="passenger in passengers" class="details-body-common-area">
                            <div v-imgSrc:profile="passenger.image" :class="'img-circle'"></div>
                            <p>{{ passenger.name }}</p>
                        </div>
                        <div v-for="seat in availableSeats" class="details-body-common-area">
                            <div :class="'img-circle'">
                                <greySeatIcon :size="25" :class="'free-seat'" />
                            </div>
                            <p style="margin-top: 10px;">available</p>
                        </div>
                    </div>

                    <!-- other details -->
                    <h3>ESTIMATE DISTANCE</h3>
                    <i>{{ this.tripDetail.distance }}&nbsp;km</i>
                    <h3>ESTIMATE TRAVEL TIME</h3>
                    <i>
                        {{ this.estimated_time }}
                    </i>
                    <h3>APPROX. CARBON FOOTPRINT</h3>
                    <i>{{ this.CO2 }}&nbsp;kg&nbsp;CO<i style="font-size: 10px; display: contents;">2eq</i></i>
                </div>
            </div>
                
            <!-- button area -->
            <div v-if="!zoomFlag" class="button-area trip-info-btns">
                <button v-if="keyWord === 'driver'" @click="editTrip">
                    Edit
                </button>
                <button v-if="keyWord === 'driver'" @click="deleteTrip" :disabled="sending">
                    Cancel Trip
                </button>
                <button v-if="keyWord === 'passenger'" @click="tripOff">
                    Trip Off
                </button>
                <button v-if="keyWord === 'passenger'" @click="save">
                    Save
                </button>
                <button style="background: #9CD076" v-if="keyWord === 'history'" @click="back">
                    Back
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

// import components for this
import closeIcon from '../../icon/CloseIcon';
import TripTicket from '../sections/TripTicket';
import arrowDownIcon from '../../icon/ArrowDownIcon';
import greySeatIcon from '../../icon/GreySeatIcon';
import detailAmenities from '../sections/DetailAmenities';
import detailPreferences from '../sections/DetailPreferences';
import dialogs from '../../services/dialogs.js';

export default {
    name: 'tripInfo',
    props: {
        data: {
            type: Object,
            required: false,
            default: null
        }
    },
    data () {
        return {
            center: { lat: 31.953940000000003, lng: 35.910630000000005 },
            tripDetail: null,
            passengers: null,
            amenities: null,
            preferences: null,
            zoomFlag: false,
            path: [],
            from_town_latlng: null,
            to_town_latlng: null,
            estimated_time: '',
            CO2: '',
            sending: false,
            availableSeats: [],
            keyWord: this.data.keyWord
        }
    },
    computed: {
        ...mapGetters({
            selectedTrip: 'trips/selectedTrip'
        })
    },
    mounted () {
        console.log('mounted', this.data);
        this.tripDetail = this.data.trip;

        // test data from json
        this.passengers = this.data.trip.passenger;
        
        // set amenities and preferences
        let amenData = {};
        amenData['wifi'] = this.data.trip.wifi;
        amenData['snacks'] = this.data.trip.snacks;
        amenData['charger'] = this.data.trip.charger;
        amenData['xcomfort'] = this.data.trip.xcomfort;
        amenData['aux'] = this.data.trip.aux;
        amenData['sanitizer'] = this.data.trip.sanitizer;

        this.amenities = amenData;

        let preData = {};
        preData['is_smoker'] = this.data.trip.is_smoker;
        preData['pets'] = this.data.trip.pets;
        preData['food'] = this.data.trip.food;
        preData['speaking'] = this.data.trip.speaking;
        preData['luggage'] = this.data.trip.luggage;
        preData['protection'] = this.data.trip.protection;

        this.preferences = preData;

        // draw route
        let fromLatlng = {
            'lat': this.data.trip.points[0].lat,
            'lng': this.data.trip.points[0].lng
        };

        let toLatlng = {
            'lat': this.data.trip.points[1].lat,
            'lng': this.data.trip.points[1].lng
        };
        this.drawRoute(fromLatlng, toLatlng);

        // set available seats
        for (let i = 0; i < this.data.trip.seats_available; i++) {
            this.availableSeats.push(i);
        }

        // // set time format
        // let time = this.data.trip.estimated_time.split(':');
        // this.estimated_time = parseInt(time[0]) + 'h' + parseInt(time[1]) + 'm';
    },
    methods: {
        ...mapActions({
            remove: 'trips/remove',
            cancel: 'passenger/cancel'
        }),
        tripOff: function () {
            if (window.confirm('Are you sure you want to get off the trip?')) {
                this.cancel({ user: this.data.user, trip: this.data.trip }).then(() => {
                    dialogs.message('You have come down from the trip.');
                    if (this.data.trip.request !== 'send') {
                        let index = this.data.trip.passenger.findIndex(item => item.id === this.data.user.id);
                        this.data.trip.passenger.splice(index, 1);
                    } else {
                        this.data.trip.request = '';
                    }
                }).catch(() => {
                    // this.sending = false;
                });
            }
        },
        save: function () {

        },
        back: function () {
            this.$router.push({name: 'your-trips'});
        },
        editTrip: function () {
            // this.$router.push({name: ''})
        },
        deleteTrip: function () {
            if (window.confirm('Are you sure you want to cancel the trip?')) {
                this.sending = true;
                this.remove(this.tripDetail.id).then(() => {
                    this.$router.replace({name: 'your-trips'});
                }).catch(() => {
                    this.sending = false;
                });
            }
        },
        zoomMap: function () {
            this.zoomFlag = !this.zoomFlag;
        },
        drawRoute: function (from, to) {
            this.center = from;
            this.from_town_latlng = from;
            this.to_town_latlng = to;
            // select this VueComponent
            let VueComp = this;
            let service = new window.google.maps.DirectionsService();
            let betpoints = [];
            service.route({
                origin: from,
                destination: to,
                travelMode: window.google.maps.TravelMode.DRIVING
            }, function (result, status) {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    console.log('result', result);
                    for (let i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                        let points = {
                            lat: result.routes[0].overview_path[i].lat(),
                            lng: result.routes[0].overview_path[i].lng()
                        };
                        betpoints.push(points);
                    }
                    VueComp.path = betpoints;
                    VueComp.CO2 = (result.routes[0].legs[0].distance.value / 1000 * 0.15).toFixed(2);

                    // claculate time
                    let duration = result.routes[0].legs[0].duration.value;
                    let h = Math.floor(duration / 3600);
                    let m = ((duration % 3600) / 60).toFixed();

                    if (h.toString().length < 2) {
                        if (m.toString().length < 2) {
                            if (h === 0) {
                                VueComp.estimated_time = '0' + m + 'm';
                            } else {
                                VueComp.estimated_time = '0' + h + 'h ' + '0' + m + 'm';
                            }
                        } else {
                            if (h === 0) {
                                VueComp.estimated_time = m + 'm';
                            } else {
                                VueComp.estimated_time = '0' + h + 'h ' + m + 'm';
                            }
                        }
                    } else {
                        if (m.toString().length < 2) {
                            if (m === 0) {
                                VueComp.estimated_time = h + 'h';
                            } else {
                                VueComp.estimated_time = h + 'h ' + '0' + m + 'm';
                            }
                        } else {
                            VueComp.estimated_time = h + 'h ' + m + 'm';
                        }
                    }
                }
            });
        }
    },
    components: {
        closeIcon,
        TripTicket,
        arrowDownIcon,
        greySeatIcon,
        detailAmenities,
        detailPreferences
    }
}
</script>