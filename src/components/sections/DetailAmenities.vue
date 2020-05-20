<template>
    <div class="details-body-common" style="display: flex !important;">
        <!-- sanitizer -->
        <div v-if="sanitizer === 'true'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + sanitizerIcon + ')'}"></div>
            <p>Sanitizer</p>
        </div>

        <!-- wifi -->
        <div v-if="wifi === 'true'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + wifiIcon + ')'}"></div>
            <p>Wifi</p>
        </div>

        <!-- comfort -->
        <div v-if="xcomfort === 'true'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + comfortIcon + ')'}"></div>
            <p>X-Comfort</p>
        </div>

        <!-- aux -->
        <div v-if="aux === 'true'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + auxIcon + ')'}"></div>
            <p>Aux</p>
        </div>

        <!-- charger -->
        <div v-if="charger === 'true'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + chargerIcon + ')'}"></div>
            <p>Charger</p>
        </div>

        <!-- snacks -->
        <div v-if="snacks === 'true'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + snacksIcon + ')'}"></div>
            <p>Snacks</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'detailAmenities',
    data () {
        return {
            wifi: false,
            snacks: false,
            charger: false,
            aux: false,
            xcomfort: false,
            sanitizer: false,
            wifiIcon: process.env.ROUTE_BASE + 'static/img/wifi.png',
            snacksIcon: process.env.ROUTE_BASE + 'static/img/snacks.png',
            chargerIcon: process.env.ROUTE_BASE + 'static/img/charger.png',
            auxIcon: process.env.ROUTE_BASE + 'static/img/aux1.png',
            comfortIcon: process.env.ROUTE_BASE + 'static/img/x-comfort.png',
            sanitizerIcon: process.env.ROUTE_BASE + 'static/img/sanitizer.png'
        };
    },
    props: {
        data: {
            type: Object,
            required: false,
            default: null
        }
    },
    mounted () {
        for (let i = 0; i < Object.keys(this.data).length; i++) {
            this[Object.keys(this.data)[i]] = this.data[Object.keys(this.data)[i]] === '1' ? 'true' : 'false';
        }
    }
};
</script>