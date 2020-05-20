<template>
  <div class="register-component user-form container" >
    <div class="uft" style="box-shadow: 0px 10px 20px rgba(35, 98, 98, 0.16); position: absolute; width: 100%;">
    <router-link v-if="!isMobile"  :to="{name: 'trips'}">
        <img  :src="lessgo_logo" />
    </router-link>
    <img  style="width: 45%; float: right;" v-if="isMobile" :src="lessgo_logo" />
    <h2 style="color: black; font-weight: bold; size: 22px; position: absolute; margin-left: 5%; margin-top: 24%;" class="create-acc">Create new account</h2>
    <h1 v-if="!(success && isMobile)"> Register new user </h1>
    </div>
    <div class='form row' v-if="!success">
      <br />
      <label style="margin-top:130px;" for="txt_name">First Name <span aria-label="Obligatory field" class="obligatory-field">*</span></label>
      <input autofocus v-jump:focus="'txt_surename'" ref="txt_name" name="txt_name" maxlength="25" type="text" id="txt_name" v-model='name' size="16" placeholder="John" :class="{'has-error': nameError.state }"/>
      <span class="error" v-if="nameError.state"> {{nameError.message}} </span>

      <label for="txt_surename">Last Name <span aria-label="Obligatory field" class="obligatory-field">*</span></label>
      <input v-jump:focus="'txt_surname'" ref="txt_surename" name="txt_surename" maxlength="25" type="text" id="txt_surename" v-model='sureName' size="16" placeholder="Doe" :class="{'has-error': lnameError.state }"/>
      <span class="error" v-if="lnameError.state"> {{lnameError.message}} </span>

      <label for="txt_gender">Gender <span aria-label="Obligatory field" class="obligatory-field">*</span></label>
      <br>
      <select v-model="gender" v-jump:focus="'txt_gender'" ref="txt_gender" name="txt_gender" maxlength="25" type="select" id="txt_gender" :class="{'has-error': genderError.state }">
      <option value="" disabled selected>Select your gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      </select>
      <span class="error" v-if="genderError.state"> {{genderError.message}} </span>
      <br>
      <label for="txt_email">Email <span aria-label="Obligatory field" class="obligatory-field">*</span></label>
      <input v-jump:focus="'txt_email'" ref="txt_email" name="txt_email" maxlength="40" type="text" id="txt_email" v-model='email' size="16" placeholder="john.doe@example.com" :class="{'has-error': emailError.state }"/>
      <span class="error" v-if="emailError.state"> {{emailError.message}} </span>

      <!--<label for="">Fecha de nacimiento <span aria-label="Campo obligatorio" class="obligatory-field">*</span></label>
      <DatePicker :value="birthday" ref="ipt_calendar" name="ipt_calendar" :maxDate="maxDate" :minDate="minDate" :class="{'has-error': birthdayError.state}" ></DatePicker>-->
      <!-- <span class="error" v-if="birthdayError.state"> {{birthdayError.message}} </span> -->

      <label for="txt_password">Password <span aria-label="Obligatory field" class="obligatory-field">*</span></label>
      <input v-jump:focus="'txt_password_confirmation'" ref="txt_password" name="txt_password" maxlength="40" type="password" id="txt_password" v-model='password' size="16" placeholder="• • • • • • • •" :class="{'has-error': passwordError.state }"/>
      <span class="error" v-if="passwordError.state"> {{passwordError.message}} </span>

      <label for="txt_password_confirmation">Password Confirmation <span aria-label="Obligatory field" class="obligatory-field">*</span></label>
      <input v-jump:focus="'ipt_terms'" ref="txt_password_confirmation" name="txt_password_confirmation" maxlength="40" type="password" id="txt_password_confirmation" v-model='passwordConfirmation' size="16" placeholder="• • • • • • • •" :class="{'has-error': passwordError.state }" />
      <span class="error" v-if="passwordError.state"> {{passwordError.message}} </span>

      <div class="terms">
        <input v-jump:click="'ipt_submit'" ref="ipt_terms" name="ipt_terms" type="checkbox" id="cbx_terms" v-model='termsAndConditions' />
        <label for="cbx_terms">I have read and accept the<router-link :to="{name: 'terms'}"> Terms and Conditions</router-link>.</label>
        <button ref="ipt_submit" name="ipt_submit" @click="register" class="btn-primary" :disabled="progress || !termsAndConditions"> Sign Up </button>
      </div>
    </div>
    <div style="    margin-top: 130px;width: 95%;margin-left: auto;margin-right: auto;" class='form row register-success' v-else>
        <h2>Successful registration! </h2>
        <p> We have sent a verification code to your e-mail so you can activate your account and start sharing trips. </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event';
