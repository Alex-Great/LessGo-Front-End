<template>
    <div class="driver-detail">
        <div :style="filterFlag?'filter: blur(5px)': ''">
            <div class="driver-detail-area">
                <closeIcon :size="10" :classes="'close-message'" title="searchResult" :data="data" :closeTitle="closeTitle" />
            </div>

            <!-- driver ticket -->
            <div class="driver-ticket" style="top: 20px !important;">
                <profileTicketIcon @join="joinRide" :data="driverDetail" :allData="data" :searchTitle="closeTitle" :joinFlag="true" />
            </div>

            <!-- map -->
            <div style="margin-top: 40px">
                <gmap-map
                    :center="center"
                    :zoom="zoomValue"
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
                        {{ this.driverDetail.description }}
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
                    <i>{{ this.driverDetail.distance }}&nbsp;km</i>
                    <h3>ESTIMATE TRAVEL TIME</h3>
                    <i>
                        {{ this.duration }}
                    </i>
                    <h3>APPROX. CARBON FOOTPRINT</h3>
                    <i>{{ this.co2 }}&nbsp;kg&nbsp;CO<i style="font-size: 10px; display: contents;">2eq</i></i>
                </div>
            </div>
                
            <!-- button area -->
            <div v-if="!zoomFlag" class="button-area">
                <button v-if="!messageBtnFlag" class="offer-ride" @click="joinRide">
                    <carIcon :size="17" :color="'white'" />
                    <span>Join this ride</span>
                </button>
                <button v-if="!messageBtnFlag" class="share-btn" @click="shareRide">
                    <shareIcon :size="15" :color="'#000000'" />
                    <span>
                        Share
                    </span>
                </button>
                <button @click="sendMessage" class="offer-ride" style="margin-right: 30vw !important;" v-if="messageBtnFlag">
                    Send Message
                </button>
            </div>
        </div>

        <!-- joinRideArea -->
        <joinRideArea @reverse="reverseAction" :show="joinRideFlag" :data="driverDetail" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

// import components for this
import closeIcon from '../../icon/CloseIcon';
import profileTicketIcon from '../../icon/ProfileTicketIcon';
import arrowDownIcon from '../../icon/ArrowDownIcon';
import greySeatIcon from '../../icon/GreySeatIcon';
import shareIcon from '../../icon/ShareIcon';
import carIcon from '../../icon/CarIcon';
import joinRideArea from '../sections/JoinRideArea';
import detailAmenities from '../sections/DetailAmenities';
import detailPreferences from '../sections/DetailPreferences';
import amenties from '../sections/Amenties';

export default {
    name: 'driverDetail',
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
        },
        closeTitle: {
            type: String,
            required: false,
            default: ''
        }
    },
    data () {
        return {
            center: { lat: 31.953940000000003, lng: 35.910630000000005 },
            driverDetail: null,
            joinRideFlag: false,
            passengers: null,
            amenities: null,
            preferences: null,
            zoomFlag: false,
            filterFlag: false,
            path: [],
            from_town_latlng: null,
            to_town_latlng: null,
            zoomValue: 12,
            co2: '',
            duration: '',
            availableSeats: [],
            messageBtnFlag: false
        }
    },
    mounted () {
        console.log('newdata', this.data);
        console.log('mounted', this.selectedTrip);
        this.driverDetail = this.selectedTrip;
        this.passengers = this.selectedTrip.passenger;

        // set amenities and preferences
        let amenData = {};
        amenData['wifi'] = this.selectedTrip.wifi;
        amenData['snacks'] = this.selectedTrip.snacks;
        amenData['charger'] = this.selectedTrip.charger;
        amenData['xcomfort'] = this.selectedTrip.xcomfort;
        amenData['aux'] = this.selectedTrip.aux;
        amenData['sanitizer'] = this.selectedTrip.sanitizer;

        this.amenities = amenData;

        let preData = {};
        preData['is_smoker'] = this.selectedTrip.is_smoker;
        preData['pets'] = this.selectedTrip.pets;
        preData['food'] = this.selectedTrip.food;
        preData['speaking'] = this.selectedTrip.speaking;
        preData['luggage'] = this.selectedTrip.luggage;
        preData['protection'] = this.selectedTrip.protection;

        this.preferences = preData;

        // Lat and Lng for draw route
        let fromLatLng = {
            lat: this.selectedTrip.points[0].lat,
            lng: this.selectedTrip.points[0].lng
        };

        let toLatLng = {
            lat: this.selectedTrip.points[1].lat,
            lng: this.selectedTrip.points[1].lng
        };

        // draw route
        this.drawRoute(fromLatLng, toLatLng);

        // set available seats
        for (let i = 0; i < this.selectedTrip.seats_available; i++) {
            this.availableSeats.push(i);
        }

        // check request this from otheruser
        if (this.status === 'otherUser') {
            this.messageBtnFlag = true;
        }
    },
    computed: {
        ...mapGetters({
            selectedTrip: 'trips/selectedTrip',
            currentUser: 'auth/user'
        })
    },
    methods: {
        ...mapActions({
            lookConversation: 'conversations/createConversation'
        }),
        reverseAction: function (flag) {
            this.joinRideFlag = false;
            this.filterFlag = false;
        },
        sendMessage: function () {
            let user = this.selectedTrip.user;

            this.lookConversation(user).then(conversation => {
                this.$router.push({ name: 'conversation-chat', params: { id: conversation.id } });
            });
        },
        joinRide: function () {
            this.joinRideFlag = true;
            this.filterFlag = true;
        },
        shareRide: function () {

        },
        zoomMap: function () {
            this.zoomFlag = !this.zoomFlag;
            if (this.zoomFlag) {
                this.zoomValue = 14;
            } else {
                this.zoomValue = 12;
            }
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
                console.log('result', result);
                if (status === window.google.maps.DirectionsStatus.OK) {
                    for (let i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                        let points = {
                            lat: result.routes[0].overview_path[i].lat(),
                            lng: result.routes[0].overview_path[i].lng()
                        };
                        betpoints.push(points);
                    }
                    // claculate time
                    let duration = result.routes[0].legs[0].duration.value;
                    let h = Math.floor(duration / 3600);
                    let m = ((duration % 3600) / 60).toFixed();
                    
                    VueComp.duration = result.routes[0].legs[0].duration.text;
                    let distance = (result.routes[0].legs[0].distance.value / 1000).toFixed(2);
                    VueComp.co2 = parseFloat(distance * 0.15).toFixed(2);
                    VueComp.path = betpoints;

                    this.driverDetail['co2'] = VueComp.co2;
                }
            });
        }
    },
    components: {
        closeIcon,
        profileTicketIcon,
        arrowDownIcon,
        greySeatIcon,
        shareIcon,
        carIcon,
        joinRideArea,
        detailAmenities,
        detailPreferences
    }
}
</script>