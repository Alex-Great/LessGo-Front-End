<template>
  <div>
    <!-- signup logo area -->
    <div class="uft" style="box-shadow: rgba(35, 98, 98, 0.16) 9px 10px 10px;; position: absolute; width: 100%;">
        <router-link v-if="!isMobile"  :to="{name: 'trips'}">
            <img  :src="lessgo_logo" />
        </router-link>
        <img  style="width: 45%; float: right; border-radius: 0 0 25px 25px" v-if="isMobile" :src="lessgo_logo" />
        <h2 v-if="pageNumber === 1" class="signup-title create-acc">Create new account</h2>
        <h2 v-if="pageNumber === 2" class="signup-title create-acc">Enter your phone number</h2>
        <h2 v-if="pageNumber === 3" class="signup-title create-acc">One Time Password</h2>
    </div>

    <!-- signup body -->
        <div class="signup-body">
            <div id="recaptcha-container" data-sitekey="6LdIIeIUAAAAALru4MJbVWQxXvtHyAmj2ro4XJ5q"></div>
            <!-- first singup area -->
            <div v-if="pageNumber === 1">
                <!-- first name -->
                <h2 class="first-margin">First Name</h2>
                <input type="text" v-model="name" placeholder="Jhon" />
                <span class="error" v-if="nameError.state"> {{nameError.message}} </span>

                <!-- last name -->
                <h2>Last Name</h2>
                <input type="text" v-model="sureName" placeholder="Doe" />
                <span class="error" v-if="lnameError.state"> {{lnameError.message}} </span>

                <!-- date of birth -->
                <h2>Date of birth</h2>
                <DatePicker @onChange="getBirth" :calendarFlag="false" :class="'data-picker'" :padding="0" />
                <span class="error" v-if="birthdayError.state"> {{birthdayError.message}} </span>

                <!-- gender -->
                <h2>Gender</h2>
                <select class="gender-select" v-model="gender" v-jump:focus="'txt_gender'" ref="txt_gender" name="txt_gender" maxlength="25" type="select" id="txt_gender" :class="{'has-error': genderError.state }">
                    <option value="" disabled selected>Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <span class="error" v-if="genderError.state"> {{genderError.message}} </span>

                <!-- password -->
                <h2>Create password</h2>
                <input type="password" v-model="password" placeholder="password" />
                <span class="error" v-if="passwordError.state"> {{passwordError.message}} </span>

                <!-- confirm password -->
                <h2>Confirm password</h2>
                <input type="password" v-model="passwordConfirmation" placeholder="repeat password" />
                <span class="error" v-if="passwordError.state"> {{passwordError.message}} </span>
            </div>

            <!-- second signup area -->
            <div v-if="pageNumber === 2">
                <h2 class="first-margin">Phone number</h2>
                <VuePhoneNumberInput @update="getPhoneUpdate" class="phone-number-input" v-model="phoneNumber" />
                <span class="error" v-if="phoneError.state"> {{phoneError.message}} </span>
            </div>

            <!-- third signup area -->
            <div v-if="pageNumber === 3">
                <h2 class="first-margin">Enter code</h2>
                <input type="number" v-model="code" placeholder="here enter code..." />
                <span class="error" v-if="codeError.state"> {{codeError.message}} </span>
                <span class="counter-span">Resend code (0:{{ count }})</span>
            </div>

            <!-- signup buttons area -->
            <div class="singup-area" :style="(pageNumber === 1)?'': (pageNumber === 2)?'margin-top: 41vh': 'margin-top: 36vh'">
                <button @click="selectPage(1)" class="next-btn">
                    <p>{{ (pageNumber === 3)?'Join LessGo': 'Next' }}</p>
                    <downIcon :color="'white'" style="transform: rotate(-90deg);" />
                    <spinner v-if="signupFlag" class="loading" />
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
import bus from '../../services/bus-event';
import router from '../../router';
import DatePicker from '../DatePicker';
import moment from 'moment';
import VuePhoneNumberInput from 'vue-phone-number-input';

