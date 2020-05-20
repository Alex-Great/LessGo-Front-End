<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" viewBox="0 0 20.581 16.163"><defs></defs><path :style="{'fill': color}" d="M-20.711-31.837H-4.548a2.2,2.2,0,0,0,2.209-2.209v-9.24a2.2,2.2,0,0,0-2.209-2.209H-7.269l-1.845-1.872A2.283,2.283,0,0,0-10.677-48h-3.839a2.256,2.256,0,0,0-1.468.552l-1.953,1.953h-2.775a2.2,2.2,0,0,0-2.209,2.209v9.24A2.2,2.2,0,0,0-20.711-31.837Zm8.081-2.411a5,5,0,0,1-5-5,5,5,0,0,1,5-5,5,5,0,0,1,5,5A5,5,0,0,1-12.63-34.248Zm0-1.347a3.662,3.662,0,0,0,3.65-3.65,3.662,3.662,0,0,0-3.65-3.65,3.662,3.662,0,0,0-3.65,3.65A3.662,3.662,0,0,0-12.63-35.6Z" transform="translate(22.92 48)"/></svg>
</template>

<script>
export default {
    name: 'cameraIcon',
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