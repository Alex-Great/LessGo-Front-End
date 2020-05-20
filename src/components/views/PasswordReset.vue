<template>
    <div>
        <!-- Forget password logo area -->
        <div class="uft" style="box-shadow: rgba(35, 98, 98, 0.16) 9px 10px 10px;; position: absolute; width: 100%;">
            <router-link v-if="!isMobile"  :to="{name: 'trips'}">
                <img  :src="lessgo_logo" />
            </router-link>
            <img  style="width: 45%; float: right; border-radius: 0 0 25px 25px" v-if="isMobile" :src="lessgo_logo" />
            <h2 v-if="pageNumber === 1" class="signup-title create-acc">Forgot your password?</h2>
            <h2 v-if="pageNumber === 2" class="signup-title create-acc">One-Time Code</h2>
            <h2 v-if="pageNumber === 3" class="signup-title create-acc">Create new password</h2>
        </div>

        <!-- Forgot password body -->
        <div class="signup-body">
            <div id="recaptcha-container" data-sitekey="6LdIIeIUAAAAALru4MJbVWQxXvtHyAmj2ro4XJ5q"></div>

            <!-- First area -->
            <div v-if="pageNumber === 1">
                <h2 class="first-margin">Phone number</h2>
                <VuePhoneNumberInput @update="getPhoneUpdate" class="phone-number-input" v-model="phoneNumber" />
                <span class="error" v-if="phoneError.state"> {{phoneError.message}} </span>
            </div>

            <!-- second area -->
            <div v-if="pageNumber === 2">
                <h2 class="first-margin">Enter code</h2>
                <input type="number" v-model="code" placeholder="here enter code..." />
                <span class="error" v-if="codeError.state"> {{codeError.message}} </span>
                <span class="counter-span">Resend code (0:{{ count }})</span>
            </div>

            <!-- third area -->
            <div v-if="pageNumber === 3">
                <!-- create password -->
                <h2 class="first-margin">Create new password</h2>
                <input type="password" v-model="password" placeholder="• • • • • • • •" />
                <span class="error" v-if="passwordError.state"> {{passwordError.message}} </span>

                <!-- confirm password -->
                <h2>Confirm new password</h2>
                <input type="password" v-model="confirm_password" placeholder="repeat password" />
                <span class="error" v-if="passwordError.state"> {{passwordError.message}} </span>
            </div>

            <!-- forgot password buttons -->
            <div class="singup-area" :style="(pageNumber === 1)?'margin-top: 41vh': (pageNumber === 2)?'margin-top: 38vh': 'margin-top: 36vh'">
                <button @click="selectPage(1)" class="next-btn">
                    <p>{{ (pageNumber === 3)?'Login': 'Next' }}</p>
                    <downIcon :color="'white'" style="transform: rotate(-90deg);" />
                    <spinner v-if="loginFlag" class="loading" />
                </button>
                <button @click="selectPage(-1)" class="previous-btn">
                    <downIcon :size="17" :color="'black'" style="transform: rotate(90deg);" />
                </button>
                <div class="btn-group">
                    <div :class="pageNumber === 1?'selected': 'non-selected'"></div>
                    <div :class="pageNumber === 2?'selected': 'non-selected'"></div>
                    <div :class="pageNumber === 3?'selected': 'non-selected'"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import firebase from 'firebase';
import dialogs from '../../services/dialogs.js';
import VuePhoneNumberInput from 'vue-phone-number-input';

// import components for this
import downIcon from '../../icon/DownIcon';
import spinner from '../Spinner.vue';

