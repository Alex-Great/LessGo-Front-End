<template>
    <div>
        <div class="messages-area profile-detail" style="background: linear-gradient(to bottom, #fff 72%, #eaf3f1 100%, #eaf3f1 100%, #fff 100%);">
            <!-- title area -->
            <div class="title-area">
                <div @click="uploadFile" class="img-profile" v-imgSrc:profile="user.image" style="width: 75px; height: 75px;">
                    <div class="camera-icon">
                        <v-icon icon="camera" class="v-icon-camera" /></br>
                        <span>Change</span>
                    </div>
                </div>
                <div style="margin-left: 10px;">
                    <h3>{{ user.name }}</h3>
                    <div v-for="num in redRating" style="float: left; margin-right: 5px;">
                        <ratingStarIcon :size="14" :color="'#e65a5b'" />
                    </div>
                    <div v-if="!no_review" v-for="num in greyRating" style="float: left; margin-right: 5px;">
                        <ratingStarIcon :size="14" />
                    </div>
                    <div v-if="no_review">
                        <span>No Reviews</span>
                    </div>
                </div>
            </div>

            <!-- bio area -->
            <div class="common-title">
                <h4>Bio</h4>
                <h4 class="bio-title">(preferences, interests and hobbies)</h4>
            </div>
            <div class="bio-content">
                <textarea v-model="description"></textarea>
                <b>{{ bio_count }}/{{ text_counter }}</b>
            </div>
            <span class="error" v-if="descriptionError.state"> {{descriptionError.message}} </span>

            <!-- preferences -->
            <!-- <h4>Preferences</h4> -->
            <!-- <div class="preferences">
                <preferences :data="preferences" :offerFlag="true" />    
            </div> -->

            <!-- contact and identification -->
            <h4>Contact and identification</h4>
            <div class="contact">
                <!-- gender -->
                <div class="common-title">
                    <h5>Gender</h5>
                    <h5 class="add-title">(cannot be edited)</h5>
                </div>
                <div class="common-input-area">
                    <v-icon icon="venus-mars" class="v-icons-profile-edit" />
                    <input type="text" name="" disabled :value="user.gender" />
                </div>

                <!-- phone number -->
                <h5>Phone Number</h5>
                <div class="common-input-area">
                    <v-icon icon="phone-alt" class="v-icons-profile-edit" style="transform: rotate(10deg);" />
                    <input maxlength="13" @keydown="isNumber" v-on:paste='isNumber' type="text" name="" placeholder="Phone number" v-model="phoneNumber" />
                </div>
                <span class="error" v-if="phoneNumberError.state"> {{phoneNumberError.message}} </span>

                <!-- car info -->
                <div class="common-title">
                    <h5>Car Info</h5>
                    <h5 class="add-title">(for offering rides)</h5>
                </div>
                <div class="common-input-area">
                    <v-icon icon="car" class="v-icons-profile-edit" style="width: 19px !important" />
                    <input type="text" name="" placeholder="Car model" v-model="carModel" />
                </div>
                <span class="error" v-if="carModelError.state"> {{carModelError.message}} </span>
                
                <div class="common-input-area">
                    <v-icon icon="vr-cardboard" class="v-icons-profile-edit" />
                    <input v-mask="'#?#-#####'" type="text" name="" placeholder="Car plate number" v-model="plateNumber" />
                </div>
                <span class="error" v-if="plateNumberError.state"> {{plateNumberError.message}} </span>

                <!-- id number -->
                <div class="common-title">
                    <h5>ID Number</h5>
                    <h5 class="add-title">(Driver's License, National Card, Passport)</h5>
                </div>
                <div class="common-input-area">
                    <v-icon icon="address-card" class="v-icons-profile-edit" />
                    <input type="number" name="" placeholder="1234567890" v-model="idNumber" />
                </div>
                <span class="error" v-if="idNumberError.state"> {{idNumberError.message}} </span>

                <!-- change password -->
                <b @click="resetPassword">Change Password...</b>
                <div v-if="showPasswordField">
                    <h5>Enter your new password</h5>
                    <div class="common-input-area">
                        <v-icon icon="lock" class="v-icons-profile-edit" />
                        <input type="password" name="" placeholder="Enter new password" v-model="password" />
                    </div>
                    <div class="common-input-area">
                        <v-icon icon="lock" class="v-icons-profile-edit" />
                        <input type="password" name="" placeholder="Enter confirm password" v-model="confirm" />
                    </div>
                    <span class="error" v-if="passwordError.state"> {{passwordError.message}} </span>
                </div>

                <!-- button area -->
                <div style="display: flow-root; margin-top: 25px;">
                    <button style="padding: 13px 30px" @click="saveProfile" class="offer-ride">
                        <span style="margin: 0">Save</span>
                        <spinner v-if="loading" class="loading" />
                    </button>
                    <button @click="goBack" class="share-btn" style="display: block !important;">
                        <span style="margin: 0">
                            Back
                        </span>
                    </button>
                </div>

                <!-- update profile -->
                <uploadfile :name="'profile'" @change="onPhotoChange" ref="file"></uploadfile>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import dialogs from '../../services/dialogs.js';
import spinner from '../Spinner.vue';
import { inputIsNumber } from '../../services/utility';

// import components for this
import ratingStarIcon from '../../icon/RatingStarIcon';
// import preferences from '../sections/Preferences';
import uploadfile from '../Uploadfile';

class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

let totalCount = 5;
let phoneRegex = /(\d+|\d+\.\d+|\.\d+)([eE][-+]?\d+)/;

export default {
    name: 'profileEdit',
    data () {
        return {
            userData: null,
            car: null,
            redRating: [],
            greyRating: [],
            no_review: false,
            bio_count: 0,
            description: '',
            text_counter: 150,
            showPasswordField: false,
            password: '',
            confirm: '',
            idNumber: '',
            plateNumber: '',
            carModel: '',
            phoneNumber: '',
            passwordError: new Error(),
            confirmError: new Error(),
            idNumberError: new Error(),
            carModelError: new Error(),
            plateNumberError: new Error(),
            phoneNumberError: new Error(),
            descriptionError: new Error(),
            loading: false
        };
    },
    props: {
        id: {
            type: String,
            required: false,
            default: 'me'
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
            cars: 'cars/cars'
        })
    },
    methods: {
        ...mapActions({
            update: 'auth/update',
            updatePhoto: 'auth/updatePhoto',
            carCreate: 'cars/create',
            carUpdate: 'cars/update',
            fetchUser: 'auth/fetchUser'
        }),
        isNumber (value) {
            inputIsNumber(value);
        },
        resetPassword: function () {
            this.showPasswordField = !this.showPasswordField;
        },
        goBack: function () {
            this.$router.push({name: 'profileDetail', params: {id: 'me'}});
        },
        saveProfile: function () {
            if (this.validate()) {
                dialogs.message('You have not completed mandatory fields or entered invalid data.', { duration: 10, state: 'error' });
                return;
            }
            this.loading = true;
            this.userData.mobile_phone = this.phoneNumber;
            this.userData.nro_doc = this.idNumber;
            this.userData.cartype = this.carModel;
            this.userData.description = this.description;

            if (this.password || this.confirm) {
                if (this.password !== this.confirm) {
                    this.passwordError.state = true;
                    this.passwordError.message = 'Password does not match.';
                    this.loading = false;
                    return;
                }
                this.userData.password = this.password;
                this.userData.password_confirmation = this.confirm;
            }

            var data = this.userData;
            this.update(data).then(() => {
                this.password = '';
                this.confirm = '';
                this.loading = false;
                if (this.plateNumber.length) {
                    if (this.car) {
                        this.car.patente = this.plateNumber;
                        this.carUpdate(this.car);
                    } else {
                        let car = {
                            description: 'NOT USED YET',
                            patente: this.plateNumber
                        };
                        this.carCreate(car);
                    }
                }
                if ((this.user.image && this.user.image.length > 0) && (this.user.description && this.user.description.length > 0)) {
                    dialogs.message('Profile updated completely.');
                    this.$router.push({name: 'main'});
                } else {
                    if (!(this.user.image && this.user.image.length > 0)) {
                        dialogs.message('You must upload a profile image.', { duration: 10, state: 'error' });
                    }
                }
            }).catch(response => {
                this.loading = false;
                this.error = 'The data could not be recorded. Try again';
            });
        },
        uploadFile: function () {
            this.$refs.file.show();
        },
        onPhotoChange (data) {
            this.loadingImg = true;
            this.updatePhoto(data).then(user => {
                this.userData.image = user.image;
                this.loadingImg = false;
            }).catch(() => {
                this.loadingImg = false;
            });
        },
        validate: function () {
            let globalError = false;

            if (!this.plateNumber) {
                // if (!patentRegex.test(this.patente)) {
                this.plateNumberError.state = true;
                this.plateNumberError.message = 'The entered patent does not have a valid format.';
                globalError = true;
                // }
            }

            if (!this.description || this.description.length < 1) {
                this.descriptionError.state = true;
                this.descriptionError.message = 'You forgot to complete your description.';
                globalError = true;
            } else if (this.description.replace(' ', '').length < 10) {
                this.descriptionError.state = true;
                this.descriptionError.message = 'Ups! Your description is very limited. Do not be shy, tell us a little more.';
                globalError = true;
            }

            if (this.idNumber && this.idNumber.length > 0 && this.idNumber.length < 7) {
                this.idNumberError.state = true;
                this.idNumberError.message = 'The Id Number you entered is not valid.';
                globalError = true;
            }

            if (this.phoneNumber && this.phoneNumber.length > 0 && this.phoneNumber.length < 6) {
                this.phoneNumberError.state = true;
                this.phoneNumberError.message = 'The phone you entered is not valid.';
                globalError = true;
            }

            if (this.phoneNumber === '') {
                this.phoneNumberError.state = true;
                this.phoneNumberError.message = 'You forgot to complete your phone number.';
                globalError = true;
            }

            if (this.carModel && this.carModel.length > 0 && this.carModel.length < 3) {
                this.carModelError.state = true;
                this.carModelError.message = 'The car type you entered is not valid.';
                globalError = true;
            }

            return globalError;
        }
    },
    watch: {
        description: function () {
            this.bio_count = this.description.length;
            let desCount = this.bio_count;
            if ((desCount % 150) >= 75) {
                this.text_counter = 150 * ((desCount / 150).toFixed());
            } else if ((desCount % 150) === 0 && desCount !== 0) {
                this.text_counter = 150 * ((desCount / 150).toFixed());
            } else if ((desCount % 150) === 0 && desCount === 0) {
                this.text_counter = 150;
            } else {
                this.text_counter = 150 * (parseInt((desCount / 150).toFixed()) + 1);
            }

            this.descriptionError.state = false;
        },
        password: function () {
            this.passwordError.state = false;
        },
        confirm: function () {
            this.passwordError.state = false;
        },
        carModel: function () {
            this.carModelError.state = false;
        },
        idNumber: function () {
            this.idNumberError.state = false;
        },
        phoneNumber: function () {
            this.phoneNumberError.state = false;
        },
        plateNumber: function () {
            this.plateNumberError.state = false;
        }
    },
    async mounted () {
        await this.fetchUser();
        if (this.user.description !== null) {
            this.bio_count = this.user.description.length;
        }
        this.userData = this.user;
        this.redRating = [];
        this.greyRating = [];
        
        // rating count
        if ((this.user.positive_ratings + this.user.negative_ratings) === 0) {
            this.no_review = true;
        } else {
            // red rating count
            for (let i = 0; i < this.user.positive_ratings; i++) {
                this.redRating.push(i);
            }

            // grey rating count
            for (let i = 0; i < this.user.negative_ratings; i++) {
                this.redRating.push(i);
            }
        }

        // details
        this.description = this.user.description;
        // this.preferences = profileData.preferences;
        this.phoneNumber = this.user.mobile_phone;
        this.carModel = this.user.cartype;
        this.plateNumber = this.cars[0].patente;
        this.idNumber = this.user.nro_doc;
        this.car = this.cars[0];
    },
    components: {
        ratingStarIcon,
        // preferences,
        uploadfile,
        spinner
    }
};
</script>