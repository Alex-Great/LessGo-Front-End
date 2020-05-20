<template>
    <div @click="selectMethod(compareKey)" :class="(reverseBk && selected)?'changedBtn': 'scheduleBtn'">
        <span :style="(reverseBk && selected)?'color: #63b7a4': 'color: #a8adac'" v-if="compareKey === 1 || compareKey === 2">REPEAT ON</span>
        <h2>{{ title }}</h2>
    </div>
</template>

<script>
export default {
    name: 'scheduleBtn',
    data () {
        return {
            reverseBk: false
        };
    },
    props: {
        title: {
            type: String,
            required: false,
            default: 'schedule'
        },
        compareKey: {
            type: Number,
            required: false,
            default: 2
        },
        selected: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    methods: {
        selectMethod: function (compareKey) {
            if (this.selected) {
                this.reverseBk = !this.reverseBk;
            }
            this.$emit('selectBtn', compareKey);
        }
    },
    watch: {
        selected: function () {
            if (this.selected) {
                this.reverseBk = !this.reverseBk;
            } else {
                this.reverseBk = false;
            }
        }
    }
};
</script>