import router from '../../router';
import DatePicker from '../DatePicker';
import moment from 'moment';
let emailRegex = /^((?!\.)[\w-_.]*[^.])(@gju.edu.jo)$/;
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
            email: '',
            password: '',
            passwordConfirmation: '',
            name: '',
            sureName: '',
            birthday: '',
            termsAndConditions: false,
            lessgo_logo: process.env.ROUTE_BASE + 'static/img/Group839.svg',
            progress: false,
            success: false,
            genderError: new Error(),
            emailError: new Error(),
            passwordError: new Error(),
            nameError: new Error(),
            lnameError: new Error(),
            birthdayError: new Error(),
            maxDate: moment().toDate(),
            minDate: moment('1900-01-01').toDate()
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
        email: function () { this.emailError.state = false; },
        name: function () { this.nameError.state = false; },
        sureName: function () { this.lnameError.state = false; },
        password: function () { this.passwordError.state = false; },
        birthdayAnswer: function () { this.birthdayError.state = false; }
    },
    components: {
        DatePicker
    },
    methods: {
        ...mapActions({
            doRegister: 'auth/register'
        }),
        validate () {
            let globalError = false;
            if (this.email.length < 1) {
                this.emailError.state = true;
                this.emailError.message = 'You forgot to enter your email. ';
                globalError = true;
            } else if (!emailRegex.test(this.email)) {
                this.emailError.state = true;
                this.emailError.message = 'Please Enter a valid GJU email"" ';
                globalError = true;
            }

            if (this.gender.value === 'Please select one') {
                this.genderError.state = true;
                this.genderError.message = 'Please make a selection';
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
                this.nameError.state = true;
                this.nameError.message = 'You forgot to enter your last name.';
                globalError = true;
            }

            /* console.log(this.birthdayAnswer);
            if (!this.birthdayAnswer || this.birthdayAnswer.length < 1) {
                this.birthdayError.state = true;
                this.birthdayError.message = 'Olvido ingresar su fecha de nacimiento.';
                globalError = true;
            } else {
                let birthday = moment(this.birthdayAnswer);
                if (moment().diff(birthday, 'years') < 18) {
                    this.birthdayError.state = true;
                    this.birthdayError.message = 'Lo sentimos, debes ser mayor de edad para usar el servicio. Para más información te recomendamos leer los términos y condiciones.';
                    globalError = true;
                }
            } */
            return globalError;
        },

        dateChange (value) {
            this.birthdayAnswer = value;
        },

        register (event) {
            if (this.validate()) {
                dialogs.message('You must correct or complete some fields to complete your registration.', { duration: 10, state: 'error' });
                return;
            }
            let gender = this.gender;
            let email = this.email;
            let password = this.password;
            let passwordConfirmation = this.passwordConfirmation;
            let name = this.name + ' ' + this.sureName;
            let termsAndConditions = this.termsAndConditions;
            let birthday = this.birthdayAnswer;
            this.progress = true;
            this.doRegister({gender, email, password, passwordConfirmation, name, birthday, termsAndConditions}).then(() => {
                this.progress = false;
                this.success = true;
            }).catch((err) => {
                console.log(err);
                if (err) {
                    if (err.status === 422) {
                        if (err.data && err.data.errors && err.data.errors.email) {
                            dialogs.message('The email account entered is in use.', {state: 'error'});
                            this.emailError.state = true;
                            this.emailError.message = 'The email account entered is in use.';
                        } else {
                            dialogs.message('Some of the fields entered is not valid.', {state: 'error'});
                        }
                    } else {
                        dialogs.message('There was an error processing the registry, please try again.', {state: 'error'});
                    }
                }
                this.progress = false;
            });
        },
        onBackClick () {
            router.back();
        },
        onClearClick () {
            router.back();
        }
    },
    mounted () {
        bus.on('back-click', this.onBackClick);
        bus.on('clear-click', this.onClearClick);

        bus.on('date-change', this.dateChange);
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
    .obligatory-field,
    .campos-obligatorios {
        color: red;
        width: 95%;
        margin-left: auto;
    }
    input[type="checkbox"] {
        width: auto;
        margin-left: 4%;
    }
    a {
        color: #42b983;
    }
    .terms {
        margin-top: 1.8rem;
    }
    .user-form a {
        font-weight: bold;
    }
    span.error {
        display: block;
        font-size: 12px;
        margin-top: -5px;
        font-weight: bold;
        color: #24007c;
    }
    .cbx_terms {
        display: inline;
    }
    .register-success * {
        color: #333333;
    }
    h2 {
        color: #fff;
    }
    .uft {
        box-shadow: rgba(35, 98, 98, 0.16) 0px 20px 23px 0px;
        position: absolute;
        width: 100%;
    }
    @media only screen and (min-width: 768px) {
        .user-form .btn-primary {
            text-align: center;
            max-width: 170px;
            padding: 1em;
            text-size-adjust: 16px;
        }
        h2 {
            color: #036686;
        }
        .terms button {
            margin-left: 2rem;
            text-align: right;
        }
        span.error {
            color: red;
            font-weight: 300;
        }
    }

    img {
        vertical-align: middle;
        width: 20em;
    }

    h2.signup-text {
        font-size: 16px;
        color: #000000;
        font-weight: bolder;
        margin-left: 5px;
    }

</style>
