<template>
    <svg :width="size" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8.736"><defs></defs><path :style="{ 'fill': color }" class="a" d="M10.286,8.736H9.428a.858.858,0,0,1-.857-.857V7.451H3.429v.429a.858.858,0,0,1-.857.857H1.714a.858.858,0,0,1-.857-.857V4.022H.429A.429.429,0,0,1,0,3.594V3.165a.429.429,0,0,1,.429-.429h.8L2.415,0H9.425l1.308,2.736h.838A.429.429,0,0,1,12,3.165v.429a.429.429,0,0,1-.429.429h-.429V7.879A.858.858,0,0,1,10.286,8.736Zm-1.5-3.857a.643.643,0,1,0,0,1.286h.857a.643.643,0,1,0,0-1.286Zm-6.429,0a.643.643,0,1,0,0,1.286h.857a.643.643,0,1,0,0-1.286ZM3.25.662,2.31,2.931H9.69L8.605.662H3.25Z"/></svg>
</template>
<style scoped>
.a{
    opacity:0.997;}
</style>
<script>
export default {
    name: 'carIcon',
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