class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'passwordReset',
    data () {
        return {
            lessgo_logo: process.env.ROUTE_BASE + 'static/img/Group839.svg',
            pageNumber: 1,
            loginFlag: false,
            phoneError: new Error(),
            codeError: new Error(),
            phoneNumber: '',
            code: '',
            phoneValid: false,
            phoNumber: '',
            count: 59,
            appVerifier: '',
            password: '',
            confirm_password: '',
            passwordError: new Error()
        };
    },
    computed: {
        ...mapGetters({
            isMobile: 'device/isMobile'
        })
    },
    watch: {
        phoneNumber: function () { this.phoneError.state = false; },
        password: function () { this.passwordError.state = false; },
        confirm_password: function () { this.passwordError.state = false; }
    },
    methods: {
        selectPage: function (num) {
            let currentPageNum = this.pageNumber;
            switch (currentPageNum) {
            case 1:
                if (num === 1) {
                    let vm = this;
                    if (!this.phoneValid) {
                        this.phoneError.state = true;
                        this.phoneError.message = 'You must validate your phone number.';
                        dialogs.message('You must correct or complete Phone Number field to create your new password.', { duration: 10, state: 'error' });
                        return;
                    }

                    // send phoneNumber for verify and get otp code
                    let phoNumber = this.phoNumber;
                    let appVerifier = this.appVerifier;

                    firebase.auth().signInWithPhoneNumber(phoNumber, appVerifier)
                        .then(function (confirmationResult) {
                            window.confirmationResult = confirmationResult;
                            window.alert('SMS sent');
                            vm.pageNumber += num;
                        })
                        .catch(error => {
                            window.alert('Error ! SMS not sent');
                        });
                } else { // to signin page
                    this.$router.push({name: 'signin'});
                }
                break;
            case 2:
                if (num === 1) {
                    if (this.codevalidate()) {
                        dialogs.message('You must correct or complete Verify field to create a new password.', { duration: 10, state: 'error' });
                        return;
                    }

                    let vm = this;
                    let otp = this.code;

                    // verify phoneNumber from otp
                    window.confirmationResult.confirm(otp)
                        .then(function (result) {
                            vm.pageNumber += num;
                        })
                        .catch(function (error) {
                            window.alert(`${error}`);
                        });
                } else {
                    this.pageNumber += num;
                }
                break;
            case 3:
                if (this.validate()) {
                    dialogs.message('You must correct or complete some fields to reset your new password.', { duration: 10, state: 'error' });
                    return;
                }
                break;
            default:
                break;
            }
        },
        validate: function () {
            let globalError = false;

            if (this.password.length < 1) {
                this.passwordError.state = true;
                this.passwordError.message = 'You forgot to enter your new Password.';
                globalError = true;
            } else if (this.password.length < 8) {
                this.passwordError.state = true;
                this.passwordError.message = 'The Password must have at least 8 characters.';
                globalError = true;
            } else if (this.confirm_password < 1) {
                this.passwordError.state = true;
                this.passwordError.message = 'Forgot to confirm your Password.';
                globalError = true;
            } else if (this.password !== this.confirm_password) {
                this.passwordError.state = true;
                this.passwordError.message = 'The Passwords do not match';
                globalError = true;
            }

            return globalError;
        },
        codevalidate () {
            let globalError = false;
            if (this.code.length < 1) {
                this.codeError.state = true;
                this.codeError.message = 'You forget to enter your code.';
                globalError = true;
            }

            return globalError;
        },
        getPhoneUpdate: function ({formattedNumber, isValid}) {
            this.phoneValid = isValid;
            if (isValid) {
                this.phoNumber = formattedNumber;
            }
        },
        initReCaptcha: function () {
            setTimeout(() => {
                window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                    'size': 'invisible',
                    'callback': function (response) {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    // ...
                    },
                    'expired-callback': function () {
                        // Response expired. Ask user to solve reCAPTCHA again.
                        // ...
                    }
                });

                this.appVerifier = window.recaptchaVerifier;
            }, 1000);
        }
    },
    created () {
        this.initReCaptcha();
    },
    components: {
        downIcon,
        spinner,
        VuePhoneNumberInput
    }
};
</script>

<style scoped>
.uft {
    box-shadow: rgba(35, 98, 98, 0.16) 0px 20px 23px 0px;
    position: absolute;
    width: 100%;
    border-radius: 0 0 25px 25px;
}
</style>