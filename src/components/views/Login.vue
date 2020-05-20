<template>
  <div class="user-form container" >
    <router-link v-if="!isMobile"  :to="{name: 'trips'}">
        <img :src="lessgo_logo" />
    </router-link>
    <div class='form row'>
    <img  :src="lessgo_logo_vertical" />


      <div class="col-sm-12 col-md-12 login-box" v-show="isShowLogin || !isMobile">
        <div class='visual-trick'>
            <label for="txt_user">Email Address</label>
            <input placeholder="john.doe@example.com" ref="txt_user" type="email" id="txt_user" v-model="email" v-jump:focus="'txt_password'" />
            <label for="txt_password">Password</label>
            <input  placeholder="• • • • • • • •" ref="txt_password" type="password" id="txt_password" v-jump:click.blur="'btn_login'" v-model='password' />
            <div class="alert alert-info" role="alert" v-if="showUserNotActiveInfo">
                 To login you must activate your account, we have sent a verification code to your e-mail so you can activate your account.
            </div>
             <div style="margin: 1em 0"  v-show="isShowLogin && isMobile" >
        <router-link class='password-not' :to="{name:'reset-password'}">Forgot Password?</router-link>
      </div>
            <button ref="btn_login" id="btn_login" class="btn btn-primary btn-shadowed-black" @click="login" :disabled="loading"> <span v-if="!loading">Login</span> <spinner class="blue" v-if="loading"></spinner></button>

            <div class="signup">
              <h2 class="signup-text"> Don’t have an account? </h2>
              <button ref="btn_signup" id="btn_signup" class="btn btn-primary btn-shadowed-black" @click="signup" :disabled="loading"> <span v-if="!loading">Sign Up</span> <spinner class="blue" v-if="loading"></spinner></button>
           </div>
        </div>
        
        <div class='pass-options' v-if="!isMobile">
            <input id="checkbox_remember" type="checkbox" /><label for="checkbox_remember">Remember me</label><span> - </span><router-link class='login-forget' :to="{name:'reset-password'}">Fogot Password? </router-link>
        </div>

      </div>

       <div class="col-sm-12 col-md-12" v-show="isMobile">
        <button ref="btn_show_login" id="btn_show_login" class="btn btn-primary btn-shadowed-black" @click="showLogin" v-show="!isShowLogin"> <span>Sign in</span></button>
      </div>
      <span v-if="loading"> Loading... </span>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import dialogs from '../../services/dialogs.js';
import router from '../../router';
import bus from '../../services/bus-event';
import spinner from '../Spinner.vue';
import cache from '../../services/cache';

export default {
    name: 'login',
    data () {
        return {
            email: '',
            password: '',
            loading: false,
            fbLoading: false,
            error: '',
            lessgo_logo: '/static/img/lessgo_logo.png',
            lessgo_logo_vertical: '/static/img/lessgo_logo_vertical.png',
            hasScroll: false,
            isUnderstood: true,
            dontShowAgain: false,
            isShowLogin: true,
            showUserNotActiveInfo: false
        };
    },
    computed: {
        ...mapGetters({
            checkLogin: 'auth/checkLogin',
            isMobile: 'device/isMobile'
        })
    },
    methods: {
        ...mapActions({
            doLogin: 'auth/login', // map this.add() to this.$store.dispatch('increment')
            fbLogin: 'cordova/facebookLogin'
        }),
        fbWarningGetIt () {
            this.isUnderstood = true;
            if (this.dontShowAgain) {
                cache.setItem('fbLoginWarningDontShow', true);
            }
        },
        login () {
            if (!this.fbLoading) {
                this.showUserNotActiveInfo = false;
                this.loading = true;
                let email = this.email;
                let password = this.password;
                this.doLogin({email, password}).then(data => {
                    this.loading = false;
                    // router.push({ name: 'trips' });
                    // router.rememberBack();
                }, error => {
                    const userNotActive = error && error.message === 'user_not_active';
                    const message = userNotActive ? 'To login you must activate your account first.' : 'Incorrect email or password.';
                    this.showUserNotActiveInfo = userNotActive;

                    dialogs.message(message, { duration: 10, state: 'error' });
                    if (error) {
                        this.error = error.error;
                    }
                    this.loading = false;
                });
            } else {
                dialogs.message('Your request has already been sent, please wait a moment.', { duration: 10, state: 'error' });
            }
        },
        signup () {
            router.push({ name: 'register' });
        },
        showLogin () {
            this.isShowLogin = true;
        },

        facebookLogin () {
            if (!this.loading) {
                this.fbLoading = true;
                this.fbLogin().catch((response) => {
                    if (response.errors && response.errors.email) {
                        dialogs.message('The email associated with your facebook account, already has an associated account in lessgo. Please, I entered using the login by email. If you do not remember your password, click on forgot my password.', { duration: 10, state: 'error' });
                    }
                });
            } else {
                dialogs.message('Your request has already been sent, please wait a moment.', { duration: 10, state: 'error' });
            }
        },

        onClearClick () {
            router.back();
        }
    },

    mounted () {
        bus.on('clear-click', this.onClearClick);
        let viewPort = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        if (!this.isMobile) {
            this.$refs.txt_user.focus();
        }

        this.hasScroll = document.body.scrollHeight > viewPort;
        cache.getItem('fbLoginWarningDontShow').then((value) => {
            console.log('fbLoginWarningDontShow', value);
            if (value) {
                this.isUnderstood = true;
            }
        });
    },

    beforeDestroy () {
        bus.off('clear-click', this.onClearClick);
    },

    components: {
        spinner
    }
};
</script>

