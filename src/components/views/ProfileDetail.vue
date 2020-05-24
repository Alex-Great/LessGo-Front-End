<template>
    <div>
        <div class="messages-area profile-detail">
            <closeIcon :size="12" :classes="'close-message'" :title="titleText" :closeTitle="closeTitle" :data="data" />
            <!-- title area -->
            <div class="title-area">
                <div class="img-profile-detail" v-imgSrc:profile="userData.image">
                </div>
                <div style="margin-left: 20px;">
                    <h3> " {{ userData.name }}"</h3> 
                    <div v-for="num in redRating" style="float: left; margin-right: 5px;">
                        <ratingStarIcon :size="10" :color="'#e65a5b'" />
                    </div>
                    <div v-if="!no_review" v-for="num in greyRating" style="float: left; margin-right: 5px;">
                        <ratingStarIcon :size="10" />
                    </div>
                    <div v-if="no_review">
                        <span>No Reviews</span>
                    </div>
                </div>
            </div>

            <!-- bio area -->
            <h4>Bio</h4>
            <p>"{{  userData.description }}"</p>
        </div>
        <!-- profile detail content -->
        <div class="profile-detail-content">
            <!-- contribution -->
            <h2>Contribution</h2>
            <contribution :data="contributionData" :testFlag="testFlag" />

            <!-- reviews -->
            <h2>Reviews&nbsp;-&nbsp;{{ reviewCount }}</h2>
            <div class="review-img">
                <img :src="review_bk" @click="viewReviews" />
                <h3 v-if="no_review">No one has reviewed {{ review_name[0] }} yet.</h3>
                <h3 v-else>{{ review_name[0] }} has been reviewed</h3>
            </div>

            <!-- <div v-if="reviewSectionFlag">
                <reviewCard />
            </div> -->
            <!-- edit profile btn -->
            <button v-if="edit_btn_flag" @click="editProfile">Edit profile</button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

// import components for this
import closeIcon from '../../icon/CloseIcon';
import ratingStarIcon from '../../icon/RatingStarIcon';
import reviewCard from '../elements/ReviewCard';

// import json for this
import profileJson from '../../jsons/profile.json';
import contribution from '../sections/Contribution';

let totalCount = 5;
export default {
    name: 'profileDetail',
    data () {
        return {
            userData: null,
            redRating: [],
            greyRating: [],
            no_review: false,
            reviewCount: null,
            contributionData: null,
            review_bk: process.env.ROUTE_BASE + 'static/svg/norating.svg',
            review_name: '',
            edit_btn_flag: false,
            distance: 0,
            co2: 0,
            testFlag: false,
            reviewSectionFlag: false
        }
    },
    props: {
        id: {
            type: String,
            required: false,
            default: 'me'
        },
        titleText: {
            type: String,
            required: false,
            default: ''
        },
        data: {
            type: Object,
            required: false,
            default: null
        },
        closeTitle: {
            type: String,
            required: false,
            default: ''
        }
    },
    async mounted () {
        if (this.id === 'me') {
            await this.oldTripsAsDriver();
            await this.oldTripsAsPassenger();

            // Contributions
            // driver trips
            let contribution = {};
            contribution['as_driver'] = this.oldTrips.length;
            contribution['as_passenger'] = this.oldPassengerTrips.length;
            contribution['co2'] = 0;
            contribution['saved_km'] = 0;

            // saved distance
            this.oldTrips.forEach(trip => {
                // Lat and Lng for draw route
                let fromLatLng = {
                    lat: trip.points[0].lat,
                    lng: trip.points[0].lng
                };

                let toLatLng = {
                    lat: trip.points[1].lat,
                    lng: trip.points[1].lng
                };

                // draw route
                this.drawRoute(fromLatLng, toLatLng);
                contribution.co2 += this.co2;
                contribution.saved_km += this.distance;
            });

            this.contributionData = contribution;
            this.userData = this.user;
            this.review_name = this.user.name.split(' ', 1); // get first name
            this.redRating = [];
            this.greyRating = [];
            let ratingCount = this.user.positive_ratings + this.user.negative_ratings;
            this.reviewCount = ratingCount;
            // rating count
            if (ratingCount !== 0) {
                for (let i = 0; i < ratingCount; i++) {
                    this.redRating.push(i);
                }

                for (let j = 0; j < (totalCount - ratingCount); j++) {
                    this.greyRating.push(j);
                }
            } else {
                this.no_review = true;
            }
            this.edit_btn_flag = true;
        } else {
            await this.search(this.id);
            this.userData = this.searchUser;
            this.review_name = this.searchUser.name.split(' ', 1); // get first name
            this.redRating = [];
            this.greyRating = [];
            let profileData = profileJson.profile;
            let ratingCount = this.searchUser.positive_ratings + this.searchUser.negative_ratings;
            this.reviewCount = ratingCount;
            // rating count
            if (ratingCount !== 0) {
                for (let i = 0; i < ratingCount; i++) {
                    this.redRating.push(i);
                }

                for (let j = 0; j < (totalCount - ratingCount); j++) {
                    this.greyRating.push(j);
                }
            } else {
                this.no_review = true;
            }
            this.contributionData = profileData;
            this.testFlag = true;
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
            oldTrips: 'myTrips/myOldTrips',
            oldPassengerTrips: 'myTrips/passengerOldTrips',
            searchUser: 'auth/searchUser'
        })
    },
    methods: {
        ...mapActions({
            search: 'auth/searchUser',
            oldTripsAsDriver: 'myTrips/oldTripsAsDriver',
            oldTripsAsPassenger: 'myTrips/oldTripsAsPassenger'
        }),
        editProfile: function () {
            this.$router.push({name: 'edit-profile', params: {id: 'me'}});
        },
        drawRoute: function (from, to) {
            // select this VueComponent
            let VueComp = this;
            let service = new window.google.maps.DirectionsService();
            service.route({
                origin: from,
                destination: to,
                travelMode: window.google.maps.TravelMode.DRIVING
            }, function (result, status) {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    for (let i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                        let points = {
                            lat: result.routes[0].overview_path[i].lat(),
                            lng: result.routes[0].overview_path[i].lng()
                        };
                    }
                    let distance = (result.routes[0].legs[0].distance.value / 1000).toFixed(2);
                    VueComp.distance = distance;
                    VueComp.co2 = parseFloat(distance * 0.15).toFixed(2);
                }
            });
        },
        viewReviews: function () {
            this.reviewSectionFlag = true;
        }
    },
    components: {
        closeIcon,
        ratingStarIcon,
        contribution,
        reviewCard
    }
}
</script>