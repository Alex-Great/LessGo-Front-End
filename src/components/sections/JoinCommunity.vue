<template>
    <div v-show="show" class="joinCommunity">
        <!-- virtual bk -->
        <div class="virtual-bk"></div>
        <div class="community-board">
            <!-- board title -->
            <div class="community-content">
                <div class="img-circle" :style="{'background': 'url(' + data.img_url + ')'}"></div>
                <div class="community-board-detail">
                    <h3>{{ data.name }}</h3>
                    <span>{{ data.title }}</span>
                </div>
            </div>

            <!-- email valid area -->
            <div class="email-valid">
                <span>
                    {{
                        (!emailValid)? "ENTER EMAIL VALID" : "WE' SENT YOU A CONFIRMATION EMAIL"
                    }}
                </span>
                <input v-if="!emailValid" type="text" name="valid-email" v-model="emailValue" :placeholder="'example' + data.domain" />
                <span class="error" v-if="emailError.state"> {{emailError.message}} </span>
                <span v-if="emailValid" class="sent-text">
                    Check your email to activate your <p>{{ data.name }}</p> community membership
                </span>
                <button ref="join_btn" v-if="!emailValid" @click="validEmail" disabled="disabled" >Join</button>
                <button @click="goMain" class="email-sent-btn" v-if="emailValid" :disabled="activeFlag">
                    <checkIcon :color="'#8c8a8a'" />
                    E-mail sent
                </button>
            </div>
            <!-- join btn -->
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import firebase from 'firebase';

// import components for this
import dialogs from '../../services/dialogs.js';
import checkIcon from '../../icon/CheckIcon.vue';

// regex
let emailRegexForGju = /^((?!\.)[\w-_.]*[^.])(@gju.edu.jo)$/;
let emailRegexForBank = /^((?!\.)[\w-_.]*[^.])(@bankaletihad.com)$/;

class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'joinCommunity',
    data () {
        return {
            emailValue: '',
            emailValid: false,
            bank_img: process.env.ROUTE_BASE + 'static/img/bank.png',
            emailError: new Error(),
            activeFlag: false
        };
    },
    props: {
        data: {
            type: Object,
            required: true,
            default: {}
        },
        show: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    watch: {
        emailValue: function () {
            if (this.emailValue === '') {
                this.$refs.join_btn.setAttribute('disabled', 'disabled');
            } else {
                this.$refs.join_btn.removeAttribute('disabled');
            }
            this.emailError.state = false;
        }
    },
    computed: {
        ...mapGetters({
            signData: 'auth/singupData',
            user: 'auth/user'
        })
    },
    methods: {
        ...mapActions({
            doRegister: 'auth/register',
            autoLogin: 'auth/login',
            update: 'auth/update'
        }),
        validate: function () {
            let globalError = false;
            if (this.data.id === 1) {
                if (!emailRegexForBank.test(this.emailValue)) {
                    this.emailError.state = true;
                    this.emailError.message = 'Your e-mail must be Bank Al Etihad e-mail';
                    globalError = true;
                }
            } else {
                if (!emailRegexForGju.test(this.emailValue)) {
                    this.emailError.state = true;
                    this.emailError.message = 'Your e-mail must be GJU e-mail';
                    globalError = true;
                }
            }
            return globalError;
        },
        validEmail: function () {
            // if (this.validate()) {
            //     dialogs.message('Incorrect email.', { duration: 10, state: 'error' });
            //     return;
            // }
            let vm = this;
            // check signin status and community status
            if (this.data.signStatus === 'signup') {
                // verify email
                const email = this.emailValue;
                const pass = '123456';
                const auth = firebase.auth();
                const promise = auth.createUserWithEmailAndPassword(email, pass);
                promise.catch(event => console.log('promise', event.message));

                auth.onAuthStateChanged(firebaseUser => {
                    if (firebaseUser) {
                        firebaseUser.sendEmailVerification().then(function () {
                            let data = vm.signData;
                            data['email'] = vm.emailValue;
                            data['community'] = vm.data.domain;
                            // new register
                            vm.doRegister(data).then(response => {
                                console.log('response', response);
                            }).catch((err) => {
                                console.log('err', err);
                            });
                            vm.emailValid = true;
                            vm.activeFlag = true;
                            dialogs.message('Successfully E-mail validate', { duration: 10, state: 'success' });
                        }, function (error) {
                            // window.alert('not send Verification');
                        });
                    } else {
                        console.log('not logged in');
                    }
                });
            } else {
                if (this.user.second_community === null) {
                    if (this.user.community === this.data.domain) {
                        dialogs.message('You have already joined this community.', { duration: 10, state: 'error' });
                        return;
                    } else {
                        // verify email
                        const email = this.emailValue;
                        const pass = '123456';
                        const auth = firebase.auth();
                        const promise = auth.createUserWithEmailAndPassword(email, pass);
                        promise.catch(event => console.log('promise', event.message));

                        auth.onAuthStateChanged(firebaseUser => {
                            if (firebaseUser) {
                                firebaseUser.sendEmailVerification().then(function () {
                                    // update user
                                    vm.user.second_community = vm.data.domain;
                                    vm.update(vm.user)
                                        .then(result => {
                                            console.log('result', result);
                                        })
                                        .catch(err => {
                                            console.log('err', err);
                                        });
                                    vm.emailValid = true;
                                    dialogs.message('Successfully E-mail validate', { duration: 10, state: 'success' });
                                }, function (error) {
                                    // window.alert('not send Verification');
                                });
                            } else {
                                console.log('not logged in');
                            }
                        });
                    }
                } else {
                    dialogs.message('You have already joined this community.', { duration: 10, state: 'error' });
                    return;
                }
            }
        },
        goMain: function () {
            this.$router.push({ name: 'main' });
        }
    },
    components: {
        checkIcon
    }
};
</script>