<template>
    <div class="search-section">
        <div class="searchcontainer">
            <div class="contentcontainer">

                <div class="imageholder">
                    <SearchForTrip></SearchForTrip>
                </div>

                <p id="hello" >Hello! Where are you headed?</p>

                <div class="textboxscontainer">
                    <div class="from fromtocommon">
                        <div style="height:100%;width:10%;display:flex;justify-content:center;align-items:center;">
                        <i id="field-icon" class="far fa-circle"></i>
                        </div>

                        <OsmAutocomplete placeholder="City, Station or Airport" :value="from_town.name"
                        v-on:place_changed="(data) => getPlace(0, data)"
                        :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                        :country="allowForeignPoints ? null : 'JO'"
                        ref="from_town"
                        type="text" class="fromtocommon"
                        style="background-color:#F0F4F3;width: 93%;
                        color:#5B5B5B;border:none;
                        font-family: 'Poppins', sans-serif;
                        font-weight: bold;
                        ">

                        </OsmAutocomplete>

                    </div>

                    <div class="swap btn">
                        <img alt="swap" class='swap-vertical' :src="swap_vertical" @click="swapCities" />
                    </div>

                    <div class="to fromtocommon">
                        <div style="height:100%;width:10%;display:flex;justify-content:center;align-items:center;">
                        <i id="field-icon" class="fas fa-map-marker-alt"></i>
                        </div>
                         <OsmAutocomplete
                         :placeholder="'City, Station or Airport'"
                         name="to_town" ref="to_town"
                         :value="to_town.name" v-on:place_changed="(data) => getPlace(1, data)"
                         :classes="'form-control form-control-with-icon form-control-map-autocomplete'"
                         :country="allowForeignPoints ? null : 'JO'"
                         type="text"
                         class="fromtocommon"

                         style="background-color:#F0F4F3;width: 93%;
                        color:#5B5B5B;border:none;
                        font-family: 'Poppins', sans-serif;
                        font-weight: bold;
                        ">
                        </OsmAutocomplete>
                    </div>

                       <DatePicker ref="datepicker" :value="date" :minDate="minDate" :class="{'has-error': dateError.state}"></DatePicker>

                </div>

                <!-- <div class="optional-warning text-center">(optional)</div> -->
                <div class="buttongroup">
                        <div
                        class="searchfortrips"
                        v-on:click="isPassenger=false"
                        @click="emit"
                        id="commonbuttongroup">
                            <p style="color:white;"> Search For Trips</p>
                        </div>
                        <!-- <div
                        class="lookingforpassenger"
                        v-on:click="isPassenger=true"
                        @click="emit"
                        id="commonbuttongroup">
                            <p> Looking For Passengers</p>
                        </div> -->
                </div>
                <div class="actionbar actionbar-bottom visible-xs" v-if="footerShow"  style='height:65px;'>
                    <div class="actionbar_item" v-for="item in footerButtons" :class="{ active: item.active }" @click="onClick(item)">
                        <span :class="{ big: item.id === 'new-trip', 'width-badges': item.id === 'notifications' }" class="footerItem">
                            <span style="align-content:center;">
                                <svgItem size="25" :icon="item.icon "></svgItem>
                                <label v-text="item.id" style="font-size:13px;display:unset;vertical-align:top;font-style:'Poppins'"></label>
                            </span>
                                <span class="badge" v-if="notificationsCount > 0 && item.id === 'notifications'">{{notificationsCount}}</span>
                         </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import svgItem from '../SvgItem';
// import {mapGetters} from 'vuex';
import {pointDistance} from '../../services/maps.js';
import DatePicker from '../DatePicker';
import OsmAutocomplete from '../OsmAutocomplete';
import bus from '../../services/bus-event.js';
import moment from 'moment';
import dialogs from '../../services/dialogs.js';
import SearchForTrip from '../searchForTrip';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

