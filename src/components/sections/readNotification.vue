<template>
    <div class="read-notification">
        <div class="circle-icon">
            <v-icon icon="car" />
        </div>
        <span>{{ this.text }}</span>
    </div>
</template>

<script>
import moment from 'moment';

// regex
let regex = /aceptado/i;
export default {
    name: 'readNotification',
    data () {
        return {
            text: ''
        };
    },
    props: {
        notification: {
            type: Object,
            required: false,
            default: null
        }
    },
    mounted () {
        this.text = 'Your trip to ' + this.notification.trip.points[1].json_address.province + ' on ' + moment(this.notification.trip.trip_date).format('ddd D/M') + ' at ' + moment(this.notification.trip.trip_date).format('HA') + (regex.test(this.notification.text) ? ' is accepted' : ' was canceled');
    }
};
</script>