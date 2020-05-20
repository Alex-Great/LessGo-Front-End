<template>
  <div class="update-profile-component" v-if="user" >
    <div class="alert alert-info" v-if="!user.image || user.image.length === 0 || !user.description || user.description.length === 0">
        <div class='alert-icon'><i class="fa fa-exclamation" aria-hidden="true"></i></div>
        <div class='alert-message'>
            Hello <strong>{{user.name}}</strong> Welcome to lessgo, to start taking trips and create your own trips, you must finish completing your profile.
            <span v-if="(!user.image || user.image.length === 0) && (!user.description || user.description.length === 0)">
                Complete your <strong> profile picture</strong> and your <strong>description</strong> to start traveling.
            </span>
            <span v-if="(!user.image || user.image.length === 0) && !(!user.description || user.description.length === 0)">
                Complete your <strong> profile picture</strong> to start traveling.
            </span>
            <span v-if="!(!user.image || user.image.length === 0) && (!user.description || user.description.length === 0)">
                Complete your <strong> description</strong> to start traveling.
            </span>
        </div>
    </div>
    <div class="row">
            <header>
    <div class="profileContainer">

      <div class="imageandnamecontainer">
        <div class="circle-box profile" v-imgSrc:profile="user.image">
          <div @click="changePhoto" class="profile_image-edit">
              <svgItem icon='addPhoto' size='20'></svgItem>
          </div>
        </div>
        <div id="nameandrating">
          <p style="font-size: 1.4em;color: black; font-weight: 200">{{user.name}}</p>
          <p id="reviewfont">{{ this.user.positive_ratings + this.user.negative_ratings }} Ratings</p>
        </div>
      </div>
      <div id="buttongroup">



    <button class="btn btn-primary" @click="grabar" :disabled="loading">
        <span v-if="!loading">Save </span><span v-if="loading">Saving ...
            </span>
        </button>



      </div>
    </div>
    </header>
        </div>
        <div class="col-xs-24 col-sm-16 col-sm-pull-8">
            <div class='form update-profie'>
                <div class="alert alert-info">
                    Generate trust with the rest of the lessgo community, use a photo of yourself and tell them a little about you. With that you increase your chances of someone wanting to share a trip with you ... it's true, bringing a treat to share also helps a lot :D
                </div>
                <label class="contact-description">CONTACT AND IDENTIFICATION </label>

                 <div class="form-group">
                    <label for="input-description">BIO <span class="description"> (preferences, interests and hobbies) </span> </label>
                    <textarea maxlength="1000" v-model="user.description" placeholder="Description" :class="{'has-error': descError.state }" ></textarea>
                    <span class="error textarea" v-if="descError.state"> {{descError.message}} </span>
                </div>
                 <div class="form-group">
                    <label for="input-name">Name <span class="description"> (cannot be edited) </span> <span class="required-field-flag" title="Required field">(*)</span></label>
                    <input maxlength="25" v-model="user.name" type="text" class="form-control" id="input-name" placeholder="Nombre" :class="{'has-error': nameError.state }" :disabled="!firstTime" />
                    <span class="error" v-if="nameError.state"> {{nameError.message}} </span>
                </div>
                 <div class="form-group">
                    <label for="input-gender">Gender <span class="description"> (cannot be edited) </span></label>
                    <input maxlength="25" v-model="user.gender" type="text" class="form-control" id="input-gender" placeholder="Nombre" :class="{'has-error': nameError.state }" :disabled="!firstTime" />
                </div>

                <div class="form-group">
                    <label for="input-email">Email <span class="description"> (cannot be edited) </span></label>
                    <input maxlength="40" v-model="user.email" type="text" class="form-control" id="input-email" placeholder="E-mail" disabled>
                </div>
                  <div class="form-group">
                    <label for="input-telefono">Phone number </label>
                    <input maxlength="13" @keydown="isNumber" v-on:paste='isNumber' v-model="user.mobile_phone" type="tel" class="form-control" id="input-phone" placeholder="Phone Number" :class="{'has-error': phoneError.state }">

                    <span class="error" v-if="phoneError.state"> {{phoneError.message}} </span>
                </div>
                <div class="form-group">
                    <label for="">Birthday  </label>
                    <DatePicker :value="birthday | moment('YYYY-MM-DD') " ref="ipt_calendar" name="ipt_calendar" :maxDate="maxDate" :minDate="minDate" :class="{'has-error': birthdayError.state}" ></DatePicker>
                    <span class="error" v-if="birthdayError.state"> {{birthdayError.message}} </span>
                </div>

                <div class="form-group">
                    <label for="input-dni">ID Number<span class="description">(Driver’s License, National Card, Passport)</span></label>
                    <input v-numberMask="'dniRawValue'" type="text" data-max-length="10" v-model="user.nro_doc" class="form-control" id="input-dni" placeholder="Id" :class="{'has-error': dniError.state }">
                    <span class="error" v-if="dniError.state"> {{dniError.message}} </span>
                </div>


                 <div class="form-group">
                    <label for="input-cartype">Car Model </label>
                    <input maxlength="20"   v-model="user.cartype" type="cartype" class="form-control" id="input-cartype" placeholder="Car Type" :class="{'has-error': cartypeError.state }">
                    <span class="error" v-if="cartypeError.state"> {{cartypeError.message}} </span>
                </div>

                <div class="form-group">
                    <label for="input-patente">Car plate number <span class="description">(Without spaces. Ex: 12-31233 or 11-34156). </span></label>
                    <input :style="patente.length > 0 ? 'text-transform: uppercase' : ''" v-mask="'#?#-#####'" v-model="patente" type="text" class="form-control" id="input-patente" placeholder="Valid patents (11-213123 or 12-12311)" :class="{'has-error': patentError.state }">
                    <span class="error" v-if="patentError.state"> {{patentError.message}} </span>
                </div>

                <div class="checkbox">
                    <label>
                    <input type="checkbox" v-model="user.emails_notifications"> Receive notifications by email.
                    </label>
                </div>
                <hr />
                <div class="checkbox" >
                    <label >
                        <input type="checkbox" @change="changeShowPassword"> Change Password
                    </label>
                </div>
                <div class="form-group" v-if="showChangePassword">
                    <label for="input-pass">Enter your new Password</label>
                    <input maxlength="40" v-model="pass.password" type="password" class="form-control" id="input-pass" placeholder="Password">
                    <input maxlength="40" v-model="pass.password_confirmation" type="password" class="form-control" id="input-pass-confirm" placeholder="Repeat Password">
                </div>


                <span v-if="error">{{error}}</span>
                <Uploadfile :name="'profile'" @change="onPhotoChange" ref="file"></Uploadfile>
            </div>
        </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { inputIsNumber } from '../../services/utility';
