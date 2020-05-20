<template>
    <div>
        <span>CHOOSE RIDE DATE</span>
        <datePicker @onChange="getDate" :format="'D dd MMMM'" style="margin: 10px 0 20px 0; width: 100%;" />
        <scheduleArea :compareKey="3" :data="rideData" @get-data="getTime" :tripType="tripType" v-show="true" :type="false" />
    </div>  
</template>

<script>
// import components for this
import scheduleArea from '../elements/ScheduleArea';
import datePicker from '../DatePicker';
import moment from 'moment';

export default {
    name: 'once',
    data () {
        return {
            rideData: [{}],
            tripType: false
        };
    },
    methods: {
        getTime: function (data) {
            console.log('finalData', data);
            this.rideData = data;
            let formatTime = '';

            Object.keys(data[0]).forEach(item => {
                console.log('item', item);
                let time = moment(data[0][item]).toDate();
                if (time.getHours().toString().length === 1) {
                    if (time.getMinutes().toString().length === 1) {
                        formatTime += '0' + time.getHours() + ':0' + time.getMinutes() + ':00';
                    } else {
                        formatTime += '0' + time.getHours() + ':' + time.getMinutes() + ':00';
                    }
                } else {
                    if (time.getMinutes().toString().length === 1) {
                        formatTime += time.getHours() + ':0' + time.getMinutes() + ':00';
                    } else {
                        formatTime += time.getHours() + ':' + time.getMinutes() + ':00';
                    }
                }

                let payload = {
                    'time': formatTime,
                    'title': 'time',
                    'type': item
                };

                this.$emit('get-data', payload);
                formatTime = '';
            });
        },
        getDate: function (data) {
            let formatDate = moment(data).format('YYYY-MM-DD'); // format as '2000-01-01'
            let payload = {
                'date': formatDate,
                'title': 'date'
            };
            this.$emit('get-data', payload);
        }
    },
    watch: {
        rideType: function () {
            this.tripType = this.rideType;
        }
    },
    props: {
        rideType: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    components: {
        scheduleArea,
        datePicker
    }
};
</script>