export default {
    name: 'search-trip',
    data () {
        return {
            minDate: moment().toDate(),
            isPassenger: false,
            from_town: {
                name: '',
                location: null,
                radio: 0,
                country: 'JO'
            },
            to_town: {
                name: '',
                location: null,
                radio: 0,
                country: 'JO'
            },
            date: '',
            dateAnswer: '',
            dateError: {
                message: '',
                state: ''
            },
            chofer_logo_blanco: process.env.ROUTE_BASE + 'static/img/icono-conductor-blanco.png',
            pasajero_logo_blanco: process.env.ROUTE_BASE + 'static/img/icono-pasajero-blanco.png',
            chofer_logo_gris: process.env.ROUTE_BASE + 'static/img/icono-conductor-gris.png',
            pasajero_logo_gris: process.env.ROUTE_BASE + 'static/img/icono-pasajero-gris.png',
            swap_horizontal: process.env.ROUTE_BASE + 'static/img/swap.svg',
            swap_vertical: process.env.ROUTE_BASE + 'static/img/swap.svg',
            circle: process.env.ROUTE_BASE + 'static/svg/from.svg',
            allowForeignPoints: false,
            options: []
        };
    },
    computed: {
        ...mapGetters({
            footerButtons: 'actionbars/footerButtons',
            footerShow: 'actionbars/footerShow',
            notificationsCount: 'notifications/count',
            isMobile: 'device/isMobile'
        })
    },
    mounted () {
        bus.on('date-change', this.dateChange);
        this.loadParams(this.params);
        this.$refs['from_town'].$el.addEventListener('input', this.checkInput);
        this.$refs['to_town'].$el.addEventListener('input', this.checkInput);
    },
    updated () {
    },
    beforeDestroy () {
        this.$refs['from_town'].$el.removeEventListener('input', this.checkInput);
        this.$refs['to_town'].$el.removeEventListener('input', this.checkInput);
        bus.off('date-change', this.dateChange);
    },
    methods: {
         ...mapActions({
            onClick: 'actionbars/footerButtonClick'
        }),
        dateChange (value) {
            this.dateAnswer = value;
        },
        checkInput (event) {
            let value = event.target.value;
            let name = event.target.name;
            if (value === '') {
                this[name] = '';
            }
        },
        getPlace (i, data) {
            /*
                {
                    place_id: "221733657",
                    licence: "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
                    osm_type: "relation",
                    osm_id: "1224652",
                    boundingbox: [
                        "-34.705637",
                        "-34.5265535",
                        "-58.5314588",
                        "-58.3351249"
                    ],
                    lat: "-34.6075616",
                    lon: "-58.437076",
                    display_name: "Buenos Aires, city Autónoma de Buenos Aires, Jordan",
                    class: "place",
                    type: "city",
                    importance: 0.76879583938391,
                    icon: "https://nominatim.openstreetmap.org/images/mapicons/poi_place_city.p.20.png",
                    address: {
                        city: "Buenos Aires",
                        state: "city Autónoma de Buenos Aires",
                        country: "Jordan",
                        country_code: "JO"
                    }
                }
            */
            let obj = {};
            if (data && data.boundingbox) {
                // var viewport = JSON.parse((JSON.stringify(data.geometry.viewport)));
                let distance = pointDistance(parseFloat(data.boundingbox[1]), parseFloat(data.boundingbox[3]), parseFloat(data.boundingbox[0]), parseFloat(data.boundingbox[2]));
                obj = {
                    name: data.display_name,
                    location: {
                        lat: parseFloat(data.lat),
                        lng: parseFloat(data.lon)
                    },
                    radio: distance,
                    country: data.address.country_code
                };
            }
            if (data && data.address_components) {
                for (let j = 0; j < data.address_components.length; j++) {
                    let addrComp = data.address_components[j];
                    if (addrComp.types.indexOf('country') >= 0) {
                        obj.country = addrComp.short_name;
                    }
                }
            }
            if (i === 0) {
                this.from_town = obj;
            } else {
                this.to_town = obj;
            }
        },
        emit () {
            let params = {};
            let foreignCountry = 0;
            if (this.from_town.location) {
                params.origin_lat = this.from_town.location.lat;
                params.origin_lng = this.from_town.location.lng;
                params.origin_radio = this.from_town.radio;
                params.origin_name = this.from_town.name;
            } else {
                params.origin_name = this.$refs['from_town'].input;
            }
            if (this.from_town && this.from_town.country && this.from_town.country.toLowerCase() !== 'JO'.toLowerCase()) {
                foreignCountry++;
            }
            if (this.to_town.location) {
                params.destination_lat = this.to_town.location.lat;
                params.destination_lng = this.to_town.location.lng;
                params.destination_radio = this.to_town.radio;
                params.destination_name = this.to_town.name;
            } else {
                params.destination_name = this.$refs['to_town'].input;
            }
            if (this.to_town && this.to_town.country && this.to_town.country.toLowerCase() !== 'JO'.toLowerCase()) {
                foreignCountry++;
            }
            if (this.dateAnswer) {
                params.date = this.dateAnswer;
            }
            params.is_passenger = this.isPassenger;
            console.log('search', params);
            if (foreignCountry < 2) {
                // console.log('trip-search', params);
                this.$emit('trip-search', params);
            } else {
                dialogs.message('Origin and destiny can not be both from the outside.', { duration: 10, estado: 'error' });
            }
        },
        resetInput (input) {
            if (this.$refs[input]) {
                this.$refs[input].input = '';
            }
            this[input] = {
                name: '',
                location: null,
                radio: 0,
                country: 'JO'
            };
        },
        swapCities () {
            let temp;
            temp = this['to_town'];
            this['to_town'] = Object.assign({}, this['from_town']);
            this['from_town'] = Object.assign({}, temp);
        },
        clear () {
            this.resetInput('from_town');
            this.resetInput('to_town');
            this.$refs.datepicker.clear();
        },
        loadParams (parameters) {
            console.log('loadParams', parameters);
            if (parameters) {
                if (parameters.origin_name) {
                    this.from_town.name = parameters.origin_name;
                    this.from_town.location = {
                        lat: parameters.origin_lat,
                        lng: parameters.origin_lng
                    };
                    this.from_town.radio = parameters.origin_radio;
                } else {
                    this.resetInput('from_town');
                }
                if (parameters.destination_name) {
                    this.to_town.name = parameters.destination_name;
                    this.to_town.location = {
                        lat: parameters.destination_lat,
                        lng: parameters.destination_lng
                    };
                    this.to_town.radio = parameters.destination_radio;
                } else {
                    this.resetInput('to_town');
                }
                if (parameters.is_passenger) {
                    this.isPassenger = parameters.is_passenger;
                } else {
                    this.isPassenger = false;
                }
                if (parameters.date) {
                    this.date = parameters.date;
                } else {
                    this.date = '';
                }
            }
        },
        onSearch (search, loading) {
            loading(true);
            this.search(loading, search, this);
        }
    },
    props: [
        'params'
    ],
    components: {
        DatePicker,
        OsmAutocomplete,
        SearchForTrip,
        svgItem
    }
};
</script>

