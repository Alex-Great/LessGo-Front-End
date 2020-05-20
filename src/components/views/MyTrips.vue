<template>
  <div class="my-trips container">
        <div class="col-xs-24 my-trips-card">
            <Loading :data="pendingRequest" :hideOnEmpty="true">
                <div class="request-list">
                     <h2 slot="title"> Pending Trips </strong> </h2>
                    <PendingRequest v-for="r in pendingRequest" :user="r.user" :trip="findTrip(r.trip_id)"></PendingRequest>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">There are no Requests to answer</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                    Loading...
                </p>
            </Loading>
        </div>


        <div class="col-xs-24 my-trips-card">
            <modal :name="'modal'" v-if="showModalPendingRates" @close="toPendingRates" :title="'Test'" :body="'Body'" :hide-footer="true">
                <h3 slot="header">
                    <span>Hello!</span>
                </h3>
                <div slot="body">
                    <div class="text-left Notice">
                      <p>
                        <b>It's very  important to rate your trips </b>. The rating allow us to know each other better and to be able to decide when sharing a trip, they are very important for the entire LessGo community.
                      </p>
                      <p> Any questions write to us <a href="mailto:info@lessgo.app">info@lessgo.app</a> or contact us on our social networks.</p>
                    </div>
                    <div class="check" style="margin-bottom:10px;">
                        <label class="check-inline">
                            <input type="checkbox" name="pendingRatesValor" value="0" v-model="pendingRatesValue"><span> Don't show this message again</span>
                        </label>
                    </div>
                    <div class="text-center">
                      <button class="btn btn-accept-request" @click="toPendingRates"> I get it! </button>
                    </div>
                </div>
            </modal>


            <Loading :data="pendingRates" :hideOnEmpty="true">
                <div class="request-list my-trips-card">
                     <h2 slot="title"> Ratings </strong></h2>
                    <RatePending v-for="rate in pendingRates" :rate="rate" @rated="onUserRated" />
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No pending Ratings</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                    Loading ratings ...
                </p>
            </Loading>
        </div>

        <div class="col-xs-24 my-trips-card">
            <Loading :data="trips">
                <div class="trips-list">
                                <h2>My <strong>next</strong> trips</h2>

                    <ProfileTicket v-for="trip in trips" :trip="trip" :user="user" :enableChangeSeats="true"></ProfileTicket>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">You Don't have any trips created</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                    Loading trips ...
                </p>
            </Loading>
        </div>

        <div class="col-xs-24 my-trips-card">
            <Loading :data="passengerTrips" :hideOnEmpty="true">
                <h2 slot="title" > Upcoming Trips </strong> </h2>
                <div class="trips-list">
                    <!-- <Trip v-for="trip in passengerTrips" :trip="trip" :user="user"></Trip> -->
                    <ProfileTicket v-for="trip in passengerTrips" :trip="trip" :user="user"></ProfileTicket>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No estas subido a ningún viaje.</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                    Loading trips ...
                </p>
            </Loading>
        </div>
        <div class="col-xs-24 my-trips-card" v-if="subscriptions && subscriptions.length" id="suscriptions">
            <Loading :data="subscriptions" :hideOnEmpty="true">
                <h2 slot="title" >Travel subscriptions</h2>
                <div class="trips-list row">
                    <div class="col-xs-24 col-md-12" v-for="subs in subscriptions" :key="subs.id">
                        <subscriptionItem :subscription="subs" :user="user"></subscriptionItem>
                    </div>

                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">You don't have any subscriptions.</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                    Loading subscriptions ...
                </p>
            </Loading>
        </div>


        <div class="col-xs-24 my-trips-card" v-if="oldTrips">
            <h2>My past trips</h2>
            <Loading :data="oldTrips">
                <div class="trips-list">
                    <!-- <Trip v-for="trip in oldTrips" :trip="trip" :user="user"></Trip> -->
                    <ProfileTicket v-for="trip in oldTrips" :trip="trip" :user="user"></ProfileTicket>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">Do not create any trip</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                    Loading trips ...
                </p>
            </Loading>
        </div>

        <div class="col-xs-24 my-trips-card" v-if="oldPassengerTrips">
            <Loading :data="oldPassengerTrips" :hideOnEmpty="true">
                <h2 slot="title" > Trips to those that I <strong>Finished</strong> </h2>
                <div class="trips-list">
                    <!-- <Trip v-for="trip in oldPassengerTrips" :trip="trip" :user="user"></Trip> -->
                    <ProfileTicket v-for="trip in oldPassengerTrips" :trip="trip" :user="user"></ProfileTicket>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">You have not been on any trip.</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                    Loading trips ...
                </p>
            </Loading>
        </div>

    </div>
</template>

<script>
import subscriptionItem from '../sections/SubscriptionItem.vue';
import Trip from '../sections/Trip.vue';
import Loading from '../Loading.vue';
import PendingRequest from '../PendingRequest';
import RatePending from '../RatePending';
import { mapGetters, mapActions } from 'vuex';

import Tab from '../elements/Tab';
import Tabset from '../elements/Tabset';
import modal from '../Modal';
import dialogs from '../../services/dialogs.js';
import ProfileTicket from '../views/ProfileTicket';

