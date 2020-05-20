<template>
    <div class="ticket-container">
        <svg class="shadow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="92vw" height="100%" viewBox="0 0 418 268.001" preserveAspectRatio="none"  v-on:click='goToDetail(false)'>
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
        <div class="overlay"  v-on:click.stop="goToDetail(false)">
            <div class="ticketContent" :class="{ 'trip-fill': seats_available === 0, 'trip-almost-fill': seats_available === 1, 'trip-mostly-available': seats_available > 3, 'trip-with-driver': user, 'trip-with-control': enableChangeSeats } ">
                <div id="leftside">
                    <div id="credentialsandphoto"    v-on:click='goToProfile' v-if="user">
                        <div id="profilepic" v-imgSrc:profile="getUserImage"></div>
                        <div id="credentials">
                            <p id="blacktext">{{ trip.user.name }}</p>
                            <p style="margin:0;padding:0; font-size: 10px;">{{ trip.user.positive_ratings + trip.user.negative_ratings }} Ratings</p>
                        </div>
                    </div>
                    <template class="tripinfo" v-if="trip.points.length >= 2">
                        <div id="info">
                            <div id="icon">
                                <carIcon />
                            </div>
                            <div id="infoText" v-if="user" >{{this.trip.user.cartype}}</div>
                             <div id="infoText" v-if="!user">Login to view cartype</div>


                        </div>
                        <div id="info">
                            <div id="icon">
                                <ringIcon />
                            </div>
                            <div id="infoText" :style="originLongName ? LONG_NAME_STYLE : {}">{{ trip.points[0].json_address.city }}, {{ trip.points[0].json_address.province | googleInfoClean }}</div>
                        </div>
                        <div id="info">
                            <div id="icon">
                                <markerIcon />
                            </div>
                            <div id="infoText"  :style="destinyLongName ? LONG_NAME_STYLE : {}">{{ trip.points[trip.points.length - 1].json_address.city }}, {{ trip.points[trip.points.length - 1].json_address.province | googleInfoClean }}</div>
                        </div>
                        <div id="genderinfo">
                            <div id="icon">
                                <genderIcon />
                            </div>
                            <div id="gendertext" v-if="user">{{this.trip.user.gender}}</div>
                            <div id="gendertext" v-if="!user">Login to view user Gender</div>



                        </div>
                    </template>

                    <template class="tripinfo" v-else>
                        <div id="info">
                            <div id="icon">
                                <carIcon />
                            </div>
                            <div id="infoText" > {{trip.user.cartype}}</div>
                                                    </div>
                        <div id="info">
                            <div id="icon">
                                <ringIcon />
                            </div>
                            <div id="infoText" > {{ trip.from_town }}</div>
                        </div>
                        <div id="info">
                            <div id="icon">
                                <markerIcon />
                            </div>
                            <div id="infoText">{{ trip.to_town }}</div>
                        </div>
                        <div id="genderinfo">
                            <div id="icon">
                                <genderIcon />
                            </div>
                            <div id="gendertext">{{trip.user.gender}}</div>
                        </div>
                    </template>

                </div>
                <div id="divider">

                </div>
                <div id="rightside">
                    <div id="rightsidecontent">
                        <div class="sectionone">
                            <div id="calender" class="calendertime">
                                <div id="rightsideicon">
                                    <calenderIcon />
                                </div>
                                <div id="rightsidetext">
                                    {{ [ trip.trip_date ] | moment("DD MMMM") }}
                                </div>
                            </div>
                            <div id="time" class="calendertime">
                                <div id="rightsideicon">
                                    <clockIcon />
                                </div>
                            <div id="rightsidetext">
                                {{ [ trip.trip_date ] | moment("HH:mm") }}
                            </div>
                        </div>
                    </div>
                    <div class="sectiontwo">
                            <div id="seats" v-if="!enableChangeSeats && trip.seats_available !== 0" >
                                <div id="priceperseat">
                                    <p id="seatpricetext">{{ (((trip.distance/1000)  * 0.119 * 0.75 )/(trip.seats_available+1+trip.passenger.length)).toFixed(2) }} JD</p>
                                    <p id="perseattext">Per Seat</p>
                                </div>
                                <div id="seaticonholder" v-if="!trip.is_passenger">
                                        <p id="seat_number"> {{ trip.seats_available }}</p>
                                    <seatIcon />
                                </div>
                            </div>
                            <div class="buttonHolder">
                                <div id="ticketButton" v-on:click.stop="goToDetail(false)">
                                    LessGo
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Comfrotaa|Oswald');
div#infoText {
    font-size: 10px;
}
#ticketButton {
      background-color: #EB5557;
    font-size: 12px;
    width: 100%;
    color: white;
    font-weight: bold;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    border-radius: 18px;
    height: 35px;
    font-family: 'Poppins', sans-serif;
    position: relative;
}
    .buttonHolder{
        /* border: solid 1px black; */
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .sectiontwo{
        position: relative;
        /* border: solid 1px brown; */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 50%;
    }
    #seaticonholder{
        width: 39%;
        position: relative;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: row;
        flex-direction: row;
        -ms-flex-pack: center;
        justify-content: center;
        -ms-flex-align: center;
        top: -1em;
        align-items: center;
    }
    #seats{
        position: relative;
        top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        position: relative;
    }
    #priceperseat{
        /* border: solid 1px red; */
        width: 85%;
    }
    #perseattext{
        font-size: 10px;
        padding:0;
        margin:0;
        font-weight: bold;
        font-family: 'Poppins', sans-serif;
        /* border: solid 1px black; */
    }
    #seatpricetext{
        /* border: solid 1px green; */
        margin:0;
        padding:0;
        color: #1C8983;
        font-family: 'Poppins', sans-serif;
        font-weight: bold;
        font-size: 13px;

    }
    #rightsideicon{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 20%;
        /* border: solid 1px black; */
    }
    #rightsidetext{
        font-size: 0.8em;
        font-weight: bold;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: row;
        flex-direction: row;
        -ms-flex-align: center;
        align-items: center;
        height: 100%;
        padding: 0;
        margin: 0;
        font-family: 'Poppins', sans-serif;
        width: 100%;
        position: relative;
        left: 5px;
    }
    .sectionone{
        height: 33%;
        /* border: solid 1px green; */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .calendertime{
        /* border: solid 1px red; */
        height: 13px;
        display: flex;
        flex-direction: row;

    }
    #rightsidecontent{
        height: 90%;
        width: 100%;
        /* border: solid 1px green; */
    }
    #genderinfo{
        /* border: solid 1px black; */
        /* width: 50%; */
        display: flex;
        font-size: 12px;
    }
    #gendertext{
        color: #1C8983;
        font-weight: bold;
        font-family: 'Poppins', sans-serif;
    }
    #infoText{
        color: #5B5B5B;
        display: flex;
        flex-direction: row;
        /* justify-content: center; */
        align-items: center;
        font-family: 'Poppins', sans-serif;
        width: 84%;
        font-size: 10px;
        padding: 0;
    }
    #icon{
        /* border: solid 1px black; */
        width: 16%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #info{
        /* border: solid 1px red; */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .tripinfo{
        /* border: solid 1px black; */
        height: 60%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    #blacktext{
        font-size: 12px;
        margin:0;
        padding:0;
        color: black;
        font-weight: 200;
        font-family: 'Poppins', sans-serif;
    }
    #credentials{
        /* border: solid 1px red; */
        width: 70%;
        height: 20%;
        margin-top: 3px;
    }
    #profilepic{
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        height: 40px;
        width: 40px;
        border-radius: 20px;
    }
    #credentialsandphoto{
        /* border: solid 1px black; */
        align-self: center;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    #divider{
        height: 92%;
        margin-top: 10px;
        border-left: solid 1px rgba(112, 112, 112, .3);
        align-self: center;
    }
    #leftside{
        /* border: solid 1px red; */
        height: 100%;
        width: 60%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    #rightside{
        /* border: solid 1px blue; */
        height: 90%;
        width: 30%;
        display: flex;
        margin-top: 10px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .ticketContent{
        width: 93%;
        height: 80%;
        position: relative;
        top: 3px;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: row;
        flex-direction: row;
        -ms-flex-pack: justify;
        justify-content: space-between;
    }
    .overlay{
        height: 100%;
        position: absolute;
        width: 100%;
        z-index: 2;
        bottom: 0vh;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

    }
    #card_back-2{
        /* background-color: red; */
    }
    .shadow{
        filter: drop-shadow( 0 0 1px rgba(0, 0, 0, .2));
        margin-bottom: -8vh;
        position: relative;
        width: 113%;
        left: -6.4%;
        top: -2vh;
    }
    .ticket-container{
        margin-bottom: 2vh;
        align-self: center;
        position: relative;
        z-index: 100;
        /* border: solid 1px black; */
    }

    #seat_number {
    position: relative;
    right: -63%;
    bottom: -7%;
    }

 .trip-detail-component {
    overflow-x: hidden;
    overflow-y: scroll;
    margin-top: 2em !important;

}


</style>
<script>
import dialogs from '../../services/dialogs.js';
import carIcon from '../../icon/CarIcon';
import ringIcon from '../../icon/RingIcon';
import markerIcon from '../../icon/MarkerIcon';
import genderIcon from '../../icon/GenderIcon';
import calenderIcon from '../../icon/CalenderIcon';
import clockIcon from '../../icon/ClockIcon';
import seatIcon from '../../icon/SeatIcon';
import { mapActions } from 'vuex';

export default{
    name: 'ProfileTicket',
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
                'font-size': '10px'
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
    },
    components: {
        carIcon,
        ringIcon,
        markerIcon,
        genderIcon,
        calenderIcon,
        clockIcon,
        seatIcon
    }
};

</script>
