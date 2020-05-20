<template>
    <div class="set-detail">
        <div class="detail">
            <div class="car-img"></div>
            <span class="car-type">{{ detail.carType }}</span>
            <span class="plate-id">{{ detail.plateId }}</span>
            <router-link :to="{name: 'setCarAndId'}" class="return-route" >Update...</router-link>
            <closeIcon :size="12" style="position: absolute; right: 9%; top: 7%; cursor: pointer;" />
        </div>

        <div class="set-schedule">
            <!-- trip detail -->
            <div class="trip-detail">
                <span>TRIP DETAILS</span>
                <searchArea @save-data="saveArea" @error-reverse="errorReverse" />
                <span class="error" v-if="areaError.state"> {{areaError.message}}</span>
            </div>

            <!-- round select area -->
            <div class="round-area">
                <div @click="rideMethod" class="round-btn">
                    <div :class="rideTypeFlag?'inline-area': 'single-area'"></div>
                </div>
                <span>Round-trip</span>
            </div>

            <!-- offer ride schedule -->
            <span>OFFER MY RIDE</span>
            <div class="schedule-btn-area">
                <scheduleBtn :title="'Select Weekdays'" :compareKey="1" @selectBtn="selectBtn" :selected="(compareKey === 1)?true: false" />
                <scheduleBtn :title="'Specific Dates'" :compareKey="2" @selectBtn="selectBtn" :selected="(compareKey === 2)?true: false" />
                <scheduleBtn :title="'Just Once'" style="margin-right: 0" :compareKey="3" @selectBtn="selectBtn" :selected="(compareKey === 3)?true: false" />
            </div>

            <!-- schedule areas -->
            <div class="schedule-area">
                <Weekdays @get-data="getData" v-show="compareKey === 1 && visibleFlag === true" :rideType="rideTypeFlag" />
                <Specific @get-data="getData" v-show="compareKey === 2 && visibleFlag === true" :rideType="rideTypeFlag" />
                <Once @get-data="getData" v-show="compareKey === 3 && visibleFlag === true" :rideType="rideTypeFlag" />
                <span class="error" v-if="tripError.state"> {{tripError.message}}</span>
            </div>
        </div>
        <!-- continue -->
        <div class="button-area" style="padding-right: 20px; padding-left: 20px">
            <button class="continue-btn" @click="nextOffer">
              <span>Continue</span>
              <rightArrowIcon :size="15" :fillColor="'black'" />
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dialogs from '../../services/dialogs.js';
import moment from 'moment';

/* import components for this */
import closeIcon from '../../icon/CloseIcon.vue';
import rightArrowIcon from '../../icon/RightArrowIcon.vue';
import scheduleBtn from '../elements/ScheduleBtn';
import Weekdays from '../sections/Weekdays';
import Specific from '../sections/Specific';
import Once from '../sections/Once';
import searchArea from '../sections/SearchArea';

