<template>
    <div>
        <span>SELECT WEEKDAYS</span>
        <div class="week-area">
            <div :class="selectedWeek[week]?'sel-week': ''" v-for="week in weeks" class="weeks" @click="weekSelect(week)">
                <span>{{ week }}</span>
            </div>
        </div>
        <scheduleArea :compareKey="1" @get-data="getData" :tripType="tripType" v-show="rideData.length > 0" title="DAY" :data="rideData" :type="true" />
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

// import components for this
import scheduleArea from '../elements/ScheduleArea';

export default {
    name: 'weekdays',
    data () {
        return {
            weeks: [
                'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'
            ],
            selectedWeek: {
                SUN: false,
                MON: false,
                TUE: false,
                WED: false,
                THU: false,
                FRI: false,
                SAT: false
            },
            rideData: [],
            tripType: false,
            rideTypeFlag: false
        };
    },
    methods: {
        weekSelect: function (item) {
            this.selectedWeek[item] = !this.selectedWeek[item];
            if (this.selectedWeek[item]) {
                this.weeks.forEach((el, i) => {
                    if (el === item) {
                        let weekdata = {
                            day: item,
                            id: i
                        };
                        let outFlag = false;
                        if (this.rideData.length === 0) {
                            this.rideData.push(weekdata);
                        } else {
                            if (this.rideData[this.rideData.length - 1].id < i) {
                                this.rideData.push(weekdata);
                            } else {
                                this.rideData.forEach((ride, j) => {
                                    if (i < ride.id && outFlag === false) {
                                        this.rideData.splice(j, 0, weekdata);
                                        outFlag = true;
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                this.rideData.forEach((el, i) => {
                    if (el.day === item) {
                        this.rideData.splice(i, 1);
                    }
                });
            }
        },
        getData: function (data) {
            this.rideData = data;
            let formatTime = '';
            let eachData = [];

            // format time
            data.forEach(item => {
                Object.keys(item).forEach(param => {
                    if (param !== 'day' && param !== 'id') {
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
        scheduleArea
    }
};
</script>