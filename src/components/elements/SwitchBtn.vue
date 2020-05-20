<template>
    <div @click="toggleBtn" class="switch-btn" :style="(reverseFlag)?'background: #ABE5C4': ''">
        <!-- move btn -->
        <div :class="(reverseFlag)?'move-btn position-right': 'move-btn position-left'">
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'switchBtn',
    data () {
        return {
            reverseFlag: false
        };
    },
    methods: {
        toggleBtn: function () {
            if (!this.postFlag) {
                this.reverseFlag = !this.reverseFlag;
                this.$emit('toggle', this.reverseFlag);
            }
        }
    }
};
</script>