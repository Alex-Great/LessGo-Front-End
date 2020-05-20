<template>
    <div class="container">
        <l-map class="mapStyle" :zoom="zoom" :options="{ zoomControl: false}" :center="center" style="width: 100%; height: 86%;z-index:0;" ref="map">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        </l-map>
    </div>
</template>
<style scoped>
    .mapStyle{
        height: 100%;
    }
    .container{
        height: 87vh;
        margin:0;
        padding:0;
    }
     /* galaxy s5 */
    @media screen and (min-height: 640px) and (max-height: 641px){
        .container{
            height: 83vh;
        }
    }
     /* pixel 2 */
    @media screen and (min-height: 731px) and (max-height: 732px){
        .container{
            height: 85vh;
        }
    }
</style>
<script>
import { LMap, LTileLayer } from 'vue2-leaflet';
import router from '../../router';
import Vue from 'vue';
import VueRouter from 'vue-router';
 export default {
    name: 'Map',
    data () {
        return {
            center: {lat: -29.0, lng: -60.0},
            zoom: 4,
            points: [
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null
                },
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null
                }
            ],
            url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }
    },
    components: {
        LMap,
        LTileLayer
    },
    mounted () {
        this.loadTrip();
    },
    loadTrip () {
            this.getTrip(this.id).then(trip => {
                // this.trip = trip;
                this.points = trip.points;
                var self = this;
                setTimeout(() => { self.renderMap(); }, 500);
                if (this.owner) {
                    this.searchMatchers({ trip: this.trip }).then(users => {
                        console.log('matching', users);
                        this.matchingUsers = users;
                        if (users && users.length) {
                            this.selectedMatchingUser = users.map(u => u.id);
                            // console.log('selectedMatchingUser', users);
                        }
                    });
                }
            }).catch(error => {
                if (error) {
                    router.replace({name: 'trips'});
                    // Ver que hacer
                    // this.trip = null;
                }
            });
        }
}
</script>
