<template>
    <div :class="[showTicket? 'container': 'containerFixed']">
        <template v-if="trip">
            <div class="trip-detail-component">
                <transition>
                <div v-if="expandMap" style="position:relative; top: 10px;">
                    <ProfileCard :user='user' :trip='trip'></ProfileCard>
                </div>
                <div v-if="collapseMap" style="position:relative; top: 10px;">
                    <ProfileCard :user='user' :trip='trip'></ProfileCard>
                </div>
                </transition>
                <div class="mapcontainer" :class="[expandMap? 'mapcontainer expandMap': '']   [collapseMap? ' collapseMap': ''] ">
                    <transition>
                        <div class="ticketcontainer" v-if="showTicket">
                            <ticket :user='user' :trip='trip'></ticket>
                        </div>
                    </transition>
                    <l-map  :draggable="false" :zoom="zoom" :options="{ zoomControl: false}" :center="center" style="width: 100%; z-index:0;" ref="map">
                        <l-tile-layer :url="url" ></l-tile-layer>
                    </l-map>
                </div>
                <div class="mapbuttonCotainer">
                    <transition>
                        <div class="gotomaptripdetailsbutton" v-on:click="activateAnimation()" v-if="showTicket">
                            <svg class="fas fa-arrow-down" style="font-size:23px;color: #E65A5B;"></svg>
                         </div>
                          <div class="hidemaptripdetailsbutton" v-on:click="deactivateAnimation()" v-if="!showTicket">
                            <svg class="fas fa-arrow-up" ></svg>
                         </div>
                    </transition>

                </div>
                <div class="contentcontainer">
                    <div id="notes">
                        <p id="labelText">Notes</p>
                        <p id="blackText">“{{trip.description}}”</p>
                </div>
                    <div id="passengers">
                           <div class="row passengers" v-if="!trip.is_passenger">
                                    <div class="col-xs-24" v-if="owner">
                                        <h4 class="title-margined">
                                            <p id="labelText">Passengers</p>
                                        </h4>
                                        <div v-for="p in trip.passenger" v-if="trip.passenger.length" class="list-item-names">
                                            <span @click="toUserProfile(p)" class="trip_driver_img circle-box passenger trip_passenger_image" v-imgSrc:profile="p.image"></span>
                                            <a href="#" @click="toUserProfile(p)" class="trip_passenger_name">
                                                {{ p.name }}
                                            </a>
                                                <a href="#" @click="toUserMessages(p)" aria-label="Ir a mensajes" class="trip_passenger-chat">
                                                 <i class="fa fa-comments" aria-hidden="true"></i>
                                            </a>
                                            <button @click="removePassenger(p)" class="trip_passenger-remove pull-right" aria-label="Bajar pasajero del viaje">
                                                <i class="fa fa-times" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                        <div v-if="trip.passenger.length === 0">
                                            There are no Passengers on this trip.
                                        </div>
                                    </div>
                                    <div v-else style="height: 2em;"></div>
                                </div>
                    </div>
                    <div class="estimatescontainer">
                        <div id="estimatedistance">
                            <p id="labelText">Estimated Distance</p>
                            <p id="blackText">{{ distanceString }} km</p>
                        </div>
                        <div id="estimatetraveltime">
                            <p id="labelText">Estimated travel time</p>
                            <p id="blackText">{{ trip.estimated_time }}</p>
                        </div>
                           <div id="carbon-dioxide">
                            <p id="labelText">Carbon footprint(<abbr title="aproximada">aprox</abbr>)</p>
                            <p id="blackText">{{ (trip.distance / 1000 * 1.5).toFixed(2) }} <abbr title="kilograms carbon dioxide equivalent">kg CO<sub>2eq</sub></abbr></p>
                        </div>
                        <div id="trip-pricing">
                            <p id="labelText">Trip Pricing</p>
                            <p id="blackText">{{ (((trip.distance/1000)  * 0.119 * 0.75 )/(trip.seats_available+1+trip.passenger.length)).toFixed(2) }} JOD</p>
                        </div>

                    </div>
                     <div id="edit">
                         <div class="buttons-container"  v-if="!isPasssengersView">
                                <router-link class="btn btn-primary" v-if="owner && !expired" :to="{name: 'update-trip', params: { id: trip.id}}">
                                    Edit
                                </router-link>
                                </div>
                                  <a class="btn btn-primary" v-if="owner && !expired" @click="deleteTrip" :disabled="sending">
                                    Cancel trip
                                </a>
                                <template v-if="!owner && !expired">
                                    <button class="btn btn-primary" @click="toMessages" v-if="!owner">
                                        Send Message
                                    </button>
                                </template>
                                 <template v-if="!owner && !trip.is_passenger && !expired">
                                    <template v-if="!isPassenger">
                                        <button class="btn btn-primary" @click="onMakeRequest" v-if="canRequest && trip.seats_available > 0" :disabled="sending">
                                            Request a seat
                                        </button>
                                        <button class="btn cancel" v-if="!canRequest" @click="cancelRequest" :disabled="sending">
                                            Cancel Request
                                        </button>
                                    </template>

                                     <modal :name="'modal'" v-if="showModalRequestSeat" @close="onModalClose" :title="'Test'" :body="'Body'">
                                <h3 slot="header">
                                    <span>Attention Awesome People!</span>
                                </h3>
                                <div slot="body">
                                    <div class="text-left carpoodatos">
                                      <p>Before sending a seat request, send a message to the other person to coordinate everything related to the trip: meeting point, arrival point, bag size, contribution for fuel and tolls, etc. </p>
                                      <p> If you send a request for a seat and they accept the order, the travel commitment is generated. Enabling the possibility of qualification 24 hours after the start of the trip. They will have 14 days to qualify</p>
                                      <p>They can be qualified even if the trip is canceled, they lower you or you get off the trip.</p>
                                      <p> Do not ask for a seat if you are not sure that you are going to travel, many people are also looking for the same trip as you. If something should happen that prevents you from traveling, let the person you were traveling with know as quickly as possible. </p>
                                      <p>Any questions write to us <a href="mailto:info@lessgo.app">info@lessgo.app</a> or send us on our social networks.</p>
                                    </div>
                                    <div class="check" style="margin-bottom:10px;">
                                        <label class="check-inline">
                                            <input type="checkbox" name="acceptPassengerValor" value="0" v-model="acceptPassengerValue"><span> Do not show this message again</span>
                                        </label>
                                    </div>
                                    <div class="text-center">
                                      <button class="btn btn-primary message" @click="toMessages" v-if="!owner">Send Message</button>
                                      <button class="btn btn-primary request" @click="toMakeRequest">Request a seat</button>
                                    </div>
                                </div>
                            </modal>

                                    <template v-if="isPassenger">
                                        <button class="btn btn-primary" @click="cancelRequest" v-if="canRequest" :disabled="sending">
                                            Get off the trip
                                        </button>
                                    </template>
                                </template>
                                 <template v-if="expired">
                                    <button class="btn btn-primary" disabled> Finalized  </button>
                                </template>
                                <template v-if="trip.seats_available === 0 && !trip.is_passenger">
                                </template>

                        </div>
                </div>
            </div>

        </template>
        <template v-else>
            <div>
                Looking for the trip, wait a second.
            </div>
        </template>
    </div>
