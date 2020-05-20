<template>
    <div class="schedule-board">
        <div v-if="type">
            <span>{{ title }}</span>
            <div style="display: flow-root">
                <h2>{{ schedule[selectedValue].day }}</h2>
                <div @click="slideDay(1)" class="arrow-icon">
                    <downIcon :size="12" :color="'#abe6c4'" style="transform: rotate(-90deg);" />
                </div>
                <div @click="slideDay(-1)" class="arrow-icon">
                    <downIcon :size="12" :color="'#abe6c4'" style="transform: rotate(90deg);" />
                </div>
            </div>
        </div>
            

        <!-- single ride -->
        <div v-if="!areaFlag" class="single-ride">
            <span>TIME OF DAY</span>
            <timePicker :timeFlag="timeFormatFlag" @time-change="timeChange" :width="45" type="singleTime" />
        </div>
        
        <!-- round ride -->
        <div v-if="areaFlag" class="round-ride">
            <!-- first trip -->
            <div>
                <span>FIRST TRIP</span>
                <timePicker :timeFlag="timeFormatFlag" @time-change="timeChange" :width="90" type="firstTime" placeholder="First" />
            </div>
            <!-- return trip -->
            <div>
                <span>RETURN TRIP</span>
                <timePicker :timeFlag="timeFormatFlag" @time-change="timeChange" :width="90" type="returnTime" placeholder="Return" />
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
// import components for this
import timePicker from './TimePicker';
import downIcon from '../../icon/DownIcon';
export default {
    name: 'scheduleArea',
    data () {
        return {
            selectedValue: 0,
            schedule: null,
            areaFlag: false,
            timeFormatFlag: false
        };
    },
    props: {
        title: {
            type: String,
            required: false,
            default: ''
        },
        data: {
            type: Array,
            required: false,
            default: null
        },
        tripType: {
            type: Boolean,
            required: false,
            default: false
        },
        type: {
            type: Boolean,
            required: false,
            default: false
        },
        compareKey: {
            type: Number,
            required: false,
            default: 0
        }
    },
    methods: {
        slideDay: function (value) {
            let maxLength = this.schedule.length - 1;
            if (value === 1 && this.selectedValue === maxLength) {
                this.selectedValue = 0;
            } else if (value === -1 && this.selectedValue === 0) {
                this.selectedValue = maxLength;
            } else {
                this.selectedValue += value;
            }
            this.timeFormatFlag = !this.timeFormatFlag;
        },
        timeChange: function (data) {
            // compare by compareKey
            switch (this.compareKey) {
            case 1:
                if (data.type === 'singleTime') {
                    this.schedule[this.selectedValue][data.type] = data.time;
                } else if (data.type === 'firstTime') {
                    this.schedule[this.selectedValue][data.type] = data.time;
                } else {
                    this.schedule[this.selectedValue][data.type] = data.time;
                }
                break;
            case 2:
                if (data.type === 'singleTime') {
                    this.schedule[this.selectedValue][data.type] = data.time;
                } else if (data.type === 'firstTime') {
                    this.schedule[this.selectedValue][data.type] = data.time;
                } else {
                    this.schedule[this.selectedValue][data.type] = data.time;
                }
                break;
            case 3:
                console.log('weekly', this.schedule);
                console.log('data', data);
                this.schedule[0][data.type] = data.time;
                break;
            default:
                break;
            }
            this.$emit('get-data', this.schedule);
        }
    },
    watch: {
        data: function () {
            if (this.data.length !== 0) {
                this.schedule = this.data;
            } else {
                this.schedule = null;
            }
        },
        tripType: function () {
            // set single or round
            this.areaFlag = this.tripType;

            // remove schedule by tripType
            if (this.schedule !== null) {
                this.schedule.forEach(item => {
                    Object.keys(item).forEach(value => {
                        if (value === 'singleTime' || value === 'firstTime' || value === 'returnTime') {
                            delete item[value];
                        }
                    });
                });
            }
        }
    },
    mounted () {
        if (this.compareKey === 3) {
            this.schedule = [{}];
        }
    },
    components: {
        timePicker,
        downIcon
    }
};
</script>