class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'setRideSchedule',
    data () {
        return {
            compareKey: null,
            visibleFlag: false,
            rideTitle: '',
            rideTypeFlag: false,
            rideType: 'single',
            sessionRideType: 'single',
            areas: null,
            tripdate: '',
            triptime: {},
            areaError: new Error(),
            tripError: new Error(),
            specific: null
        }
    },
    computed: {
        ...mapGetters({
            detail: 'cars/getDetail'
        })
    },
    methods: {
        nextOffer: function () {
            switch (this.compareKey) {
            case 1:
                let weekData = {
                    'areas': this.areas,
                    'tripMode': this.rideType,
                    'rideMode': this.rideTitle,
                    'days': this.specific
                };

                this.$router.push({name: 'postRide', params: { data: weekData }});
                break;
            case 2:
                let specificData = {
                    'areas': this.areas,
                    'tripMode': this.rideType,
                    'rideMode': this.rideTitle,
                    'days': this.specific
                };

                this.$router.push({name: 'postRide', params: { data: specificData }});
                break;
            case 3:
                if (this.validate()) {
                dialogs.message('You must correct or complete some fields to complete your ride.', { duration: 10, state: 'error' });
                return;
                }

                let data = {
                    'tripTime': {
                        'time': this.triptime,
                        'date': this.tripdate
                    },
                    'areas': this.areas,
                    'tripMode': this.rideType,
                    'rideMode': this.rideTitle
                };
                this.$router.push({name: 'postRide', params: {data}});
                break;
            default:
                break;
            }
        },
        validate: function () {
            let globalError = false;
            if (this.areas === null) {
                this.areaError.state = true;
                this.areaError.message = 'You must select the location of origin and destination.';
                globalError = true;
            }

            // validate by trip method
            if (this.tripdate === '') {
                if (Object.keys(this.triptime).length === 0) {
                    this.tripError.state = true;
                    this.tripError.message = 'You must select the Date and Time for the trip.';
                    globalError = true;
                } else {
                    this.tripError.state = true;
                    this.tripError.message = 'You must select the Date for the trip.';
                    globalError = true;
                }
            } else {
                if (Object.keys(this.triptime).length === 0) {
                    this.tripError.state = true;
                    this.tripError.message = 'You must select the Time for the trip.';
                    globalError = true;
                } else {
                    if (this.rideType === 'Round' && Object.keys(this.triptime).length === 1) {
                        Object.keys(this.triptime).forEach(value => {
                            if (value === 'firstTime') {
                                this.tripError.state = true;
                                this.tripError.message = 'You must select Return Trip field of the trip.';
                                globalError = true;
                            } else {
                                this.tripError.state = true;
                                this.tripError.message = 'You must select First Trip field of the trip.';
                                globalError = true;
                            }
                        });
                    }
                }
            }

            return globalError;
        },
        errorReverse: function () {
            this.areaError.state = false;
        },
        selectBtn: function (compareKey) {
            if (this.compareKey === compareKey) {
                this.visibleFlag = !this.visibleFlag;
            } else {
                this.visibleFlag = true;
            }
            this.compareKey = compareKey;
            switch (compareKey) {
                case 1:
                    this.rideTitle = 'Weekdays';
                    break;
                case 2:
                    this.rideTitle = 'Specific';
                    break;
                case 3:
                    this.rideTitle = 'Once';
                    break;
                default:
                    break;
            }
        },
        rideMethod: function () {
            this.rideTypeFlag = !this.rideTypeFlag;
            if (this.rideTypeFlag) {
                this.rideType = 'Round';
            } else {
                this.rideType = 'single';
            }
        },
        saveArea: function (areas) {
            this.areas = areas;
        },
        getData: function (data) {
            switch (this.compareKey) {
            case 1:
                let compareWeekDate = '';
                let weeklyData = [];
                let newWeekDate = {};
                if (this.rideTypeFlag) {
                    data.forEach(item => {
                        if (item.day !== compareWeekDate) {
                            compareWeekDate = item.day;
                            data.forEach(value => {
                                if (compareWeekDate === value.day) {
                                    newWeekDate['day'] = compareWeekDate;
                                    newWeekDate[value.type] = value.time;
                                }
                            });
                            weeklyData.push(newWeekDate);
                            newWeekDate = {};
                        }
                    });
                    this.specific = weeklyData;
                } else {
                    data.forEach(item => {
                        let newWeekDate = {};
                        newWeekDate['day'] = item.day;
                        newWeekDate[item.type] = item.time;

                        weeklyData.push(newWeekDate);
                    });
                    this.specific = weeklyData;
                }
                break;
            case 2:
                let compareDate = '';
                let specificData = [];
                let newDate = {};
                if (this.rideTypeFlag) {
                    data.forEach(item => {
                        if (item.day !== compareDate) {
                            compareDate = item.day;
                            data.forEach(value => {
                                if (compareDate === value.day) {
                                    newDate['day'] = compareDate;
                                    newDate[value.type] = value.time;
                                    newDate['realDay'] = item.realFormatDate;
                                }
                            });
                            specificData.push(newDate);
                            newDate = {};
                        }
                    });
                    this.specific = specificData;
                } else {
                    data.forEach(item => {
                        let newDate = {};
                        newDate['day'] = item.day;
                        newDate['realDay'] = item.realFormatDate;
                        newDate[item.type] = item.time;

                        specificData.push(newDate);
                    });
                    this.specific = specificData;
                }
                break;
            case 3:
                // initialize triptime by trip method
                if (this.sessionRideType !== this.rideType) {
                    this.triptime = {};
                }

                // save trip date and time
                if (data.title === 'date') {
                    this.tripdate = data.date;
                } else {
                    if (this.rideType === 'single') {
                        this.triptime['time'] = data.time;
                    } else {
                        this.triptime[data.type] = data.time;
                    }
                }

                this.sessionRideType = this.rideType;
                break;
            default:
                break;
            }
            this.tripError.state = false;
        }
    },
    components: {
        closeIcon,
        rightArrowIcon,
        scheduleBtn,
        Weekdays,
        Specific,
        Once,
        searchArea
    }
};
</script>