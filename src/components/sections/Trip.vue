<template>
  <div class="col-lg-6 col-md-8 col-sm-12" v-on:click='goToDetail(false)'>
    <div class="trip" :class="{ 'trip-fill': seats_available === 0, 'trip-almost-fill': seats_available === 1, 'trip-mostly-available': seats_available > 3, 'trip-with-driver': user, 'trip-with-control': enableChangeSeats } " >
        <div class="panel panel-default panel-card card card-trip">
          <div class="panel-heading card_heading">
            <div class="panel-title card-trip_title row">
              <div class="card-icon">
                <span class="trip_visibility">
                  <span v-if="trip.friendship_type_id === 0" title="Visibility: Just friends">
                    <span class="tooltip" title="Visibilidad: Solo amigos" data-tooltip="Just friends.">
                      <i class="fa fa-user" aria-hidden="true"></i>
                    </span>
                  </span>
                  <span v-else-if="trip.friendship_type_id === 1" title="Visibility: Friends of friends">
                    <i class="fa fa-users" aria-hidden="true"></i>
                  </span>
                  <span v-else-if="trip.friendship_type_id === 2" title="Visilidad: Public">
                    <span class="tooltip-bottom" title="Visibility: Public" data-tooltip="Public">
                      <i class="fa fa-globe" aria-hidden="true"></i>
                    </span>
                  </span>
                </span>
              </div>
              <template v-if="user">
                <div class="trip_driver_img_container"  v-on:click='goToProfile'>
                  <div class="trip_driver_img circle-box" v-imgSrc:profile="getUserImage"></div>
                </div>
                <div class="trip_driver_details">
                  <div class="trip_driver_name"  v-on:click='goToProfile'>
                    {{ trip.user.name }}
                  </div>
                  <div class="trip_driver_ratings">
                    {{ trip.user.positive_ratings + trip.user.negative_ratings }} ratings

                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="panel-body card_body">
            <div class="trip_location">
              <template v-if="trip.points.length >= 2">
                <div class="row trip_location_from">
                  <div class="col-xs-4 text-right">
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <div class="col-xs-20">
                    <span class="trip_location_from_city" :style="originLongName ? LONG_NAME_STYLE : {}">{{ trip.points[0].json_address.city }}</span>
                    <span class="trip_location_from_state-country">{{ trip.points[0].json_address.province | googleInfoClean }}</span>
                  </div>
                </div>
                <div class="row trip_location_to">
                  <div class="col-xs-4 text-right">
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <div class="col-xs-20">
                    <span class="trip_location_from_city" :style="destinyLongName ? LONG_NAME_STYLE : {}">{{ trip.points[trip.points.length - 1].json_address.city }}</span>
                    <span class="trip_location_from_state-country">{{ trip.points[trip.points.length - 1].json_address.province | googleInfoClean }}</span>
                  </div>
                </div>
                <div class="col-xs-4 trip_location-dot-line">
                  <div></div>
                </div>
              </template>
              <template v-else>
                  <div class="row trip_location_from">
                    <div class="col-xs-4 text-right">
                      <i class="fa fa-map-marker" aria-hidden="true"></i>
                    </div>
                    <div  class="col-xs-20">
                      {{ trip.from_town }}
                    </div>
                </div>
                <div class="row trip_location_to">
                  <div class="col-xs-4 text-right">
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <div class="col-xs-20">
                    {{ trip.to_town }}
                  </div>
                </div>
              </template>
            </div>
            <div class="row">
                <time class="trip_datetime col-xs-24" :datetime="trip.trip_date">
                    <div class="row">
                        <div class="col-xs-14 trip_datetime_date">
                            <span class="trip_datetime_date_day">
                                <span style="text-transform: uppercase;">{{ [ trip.trip_date ] | moment("ddd") }}</span>
                                {{ [ trip.trip_date ] | moment("DD MMMM") }}
                            </span>
                            <br />
                            <span class="trip_datetime_date_year">{{ [ trip.trip_date ] | moment("YYYY") }}</span>
                        </div>
                        <div class="col-xs-10">
                            <span class="trip_datetime_time">{{ [ trip.trip_date ] | moment("HH:mm") }} </span>
                        </div>
                    </div>

                </time>
            </div>
            <template v-if="!enableChangeSeats">
                <div v-if="trip.seats_available !== 0" class="row">
                    <div class="trip_seats-available col-xs-offset-2 col-xs-12" v-if="!trip.is_passenger">
                        <span class="trip_seats-available_value pull-left">{{ trip.seats_available }}</span>
                        <span class="trip_seats-available_label" v-if="trip.seats_available > 1">
                            <span>places</span><span>Avaliable</span>
                        </span>
                        <span class="trip_seats-available_label" v-else="trip.seats_available > 1">
                            <span>places</span><span>Avaliable</span>
                        </span>
                    </div>
                    <div class="col-xs-offset-2 col-xs-12" v-else></div>
                    <div class="trip_actions col-xs-10">
                        <div class="btn btn-default btn-lg btn-trip-detail">LessGo!</div>
                    </div>
                </div>
                <div v-if="trip.seats_available === 0" class="row row--carpooleado">
                    <div class="trip_seats-available col-xs-offset-6 col-xs-18 carpooleado">
                        <span>LessGo</span>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="row">
                    <div v-if="!trip.is_passenger" class="trip-seats-control col-xs-offset-2">
                        <button aria-label="Decrease the number of seats by one" v-on:click.stop="changeSeatsNumber(-1)" :disabled="sending || trip.total_seats < 1" class="btn btn-default">
                            -
                        </button>
                        <span class="trip_seats-available_value">
                            {{ seats_available }}
                        </span>
                        <button aria-label="Increase the number of seats by one" v-on:click.stop="changeSeatsNumber(1)" :disabled="sending || seats_available > 3" class="btn btn-default">
                            +
                        </button>
                        <span class="trip_seats-available_label" v-if="seats_available > 1">
                            <span>Free places</span>
                        </span>
                        <span class="trip_seats-available_label" v-if="seats_available === 1">
                            <span>Free place</span>
                        </span>
                        <span class="trip_seats-available_label" v-if="seats_available === 0">
                            LessGo!
                        </span>
                    </div>
                    <div class="trip-inline-controls row">
                        <span class="col-xs-6">
                            <button v-on:click.stop="goToDetail(false)" class="btn btn-default" aria-label="See detail of the trip">
                                <i class="fa fa-eye" aria-hidden="true"></i>
                            </button>
                        </span>
                        <span class="col-xs-6">
                            <button v-on:click.stop="goToDetail(false, true)" v-if="!trip.is_passenger" :disabled="!trip.passenger.length" class="btn btn-default"  aria-label="See passengers">
                                <i class="fa fa-users" aria-hidden="true"></i>
                            </button>
                        </span>
                        <span class="col-xs-6">
                            <button v-on:click.stop="goToDetail(true)" class="btn btn-default" aria-label="Edit trip">
                                <i class="fa fa-pencil" aria-hidden="true"></i>
                            </button>
                        </span>
                        <span class="col-xs-6">
                            <button v-on:click.stop="deleteTrip" class="btn btn-default"  aria-label="Delete trip">
                                <i class="fa fa-trash-o" aria-hidden="true"></i>
                            </button>
                        </span>
                    </div>
                </div>
            </template>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import dialogs from '../../services/dialogs.js';