import Uploadfile from '../Uploadfile';
import DatePicker from '../DatePicker';
import SvgItem from '../SvgItem';
import dialogs from '../../services/dialogs.js';
import moment from 'moment';
import router from '../../router';
import bus from '../../services/bus-event.js';

class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

let patentRegex = /(([1-9]{1})+([0-9]{1})*-[1-9]{1}([0-9]{1,5})|[1-9]{1}([0-9]{1})*-[1-9]{1})/;

export default {
    name: 'upddate-profile',
    data () {
        return {
            user: null,
            car: null,
            patente: '',
            pass: {
                password: '',
                password_confirmation: ''
            },
            error: null,
            loading: false,
            loadingImg: false,
            dniRawValue: '',
            globalError: false,
            nameError: new Error(),
            descError: new Error(),
            birthdayError: new Error(),
            patentError: new Error(),
            dniError: new Error(),
            phoneError: new Error(),
            cartypeError: new Error(),
            emailError: new Error(),
            maxDate: moment().toDate(),
            minDate: moment('1900-01-01').toDate(),
            birthday: '',
            birthdayAnswer: '',
            showChangePassword: false
        };
    },
    computed: {
        ...mapGetters({
            userData: 'auth/user',
            firstTime: 'auth/firstTime',
            cars: 'cars/cars',
            isMobile: 'device/isMobile'
        }),
        iptUser () {
            if (this.user) {
                return this.user.name;
            }
        },
        iptEmail () {
            if (this.user) {
                return this.user.email;
            }
        },
        iptBirthday () {
            if (this.user) {
                return this.user.birthdayAnswer;
            }
        },
        iptDescription () {
            if (this.user) {
                return this.user.description;
            }
        },
        iptDni () {
            if (this.user) {
                return this.user.nro_doc;
            }
        },
        iptPhone () {
            if (this.user) {
                return this.user.mobile_phone;
            }
        },
        iptCartype () {
            if (this.user) {
                return this.user.cartype;
            }
        }
    },
    methods: {
        ...mapActions({
            update: 'auth/update',
            updatePhoto: 'auth/updatePhoto',
            carCreate: 'cars/create',
            carUpdate: 'cars/update'
        }),
        onBackClick () {
            router.back();
        },
        onClearClick () {
            router.back();
        },
        changeShowPassword () {
            this.showChangePassword = !this.showChangePassword;
        },
        isNumber (value) {
            inputIsNumber(value);
        },
        onPhotoChange (data) {
            console.log('img', data);
            this.loadingImg = true;
            this.updatePhoto(data).then(user => {
                console.log('updatePhoto', user);
                this.user.image = user.image;
                this.loadingImg = false;
            }).catch(() => {
                this.loadingImg = false;
            });
        },
        dateChange (value) {
            this.birthdayAnswer = value;
        },
        changePhoto () {
            console.log('changePhoto');
            this.$refs.file.show();
        },
        grabar () {
            if (this.validate()) {
                dialogs.message('You have not completed mandatory fields or entered invalid data.', { duration: 10, state: 'error' });
                return;
            }
            this.loading = true;
            var data = Object.assign({}, this.user);
            if (this.pass.password) {
                if (this.pass.password !== this.pass.password_confirmation) {
                    this.error = 'Password does not match';
                    this.loading = false;
                    return;
                }
                data.password = this.pass.password;
                data.password_confirmation = this.pass.password_confirmation;
            }
            if (moment(this.birthdayAnswer, 'YYYY-MM-DD').isValid()) {
                console.log('valid date');
                data.birthday = this.birthdayAnswer;
                console.log(this.user.birthday);
            }
            data.nro_doc = this.dniRawValue;
            console.log('updateData', data);
            this.update(data).then(() => {
                this.pass.password = '';
                this.pass.password_confirmation = '';
                this.loading = false;
                dialogs.message('Profile updated completely.');
                if (this.patente.length) {
                    if (this.car) {
                        this.car.patente = this.patente;
                        this.carUpdate(this.car);
                    } else {
                        let car = {
                            description: 'NOT USED YET',
                            patente: this.patente
                        };
                        this.carCreate(car);
                    }
                }
                 this.user.birthday = this.birthdayAnswer;
                if ((this.user.image && this.user.image.length > 0) && (this.user.description && this.user.description.length > 0)) {
                    this.$router.rememberBack();
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
        validate () {
            let globalError = false;
            /* if (this.password.length < 1) {
                this.passwordError.state = true;
                this.passwordError.message = 'Olvidó ingresar su Password.';
                globalError = true;
            } else if (this.password.length < 8) {
                this.passwordError.state = true;
                this.passwordError.message = 'Las Password debe tener al menos 8 caracteres.';
                globalError = true;
            } else if (this.passwordConfirmation < 1) {
                this.passwordError.state = true;
                this.passwordError.message = 'Olvidó confirmar su Password.';
                globalError = true;
            } else if (this.password !== this.passwordConfirmation) {
                this.passwordError.state = true;
                this.passwordError.message = 'Las Passwords no coinciden.';
                globalError = true;
            } */

            if (!this.user.name || this.user.name.length < 1) {
                this.nameError.state = true;
                this.nameError.message = 'You forgot to enter your first and last name.';
                globalError = true;
            }

            console.log(this.birthdayAnswer);
            if (!this.birthdayAnswer || this.birthdayAnswer.length < 1) {
                this.birthdayError.state = true;
                this.birthdayError.message = 'You forgot to enter your date of birth.';
                globalError = true;
            } else {
                let birthday = moment(this.birthdayAnswer);
                if (moment().diff(birthday, 'years') < 18) {
                    this.birthdayError.state = true;
                    this.birthdayError.message = 'It seems that you are not of legal age. Check if you entered your birth date well and remember that you must be of legal age to use LessGo. For more information we recommend you to read the terms and conditions again.';
                    globalError = true;
                }
            }

            if (this.patente && this.patente.length > 0) {
                if (!patentRegex.test(this.patente)) {
                    this.patentError.state = true;
                    this.patentError.message = 'The entered patent does not have a valid format.';
                    globalError = true;
                }
            }

            if (!this.user.description || this.user.description.length < 1) {
                this.descError.state = true;
                this.descError.message = 'You forgot to complete your description.';
                globalError = true;
            } else if (this.user.description.replace(' ', '').length < 10) {
                this.descError.state = true;
                this.descError.message = 'Ups! Your description is very limited. Do not be shy, tell us a little more.';
                globalError = true;
            }

            if (this.dniRawValue && this.dniRawValue.length > 0 && this.dniRawValue.length < 7) {
                this.dniError.state = true;
                this.dniError.message = 'The Id Number you entered is not valid.';
                globalError = true;
            }

            if (this.user.mobile_phone && this.user.mobile_phone.length > 0 && this.user.mobile_phone.length < 6) {
                this.phoneError.state = true;
                this.phoneError.message = 'The phone you entered is not valid.';
                globalError = true;
            }

            if (this.user.cartype && this.user.cartype.length > 0 && this.user.cartype.length < 3) {
                this.cartypeError.state = true;
                this.cartypeError.message = 'The car type you entered is not valid.';
                globalError = true;
            }

            return globalError;
        }
    },
    watch: {
        cars: function () {
            if (this.cars.length > 0) {
                this.car = this.cars[0];
                this.patente = this.car.patente;
            }
        },
        userData: function () {
            this.user = this.userData;
        },
        iptUser () {
            this.nameError.state = false;
        },
        iptEmail () {
            this.emailError.state = false;
        },
        birthdayAnswer: function () {
            this.birthdayError.state = false;
        },
        iptDescription () {
            this.descError.state = false;
        },
        iptDni () {
            this.dniError.state = false;
        },
        iptPhone () {
            this.phoneError.state = false;
        },
        patente () {
            this.patentError.state = false;
        },
        iptcartype () {
            this.cartypeError.state = false;
        }
    },

    mounted () {
        bus.on('date-change', this.dateChange);
        bus.on('back-click', this.onBackClick);
        bus.on('clear-click', this.onClearClick);
        console.log('userData', this.userData);
        this.user = this.userData;
        if (this.cars) {
            if (this.cars.length > 0) {
                this.car = this.cars[0];
                this.patente = this.car.patente;
            }
        };
        try {
            if (moment(this.user.birthday, 'YYYY-MM-DD').isValid()) {
                this.birthday = moment(this.user.birthday, 'YYYY-MM-DD');
            } else {
                this.birthday = '';
            }
        } catch (ex) {
            console.log('exception', ex);
        }
    },
    beforeDestroy () {
        bus.off('back-click', this.onBackClick);
    },
    components: {
        DatePicker,
        Uploadfile,
        SvgItem
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .required-field-flag {
        color: red;
    }
    .required-field-info {
        display: block;
        padding: 1em 0;
    }
    .profile_image-container.error .circle-box {
        border: solid 2px red;
    }
    .profile_image-container.error .span {
        color: red;
    }
    span.error {
        display: block;
        font-size: 12px;
        margin-top: 2em;
        font-weight: bold;
        color: red;
    }
    span.error.textarea {
        margin-top: .8em;
    }
    @media only screen and (min-width: 768px) {
        span.error {
            font-weight: 300;
        }
    }

    .profile_image-edit{
        width: 100%;
        position: absolute;
        left: 3px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
    #backbubblebutton{
        background-color: white;
        width: 80px;
        height: 35px;
        border-radius: 19px;
        border: solid rgba(91, 91, 91, 1) 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(91, 91, 91, 1);
        font-family: "Avenir Black", sans-serif;
    }
    #savebutton{
        background-color: #E65A5B;
        width: 80px;
        height: 35px;
        border-radius: 19px;
        margin-left: 10px;
        margin-right: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-family: "Avenir Black", sans-serif;
        box-shadow: 0px 0px 8px rgba(235, 85, 87, 0.8)
    }
    #buttongroup{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
#groupone{
    /* border: solid 1px red; */
}
.infostyle{
    /* border: solid 1px black; */
}
#smalltext{
    color: black;
    font-size: 1em;
}
#emailtextbox{
    width: 100%;
    border: none;
    color: rgba(91, 91, 91, 1);
    background-color: rgba(240, 244, 243, 1);
    font-family: 'Nunito', sans-serif;
    margin-bottom: 10px;
    height: 34px;
}
#notestextstyle{
    color: rgba(0,0,0,0.3);
    margin-bottom: 1px;
}
.editcontentstyle{
    display: flex;
    flex-direction: column;
}
#bioinput{
    /* text-indent: 10px; */
    height: 100px;
    border: none;
    background-color: rgba(240, 244, 243, 1);
}
.contentcontainer{
    /* border: solid 1px black; */
    position: relative;
    top: 10px;
    height: 70%;
    overflow-y: scroll;
}
p {
  font-family: 'Nunito', sans-serif;
  font-size: 1em;
  color: rgba(28, 137, 131, 1);
}
#nameandrating p {
  margin: 0;
  padding: 0;
}
#nameandrating {
  /* border: solid black 1px; */
 height: 15vh;
    width: 80%;
    margin-left: 2em;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-flex-pack: center;
    justify-content: center;
}
.profile {
 height: 8em;
    width: 10em;
    border-radius: 50%;
   align-self: center;
}
.imageandnamecontainer {
  display: flex;
  flex-direction: row;
  height: 100%;
}
#backbuttonholder {
  /* border: solid 1px black; */
}
#backbutton {
    color: rgba(28, 137, 131, 1);
    margin-bottom: 10px;
}
.profileContainer {
  /* border: solid black 1px; */
  height: 20%;
}
.updateprofilecontainer {
  /* border: solid 1px black; */
  height: 80vh;
  overflow-y: scroll;
  overflow-x: none;
}
#nameAndCredentialsContainer {
  display: flex;
  padding: 0;
  flex-direction: column;
  /* align-self: center; */
  width: 65vw;
  position: relative;
  /* border: solid 1px black; */
  height: 100%;
  justify-content: center;
  /* align-items: center;    */
}
#credentialwithicon {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  /* border: solid 1px black; */
}
#namefont {
  font-size: 1.6em;
  color: black;
  font-family: "Nunito", sans-serif;
  margin: 0;
  padding: 0;
}
#menuicon {
  color: #5b5b5b;
}
#reviewfont {
  color: #5b5b5b;
  font-size: 16px;
  margin: 0;
  padding: 0;
  font-family: "Nunito", sans-serif;
  /* border: solid 1px black; */
}

