<template>
    <div class="bubblecontainer">
        <div id="bubble" v-bind:style="{ 'background-image': 'url(' + image + ')'}">
        </div>
        <p style="color: black;text-align:center;padding:0;margin:0;margin-top:7px">{{title}}</p>
    </div>
</template>
<style scoped>
    .bubblecontainer {
        /* border: solid black 1px; */
        margin-top: 10px;
        width: 26%;  
        height: 140px;
        display: flex;
        flex-direction: column;
        align-items: center;  
    }
    #bubble {
        background-size: cover;
        height: 60px;
        width: 60px;
        border: solid 1px rgba(0,0,0,0.2);
        border-radius: 30px;
    }
</style>
<script>
export default{
    name: 'bubble',
    props: ['title', 'image']
};
</script>