<template>
    <div class="user-form container " >
        <router-link v-if="!isMobile"  :to="{name: 'trips'}">
            <img :src="lessgo_logo" />
        </router-link>
        <h1> Reset Password </h1>
        <div class="form row" v-if="send">
            <h3> An email has been sent to your mailbox with the instructions to reset your Password. </h3>
        </div>
        <div class="form row message" v-else-if="!token">
            <label for="txt_email">E-mail</label>
            <input type="text" id="txt_email" v-model='email'/>

            <button class="btn btn-primary btn-shadowed-black" @click="reset"> Recover Password </button>
            <span v-if="loading" class='loading'> wait a sec... </span>
            <span v-if="error"> {{error}} </span>
        </div>
        <div class='form row' v-else-if="token">
            <label for="txt_password">Password</label>
            <input  type="password" id="txt_password" v-model='password' />

            <label for="txt_password">Password Confirmation </label>
            <input  type="password" id="txt_password" v-model='password_confirmation' />

            <button class="btn btn-primary" @click="change"> Change Password </button>
            <span v-if="loading" class='loading'> wait a sec... </span>
            <span v-if="error"> {{error}} </span>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import bus from '../../services/bus-event';
import router from '../../router';

let emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export default {
    name: 'reset-password',
    props: {
        'token': {
            type: String,
            required: false
        }
    },

    data () {
        return {
            email: '',
            loading: false,
            error: null,
            send: false,
            password_confirmation: '',
            password: '',
            lessgo_logo: process.env.ROUTE_BASE + 'static/img/lessgo_logo.png'
        };
    },
    computed: {
        ...mapGetters({
            isMobile: 'device/isMobile'
        })
    },

    methods: {
        ...mapActions({
            'resetPassword': 'auth/resetPassword',
            'changePassword': 'auth/changePassword'
        }),

        reset () {
            this.error = null;
            if (emailRegex.test(this.email)) {
                this.loading = true;
                this.resetPassword(this.email).then(() => {
                    this.loading = false;
                    this.send = true;
                }, () => {
                    this.loading = false;
                    this.error = 'This Email does not belong to any user.';
                });
            } else {
                this.error = 'Please Enter a valid e-mail.';
            }
        },

        change () {
            this.error = null;
            if (this.password === this.password_confirmation) {
                this.loading = true;
                let data = {};
                data.password = this.password;
                data.password_confirmation = this.password_confirmation;
                let token = this.token;
                this.changePassword({token, data}).then(() => {
                    this.$router.replace({name: 'login'});
                }, () => {
                    this.loading = false;
                    this.error = 'Token Invalid';
                });
            } else {
                this.error = 'Do not coicide the fields';
            }
        },
        onBackClick () {
            router.back();
        }
    },

    mounted () {
        bus.on('back-click', this.onBackClick);
    },

    beforeDestroy () {
        bus.off('back-click', this.onBackClick);
    }
};
</script>

<style>
  .app-container {
    min-height: 100vh;
  }
</style>

<style scoped>
    h3 {
        margin-bottom: 2em;
        font-size: 18px;
    }
    label {
        display: block;
        margin-top: .3em;
        margin-bottom: .6em;
    }
    input {
        margin-bottom: 0.8em;
    }
    loading {
        margin-left: 1em;
    }
    .message > span {
        vertical-align: -.6em;
        color: red;
        margin-left: 2em;
    }
    h3 {
        color: #fff;
    }
    @media only screen and (min-width: 768px) {
        h3 {
            color: #036686;
        }
    }
</style>
