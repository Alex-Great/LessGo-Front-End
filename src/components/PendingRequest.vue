<template>
    <div class="col-xs-24 col-md-16 col-lg-12">
        <div class="rate-pending_component clearfix">
            <div class="rate-pending_photo">
                <router-link :to="{name: 'profile', params: { id: user.id, userProfile: user, activeTab: 1}}">
                    <div class="trip_driver_img circle-box" v-imgSrc:profile="user.image">
                    </div>
                </router-link>
            </div>
            <modal :name="'modal'" v-if="showModalRequestSeat" @close="onModalClose" :title="'Test'" :body="'Body'">
                <h3 slot="header">
                    <span>Attention!</span>
                </h3>
                <div slot="body">
                    <div class="text-left carpoodatos">
                        <p>
                            Before accepting a seat request, send a message to the other person to coordinate everything related to the trip: meeting point, arrival point, bag size, contribution for fuel and tolls, etc.
                        </p>
                        <p>
                            If you accept a seat request, the commitment to travel between you and the other person is generated, enabling the possibility of qualification 24 hours after the start of the trip. They will have 14 days to rate.
                        </p>
                        <p>
                            You can rate even if you cancel the trip or go down to / get off the other person.
                        </p>
                        <p>
                            Do not offer a trip if you are not sure that you are going to travel. If something should happen that forces you to cancel it, notify the people who were traveling as soon as possible.
                        </p>
                        <p>
                            Any questions write to <a href="mailto:info@lessgo.app"> info@lessgo.app </a> or our social networks.
                        </p>
                    </div>
                    <div class="check" style="margin-bottom:10px;">
                        <label class="check-inline">
                            <input type="checkbox" name="acceptRequestValor" value="0" v-model="acceptRequestValue"><span> Do not show message again</span>
                        </label>
                    </div>
                    <div class="text-center">
                        <button class="btn btn-accept-request" :disabled="acceptInProcess" @click="toAcceptRequest"> Accept </button>
                        <button class="btn btn-secondary"  @click="onModalToChat">Send Message </button>
                    </div>
                </div>
            </modal>
            <div class="rate-pending-message">
                <div class="rate-pending-message--content">
                    <strong>{{user.name}}</strong> wants to get on the trip to <strong>{{trip.points[trip.points.length - 1].json_address.city}}</strong> of the day {{ trip.trip_date | moment("DD/MM/YYYY") }} at {{ trip.trip_date | moment("HH:mm") }}.
                    <div class='pending-buttons'>
                        <button class="btn btn-accept-request" :disabled="acceptInProcess" @click="onAcceptRequest"> Accept </button>
                        <button class="btn btn-primary" :disabled="rejectInProcess" @click="reject"> Decline </button>
                    </div>
                    <div class="message-button">
                        <button class="btn btn-secondary"  @click="chat"> Send Message </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.modal-default-button{
    width: 7em;
}
.message-button {
    width: 78%;
}
.btn-accept-request, .btn-primary, .btn-secondary {
    padding: 10px !important;
    border-radius: 10px !important;
    color: white !important;
    font-size: 15px !important;
    font-family: Avenir ! important;
    width: 100% !important;
}
</style>

<script>
import { mapActions, mapGetters } from 'vuex';
import router from '../router';
import modal from './Modal';
import dialogs from '../services/dialogs.js';
export default {
    data () {
        return {
            acceptInProcess: false,
            rejectInProcess: false,
            showModalRequestSeat: false,
            acceptRequestValue: 1
        };
    },
    computed: {
        ...mapGetters({
            currentUser: 'auth/user'
        })
    },
    methods: {
        ...mapActions({
            passengerAccept: 'passenger/accept',
            passengerReject: 'passenger/reject',
            lookConversation: 'conversations/createConversation',
            changeProperty: 'profile/changeProperty'
        }),

        onAcceptRequest () {
            if (this.currentUser.do_not_alert_accept_passenger) {
                this.toAcceptRequest();
            } else {
                this.showModalRequestSeat = true;
            }
        },

        toAcceptRequest () {
            if (this.acceptRequestValue) {
                let data = {
                    property: 'do_not_alert_accept_passenger',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }

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

        reject () {
            if (this.acceptRequestValue) {
                let data = {
                    property: 'do_not_alert_accept_passenger',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }

            let user = this.user;
            let trip = this.trip;
            this.rejectInProcess = true;
            this.passengerReject({user, trip}).then(() => {
                this.rejectInProcess = false;
            }).catch((resp) => {
                this.rejectInProcess = false;
            });
        },

        chat () {
            let user = this.user;

            this.lookConversation(user).then(conversation => {
                router.push({ name: 'conversation-chat', params: { id: conversation.id } });
            });
        },
        onModalToChat () {
            this.showModalRequestSeat = false;

            if (this.acceptRequestValue) {
                let data = {
                    property: 'do_not_alert_accept_passenger',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }
            this.chat();
        },

        onModalClose () {
            this.showModalRequestSeat = false;

            if (this.acceptRequestValue) {
                let data = {
                    property: 'do_not_alert_accept_passenger',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }
        }
    },

    components: {
        modal
    },
    mounted () {
        console.log('test', this.user);
    },

    props: [
        'user',
        'trip'
    ]
};
</script>
