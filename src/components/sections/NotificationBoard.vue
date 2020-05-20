<template>
    <div class="notificationBoard">
        <div class="noti-flex-div">
            <div class="noti-img-div">
                <div class="img-circle" v-imgSrc:profile="user.image"></div>
                <div class="circle-icon ">
                    <v-icon icon="car" v-if="is_driver" />
                    <v-icon icon="user" v-else />
                </div>
            </div>

            <!-- notification title -->
            <div class="not-title">
                <span>{{ user.name }} requested to join your trip to {{ trip.points[1].json_address.province}} on {{ trip.trip_date | moment("ddd D/M") }} at {{ trip.trip_date | moment("HA") }}</span>
            </div>
        </div>

        <!-- modal -->
        <modal :name="'modal'" v-if="showModalRequest" :title="'Test'" :body="'Body'">
            <div slot="body">
                <div class="noti-flex-div" style="width: 100%">
                    <div class="noti-img-div">
                        <div class="img-circle" v-imgSrc:profile="user.image"></div>
                        <div class="circle-icon ">
                            <v-icon icon="car" v-if="is_driver" />
                            <v-icon icon="user" v-else />
                        </div>
                    </div>

                    <!-- notification title -->
                    <div class="not-title">
                        <span>{{ user.name }} requested to join your trip to {{ trip.points[1].json_address.province}} on {{ trip.trip_date | moment("ddd D/M") }} at {{ trip.trip_date | moment("HA") }}</span>
                    </div>
                </div>
                
                <div class="response-title">
                    <span>You are {{ acceptFlag?'accepting': 'declining' }} {{ user.name }}'s requrest</span>
                </div>
                <div class="text-center">
                    <button :disabled="acceptInProcess" @click="cancelModal"> Dismiss </button>
                    <button class="accept" v-if="acceptFlag" :disabled="acceptInProcess" @click="toAcceptRequest"> Accept </button>
                    <button class="decline" v-if="declineFlag" :disabled="rejectInProcess" @click="toDeclineRequest"> Decline </button>
                </div>
            </div>
        </modal>

        <!-- several functional buttons area -->
        <div class="noti-btns">
            <button @click="accept">accept</button></br>
            <button @click="decline">decline</button>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import dialogs from '../../services/dialogs.js';

// import components for this
import Modal from '../Modal';

export default {
    name: 'notificationBoard',
    data () {
        return {
            is_driver: false,
            showModalRequest: false,
            acceptInProcess: false,
            rejectInProcess: false,
            declineFlag: false,
            acceptFlag: false,
            acceptRequestValue: 0
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
        }
    },
    computed: {
        ...mapGetters({
            currentUser: 'auth/user'
        })
    },
    mounted () {
        console.log('mounted', this.trip);
        if (this.user.id === this.trip.user.id) {
            this.is_driver = true;
        } else {
            this.is_driver = false;
        }
    },
    methods: {
        ...mapActions({
            passengerAccept: 'passenger/accept',
            passengerReject: 'passenger/reject',
            changeProperty: 'profile/changeProperty'
        }),
        accept: function () {
            this.showModalRequest = !this.showModalRequest;
            this.declineFlag = false;
            this.acceptFlag = true;
        },
        decline: function () {
            this.showModalRequest = !this.showModalRequest;
            this.declineFlag = true;
            this.acceptFlag = false;
        },
        toAcceptRequest: function () {
            let user = this.user;
            let trip = this.trip;
            this.acceptInProcess = true;
            this.passengerAccept({user, trip}).then(() => {
                this.acceptInProcess = false;
            }).catch((resp) => {
                this.acceptInProcess = false;
                if (resp.status === 422) {
                    if (resp.data && resp.data.errors && resp.data.errors.error && resp.data.errors.error.length) {
                        for (let i = 0; i < resp.data.errors.error.length; i++) {
                            let error = resp.data.errors.error[i];
                            if (error === 'not_seat_available') {
                                dialogs.message('You can not accept this request, all the seats of the trip are occupied.', { duration: 10, state: 'error' });
                            }
                        }
                    }
                }
            });
        },
        cancelModal: function () {
            this.showModalRequest = !this.showModalRequest;
        },
        toDeclineRequest: function () {
            let user = this.user;
            let trip = this.trip;
            this.rejectInProcess = true;
            this.passengerReject({user, trip}).then(() => {
                this.rejectInProcess = false;
            }).catch((resp) => {
                this.rejectInProcess = false;
            });
        }
    },
    components: {
        Modal
    }
};
</script>