</template>



<style scoped>

svg.svg-inline--fa.fa-arrow-down.fa-w-14 {
    font-size: 23px;
    color: #E65A5B;
}

.section.third {
    margin-top: 3em;
    margin-bottom: 3em;
}

.modal-default-button.btn.btn-link {
    width: 2em;
    border: solid 1px #EB5557;
    font-size: 10px;
    width: 3vh;
    left: -5px;
    margin: 1vh;
    background-color: unset;
    color: #EB5557;
    font-weight: bold;
    display: -ms-flexbox;
    display: flex;
    text-align: center;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    border-radius: 18px !important;
    height: 70%;
    font-family: 'Poppins', sans-serif;
    position: relative;
}

.modal-body div .text-center button.btn.btn-primary {
    float: left;
}

label.check-inline input[type="checkbox"] {
    margin-right: 1em;
}

button.btn.btn-primary.message {
    float: left;
}

button.btn.btn-primary.request {
    float: right !important;
}


button.btn.cancel {
    background: red !important;
    border: solid 1px #EB5557;
    font-size: 10px;
    width: 2vh;
    left: -5px;
    margin: 1vh;
    background-color: unset;
    color: white;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 18px !important;
    font-family: 'Poppins', sans-serif;
}
.mapcontainer.mapcontainer.expandMap {
    height: 19em;
}