// import components for this
import downIcon from '../../icon/DownIcon';
import spinner from '../Spinner.vue';

// let emailRegex = /^((?!\.)[\w-_.]*[^.])(@gju.edu.jo)$/;
class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'register',
    data () {
        return {
            gender: '',
            password: '',
            passwordConfirmation: '',
            name: '',
            sureName: '',
            birthday: '',
            phoneNumber: '',
            phoNumber: '',
            code: '',
            lessgo_logo: process.env.ROUTE_BASE + 'static/img/Group839.svg',
            progress: false,
            success: false,
            genderError: new Error(),
            codeError: new Error(),
            passwordError: new Error(),
            nameError: new Error(),
            lnameError: new Error(),
            birthdayError: new Error(),
            phoneError: new Error(),
            maxDate: moment().toDate(),
            minDate: moment('1900-01-01').toDate(),
            signupData: null,
            pageNumber: 1,
            count: 59,
            signupFlag: false,
            phoneValid: false,
            appVerifier: ''
        };
    },
    computed: {
        ...mapGetters({
            checkLogin: 'auth/checkLogin',
            isMobile: 'device/isMobile'
        })
    },
    watch: {
        gender: function () { this.genderError.state = false; },
        name: function () { this.nameError.state = false; },
        sureName: function () { this.lnameError.state = false; },
        password: function () { this.passwordError.state = false; },
        birthdayAnswer: function () { this.birthdayError.state = false; },
        code: function () { this.codeError.state = false; },
        phoneNumber: function () { this.phoneError.state = false; }
    },
    components: {
        DatePicker,
        downIcon,
        spinner,
        VuePhoneNumberInput
    },
    methods: {
        ...mapActions({
            saveData: 'auth/saveSignupData'
        }),
        selectPage: function (id) {
            let currentPageNum = this.pageNumber;
            switch (currentPageNum) {
            case 1: // first page
                if (id === 1) {
                    if (this.validate()) {
                        dialogs.message('You must correct or complete some fields to complete your registration.', { duration: 10, state: 'error' });
                        return;
                    }

                    let data = {
                        gender: this.gender,
                        birthday: this.birthday,
                        passwordConfirmation: this.passwordConfirmation,
                        password: this.password,
                        name: this.name + ' ' + this.sureName
                    };
                    this.signupData = data;
                    this.pageNumber += id;
                } else { // to signin page
                    this.$router.push({name: 'signin'});
                }
                break;
            case 2: // second page
                if (id === 1) {
                    let vm = this;
                    if (!this.phoneValid) {
                        this.phoneError.state = true;
                        this.phoneError.message = 'You must validate your phone number.';
                        dialogs.message('You must correct or complete Phone Number field to complete your registration.', { duration: 10, state: 'error' });
                        return;
                    }

                    // send phoneNumber for verify and get otp code
                    let phoNumber = this.phoNumber;
                    let appVerifier = this.appVerifier;

                    console.log('phoNumber', phoNumber);
                    firebase.auth().signInWithPhoneNumber(phoNumber, appVerifier)
                        .then(function (confirmationResult) {
                            window.confirmationResult = confirmationResult;
                            window.alert('SMS sent');

                            vm.signupData['mobile'] = phoNumber;
                            // vm.signupData['email'] = 'zeus@gju.edu.jo';
                            vm.pageNumber += id;
                        })
                        .catch(error => {
                            console.log('error', error)
                            window.alert('Error ! SMS not sent');
                        });
                } else { // to signin page
                    this.pageNumber += id;
                }
                break;
            case 3: // third page
                if (id === 1) {
                    if (this.codevalidate()) {
                        dialogs.message('You must correct or complete Verify field to complete your registration.', { duration: 10, state: 'error' });
                        return;
                    }

                    this.signupFlag = true;
                    let vm = this;
                    let otp = this.code;

                    // verify phoneNumber from otp
                    window.confirmationResult.confirm(otp)
                        .then(function (result) {
                            console.log('result', result);
                            let user = result.user;

                            let data = vm.signupData;
                            // data.active = true;

                            // save SignData
                            vm.saveData(data);
                            vm.signupFlag = false;
                            // success register
                            vm.$router.push({name: 'signUpSuccess'});
                            // vm.doRegister(data).then(() => {
                            //     vm.signupFlag = false;
                            //     vm.$router.push({name: 'signUpSuccess'});
                            // }).catch((err) => {
                            //     console.log(err);
                            //     if (err) {
                            //         if (err.status === 422) {
                            //             if (err.data && err.data.errors && err.data.errors.email) {
                            //                 dialogs.message('The email account entered is in use.', {state: 'error'});
                            //                 vm.emailError.state = true;
                            //                 vm.emailError.message = 'The email account entered is in use.';
                            //             } else {
                            //                 dialogs.message('Some of the fields entered is not valid.', {state: 'error'});
                            //             }
                            //         } else {
                            //             dialogs.message('There was an error processing the registry, please try again.', {state: 'error'});
                            //         }
                            //     }
                            //     vm.progress = false;
                            // });
                        })
                        .catch(function (error) {
                            console.log('error', error);
                        });
                } else { // to signin page
                    this.pageNumber += id;
                }
                break;
            default:
                break;
            }
        },
        getBirth: function (date) {
            this.birthday = date;
            this.birthdayError.state = false;
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
        validate () {
            let globalError = false;
            if (this.gender === '') {
                this.genderError.state = true;
                this.genderError.message = 'Plsase select your gender.';
            }

            if (this.password.length < 1) {
                this.passwordError.state = true;
                this.passwordError.message = 'You forgot to enter your Password.';
                globalError = true;
            } else if (this.password.length < 8) {
                this.passwordError.state = true;
                this.passwordError.message = 'The Password must have at least 8 characters.';
                globalError = true;
            } else if (this.passwordConfirmation < 1) {
                this.passwordError.state = true;
                this.passwordError.message = 'Forgot to confirm your Password.';
                globalError = true;
            } else if (this.password !== this.passwordConfirmation) {
                this.passwordError.state = true;
                this.passwordError.message = 'The Passwords do not match';
                globalError = true;
            }

            if (this.name.length < 1) {
                this.nameError.state = true;
                this.nameError.message = 'You forgot to enter your first name.';
                globalError = true;
            }

            if (this.sureName.length < 1) {
                this.lnameError.state = true;
                this.lnameError.message = 'You forgot to enter your last name.';
                globalError = true;
            }

            if (this.birthday === null) {
                this.birthdayError.state = true;
                this.birthdayError.message = 'Please select your birthday.';
                globalError = true;
            } else {
                let value = 60 * 60 * 24 * 365 * 1000;
                let nowDate = new Date();
                if ((nowDate.getTime() - this.birthday.getTime()) < 0 || ((nowDate.getTime() - this.birthday.getTime()) / value).toFixed() < 18) {
                    this.birthdayError.state = true;
                    this.birthdayError.message = 'It seems that you are not of legal age. Check if you entered your birth date well and remember that you must be of legal age to use LessGo. For more information we recommend you to read the terms and conditions again.';
                    globalError = true;
                }
            }

            return globalError;
        },

        dateChange (value) {
            this.birthdayAnswer = value;
        },
        onBackClick () {
            router.back();
        },
        onClearClick () {
            router.back();
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
    mounted () {
        bus.on('back-click', this.onBackClick);
        bus.on('clear-click', this.onClearClick);

        bus.on('date-change', this.dateChange);
    },
    created () {
        this.initReCaptcha();
    },
    beforeDestroy () {
        bus.off('back-click', this.onBackClick);
        bus.off('date-change', this.dateChange);
    }
};
</script>

<style>
    .app-container {
        min-height: 100vh;
    }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .uft {
        box-shadow: rgba(35, 98, 98, 0.16) 0px 20px 23px 0px;
        position: absolute;
        width: 100%;
        border-radius: 0 0 25px 25px;
    }
</style>
