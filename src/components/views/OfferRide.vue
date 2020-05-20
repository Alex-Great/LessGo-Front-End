<template>
    <div style="position: relative; background: #f0f4f3">
        <div class="offer-bk">
            <img class="offerImg" :src="bkImg">
        </div>
        <closeIcon :size="12" style="position: absolute; right: 9%; top: 12%; cursor: pointer;" />

        <!-- post area -->
        <div class="car-detail-post">
            <span class="about-ride">
                To be albe to post rides, please provide us with some info about your car
            </span>
            <!-- car info -->
            <div class="identification" style="margin: 30px 0; display: flex;">
                <!-- car image -->
                <div @click="updateData('car')" class="section-part" title="Input your Car">
                    <img v-for="part in styles" v-bind:style="{'transform': part.transform,
                    'top': part.top, 'right': part.right, 'bottom': part.bottom, 'left': part.left,
                    'position': 'absolute' }" :src="cornerImg">
                    <div v-if="carImg === ''">
                        <carIcon :size="35" :color="fillcolor" />
                        <span>a photo of your car</span>
                    </div>
                </div>

                <!-- license image -->
                <div @click="updateData('license_id')" class="section-part" style="margin-right: 0;" title="Input your Id">
                    <img v-for="part in styles" v-bind:style="{'transform': part.transform,
                    'top': part.top, 'right': part.right, 'bottom': part.bottom, 'left': part.left,
                    'position': 'absolute' }" :src="cornerImg">
                    <div v-if="idImg === ''">
                        <userCardIcon :size="35" :fillcolor="fillcolor" style="margin-top: -5px" />
                        <span>a photo of your ID</span>
                    </div>
                </div>
            </div>

            <!-- input car type and user id -->
            <div class="car-info">
                <div class="common-input">
                    <carIcon :size="15" :color="fillcolor" style="margin-right: 15px" />
                    <input ref="car_type" type="text" name="car-model" placeholder="Car model" v-model="carType" />
                </div>
                <span class="error" v-if="carModelError.state"> {{carModelError.message}} </span>
                <div class="common-input">
                    <plateIcon :size="15" :fillcolor="fillcolor" style="margin-right: 15px" />
                    <input v-mask="'#?#-#####'" ref="plate_id" type="text" name="plate-number" placeholder="Plate number" v-model="plateId" />
                </div>
                <span class="error" v-if="plateIdError.state"> {{plateIdError.message}} </span>
            </div>

            <!-- go next step -->
            <button class="offer-ride" style="margin-top: 50px; margin-right: 0;" @click="offerRide">
                <carIcon :size="20" :color="'#D5E9E8'" style="margin-top: -3px;" />
                <span style="color: white">Offer ride</span>
            </button>
        </div>
        <!-- <Uploadfile :name="'profile'" @change="onPhotoChange" ref="file"></Uploadfile> -->
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import dialogs from '../../services/dialogs.js';
// import Uploadfile from '../Uploadfile';

/* import components for this */
import closeIcon from '../../icon/CloseIcon';
import carIcon from '../../icon/CarIcon';
import userCardIcon from '../../icon/UserCardIcon';
import plateIcon from '../../icon/PlateIcon';
import offerIcon from '../../icon/OfferIcon';

class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'offerride',
    data () {
        return {
            carImg: '',
            idImg: '',
            bkImg: process.env.ROUTE_BASE + 'static/svg/offerride.svg',
            cornerImg: process.env.ROUTE_BASE + 'static/svg/corner.svg',
            fillcolor: '#c0ecd3',
            carType: '',
            plateId: '',
            plateIdError: new Error(),
            carModelError: new Error(),
            styles: [
                {
                    top: 0,
                    left: 0,
                    transform: 'rotate(-90deg)'
                },
                {
                    top: 0,
                    right: 0,
                    transform: 'rotate(0deg)'
                },
                {
                    bottom: 0,
                    right: 0,
                    transform: 'rotate(90deg)'
                },
                {
                    bottom: 0,
                    left: 0,
                    transform: 'rotate(180deg)'
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            detail: 'cars/getDetail'
        }),
        setDetail: function () {
            if (this.detail) {
                this.carType = this.detail.carType;
                this.plateId = this.detail.plateId;
            }
        }
    },
    methods: {
        ...mapActions({
            saveCarAndId: 'cars/saveCarAndId'
        }),
        offerRide: function () {
            if (this.validate()) {
                dialogs.message('You must correct or complete some fields to complete your offer.', { duration: 10, state: 'error' });
                return;
            }
            let data = {
                carType: this.carType,
                plateId: this.plateId
            };

            /* save car and id number */
            this.saveCarAndId({data}).then(res => {
                this.$router.push({name: 'setRideSchedule'});    
            }).catch((err) => console.log('save err'));
        },
        validate: function () {
            let globalError = false;
            if (this.carType.length < 1) {
                this.carModelError.state = true;
                this.carModelError.message = 'You forgot to enter your car type';
                globalError = true;
            }

            if (this.plateId.length < 1) {
                this.plateIdError.state = true;
                this.plateIdError.message = 'You forgot to enter your plate id';
                globalError = true;
            }

            return globalError;
        },
        updateData: function (key) {
            console.log('key', key);
        }
    },
    watch: {
        carType: function () {
            this.carModelError.state = false;
        },
        plateId: function () {
            this.plateIdError.state = false;
        },
        setDetail: function () {
            console.log('watch', this.detail);
        }
    },
    components: {
        closeIcon,
        carIcon,
        userCardIcon,
        plateIcon,
        offerIcon
    }
};
</script>