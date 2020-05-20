<template>
    <div class="details-body-common">
        <!-- sanitizer -->
        <div @click="selectAmens('sanitizer')" :style="(offerFlag && !sanitizer)?'opacity: .3': 'opacity: 1'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + sanitizerIcon + ')'}"></div>
            <p>Sanitizer</p>
        </div>

        <!-- wifi -->
        <div @click="selectAmens('wifi')" :style="(offerFlag && !wifi)?'opacity: .3': 'opacity: 1'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + wifiIcon + ')'}"></div>
            <p>Wifi</p>
        </div>

        <!-- comfort -->
        <div @click="selectAmens('xcomfort')" :style="(offerFlag && !xcomfort)?'opacity: .3': 'opacity: 1'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + comfortIcon + ')'}"></div>
            <p>X-Comfort</p>
        </div>

        <!-- aux -->
        <div @click="selectAmens('aux')" :style="(offerFlag && !aux)?'opacity: .3': 'opacity: 1'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + auxIcon + ')'}"></div>
            <p>Aux</p>
        </div>

        <!-- charger -->
        <div @click="selectAmens('charger')" :style="(offerFlag && !charger)?'opacity: .3': 'opacity: 1'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + chargerIcon + ')'}"></div>
            <p>Charger</p>
        </div>

        <!-- snacks -->
        <div v-if="reverse">
            <div @click="selectAmens('snacks')" :style="(offerFlag && !snacks)?'opacity: .3': 'opacity: 1'" class="details-body-common-area">
                <div class="amenties-img" :style="{'background': 'url(' + snacksIcon + ')'}"></div>
                <p>Snacks</p>
            </div>
        </div>

        <!-- arrow icon -->
        <div :style="reverse?'transform: rotate(180deg)': ''" class="amen-arrow" @click="reverseBtn">
            <v-icon icon="angle-down" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'amenties',
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
            sanitizerIcon: process.env.ROUTE_BASE + 'static/img/sanitizer.png',
            reverse: false
        };
    },
    props: {
        data: {
            type: Array,
            required: false,
            default: null
        },
        offerFlag: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    methods: {
        selectAmens: function (amens) {
            this[amens] = !this[amens];

            let ameniData = {
                wifi: this.wifi,
                aux: this.aux,
                xcomfort: this.xcomfort,
                sanitizer: this.sanitizer,
                charger: this.charger,
                snacks: this.snacks
            };
            this.$emit('amenities', ameniData);
        },
        reverseBtn: function () {
            this.reverse = !this.reverse;
        }
    },
    mounted () {
        this.data.forEach(item => {
            switch (item) {
            case 'Wifi':
                this.wifi = item;
                break;
            case 'Snacks':
                this.snacks = item;
                break;
            case 'Charger':
                this.charger = item;
                break;
            case 'Aux':
                this.aux = item;
                break;
            case 'X-Comfort':
                this.comfort = item;
                break;
            case 'Sanitizer':
                this.sanitizer = item;
                break;
            default:
                break;
            }
        });
    }
};
</script>