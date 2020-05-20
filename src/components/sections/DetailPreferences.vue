<template>
    <div class="details-body-common" style="display: flex !important;">
        <!-- smoking -->
        <div v-if="is_smoker === 'true'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + smokeIcon + ')'}"></div>
            <p>Smoking</p>
        </div>

        <!-- pets -->
        <div v-if="pets === 'true'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + petsIcon + ')'}"></div>
            <p>Pets</p>
        </div>

        <!-- luggage -->
        <div v-if="luggage === 'true'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + luggageIcon + ')'}"></div>
            <p>Luggage</p>
        </div>

        <!-- food -->
        <div v-if="food === 'true'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + foodIcon + ')'}"></div>
            <p>Food</p>
        </div>

        <!-- speak -->
        <div v-if="speaking === 'true'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + speakIcon + ')'}"></div>
            <p>Speaking</p>
        </div>

        <!-- protection -->
        <div v-if="protection === 'true'" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + protectIcon + ')'}"></div>
            <p>Protection</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'detailPreferences',
    data () {
        return {
            is_smoker: '',
            pets: '',
            food: '',
            speaking: '',
            luggage: '',
            protection: '',
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