.leaflet-control-attribution.leaflet-control {
    display: none;
}


.containerFixed{
        overflow-y: hidden;
        overflow-x: hidden;
        /* border: solid 1px black; */
        position: relative;
        bottom: 10px;
    }
    .v-leave-active{
        animation: fadeout 0.5s;
    }
     .v-enter-active{
        animation: fadein 1s;
    }
    .expandMap{
        animation: expand 0.5s;
        animation-iteration-count: 1;
        animation-fill-mode: both;
    }
    .collapseMap{
        animation: expand 0.5s;
        animation-iteration-count: 1;
        animation-fill-mode: both;
    }


.pull-right {
    float: right;
    position: relative;
    left: 6em;
    top: -8em;
    background: white;
    color: #eb5556;
    width: 2em;
    height: 2em;
    border-radius: 50%;
}

.svg-inline--fa.fa-w-11{
        width: 8px;
}

a.trip_passenger_name {
    right: -3vh;
    position: relative;
    top: 2vh;
    font-size: 12px;
}


    .ticketcontainer{
        height: 75%;
        bottom: 100px;
        width: 100%;
        position: absolute;
        z-index: 100;
    }
      .shadow{
        width:100% !important;
    }

    .mapbuttonCotainer{
        /* border: solid 1px black; */
        height: 56px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100vw;
        right: 10px;
        position: relative;
        z-index: 5;
        bottom: -1vh;
    }
    .estimatescontainer{
        height: 100%;
    }
    .container{
        overflow-y: visible;
        overflow-x: visible;
        position: relative;
        bottom: 5px;
    }
    #passengersHolder{
        display: flex;
        flex-direction: row;
        height: 120px;
        overflow-x:scroll;
        overflow-y: hidden;
    }
    #passengers{
    }
    .contentcontainer{
        margin: 0px;
        bottom: 26px;
        padding: 0vh 3vh 11vh 3vh;
    }
    .header{
        position: relative;
    }

    .list-item-names {
    display: flex;
    float: left;
    width: 33%;
    justify-content: center;
    flex-direction: column;
    }

    #labelText{
        font-size: 16px;
        font-weight: bold;
        padding:0;
        margin-bottom: 0;
        /* border: solid 1px red; */
        /* margin:0; */

    }
    #blackText{
        color: #5B5B5B;
        margin: 0;
        padding: 0;
        font-size: 18px;
    }
    p{
        font-size: 1em;
        color: #1C8983;
        font-family: 'Poppins', sans-serif;
    }
    .gotomaptripdetailsbutton{
        height: 50px;
        width: 50px;
        border-radius: 25px;
        background-color: white;
        z-index: 100px;
        box-shadow: 0 0 8px  rgba(0,0,0,0.5);
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

        .hidemaptripdetailsbutton{
        /* border: solid 1px black; */
        height: 50px;
        width: 50px;
        border-radius: 25px;
        background-color: white;
        z-index: 100px;
        box-shadow: 0 0 8px  rgba(0,0,0,0.5);
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: -1em;
        overflow: visible;
        z-index: 999999999999999;
    }
    .trip-detail-component{
        height: 100%;
        /* border: solid black 1px; */
        width: 100%;
        float: left;
        margin-top:1em;

    }

    .btn-primary{
    width: 2em;
    border: solid 1px #EB5557;
    font-size: 10px;
    width: 3vh;
    left: -5px;
    margin: 1vh;

    background-color: unset ;
    color: #EB5557;
    font-weight: bold;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    border-radius: 18px !important;
    height: 70%;
    font-family: 'Poppins', sans-serif;
    position: relative;
    }

    #edit {
    display: flex;
    align-self: center;
    justify-content: center;
    margin-top: 2em !important;
}
    .mapcontainer{
        height: 19em;
        margin-top: 20%;
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;
        z-index: 0;
        bottom: -3em;
        justify-content: flex-end;
    }

    /* iphone 5/SE */
    @media screen and (min-height: 568px) and (max-height: 569px){
        .mapcontainer{
                height: 19em;
                margin-top: 20%;
        }
    }

    @media screen and (min-height: 736px) and (max-height: 740px){
        .mapcontainer{
            height: 19em;
            margin-top: 20%;

        }
    }
    /* iphone 6/7/8 */
    @media screen and (min-height: 667px) and (max-height: 677px){
        .mapcontainer{
            height: 19em;
            margin-top: 20%;

        }
    }

    /* pixel 2 xl */
    @media screen and (min-height: 823px){
        .mapcontainer{
            height: 19em;
            margin-top: 20%;

        }
    }
    /* galaxy s5 */
    @media screen and (min-height: 640px) and (max-height: 641px){
        .trip-detail-component{
            height: 100%;
            margin-top: 1em;
        }
        .mapcontainer{
            height: 19em;
            margin-top: 20%;

        }

    }
    @media screen and (min-height: 667px) and (max-height: 670px){
        .trip-detail-component{
            height: 100%;
            margin-top: 1em;
        }
    }


    @media screen and (min-height: 736px) and (max-height: 737px){
        .mapcontainer{
            height: 19em;
            margin-top: 20%;

        }
    }
    /* pixel phone */
    @media screen and (min-height: 731px) and (max-height: 731px){
        .mapcontainer{
            height: 19em;
            margin-top: 20%;

        }
    }

       @keyframes expand{
     0%{height: 37%;}
     50%{height: 60%;}
    100%{height: 100%;}
    }
     @keyframes fadeout{
        0%{opacity: 1;}
        100%{opacity: 0;}
    }
    @keyframes fadein{
        0%{opacity: 0;}
        100%{opacity: 1;}
    }

        @keyframes collapse{
     100%{height: 100%;}
    50%{height: 60%;}
    0%{height: 37%;}
    }
     @keyframes fadeout{
        100%{opacity: 0;}
        0%{opacity: 1;}
    }
    @keyframes fadein{
        100%{opacity: 1;}
        0%{opacity: 0;}
    }
    .row.passengers .col-xs-24 {
    padding-left: 0px !important;
}

