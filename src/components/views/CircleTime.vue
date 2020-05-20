<template>
    <svg class="progress-ring" viewBox="-50,-50,100,100">
        <circle class="progress-ring-circle" r="46"/>
        <circle class="circle-start" cx="0" cy="-46" r="3"/>
        <path class="progress-ring-ring" :d="path"/>
        <circle class="progress-ring-end" :cx="endX" :cy="endY" r="7" filter="url(#dropshadow)" />
        <text
            :x="endX"
            :y="endY"
            fill="white"
            font-size="6px"
            alignment-baseline="middle"
            text-anchor="middle"
            font-weight="bold"
        >{{ this.distance }}</text>
        
        <!-- title -->
        <text
            x="0"
            y="0"
            fill="#848484"
            text-anchor="middle"
            class="goCoins"
        >
            Total GoCoins
        </text>
        <text
            x="0"
            y="18"
            font-size="7px"
            text-anchor="middle"
        >
            <tspan class="left-distance">{{ this.left }}</tspan>
            <tspan class="text-km">km left</tspan>
        </text>
        <defs>
        <filter id="dropshadow" x="-60%" y="-60%" width="300%" height="300%" filterUnits="userSpaceOnUse">
            <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="3"/> <!-- stdDeviation is how much to blur -->
            <feOffset dx="5" dy="5" result="offsetblur"/> 
            <feOffset dx="-5" dy="-5" result="offsetblur"/>
            <feMerge> 
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
  </defs>
    </svg>
</template>

<script>
export default {
    name: 'circleTime',
    props: {
        value: {
            type: Number,
            default: 0
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 1
        },
        text: {
            type: null,
            default: ''
        },
        distance: {
            type: Number,
            default: 0
        },
        left: {
            type: Number,
            default: 0
        },
        coin: {
            type: Number,
            default: 0
        }
    },
    computed: {
        theta: function () {
            const frac = (this.value - this.min) / (this.max - this.min) || 0;
            return frac * 2 * Math.PI;
        },
        path: function () {
            const large = this.theta > Math.PI;
            return `M0,-46 A46,46,0,${large ? 1 : 0},1,${this.endX},${this.endY}`;
        },
        endX: function () {
            return Math.cos(this.theta - Math.PI * 0.5) * 46;
        },
        endY: function () {
            return Math.sin(this.theta - Math.PI * 0.5) * 46;
        }
    }
};
</script>

<style>
.circle-start {
    fill: #71dea0;
}
.progress-ring {
    width: 250px;
    height: 250px;
    overflow: overlay !important;
}

.progress-ring-circle {
    stroke: rgba(0, 0, 0, 0.1);
    stroke-width: 6;
    fill: none;
}

.progress-ring-ring {
    stroke: #71dea0;
    stroke-width: 6;
    fill: none;
}

.progress-ring-end {
    fill: #63ca8f;
    position: relative;
}
</style>