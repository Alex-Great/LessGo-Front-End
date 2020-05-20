<template>
    <div class="notificationBoard">
        <div class="noti-flex-div" style="width: 70%">
            <div class="noti-img-div">
                <div class="img-circle" v-imgSrc:profile="notification.trip.user.image"></div>
                <div class="circle-icon ">
                    <v-icon icon="car"/>
                </div>
            </div>

            <!-- notification title -->
            <div class="not-title">
                <span>{{ this.text }}</span>
            </div>
        </div>

        <!-- several functional buttons area -->
        <div class="new-noti-btns" style="width: 30%">
            <button v-if="!statusFlag" @click="newTrip">new trip</button>
            <button v-else @click="tripDetail">trip details</button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';

// regex
let regex = /aceptado/i;
export default {
    name: 'unreadNotification',
    data () {
        return {
            text: '',
            statusFlag: false
        };
    },
    props: {
        notification: {
            type: Object,
            required: false,
            default: null
        }
    },
    async mounted () {
        await this.getAllUsers();
        console.log('allUsers', this.allUsers);
        this.text = 'Your trip to ' + this.notification.trip.points[1].json_address.province + ' on ' + moment(this.notification.trip.trip_date).format('ddd D/M') + ' at ' + moment(this.notification.trip.trip_date).format('HA') + (regex.test(this.notification.text) ? ' is accepted' : ' was canceled');
        if (regex.test(this.notification.text)) {
            this.statusFlag = true;
        } else {
            this.statusFlag = false;
        }

        this.deleteAllTrips();
    },
    computed: {
        ...mapGetters({
            allUsers: 'auth/users'
        })
    },
    methods: {
        ...mapActions({
            getAllUsers: 'auth/getAllUsers',
            deleteAllTrips: 'userTrips/deleteAllTrips',
            search: 'notifications/index',
            setSelectedTrip: 'trips/setSelectedTrip'
        }),
        newTrip: function () {
            let data = {
                from_town: this.notification.trip.from_town,
                to_town: this.notification.trip.to_town,
                date: new Date()
            };

            this.$router.push({name: 'searchResult', params: {data}});
            this.search(true);
        },
        tripDetail: function () {
            console.log('notification', this.notification);
            let name = this.notification.trip.user.name;
            let newName = name.replace(/ /gi, '');

            this.allUsers.forEach(user => {
                if (this.notification.trip.user.id === user.id) {
                    this.notification.trip['cartype'] = user.cartype;
                }
            });

            this.setSelectedTrip(this.notification.trip);

            // go detail page
            this.$router.push({name: 'detail', params: {name: newName, status: 'otherUser'}});
            this.search(true);
        }
    }
};
</script>