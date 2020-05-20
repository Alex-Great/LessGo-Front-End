<template>
    <div class="container">

    </div>
</template>
<style scoped>
    .container{
        background: white;
        /* border: solid black 1px; */
        margin:0;
        padding:0;
        width: 100%;
    }
</style>
<script>
import bubble from '../views/BubbleComponent';
export default {
    name: 'ProfileCard',
    data () {
        return {

        };
    },
    props: ['user'],
    components: {
        bubble
    }
};
</script>