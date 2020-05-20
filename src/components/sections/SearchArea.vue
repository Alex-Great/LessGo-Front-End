<template>
    <div class="searchArea-box">
        <div>
            <v-icon :icon="['fa', 'bullseye']" class="v-icon-search" />
            <gmap-autocomplete
                @place_changed="setFromtownPlace"
                placeholder="Leaving from"
                :value="from_address"
            ></gmap-autocomplete>
        </div>
        <div>
            <v-icon :icon="['fas', 'map-marker-alt']" class="v-icon-search" />
            <gmap-autocomplete
                @place_changed="setTotownPlace"
                placeholder="Going to"
                :value="to_address"
            ></gmap-autocomplete>    
        </div>
    </div>
</template>

<script>
// import components for this
import fromIcon from '../../icon/FromIcon';
import toIcon from '../../icon/ToIcon';

export default {
    name: 'searchArea',
    data () {
        return {
            from_address: '',
            to_address: '',
            from_town: null,
            to_town: null,
            distance: '',
            duration: '',
            co2: '',
            image_url: ''
        };
    },
    methods: {
        setFromtownPlace: function (place) {
            this.image_url = place.photos[0].getUrl();
            this.from_address = place.from_address;
            let data = {
                address: place.formatted_address,
                json_address: {},
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            let placedata = place.formatted_address.split(',');
            if (placedata.length > 2) {
                data.json_address.country = placedata[placedata.length - 1];
                data.json_address.province = placedata[1];
                data.json_address.Street = placedata[0];
                data.json_address.city = '';
                data.json_address.number = '';
            } else {
                data.json_address.country = placedata[1];
                data.json_address.province = placedata[0];
                data.json_address.Street = '';
                data.json_address.city = '';
                data.json_address.number = '';
            }
            this.from_town = data;
            this.$emit('error-reverse');

            // check points, calculate distance and co2
            if (this.from_town.length !== null && this.to_town.length !== null) {
                this.calFunc();
            }
        },
        setTotownPlace: function (place) {
            this.to_address = place.formatted_address;
            let data = {
                address: place.formatted_address,
                json_address: {},
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            let placedata = place.formatted_address.split(',');
            if (placedata.length > 2) {
                data.json_address.country = placedata[placedata.length - 1];
                data.json_address.province = placedata[1];
                data.json_address.Street = placedata[0];
                data.json_address.city = '';
                data.json_address.number = '';
            } else {
                data.json_address.country = placedata[1];
                data.json_address.province = placedata[0];
                data.json_address.Street = '';
                data.json_address.city = '';
                data.json_address.number = '';
            }
            this.to_town = data;
            this.$emit('error-reverse');

            // check points, calculate distance and co2
            if (this.from_town.length !== null && this.to_town.length !== null) {
                this.calFunc();
            }
        },
        calFunc: function () {
            let first = {
                lat: this.from_town.lat,
                lng: this.from_town.lng
            };
            let second = {
                lat: this.to_town.lat,
                lng: this.to_town.lng
            };
            // select this VueComponent
            let VueComp = this;
            let service = new window.google.maps.DirectionsService();
            let betpoints = [];
            service.route({
                origin: first,
                destination: second,
                travelMode: window.google.maps.TravelMode.DRIVING
            }, function (result, status) {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    for (let i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                        let points = {
                            lat: result.routes[0].overview_path[i].lat(),
                            lng: result.routes[0].overview_path[i].lng()
                        };
                        betpoints.push(points);
                    }
                    VueComp.distance = (result.routes[0].legs[0].distance.value / 1000).toFixed(2);

                    // claculate time
                    let duration = result.routes[0].legs[0].duration.value;
                    let h = Math.floor(duration / 3600);
                    let m = ((duration % 3600) / 60).toFixed();
                    // format set duration as style 00:00
                    if (h.toString().length < 2) {
                        if (m.toString().length < 2) {
                            VueComp.duration = '0' + h + ':0' + m;
                        } else {
                            VueComp.duration = '0' + h + ':' + m;
                        }
                    } else {
                        if (m.toString().length < 2) {
                            VueComp.duration = h + ':0' + m;
                        } else {
                            VueComp.duration = h + ':' + m;
                        }
                    }
                    VueComp.co2 = parseFloat(VueComp.distance * 0.15).toFixed(2);
                    VueComp.emit();
                }
            });
        },
        emit: function () {
            let areas = [
                this.from_town,
                this.to_town,
                this.distance,
                this.duration,
                this.co2,
                this.image_url
            ];
            this.$emit('save-data', areas);
        }
    },
    components: {
        fromIcon,
        toIcon
    }
};
</script>