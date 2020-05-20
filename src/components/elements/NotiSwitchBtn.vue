<template>
    <div @click="toggleBtn" class="notiswitch-btn" :style="reverseFlag?'background: #7de794; border-color: #7de794': ''">
        <!-- move btn -->
        <div :class="reverseFlag?'move-btn position-right': 'move-btn position-left'">
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'notiSwitchIcon',
    props: {
        title: {
            type: String,
            required: false,
            default: ''
        }
    },
    data () {
        return {
            reverseFlag: false
        };
    },
    methods: {
        toggleBtn: function () {
            this.reverseFlag = !this.reverseFlag;
            let data = {
                compareKey: this.title,
                flagStatus: this.reverseFlag
            };
            this.$emit('toggle', data);
        }
    }
};
</script>