export default {
    name: 'my-trips',
    data () {
        return {
            showModalRequestDonation: false,
            donateValue: 0,
            modalTripId: 0,
            showModalPendingRates: false,
            pendingRatesValue: 0,
            alreadyAlerted: false
        };
    },
    mounted () {
        this.tripAsDriver();
        this.tripAsPassenger();
        this.pendingRate();
        this.getPendingRequest().then(() => {
            this.oldTripsAsDriver();
            this.oldTripsAsPassenger();
        });
        this.findSubscriptions();
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
            findSubscriptions: 'subscriptions/index',
            registerDonation: 'profile/registerDonation',
            changeProperty: 'profile/changeProperty'
        }),
        findTrip (id) {
            if (this.trips) {
                return this.trips.find(item => item.id === id);
            }
        },
        updateScroll () {
            if (this.$route.query.loc) {
                // window.scrollTo(0, document.body.scrollHeight);
                // window.location.hash = this.$route.query.loc;
                let domNode = document.getElementById(this.$route.query.loc);
                window.scrollTo(0, domNode.offsetTop - 150);
            }
        },
        onDonateOnceTime () {
            if (this.donateValue > 0) {
                var url = 'http://mpago.la/jgap'; // 50
                switch (this.donateValue) {
                case '100':
                    url = 'http://mpago.la/CaSZ';
                    break;
                case '200':
                    url = 'http://mpago.la/xntw';
                    break;
                case '500':
                    url = 'http://mpago.la/QEiN';
                    break;
                default:
                    break;
                }
                window.open(url, '_blank');
                this.showModalRequestDonation = false;
                let data = {
                    has_donated: 1,
                    has_denied: 0,
                    ammount: parseFloat(this.donateValue),
                    trip_id: this.modalTripId
                };
                this.registerDonation(data);
            } else {
                dialogs.message('You have to select a donation value.', { duration: 10, estado: 'error' });
            }
        },
        onDonateMonthly () {
            if (this.donateValue > 0) {
                var url = 'http://mpago.la/1w3aci'; // 50
                switch (this.donateValue) {
                case '100':
                    url = 'http://mpago.la/BfZ';
                    break;
                case '200':
                    url = 'http://mpago.la/P02H';
                    break;
                case '500':
                    url = 'http://mpago.la/k8Xp';
                    break;
                default:
                    break;
                }
                window.open(url, '_blank');
                this.showModalRequestDonation = false;
                let data = {
                    has_donated: 1,
                    has_denied: 0,
                    ammount: parseFloat(this.donateValue),
                    trip_id: this.modalTripId
                };
                this.registerDonation(data);
            } else {
                dialogs.message('You have to select a donation value.', { duration: 10, estado: 'error' });
            }
        },
        toPendingRates () {
            if (this.pendingRatesValue) {
                let data = {
                    property: 'do_not_alert_pending_rates',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }
            this.showModalPendingRates = false;
        },
        onMessageModalClose () {
            this.showModalRequestDonation = false;
            let data = {
                has_donated: 0,
                has_denied: 1,
                ammount: 0,
                trip_id: this.modalTripId
            };
            this.registerDonation(data);
        },
        onModalClose () {
            this.showModalRequestDonation = false;
            let data = {
                has_donated: 0,
                has_denied: 1,
                ammount: 0,
                trip_id: this.modalTripId
            };
            this.registerDonation(data);
        },
        hasToShowModal (tripId) {
            let tripRateds = parseFloat(this.appConfig.donation.trips_rated);
            if (this.user && !this.user.monthly_donate) { // only if the user is not a monthly donor
                if (!this.user.donations) {
                    // I have no attempt at donations this month should appear
                    this.showModalRequestDonation = true;
                    this.modalTripId = tripId;
                } else {
                    // must appear to me once per trip
                    let donation = this.user.donations.find(d => d.trip_id === tripId);
                    if (!donation) {
                        // for the amount of tripRated monthly trips
                        let donations = this.user.donations.filter(d => d.trip_id !== null);
                        if (donations && donations.length < tripRateds) {
                            this.showModalRequestDonation = true;
                            this.modalTripId = tripId;
                        } else {
                            console.log('hasToShowModal: already interacted with at least two trips');
                        }
                    } else {
                        console.log('hasToShowModal: I already interacted with this trip ');
                    }
                }
            }
        },
        onUserRated (data) {
            console.log('onUserRated', data);
            if (data.rating) {
                // vote positivo
                this.hasToShowModal(data.trip_id);
            }
        }
    },
    watch: {
        trips: function () {
            this.updateScroll();
        },
        passengerTrips: function () {
            this.updateScroll();
        },
        pendingRates: function (newValue, oldValue) {
            this.updateScroll();
            if (!this.user.do_not_alert_pending_rates) {
                console.log('pendingRates', newValue, oldValue);
                if (newValue && newValue.length > 0 && !this.alreadyAlerted) {
                    this.alreadyAlerted = true;
                    this.showModalPendingRates = true;
                }
            }
        },
        pendingRequest: function () {
            this.updateScroll();
        },
        user: function () {
            this.updateScroll();
        },
        oldTrips: function () {
            this.updateScroll();
        },
        oldPassengerTrips: function () {
            this.updateScroll();
        }/* ,
        subscriptions: function () {
            this.updateScroll();
        } */
    },
    components: {
        Trip,
        Loading,
        PendingRequest,
        RatePending,
        Tab,
        Tabset,
        subscriptionItem,
        modal,
        ProfileTicket
    }
};
</script>

<style scoped>

    .my-trips.container {
        margin-bottom: 8em;
        margin-top: 0em;
    }
    h2 {
        font-weight: 300;
    }
    .donation-text {
        margin-bottom: 1.5rem;
    }
    .donation-text p {
        margin-top: -1rem;
        font-size: 1.1rem;
        margin-bottom: .5rem;
    }
</style>