<style>

button#btn_login {
    border-radius: 10px;
    background-color: #E65A5B;
    color: white;
    box-shadow: 0px 0px 20px rgba(235, 85, 87, 0.32);
    border: none;
}

.app-container {
  min-height: 100vh;
}
.container {
    padding-left: auto !important;
    padding-right: auto !important;
}

</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fb-terms {
  color: #676767;
}

.facebook-box {
  margin-top: 0.5em !important;
}

.password-not {
  text-align: center;
  margin-top: 16px;
  display: block;
  text-align: right;
  opacity: 0.75;
  color: #5B5B5B;
  font-weight: bold;
  padding-left: 10px;
}

label {
  margin-top: 0.3em;
  font-weight: bold;
}

.login-forget {
  font-weight: bold;
  padding-left: 12px;
  color: #016587;
}

.user-form .btn-primary.btn-facebook {
  width: 90%;
}

.description {
  font-size: 11px;
  text-transform: none;
  color: #fff;
  display: block;
}

.btn-facebook.btn-with-icon--icon {
  background-color: var(--button-facebook-blue-left);
}

.register {
  font-weight: 300;
  font-size: 16px;
  display: block;
  padding: 1.4em 0;
  position: relative;
  display: inline-block;
}

.register::before {
  position: absolute;
  /* border-top: solid 1px #2793ff; */
  width: 90%;
  margin-left: 5%;
  content: " ";
  top: 0;
  left: 0;
}

.register::after {
  position: absolute;
  width: 90%;
  margin-left: 5%;
  content: " ";
  bottom: 0;
  left: 0;
}

.alert-warning a {
  color: #1b8882;
}

.register {
  color: #676767;
}

.alert-warning {
  background-color: #eb5557;
  border-color: #fff;
  color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  width: 94%;
  margin: 10vh 3%;
  height: 80vh;
  z-index: 100;
}

@media only screen and (min-width: 768px) {
  .login-box {
    margin-right: 0;
  }
  .alert-warning {
    position: static;
    width: auto;
    height: auto;
    margin: auto;
    margin-bottom: 1em;
  }
  .register {
    color: #555;
  }
  .description {
    display: inline;
    padding-left: 0.4em;
    color: rgb(1, 101, 135);
  }
  .visual-trick {
    border-right: solid 1px #ccc;
    padding-right: 4rem;
  }
  .form > div:last-child {
    padding-left: 4em;
  }
  .user-form .btn-primary.btn-facebook {
    width: 100%;
    max-width: 280px;
    margin: 1.6em 0 0.6em 0;
  }
  .register {
    display: inline;
    margin-bottom: 2em;
    font-weight: 400;
  }
  .register::before {
    display: none;
  }
  .register::after {
    display: none;
  }
}

.form-warning-login label {
  color: black;
}

.form-warning-login .checkbox {
  display: inline-block;
  margin-right: 1em;
}

.form-warning-login .checkbox span {
  text-transform: none;
}

.form-warning-login * {
  vertical-align: middle;
}

.form-warning-login button {
  margin-top: 0em;
}

@media only screen and (min-width: 768px) {
  .form-warning-login button {
    margin-top: 0.5em;
  }
  [type="checkbox"] {
    margin-top: 0;
  }

  .actionbar_section.actionbar_icon img {
    visibility: hidden;
}
}

#btn_show_login {
  border: 1px solid #B5B5B5;
  color: #373737;
  border-radius: 12px;
  background: transparent;
  width: 134px;
  height: 44px;
}

.user-form .form img{
    width: 40%;
    margin-bottom: 15%;
    margin-top: 5%;

}

.col-sm-12.col-md-12.login-box {
    text-align: left;
}

.col-sm-12.col-md-12.login-box {
    width: 100%;
    padding: 0;
}
</style>
