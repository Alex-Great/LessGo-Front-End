<template>
    <div class="date-picker">
        <div v-if="browser" class="form-control picker" :class="focus ? 'input-border' : ''" :style="!calendarFlag?'padding: 0px; border-bottom-color: transparent !important;': ''">
            <DatepickerSystem
                :clear-button="clearFlag"
                :clear-button-icon="'fa fa-times'"
                :calendar-button="calendarFlag"
                :calendar-button-icon="'fa fa-calendar'"
                :value="dateBrowser"
                :language="'en'"
                v-on:opened="focus = true"
                v-on:closed="focus = false"
                v-on:selected="changeValue"
                :placeholder="'When?'"
                :format="format"
                :disabled="{
                    to: min,
                    from: max
                }"
                :disabled-picker = "disabledPicker"
                autocomplete="off"
                cursor="pointer"
                :class="!calendarFlag?'default-date-picker': ''"
                >
            </DatepickerSystem>
        </div>
        <div v-if="!browser" class="form-control form-control-with-icon form-control-date">
            <input
                @focus="openNativeDatePicker"
                @blur="focus = false"
                :value = "niceDate"
                @change="changeMobileValue"
                type="text"
                id="datepicker-mobile"
                :min="min| moment('YYYY-MM-DD')"
                :max="max| moment('YYYY-MM-DD')"
                autocomplete="off"
                :placeholder="'When?'"
            />
        </div>
    </div>
</template>

