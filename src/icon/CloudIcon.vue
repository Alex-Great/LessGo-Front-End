<template>
    <svg :width="size" id="Layer_1" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path :style="{'fill': color}" d="m121.5 78.73a25.082 25.082 0 0 1 -25.08 25.08h-64.84a25.081 25.081 0 0 1 -2.56-50.03c-.02-.28-.02-.56-.02-.84a28.753 28.753 0 0 1 54.63-12.53 18.22 18.22 0 0 1 2.87-.22 18.762 18.762 0 0 1 18.36 14.92 25.078 25.078 0 0 1 16.64 23.62z" fill="#4e8ed5"/></svg>
</template>

<script>
export default {
    name: 'cloudIcon',
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