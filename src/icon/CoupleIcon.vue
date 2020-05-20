<template>
    <svg :width="size" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"><path :style="{'fill': color}" d="m64 144h-8-8v8h-16v16h16v24h16v-24h16v-16h-16z"/><path :style="{'fill': color}" d="m58.745 133.256a64.07 64.07 0 0 1 -4.729-5.306 40.061 40.061 0 1 1 31.959-13.506 31.694 31.694 0 0 0 15.992 5.485 55.843 55.843 0 1 0 -31.96 22.3 64.335 64.335 0 0 1 -11.262-8.973z"/><path :style="{'fill': color}" d="m175.352 44.314 15.689-3.138-5.657-28.284a8 8 0 0 0 -6.276-6.276l-28.284-5.657-3.138 15.689 13.626 2.726-23.783 23.783a56.116 56.116 0 0 0 -47.544-9.35 64.487 64.487 0 0 1 15.959 14.24 40.017 40.017 0 1 1 -31.944 13.51 31.792 31.792 0 0 0 -15.991-5.487 55.995 55.995 0 1 0 90.836-1.6l23.781-23.781z"/></svg>
</template>

<script>
export default {
    name: 'coupleIcon',
    props: {
        size: {
            type: Number,
            required: false,
            default: 10
        },
        color: {
            type: String,
            required: false,
            default: 'grey'
        }
    }
};
</script>