@media screen and (max-height: 640) {
  .updateprofilecontainer {
    height: 40vh;
  }
}

button.btn.btn-primary {
    /* font-size: 14px; */
    background-color: #E65A5B;
    width: 6em;
    height: 31px;
    border-radius: 19px;
    margin-left: 10px;
    margin-right: 2px;
    display: -ms-flexbox;
    padding: 0em;
    display: flex;
    border: none;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    color: white;
    font-family: "Avenir Black", sans-serif;
    box-shadow: 0px 0px 8px rgba(235, 85, 87, .8);
}

.alert-info {
    background-color: #e65a5b;
    border-color: none;
    color: #f0f4f3;
    border-radius: 16px;
}

label.contact-description {
    font-weight: bolder;
    font-size: 16px;
}

textarea {
    background-color: #F0F4F3;
    border-radius: 5px;
}
.col-xs-24.col-sm-16.col-sm-pull-8 {
     margin-bottom: 4em;
     }


     .form-control[disabled], .form-control[readonly], fieldset[disabled] .form-control {
    background-color: #F0F4F3;
    opacity: 0.4;
    color: #5B5B5B;
}

input#input-dni {
    background: #F0F4F3;
}

input#input-patente {
    background-color: #F0F4F3;
}

.date-picker {
        width: 100%;
}

.update-profile-component{
    margin-top: 3em;
}
.form.update-profie {
    margin-top: -5em !important;
}
</style>