.trip-detail-component {
       overflow-x: hidden;
    overflow-y: scroll;
}

</style>
<script>
import { mapGetters, mapActions } from 'vuex';
import router from '../../router';
import bus from '../../services/bus-event';
import svgItem from '../SvgItem';
import modal from '../Modal';
import moment from 'moment';
import dialogs from '../../services/dialogs.js';
import bubble from '../views/BubbleComponent.vue';
import ticket from '../views/ProfileTicket.vue';
import carIcon from '../../icon/CarIcon';
import ProfileCard from '../views/ProfileCard';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueHead from 'vue-head';
import { LMap, LTileLayer } from 'vue2-leaflet';
import 'leaflet-routing-machine';
Vue.use(VueHead);
Vue.use(VueRouter);

export default {
    name: 'trip',
    data () {
        return {
            showTicket: true,
            expandMap: false,
            collapseMap: true,
            // trip: null,
            title: 'Abdulkareem B.',
            userimage: 'https://d2mxuefqeaa7sj.cloudfront.net/s_ACF2B3FED5F7644A8E27E3FE8A9142BB95ECC3C792EA9166BF492FA2116B5277_1517608730821_Screen+Shot+2018-02-02+at+4.58.29+PM.png',
            lessgo_logo: process.env.ROUTE_BASE + 'static/img/lessgo_logo.png',
            sending: false,
            zoom: 4,
            center: {lat: 31.9, lng: 35.9},
            points: [
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    draggable: false

                },
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    draggable: false

                }
            ],
            currentUrl: encodeURIComponent('https://lessgo.app/app' + this.$route.fullPath),
            matchingUsers: [],
            messageToUsers: '',
            selectedMatchingUser: [],
            url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
            showModalRequestSeat: false,
            acceptPassengerValue: 0
        };
    },

    head: {
        title: function () {
            return {
                inner: 'Trip'
            };
        },
        meta: function () {
            if (this.trip) {
                return [
                    { p: 'og:description', c: this.trip.description },
                    { p: 'og:title', c: this.trip.points[0].json_address.city + ' -> ' + this.trip.points[this.trip.points.length - 1].json_address.city + ' | ' + moment(this.trip.trip_date).format('dddd DD/MM hh:mm') },
                    { p: 'og:image', c: this.lessgo_logo }
                ];
            } else {
                return [];
            }
        }
    },

    methods: {
        activateAnimation () {
            this.expandMap = true;
            this.showTicket = false;
            this.collapseMap = false;
            this.renderMap();
        },
        deactivateAnimation () {
            this.expandMap = false;
            this.showTicket = true;
            this.collapseMap = true;
            this.renderMap();
        },
        ...mapActions({
            getTrip: 'getTrip',
            lookConversation: 'conversations/createConversation',
            selectConversation: 'conversations/select',
            make: 'passenger/makeRequest',
            cancel: 'passenger/cancel',
            remove: 'trips/remove',
            searchMatchers: 'trips/searchMatchers',
            sendToAll: 'conversations/sendToAll',
            changeProperty: 'profile/changeProperty'
        }),
        profileComplete () {
            if (!this.user.image || this.user.image.length === 0 || !this.user.description || this.user.description.length === 0) {
                router.replace({ name: 'profile_update' });
            } else {
                return true;
            }
        },
        deleteTrip () {
            if (window.confirm('Are you sure you want to cancel the trip?')) {
                this.sending = true;
                this.remove(this.trip.id).then(() => {
                    this.$router.replace({name: 'trips'});
                }).catch(() => {
                    this.sending = false;
                });
            }
        },
        loadTrip () {
            this.getTrip(this.id).then(trip => {
                // this.trip = trip;
                this.points = trip.points;
                var self = this;
                setTimeout(() => { self.renderMap(); }, 500);
                if (this.owner) {
                    this.searchMatchers({ trip: this.trip }).then(users => {
                        console.log('matching', users);
                        this.matchingUsers = users;
                        if (users && users.length) {
                            this.selectedMatchingUser = users.map(u => u.id);
                            // console.log('selectedMatchingUser', users);
                        }
                    });
                }
            }).catch(error => {
                if (error) {
                    router.replace({name: 'trips'});
                    // Ver que hacer
                    // this.trip = null;
                }
            });
        },

        toMessages () {
            if (this.acceptPassengerValue) {
                let data = {
                    property: 'do_not_alert_request_seat',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }

            if (this.profileComplete()) {
                this.toUserMessages(this.trip.user);
            }
        },

        toUserMessages (user) {
            this.lookConversation(user).then(conversation => {
                // this.selectConversation(conversation.id).then(data => {
                router.push({ name: 'conversation-chat', params: { id: conversation.id } });
                // });
            });
        },

        toUserProfile (user) {
            console.log('toUserProfile replace');
            router.replace({
                name: 'profile',
                params: {
                    id: user.id,
                    userProfile: user,
                    activeTab: 1
                }
            });
        },

        onMakeRequest () {
            if (this.profileComplete()) {
                if (this.user.do_not_alert_request_seat) {
                    this.toMakeRequest();
                    // console.log('1:' + this.trip.do_not_alert_accept_passenger);
                } else {
                    this.showModalRequestSeat = true;
                    // console.log('2:' + this.trip.do_not_alert_accept_passenger);
                }
            }
        },

        toMakeRequest () {
            if (this.acceptPassengerValue) {
                let data = {
                    property: 'do_not_alert_request_seat',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }
            if (this.profileComplete()) {
                this.sending = true;
                this.showModalRequestSeat = false;
                this.make(this.trip.id).then(() => {
                    dialogs.message('Request was sent.');
                    this.sending = false;
                    this.trip.request = 'send';
                }).catch(() => {
                    this.sending = false;
                });
            }
        },

        cancelRequest () {
            if (window.confirm('Are you sure you want to get off the trip?')) {
                this.sending = true;
                this.cancel({ user: this.user, trip: this.trip }).then(() => {
                    this.sending = false;
                    dialogs.message('You have come down from the trip.');
                    if (this.trip.request !== 'send') {
                        let index = this.trip.passenger.findIndex(item => item.id === this.user.id);
                        this.trip.passenger.splice(index, 1);
                    } else {
                        this.trip.request = '';
                    }
                }).catch(() => {
                    this.sending = false;
                });
            }
        },

        removePassenger (user) {
            if (window.confirm('Are you sure you want to remove this passenger from your trip?')) {
                this.sending = true;
                this.cancel({ user: user, trip: this.trip }).then(() => {
                    this.sending = false;
                    let index = this.trip.passenger.findIndex(item => item.id === user.id);
                    this.trip.passenger.splice(index, 1);
                }).catch(() => {
                    this.sending = false;
                });
            }
        },

        onShareLinkClick (event) {
            if (window.device && window.device.platform && window.device.platform.toLowerCase() !== 'browser') {
                // Estoy en movil
                event.preventDefault();
                let href = event.target.getAttribute('href');
                if (!href) {
                    href = event.target.parentElement.getAttribute('href');
                }
                if (href) {
                    window.location.href = href;
                }
            }
        },
        onWhatsAppShareClick (event) {
            if (window.device && window.device.platform && window.device.platform.toLowerCase() !== 'browser') {
                // Estoy en movil
                event.preventDefault();
                if (window && window.plugins && window.plugins.socialsharing && window.plugins.socialsharing.shareWithOptions) {
                    let message = 'I published a trip to share in LessGo';
                    window.plugins.socialsharing.shareViaWhatsApp(message, null /* img */, decodeURIComponent(this.currentUrl), function () {
                        console.log('share ok');
                    }, function (errormsg) {
                        console.log('share not ok:', errormsg);
                    });
                }
            }
        },

        onBackClick () {
            router.back();
        },

        renderMap () {
            if (this.$refs.map) {
                /* eslint-disable no-undef */
                /* this.$refs.map.$mapCreated.then(() => {
                    this.directionsService = new google.maps.DirectionsService();
                    this.directionsDisplay = new google.maps.DirectionsRenderer();
                    this.directionsDisplay.setMap(this.$refs.map.$mapObject);
                    this.restoreData(this.trip);
                }); */
                let map = this.$refs.map.mapObject;
                console.log('trip', this.trip);
                let data = {
                    origin: this.trip.points[0],
                    destiny: this.trip.points[this.trip.points.length - 1]
                };
                 /* eslint-disable no-undef */
                let control = L.Routing.control({
                    waypoints: [
                        L.latLng(data.origin.lat, data.origin.lng),
                        L.latLng(data.destiny.lat, data.destiny.lng)
                    ],
                    language: 'en'
                });
                /* control.on('routeselected', function (e) {
                    console.log('routeselected', e);
                    var coord = e.route.coordinates;
                    var instr = e.route.instructions;
                    var formatter = new L.Routing.Formatter({ langague: 'en' });
                    var instrPts = {
                        type: 'FeatureCollection',
                        features: []
                    };
                    for (var i = 0; i < instr.length; ++i) {
                        var g = {
                            'type': 'Point',
                            'coordinates': [
                                coord[instr[i].index].lng,
                                coord[instr[i].index].lat
                            ]
                        };
                        var p = {
                            'instruction': formatter.formatInstruction(instr[i]),
                            '_instruction': instr[i]
                        };
                        instrPts.features.push({
                            'geometry': g,
                            'type': 'Feature',
                            'properties': p
                        });
                    }
                    console.log(instrPts);
                }); */
                control.addTo(map);
            }
        },

        restoreData (trip) {
            this.points = [];
            trip.points.forEach(p => {
                let point = {
                    name: p.address,
                    json: p.json_address,
                    location: {
                        lat: p.lat,
                        lng: p.lng
                    },
                    place: null
                };
                this.points.push(point);
            });
            this.date = trip.trip_date.split(' ')[0];
            this.time = trip.trip_date.split(' ')[1];
            this.trip.is_passenger = trip.is_passenger ? 1 : 0;
            this.trip.total_seats = trip.total_seats;
            this.trip.friendship_type_id = trip.friendship_type_id;
            this.trip.distance = trip.distance;
            this.trip.description = trip.description;

            this.calcRoute();
        },

        calcRoute () {
            for (let i = 0; i < this.points.length; i++) {
                if (!this.points[i].name) {
                    return;
                }
            }

            /* this.directionsService.route({
                origin: this.points[0].name,
                destination: this.points[this.points.length - 1].name,
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
                    this.co2 = parseFloat(totalDistance * 0.15).toFixed(2);
                } else {
                    console.log('Directions request failed due to ' + status);
                }
            }); */
        },
        onSendToAll () {
            let users = this.matchingUsers.filter(u => this.selectedMatchingUser.indexOf(u.id) >= 0);
            console.log(users, this.messageToUsers);
            if (this.messageToUsers && users && users.length) {
                this.sendToAll({
                    message: this.messageToUsers,
                    users: users
                }).then(() => {
                    this.messageToUsers = '';
                    dialogs.message('The message was sent.');
                });
            }
        },
        onModalClose () {
            if (this.acceptPassengerValue) {
                let data = {
                    property: 'do_not_alert_request_seat',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }
            this.showModalRequestSeat = false;
        },
        onClearClick () {
            router.back();
        }
    },

    mounted () {
        bus.on('clear-click', this.onClearClick);
        // this.activateAnimation();
        // this.deactivateAnimation();
        this.loadTrip();
    },

    watch: {
        'id': function (value) {
            this.loadTrip();
        }
    },

    computed: {
        ...mapGetters({
            user: 'auth/user',
            trip: 'trips/currentTrip',
            isMobile: 'device/isMobile'
        }),
        expired () {
            return moment(this.trip.trip_date).format() < moment().format();
        },
        owner () {
            return this.trip && this.user && this.user.id === this.trip.user.id;
        },
        canRequest () {
            return !this.owner && !this.trip.request;
        },
        isPassenger () {
            return this.trip.passenger.findIndex(item => item.id === this.user.id) >= 0;
        },
        getUserImage () {
            return this.user.id === this.trip.user.id ? this.user.image : this.trip.user.image;
        },
        getUserProfile () {
            return this.trip.user.id === this.user.id ? 'me' : this.trip.user.id;
        },
        descriptionLength () {
            return this.trip.description.length > 215 ? 'long-description' : '';
        },
        distanceString () {
            return Math.floor(this.trip.distance / 1000);
        },
        isPasssengersView () {
            if (this.location) {
                return this.location === 'passenger';
            }
            return false;
        }
    },

    components: {
        svgItem,
        LMap,
        LTileLayer,
        modal,
        bubble,
        ticket,
        carIcon,
        ProfileCard
    },

    beforeDestroy () {
        bus.off('clear-click', this.onClearClick);
    },

    props: [
        'id',
        'location'
    ]

};
</script>