export default {
    name: 'trip',
    props: {
        'trip': {
            type: Object,
            required: false,
            default: () => {
                return {};
            }
        },
        'user': {
            type: Object,
            required: false,
            default: () => {
                return {};
            }
        },
        'enableChangeSeats': {
            type: Boolean,
            required: false,
            default: false
        }
    },

    methods: {
        ...mapActions({
            changeSeats: 'trips/changeSeats',
            remove: 'trips/remove'
        }),
        goToDetail: function (goToEdit, passengerView) {
            if (goToEdit) {
                this.$router.push({ name: 'update-trip', params: { id: this.trip.id } });
            } else {
                if (!passengerView) {
                    this.$router.push({ name: 'detail_trip', params: { id: this.trip.id } });
                } else {
                    this.$router.push({
                        name: 'detail_trip_location',
                        params: {
                            id: this.trip.id,
                            location: 'passenger'
                        }
                    });
                }
            }
        },
        goToProfile: function (event) {
            event.stopPropagation();
            this.$router.push({
                name: 'profile',
                params: {
                    id: this.trip.user.id,
                    userProfile: this.trip.user,
                    activeTab: 1
                }
            });
        },
        changeSeatsNumber: function (increment) {
            this.sending = true;
            let data = {
                id: this.trip.id,
                increment: increment
            };
            this.changeSeats(data).then((data) => {
                this.sending = false;
                this.seats_available = data.seats_available;
                this.trip.total_seats += increment;
                this.$forceUpdate();
            }).catch((response) => {
                this.sending = false;
                let errorMessage = '';
                if (response.status === 422) {
                    if (response.data.errors && response.data.errors.error && response.data.errors.error.length) {
                        let error = response.data.errors.error[0];
                        switch (error) {
                        case 'trip_seats_greater_than_zero':
                            errorMessage = 'The number of seats can not be less than zero.';
                            break;
                        case 'trip_seats_less_than_four':
                            errorMessage = 'A trip can not have more than 4 seats available.';
                            break;
                        case 'trip_invalid_seats':
                            errorMessage = 'You already have passengers uploaded you can not decrease the number of seats.';
                            break;
                        default:
                            errorMessage = 'There was an error changing the number of seats. Please, try again.';
                            break;

                        }
                    } else {
                        errorMessage = 'There was an error changing the number of seats. Please, try again.';
                    }
                } else {
                    errorMessage = 'There was an error changing the number of seats. Please, try again.';
                }
                dialogs.message(errorMessage, { state: 'error' });
            });
        },
        deleteTrip: function () {
            if (window.confirm('Are you sure you want to cancel the trip?')) {
                this.remove(this.trip.id).then(() => {
                    dialogs.message('The trip was canceled.', { state: 'error' });
                }).catch(() => {
                    dialogs.message('There was an error canceling the trip.', { state: 'error' });
                });
            }
        }
    },
    data () {
        return {
            sending: false,
            seats_available: 0,
            CITY_NAME_LONG_LENGTH: 16,
            LONG_NAME_STYLE: {
                'font-size': '17px'
            }
        };
    },
    computed: {
        originLongName () {
            if (this.trip.points) {
                if (this.trip.points[0].json_address.city) {
                    return this.trip.points[0].json_address.city.length > this.CITY_NAME_LONG_LENGTH;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        destinyLongName () {
            if (this.trip.points) {
                if (this.trip.points[this.trip.points.length - 1].json_address.city) {
                    return this.trip.points[this.trip.points.length - 1].json_address.city.length > this.CITY_NAME_LONG_LENGTH;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        getUserImage () {
            return this.user.id === this.trip.user.id ? this.user.image : this.trip.user.image;
        }
    },
    mounted () {
        if (this.trip) {
            this.seats_available = this.trip.seats_available;
        }
    },
    updated () {
    }
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Comfrotaa|Oswald');
    .trip-seats-control .trip_seats-available_value {
        margin-right: .15em;
        margin-left: .15em;
    }
    .trip-seats-control .trip_seats-available_label {
        position: static;
        top: 0;
        margin-left: .5em;
    }
    .trip-fill .trip-seats-control .trip_seats-available_label {
        color: #FE9900;
    }
    .trip-seats-control .btn {
        background: #EEE;
        min-width: 2.5em;
    }
    .trip-seats-control .btn[disabled] {
        opacity: 0.25;
    }
    .trip-seats-control .btn[disabled]:hover {
        background: #EEE;
    }
    .trip-seats-control > * {
        vertical-align: middle;
    }
    .trip-with-control .card-trip {
        height: 470px;
    }
    .trip-inline-controls .btn {
        width: 100%;
    }
    .trip-inline-controls {
        margin-top: 1em;
    }

    .trip-inline-controls .btn[disabled] {
        opacity: 0.20;
    }
    .trip-inline-controls .btn[disabled]:hover {
        background: #EEE;
    }
    @media (min-width: 1200px) {
        .trip-with-control .card-trip {
            height: 500px;
        }
    }
    .trip-detail-component .btn {
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
        -ms-flex-direction: row;
        flex-direction: row;
        -ms-flex-pack: center;
        justify-content: center;
        -ms-flex-align: center;
        align-items: center;
        border-radius: 18px !important;
        font-family: 'Poppins', sans-serif;
        position: relative;
        min-width: 8rem;
        padding: .8em 1.2em;
        text-transform: uppercase;
}
</style>
