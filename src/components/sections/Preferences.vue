<template>
    <div class="details-body-common">
        <!-- smoking -->
        <div @click="selPreference('is_smoker')" :style="(offerFlag && !is_smoker)?'opacity: .5' : ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + smokeIcon + ')'}"></div>
            <p>Smoking</p>
        </div>

        <!-- pets -->
        <div @click="selPreference('pets')" :style="(offerFlag && !pets)?'opacity: .5' : ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + petsIcon + ')'}"></div>
            <p>Pets</p>
        </div>

        <!-- luggage -->
        <div @click="selPreference('luggage')" :style="(offerFlag && !luggage)?'opacity: .5' : ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + luggageIcon + ')'}"></div>
            <p>Luggage</p>
        </div>

        <!-- food -->
        <div @click="selPreference('food')" :style="(offerFlag && !food)?'opacity: .5' : ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + foodIcon + ')'}"></div>
            <p>Food</p>
        </div>

        <!-- speak -->
        <div @click="selPreference('speaking')" :style="(offerFlag && !speaking)?'opacity: .5' : ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + speakIcon + ')'}"></div>
            <p>Speaking</p>
        </div>

        <!-- protection -->
        <div v-if="reverse">
            <div @click="selPreference('protection')" :style="(offerFlag && !protection)?'opacity: .5' : ''" class="details-body-common-area">
                <div class="amenties-img" :style="{'background': 'url(' + protectIcon + ')'}"></div>
                <p>Protection</p>
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
    name: 'preferences',
    data () {
        return {
            reverse: false,
            is_smoker: false,
            pets: false,
            food: false,
            speaking: false,
            luggage: false,
            protection: false,
            smokeIcon: process.env.ROUTE_BASE + 'static/img/smoke.png',
            petsIcon: process.env.ROUTE_BASE + 'static/img/pets.png',
            luggageIcon: process.env.ROUTE_BASE + 'static/img/luggage.png',
            foodIcon: process.env.ROUTE_BASE + 'static/img/food.png',
            speakIcon: process.env.ROUTE_BASE + 'static/img/speaking.png',
            protectIcon: process.env.ROUTE_BASE + 'static/img/protection.png'
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
    mounted () {
        this.data.forEach(item => {
            switch (item) {
            case 'is_smoker':
                this.is_smoker = true;
                break;
            case 'pets':
                this.pets = true;
                break;
            case 'food':
                this.food = true;
                break;
            case 'luggage':
                this.luggage = true;
                break;
            case 'speaking':
                this.speaking = true;
                break;
            case 'protection':
                this.protection = true;
                break;
            default:
                break;
            }
        });
    },
    methods: {
        selPreference: function (item) {
            this[item] = !this[item];

            let data = {
                is_smoker: this.is_smoker,
                pets: this.pets,
                luggage: this.luggage,
                food: this.food,
                speaking: this.speaking,
                protection: this.protection
            };
            this.$emit('preference', data);
        },
        reverseBtn: function () {
            this.reverse = !this.reverse;
        }
    }
};
</script>