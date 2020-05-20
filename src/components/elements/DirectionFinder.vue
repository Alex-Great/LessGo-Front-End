<template>
    <div class="direction">
        From: <input type="text" v-model="origin" />
        To: <input type="text" v-model="destination" />
        <iframe width="100%" height="500px" v-bind:src="src()"></iframe>
    </div>
</template>

<script>
export default {
    name: 'directionFinder',
    data () {
        return {
            origin: 'dubai',
            destination: 'ajman',
            url: 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyDoi0kDoetjxsvsctCrRb99I5lu1GJMj_8'
        };
    },
    methods: {
        src: function () {
            this.url += '&origin=' + this.origin + '&destination=' + this.destination;
            return this.url;
        }
    }
};
</script>