<style scoped>
.search-section{
    /* border: solid 1px black; */
    margin: 10px;
}
.lookingforpassenger{
    background-color: white;
    box-shadow: 0px 0px 20px #aaa;
}
.searchfortrips{
    background-color: #E65A5B;
    color: white;
    box-shadow: 0px 0px 10px rgba(235, 85, 87, 0.32);
}
.buttongroup{
    width: 100%;
    position: relative;
    top: 40px;
}
#commonbuttongroup{
    height: 42px;
    margin-bottom: 3em;
    width: 100%;
    border-radius: 10px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.textboxscontainer{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

}
.fromtocommon{
    background-color: #F0F4F3;
    border-radius: 5px;
    width: 95%;
    height: 40px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* border: solid 1px black; */
}
.from{

}
.to{

}
p{
    font-family: "Poppins", sans-serif;
    color: black;
}


/* Portrait */
@media only screen 
  and (min-device-width: 320px) 
  and (max-device-width: 360px)
{



 .imageholder
 {
     height: 14em !important;
     display: flex;
     flex-direction: row;
     justify-content: center;
     align-items: center;
     margin-bottom: 5em !important;
     margin-top: 27% !important;
 }

 .buttongroup {
    width: 100%;
    position: relative;
    top: 25px;
}

p{
        margin: 1em 0;
}

}



 .imageholder{
     height: 30vh;
     /* border: solid red 1px; */
     display: flex;
     flex-direction: row;
     justify-content: center;
     align-items: center;
 }
 @media screen and (max-height: 568px){
 .searchcontainer{
    height: 75vh;
    width: 100%;

 }
 }
 @media screen and (min-height: 823px){
     .searchcontainer{
         height: 86vh;
         width: 100%;
     }
 }
 @media screen and (min-height: 812px) and (max-height: 819px){
 .searchcontainer{
    height: 83vh;
    width: 100%;

 }
 }

 @media screen and (min-height: 640px){
 .searchcontainer{
    height: 78vh;
    width: 100%;
 }
 }

 .swap.btn {
  display: flex;
    position: absolute;
    background: #FFFFFF;
    z-index: 1;
    border: 2px solid #F0F4F3;
    right: 5%;
    margin: -2em 1em 4em 2em;
    border-radius: 50%;
    padding: 6px;
    text-align: center;
}

i#field-icon{
    color: #999999;
}

#hello{
    font-size: 18px;
    font-weight: bold;
    padding-left: 1em;
}
</style>
