<template>
    <div>
        <span>PICK MULTIPLE DATES</span>
        <div class="specific-area">
            <v-icon :icon="['fa', 'calendar-alt']" class="v-icon-calendar-specific" />
            <div class="date-area">
                <!-- <VueSlickCarousel v-bind="settings"> -->
                    <div v-for="date in rideData">
                        <h2>{{ date.day }}</h2>
                    </div>
                <!-- </VueSlickCarousel> -->
            </div>
            <div class="non-visibility-picker">
                <v-icon icon="plus" class="plus-area" />
                <div class="non-picker-area">
                    <datePicker :clearFlag="false" :calendarFlag="false" @onChange="getDate" :format="'D dd MMMM'" style="margin: 10px 0 20px 0; width: 100%;" />
                </div>
            </div>
        </div>
        <scheduleArea title="DATE" @get-data="getData" :tripType="tripType" v-show="true" :type="true" :data="rideData" :compareKey="2" />
        <div class="round-area" style="margin-top: 20px;">
            <div @click="rideMethod" class="round-btn">
                <div :class="rideTypeFlag?'inline-area': 'single-area'"></div>
            </div>
            <span>Different time of day</span>
        </div>
    </div>  
</template>

<script>
import moment from 'moment';
import VueSlickCarousel from 'vue-slick-carousel';

// import components for this
import scheduleArea from '../elements/ScheduleArea';
import datePicker from '../DatePicker';

export default {
    name: 'specific',
    data () {
        return {
            rideData: [],
            tripType: false,
            rideTypeFlag: false,
            settings: {
                'dots': true,
                'variableWidth': true,
                'arrows': true
            }
        };
    },
    methods: {
        getData: function (data) {
            // console.log('data------------', data);
            this.rideData = data;
            let formatTime = '';
            let eachData = [];

            // format time
            data.forEach(item => {
                Object.keys(item).forEach(param => {
                    if (param !== 'day' && param !== 'realFormatDate') {
                        let time = moment(item[param]).toDate();

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
                            day: item.day,
                            realFormatDate: item.realFormatDate,
                            type: param,
                            time: formatTime
                        };
                        eachData.push(payload);
                        formatTime = '';
                    }
                });
            });

            this.$emit('get-data', eachData);
        },
        rideMethod: function () {
            this.rideTypeFlag = !this.rideTypeFlag;
        },
        getDate: function (date) {
            let formatDate = moment(date).format('DD/M');
            let realFormatDate = moment(date).format('YYYY-MM-DD'); // format as '2000-01-01'
            let specific = {
                'day': formatDate,
                'realFormatDate': realFormatDate
            };
            this.rideData.push(specific);
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
        VueSlickCarousel,
        datePicker
    }
};
</script>