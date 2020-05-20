<template>
    <div style="position: relative;">
        <img :src="bk" class="signIn-bk" />
        <img :src="logo" class="logo-bk" />
        <!-- signin area -->
        <div class="signin-area">
            <h1>
                Go places for less
            </h1>

            <!-- email -->
            <span>Phone Number</span>
            <div class="phoNumber-area">
                <VuePhoneNumberInput @update="getPhoneUpdate" class="phone-number-input" v-model="phoneNumber" />
                <span class="error" v-if="phoneError.state"> {{phoneError.message}} </span></br>
            </div>
                
            <!-- password -->
            <span>Password</span>
            <div>
                <input type="password" name="password" placeholder="• • • • • • • •" v-model="password" @keyup="goLogin" />
            </div>
            <span class="error" v-if="passwordError.state"> {{passwordError.message}} </span>
            <div class="alert alert-info alert-user" role="alert" v-if="showUserNotActiveInfo">
                 To login you must activate your account, we have sent a verification code to your e-mail so you can activate your account.
            </div>
            <router-link :to="{name: 'forget-password'}" :class="'forget-password'">Forget Password?</router-link>
            
            <!-- button area -->
            <div class=btn-area>
                <button @click="login" class="signin-btn">
                    <downIcon :size="17" :color="'white'" style="transform: rotate(-90deg);" />
                    <spinner v-if="login_loading" class="loading" />
                </button>
                <button class="facebook">
                    <facebookIcon :size="17" :color="'black'" />
                </button>
                <button @click="signup" class="signup-btn">
                    <spinner v-if="signup_loading" class="loading" />
                    <p>Sign up</p>
                </button>
            </div>

            <!-- loading gif -->
            <img v-if="loading_flag" class="loading-signin-img" :src="loading_img" />
        </div>
    </div>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import { mapGetters, mapActions } from 'vuex';
import spinner from '../Spinner.vue';
import dialogs from '../../services/dialogs.js';

// import components for this
import downIcon from '../../icon/DownIcon';
import facebookIcon from '../../icon/FacebookIcon';

class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'signIn',
    data () {
        return {
            bk: '/static/img/banner.png',
            logo: '/static/img/lessgo_logo_vertical.png',
            loading_img: process.env.ROUTE_BASE + 'static/svg/loading.gif',
            password: '',
            showUserNotActiveInfo: false,
            login_loading: false,
            signup_loading: false,
            fbLoading: false,
            phoNumber: '',
            phoneNumber: '',
            phoneValid: false,
            passwordError: new Error(),
            phoneError: new Error(),
            loading_flag: false
        };
    },
    computed: {
        ...mapGetters({
            checkLogin: 'auth/checkLogin',
            isMobile: 'device/isMobile',
            getLocalData: 'auth/getLocalStore'
        })
    },
    async mounted () {
        this.loading_flag = true;
        await this.getData();
        console.log('getLocalData', this.getLocalData);
        await this.getLocalData
            .then(result => {
                this.activate(result.user.activation_token).then(response => {
                    this.loading_flag = false;
                }).catch(err => {
                    console.log('err', err);
                });
            })
            .catch(err => {
                console.log('err', err);
                this.loading_flag = false;
            });
    },
    methods: {
        ...mapActions({
            doLogin: 'auth/login',
            getData: 'auth/getSignupFromLocal',
            fbLogin: 'cordova/facebookLogin',
            activate: 'auth/activate'
        }),
        goLogin: function (event) {
            if (event.key === 'Enter') {
                this.login();
            }
        },
        validate: function () {
            let globalError = false;

            if (!this.phoneValid) {
                if (this.phoneNumber.length !== 0) {
                    this.phoneError.state = true;
                    this.phoneError.message = 'You must validate your phone number.';
                    globalError = true;
                } else {
                    this.phoneError.state = true;
                    this.phoneError.message = 'You must insert phone number.';
                    globalError = true;
                }
            }

            if (this.password.length < 1) {
                this.passwordError.state = true;
                this.passwordError.message = 'You must insert password.';
                globalError = true;
            } else if (this.password.length < 8) {
                this.passwordError.state = true;
                this.passwordError.message = 'Your password must be at least 8 characters.';
                globalError = true;
            }

            return globalError;
        },
        login: function () {
            if (!this.fbLoading) {
                if (this.validate()) {
                    dialogs.message('You must correct or complete some fields to complete your Login.', { duration: 10, state: 'error' });
                    return;
                }
                this.showUserNotActiveInfo = false;
                this.login_loading = true;
                let phoNumber = this.phoNumber;
                let password = this.password;
                this.doLogin({phoNumber, password}).then(data => {
                    this.loading = false;
                    // router.push({ name: 'trips' });
                    // router.rememberBack();
                }, error => {
                    const userNotActive = error && error.message === 'user_not_active';
                    const message = userNotActive ? 'To login you must activate your account first.' : 'Incorrect phone number or password.';
                    this.showUserNotActiveInfo = userNotActive;

                    dialogs.message(message, { duration: 10, state: 'error' });
                    if (error) {
                        this.error = error.error;
                    }
                    this.login_loading = false;
                });
            } else {
                dialogs.message('Your request has already been sent, please wait a moment.', { duration: 10, state: 'error' });
            }
            // this.$router.push({name: 'main'});
        },
        getPhoneUpdate: function ({formattedNumber, isValid}) {
            this.phoneValid = isValid;
            if (isValid) {
                this.phoNumber = formattedNumber;
            } else {
                this.phoNumber = '';
            }
        },
        signup: function () {
            this.signup_loading = true;
            this.$router.push({name: 'signup'});
        }
    },
    watch: {
        phoneNumber: function () {
            this.phoneError.state = false;
        },
        password: function () {
            this.passwordError.state = false;
        }
    },
    components: {
        facebookIcon,
        downIcon,
        spinner,
        VuePhoneNumberInput
    }
};
</script>