<script>
import DatepickerSystem from 'vuejs-datepicker';
import { mapGetters } from 'vuex';
import moment from 'moment';
import bus from '../services/bus-event';
/*

*/
export default {
    name: 'datePicker',
    data () {
        return {
            dateBrowser: '',
            dateMobile: '',
            date: '',
            update: true,
            focus: false,
            nextYear: moment().add(2, 'years').format('YYYY-MM-DD'),
            lastCentury: moment().subtract(100, 'years').format('YYYY-MM-DD'),
            niceDate: ''
        };
    },
    mounted () {
        if (this.value !== '') {
            console.log('value', this.value);
            this.dateBrowser = moment(this.value).toDate();
            this.dateMobile = this.value;
            this.niceDate = moment(this.value).format('DD/MM/YYYY');
            console.log('dateBrowser', this.dateBrowser);
        }
    },

    updated () {
        if (this.value !== '') {
            this.niceDate = moment(this.value).format('DD/MM/YYYY');
        }
    },
    methods: {
        clear () {
            this.dateBrowser = '';
            this.dateMobile = '';
            this.niceDate = '';
        },
        changeValue (value) {
            this.dateBrowser = value;
            this.$emit('onChange', this.dateBrowser);
        },
        changeMobileValue (el) {
            this.dateMobile = el.target.value;
        },
        openNativeDatePicker (event) {
            event.target.blur();
            var context = this;
            this.focus = true;
            let date = new Date();
            if (context.dateMobile) {
                date = moment(context.dateMobile).toDate();
            }
            var options = {
                date: date,
                mode: 'date',
                minDate: Date.parse(moment(this.min).toDate()),
                maxDate: Date.parse(moment(this.max).toDate()),
                androidTheme: 3
            };

            function onSuccess (date) {
                context.dateMobile = moment(date).format('YYYY-MM-DD');
                context.niceDate = moment(date).format('DD/MM/YYYY');
            }

            function onError (/* error */) { // Android only
                // window.alert('Error: ' + error);
            }

            window.datePicker.show(options, onSuccess, onError);
        }

    },
    watch: {
        dateBrowser: function (value) {
            value = value && value !== '' ? moment(value).format('YYYY-MM-DD') : '';
            bus.emit('date-change', value);

            this.$emit('date_changed', value);
        },
        dateMobile: function (value) {
            value = value && value !== '' ? value : '';

            bus.emit('date-change', value);

            this.$emit('date_changed', value);
        },
        value: function (value) {
            console.log('value', value);
            this.dateBrowser = moment(this.value).toDate();
            this.dateMobile = this.value;
            this.niceDate = moment(this.value).format('DD/MM/YYYY');
        }
    },
    props: {
        'format': {
            type: String,
            required: false,
            default: 'MM/dd/yyyy'
        },
        'value': {
            type: String,
            required: false
        },
        'minDate': {
            type: Date,
            required: false
        },
        'maxDate': {
            type: Date,
            required: false
        },
        'disabledPicker': {
            type: Boolean,
            required: false,
            default: false
        },
        'calendarFlag': {
            type: Boolean,
            required: false,
            default: true
        },
        'clearFlag': {
            type: Boolean,
            required: false,
            default: true
        }
    },
    computed: {
        ...mapGetters({
            isMobile: 'device/isMobile',
            device: 'cordova/device'
        }),
        browser () {
            if (this.device) {
                if (this.device.platform === 'browser') {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
        max () {
            let answer;
            if (this.maxDate) {
                answer = this.maxDate;
            } else {
                answer = this.nextYear;
            }
            if (this.browser) {
                return moment(answer).toDate();
            } else {
                return moment(answer).format('YYYY-MM-DD');
            }
        },
        min () {
            let answer;
            if (this.minDate) {
                answer = this.minDate;
            } else {
                answer = this.lastCentury;
            }
            if (this.browser) {
                let date = moment(answer).toDate();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                return date;
            } else {
                return moment(answer).format('YYYY-MM-DD');
            }
        }
    },
    components: {
        DatepickerSystem
    }
};
</script>

<style>
    .vdp-datepicker i {
        font-size: 16px;
        color: #abe5c4;
    }
    .vdp-datepicker i.fa-times {
        font-size: 14.4px;
    }

    .vdp-datepicker__calendar-button {
        width: 18px;
    }
    .vdp-datepicker input,
    .user-form .vdp-datepicker input[type='text'] {
        width: 80%;
        height: 34px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        border: 0px solid transparent !important;
        border-radius: 4px;
        transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    }

    .user-form .vdp-datepicker input[type='text'] {
        padding-left: 2.4em;
        width: 86%;
        height: 34px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        border: 0px solid transparent !important;
        border-radius: 4px;
        transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    }

    .date-picker--cross {
        position: absolute;
    }
    .date-picker--cross i {
        cursor: pointer;
    }
    .date-picker {
        width: 100%;
        height: 30px;
        cursor: pointer;
        border: none;
        display: contents;
        vertical-align: middle;
    }
    .form-control {
        position: flex;
        vertical-align: middle;
        cursor: pointer;
        background: white;
    }
    .picker.form-control {
        padding: .1em 1.2em;
        background: white !important;
        border-bottom: 3px solid #f0f8f6 !important;
        border: none;
        box-shadow: none;
    }
    .vdp-datepicker__calendar .selected {
        float: none !important;
        margin-right: unset !important;
        border-radius: unset !important;
    }
    .vdp-datepicker__calendar-button, .vdp-datepicker__clear-button {
        color: #abe5c4 !important;
    }
    @media only screen and (min-width: 992px) {
        .search-section .picker.form-control {
            padding: .8em .6em;
        }
    }
    .input-border.form-control {
        border-color: #66afe9;
        outline: 0;
    }
    @media only screen and (max-width: 991px) {
        .vdp-datepicker .vdp-datepicker__calendar {
            box-shadow: 2px 2px 11px;
            z-index: 100;
            padding: 5em 1em;
            position: fixed;
            height: 80%;
            width: 80%;
            top: 0px;
            left: 0px;
            margin: 10%;
        }
    }

input#datepicker-mobile {
    position: relative;
    padding-left: 2.4em;
    width: 90%;
    height: 34px;
    padding: 6% 7%;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    border: 0px solid transparent !important;
    border-radius: 4px;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
}
</style>
