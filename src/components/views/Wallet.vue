<template>
    <div class="messages">
        <div class="messages-area">
            <h1 style="margin: unset;">Wallet</h1>
            <closeIcon :size="12" :classes="'close-message'" />
        </div>

        <!-- circle time -->
        <div class="wallet">
            <div class="circle-time">
                <circleTime :min="min" :max="max" :value="value" text="12:34" :distance="curDistance" :left="leftDistance" :coin="curCoins" />
                <h2>{{ this.curCoins }}</h2>
                <div></div>
            </div>
            
            <!-- rewards part -->
            <h2>Rewards</h2>
            <div @click="goMarket" class="rewards">
                <h2>GoMarket</h2>
                <p>Enjoy exclusive reward from LessGo & Partners</p>
                <div style="margin-top: 10px;">
                    <p>Visit GoMarket</p>
                    <div class="arrow-circle">
                        <downIcon :size="10" :color="'#1C8983'" style="transform: rotate(-90deg);" />
                    </div>
                </div>
            </div>

            <div class="Payment">

            <!-- payment part -->
            <h2>Payment methods</h2>

            <div class="cash-icon">
                <v-icon icon="money-bill" class="v-icon-cash" />
                <h2>Cash</h2>
            </div>
            <!-- add payment method -->
            <div class="payment-add">
                <v-icon icon="plus" class="v-icon-plus" />
                <h3>Add a new payment method</h3>
            </div>

            <!-- Give button -->
            <button>
                <v-icon icon="hand-holding-heart" class="v-icons-wallet" />
                <h4>Refer a friend</h4>
            </button>
             </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

// import components for this
import circleTime from './CircleTime';
import closeIcon from '../../icon/CloseIcon';
import downIcon from '../../icon/DownIcon';
import giveIcon from '../../icon/GiveIcon';
import cashIcon from '../../icon/CashIcon';

export default {
    name: 'wallet',
    data () {
        return {
            min: 0,
            max: 100,
            value: 0,
            date: moment(2 * 60 * 1000),
            pathProgess: '',
            curDistance: 0,
            leftDistance: 100,
            curCoins: 0
        };
    },
    computed: {
        ...mapGetters({
            users: 'auth/users',
            trips: 'userTrips/driverTrip'
        })
    },
    mounted () {
        let maxValue = this.date.diff(moment(0), 'seconds'); // total seconds
        var timer = setInterval(() => {
            this.date = moment(this.date.subtract(1, 'seconds'));
            let curValue = this.date.diff(moment(0), 'seconds'); // current seconds
            this.value = this.max * (maxValue - curValue) / maxValue;
            this.curDistance = parseInt(this.value.toFixed());
            this.leftDistance = 100 - this.curDistance;
            // this.pathProgess = this.describeArc(45, 45, 46, 0, (maxValue - curValue) * 360 / maxValue);
            if (this.date.diff(moment(0)) === 0) {
                // clearInterval(timer);
                this.date = moment(2 * 60 * 1000);
                this.curCoins += 1;
            }
        }, 100);
        console.log('user', this.users);
        console.log('trips', this.trips);
    },
    methods: {
        goMarket: function () {
            console.log('LessGo');
        }
    },
    components: {
        circleTime,
        closeIcon,
        downIcon,
        giveIcon,
        cashIcon
    }
};
</script>