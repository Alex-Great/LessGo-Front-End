<template>
    <div>
        <div>
            <h2>Search and add a pin</h2>
            <div class="point-search">
                <!-- From town -->
                <div>
                    <label>From:</label>
                    <gmap-autocomplete
                        @place_changed="setFromtownPlace"
                    ></gmap-autocomplete>
                </div>
                <!-- To town -->
                <div>
                    <label>To:</label>
                    <gmap-autocomplete
                        @place_changed="setTotownPlace"
                    ></gmap-autocomplete>
                </div>
                <!-- measure distance of two points -->
                <button type="button" @click="calDistance">Measure</button>
                <div>
                    <div>
                        <label>Direct Distance:</label>
                        <span v-if="distance !== ''">{{ distance }} km</span>
                    </div>
                    <div>
                        <label>Driving Distance:</label>
                        <span>{{ dirive_distance }}</span>    
                    </div>
                    <div>
                        <label>Driving Duration:</label>
                        <span>{{ duration }}</span>    
                    </div>
                    <div>
                        <label>co2 amount:</label>
                        <span v-if="co2 !== ''">{{ co2 }} kg</span>
                    </div>
                </div>
                <button @click="drawRoute">Draw</button>
            </div>
        </div>
        <div id="mapRef">
            
        </div>
        <input type="text" v-model="text" name="" id="area" />
        <VueSlickCarousel :arrows="true" :dots="true">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
        </VueSlickCarousel>
        <gmap-map
            :center="center"
            :zoom="12"
            style="width: 100%; height: 400px;"
        >
            <GmapMarker v-if="from_town" :position="from_town.latlng" label="From Town" />
            <GmapMarker v-if="to_town" :position="to_town.latlng" label="To Town" />
            <gmap-polyline v-bind:path.sync="path" v-bind:options="{ strokeColor:'#008000'}">
            </gmap-polyline>
        </gmap-map>
    </div>
</template>


<script>
// import components for this
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';

let rad = function (x) {
    return x * Math.PI / 180;
};

export default {
    name: 'googleMap',
    data () {
        return {
            center: { lat: 31.953940000000003, lng: 35.910630000000005 },
            markers: [],
            places: [],
            currentPlace: null,
            from_town: null,
            to_town: null,
            distance: '',
            path: [],
            dirive_distance: '',
            duration: '',
            co2: '',
            text: ''
        };
    },
    components: {
        VueSlickCarousel
    },
    methods: {
        setPlace: function (place) {
            console.log('setPlace', place.geometry.location.lat());
            console.log('setPlace', place.geometry.location.lng());
            this.currentPlace = place;
        },
        addMarker: function () {
            if (this.currentPlace) {
                const marker = {
                    lat: this.currentPlace.geometry.location.lat(),
                    lng: this.currentPlace.geometry.location.lng()
                };

                this.markers.push({ position: marker });
                this.places.push(this.currentPlace);
                this.center = marker;
                this.currentPlace = null;
            }
        },
        geolocate: function () {
            navigator.geolocation.getCurrentPosition(position => {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log('geolocate', this.center);
            });
        },
        showFromTown: function (town) {
            this.center = town;
        },
        setFromtownPlace: function (place) {
            place.photos.forEach(photo => {
                console.log('place', photo.getUrl());
            });
            console.log(place.vicinity);
            let data = {
                latlng: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                },
                address: place.formatted_address,
                title: 'from_town'
            };
            this.from_town = data;
            this.markers.push(data.latlng);
            // this.path.push(data.latlng);
            this.showFromTown(data.latlng);
        },
        setTotownPlace: function (place) {
            let data = {
                latlng: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                },
                address: place.formatted_address,
                title: 'to_town'
            };
            this.to_town = data;
            this.markers.push(data.latlng);
            // this.path.push(data.latlng);
        },
        calDistance: function () {
            let R = 6378137;
            let first = this.from_town;
            let second = this.to_town;
            let dLat = rad(second.latlng.lat - first.latlng.lat);
            let dLong = rad(second.latlng.lng - first.latlng.lng);
            let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(first.latlng.lat)) * Math.cos(rad(second.latlng.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            let d = R * c;
            console.log('distance', d);
            this.distance = (d / 1000).toFixed(2);
        },
        drawRoute: function () {
            console.log('from_town', this.from_town);
            console.log('to_town', this.to_town);
            // select this VueComponent
            let VueComp = this;
            let service = new window.google.maps.DirectionsService();
            let betpoints = [];
            service.route({
                origin: this.from_town.latlng,
                destination: this.to_town.latlng,
                travelMode: window.google.maps.TravelMode.DRIVING
            }, function (result, status) {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    console.log('result', result);
                    for (let i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                        let points = {
                            lat: result.routes[0].overview_path[i].lat(),
                            lng: result.routes[0].overview_path[i].lng()
                        };
                        betpoints.push(points);
                    }
                    VueComp.path = betpoints;
                    VueComp.dirive_distance = result.routes[0].legs[0].distance.text;
                    VueComp.duration = result.routes[0].legs[0].duration.text;
                    VueComp.co2 = parseFloat(parseInt(VueComp.dirive_distance) * 0.15).toFixed(2);
                }
            });
        }
    },
    watch: {
        text: function () {
            console.log('text');
            var input = document.getElementById('area');
            var ac = new window.google.maps.places.Autocomplete(input);
            console.log('ac', ac);
        }
    }
};
</script>

<style>
.point-search {
    width: 80%;
    padding: 20px;
    margin: auto;
    background: grey;
    margin-bottom: 20px;
    margin-top: 20px;
    border-radius: 25px;
}
.point-search div {
    margin-bottom: 20px;
}
.point-search> :last-child {
    margin-bottom: 0;
}
.point-search label {
    font-family: Avenir;
    color: white;
}
.point-search input {
    border: none;
    color: white;
    font-size: 15px;
}
.point-search input::placeholder {
    color: #ffff00;
}
.point-search button {
    border-radius: 10px;
    border: none;
    padding: 10px;
    background: white;
    font-size: 16px;
    margin-bottom: 10px;
}
.point-search span {
    background: grey;
    color: white;
}
</style>