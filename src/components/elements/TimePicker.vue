<template>
    <div class="time-selector-part" :style="{'width': width + '%'}">
        <v-icon :icon="['fa','clock']" class="v-icon-clock" />
        <timeselector @input="changeTime" v-model="time" :class="'time-selector'" returnFormat="HH" :placeholder="placeholder"></timeselector>
    </div>
</template>

<script>
import Timeselector from 'vue-timeselector';
// import moment from 'moment';

// import components for this
import timeClockIcon from '../../icon/TimeClockIcon';

export default {
    name: 'timePicker',
    props: {
        placeholder: {
            type: String,
            required: false,
            default: 'When ?'
        },
        width: {
            type: Number,
            required: false,
            default: 50
        },
        type: {
            type: String,
            required: false,
            default: 'singleTime'
        },
        timeFlag: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    components: {
        Timeselector,
        timeClockIcon
    },
    data () {
        return {
            time: null
        };
    },
    methods: {
        changeTime: function (time) {
            if (this.time !== null && this.time !== '') {
                let data = {
                    type: this.type,
                    time: this.time
                };
                this.$emit('time-change', data);
            }
        }
    },
    watch: {
        timeFlag: function () {
            let newDate = new Date();
            newDate.setHours(0);
            newDate.setMinutes(0);
            newDate.setSeconds(0);
            this.time = newDate;
        }
    }
};
</script>