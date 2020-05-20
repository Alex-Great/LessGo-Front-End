<template>
<div
id="parentcontainer">
<div class="section">
  <div id="profileContainer">
    <div class="profile" v-imgSrc:profile="profile.image"></div>
    <div class="subcontainer">
      <div id="nameAndCredentialsContainer">
        <div id="credentialwithicon">
          <p id="namefont">{{profile.name}}</p>
          <!-- menu icon -->
           <div class="dropdown-right">
                    <dropdown type="icon">
                        <template slot="button">
                            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                        </template>
                        <li><router-link tag="a" :to="{name: 'about'}"  >About LessGo</router-link></li>
                        <li><router-link :to="{name: 'terms'}" tag="a">Terms and Conditions</router-link></li>
                        <li><a @click="logout" >Logout</a></li>
                    </dropdown>
            </div>
        </div>
        <p id="reviewfont">{{ this.user.positive_ratings + this.user.negative_ratings }} Ratings</p>
      </div>
    </div>
  </div>
  <div
  id="editbuttoncontainer"
  style="width:100%;">
    <div id="editbutton" v-if="profile.id == user.id">
        <router-link :to="{name:'profile_update'}"> <p id="editbuttontext">Edit Profile</p></router-link>
    </div>
</div>
</div>
<div class="section">
    <div id="bio">
        <p style="color:#1C8983;margin:0;padding:0;">BIO</p>
        <p style="padding:0;margin-top: 7px;">{{profile.description}}</p>
    </div>
</div>
<div class="section third">
    <div id="ratingword">
        <p style='color:#1C8983;margin:0;padding:0;'> RATINGS - </p>
        <p style='color:#1C8983;margin:0;padding:0;'> {{ this.user.positive_ratings + this.user.negative_ratings }} </p>
    </div>

  <div class="profile-rates-component container clearfix">
        <Loading :data="rates">
            <div class="list-group">
                <div class="column-rating">
                    <div class="list-group-item clearfix" v-for="rate in rating.col1">
                        <RateItem :user="user" :id="id" :rate="rate"></RateItem>
                    </div>
                </div>
                <!-- <h1>something</h1> -->
                <div class="column-rating">
                    <div class="list-group-item clearfix" v-for="rate in rating.col2">
                        <RateItem :user="user" :id="id" :rate="rate"></RateItem>
                    </div>
                </div>
                <div class="column-rating">
                    <div class="list-group-item clearfix" v-for="rate in rating.col3">
                        <RateItem :user="user" :id="id" :rate="rate"></RateItem>
                    </div>
                </div>
            </div>
            <!--
            <div v-if="morePages">
                <button class="btn btn-primary" @click="nextPage">More results</button>
            </div>
            -->

            <div slot="no-data" class="alert alert-warning"  role="alert">
                  <div id="imageholder">
        <noRating></noRating>
        <p
        id="noreview">No Reviews for {{profile.name}}</p>
        </div>
            </div>
            <p slot="loading"  role="alert">
                <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                Loading ratings ...
            </p>
        </Loading>


    </div>


</div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import NoRating from '../NoRating';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import profile from '../../store/modules/profile';
import Axios from 'axios';
import {dropdown} from 'vue-strap';
import router from '../../router';
import bus from '../../services/bus-event.js';
import modal from '../Modal';
import RateItem from '../RateItem';
import Loading from '../Loading.vue';

export default {
  data () {
      return {
            rating: {
                col1: [],
                col2: [],
                col3: []
            }
        };
  },
  methods: {
    makeRows () {
            if (this.rates) {
                this.rating = {
                    col1: [],
                    col2: [],
                    col3: []
                };
                let i;
                let temp = [];
                if (this.isMobile) {
                    this.rating.col1 = this.rates;
                } else if (this.isTablet) {
                    i = 0;
                    for (i; i < this.rates.length; i += 2) {
                        temp.push(this.rates[i]);
                    }
                    this.rating.col1 = temp;
                    temp = [];
                    i = 1;
                    for (i; i < this.rates.length; i += 2) {
                        temp.push(this.rates[i]);
                    }
                    this.rating.col2 = temp;
                } else {
                    i = 0;
                    temp = [];
                    for (i; i < this.rates.length; i += 3) {
                        temp.push(this.rates[i]);
                    }
                    this.rating.col1 = temp;
                    i = 1;
                    temp = [];
                    for (i; i < this.rates.length; i += 3) {
                        temp.push(this.rates[i]);
                    }
                    this.rating.col2 = temp;
                    i = 2;
                    temp = [];
                    for (i; i < this.rates.length; i += 3) {
                        temp.push(this.rates[i]);
                    }
                    this.rating.col3 = temp;
                }
            }
        },
    share () {
        // dialogs.message('Message example');
        /* if (window && window.plugins && window.plugins.socialsharing && window.plugins.socialsharing.shareWithOptions) {
            socialShare.share();
        } else {
            this.showModal = true;
        } */
        // Primero necesito ver cuando estoy en App y cuando en Web
        this.showModal = true;
    },

    logout () {
        this.$store.dispatch('auth/logout');
    },

    toNotifications () {
        router.push({name: 'notifications'});
    },

    onClick (item) {
        bus.emit(item.id + '-click');
    },

    tripsClick () {
        this.$store.dispatch('trips/refreshList', true);
        this.$store.dispatch('trips/tripsSearch', { is_passenger: false });
    },

    onHeaderChange () {
        console.log('header-change', this.title);
    }

  },
  mounted () {

  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      profile: 'profile/user',
      rates: 'profile/rates',
      'isMobile:': 'device/isMobile',
      'isTablet': 'device/isTablet',
      'isDesktop': 'device/isDesktop'

    })
  },
  watch: {
        rates: {
            handler: function (val, oldVal) {
                this.makeRows();
            }
        },
        isMobile: {
            handler: function (val, oldVal) {
                this.makeRows();
            }
        },
        isDesktop: {
            handler: function (val, oldVal) {
                this.makeRows();
            }
        }
    },
  components: {
    NoRating,
    dropdown,
    RateItem,
    Loading
  },
  props: [
        'id'
   ]
};
</script>

<style scoped>

#editbuttontext{
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 1em;
}
.profile{
  width: 76px;
  height: 76px;
  border-radius: 38px;
  margin-right: 10px;
  /* border: solid black 1px; */
  background-size: cover;
}
#profilephoto{
  border: solid black 1px;
  width: 100px;
  height: 300px;
}
#menuicon{
  color: #5B5B5B;
}
#imageholder{
    width: 100%;
    height: 100%;
    margin-top: 5px;
    /* border: solid 1px black; */
}
#ratingword{
    width: "100%";
    display: flex;
    flex-direction: row;
}
#bio{
    border-bottom:solid #1F524F 1px;
}
p{
    font-family: "Poppins", sans-serif;
    font-size: 0.95em;
    /* color: white; */
}

.section{
    margin: 10px;
}
.third{
  /* border: solid black 1px; */
  display: flex;
  flex-direction: column;
}
#parentcontainer{
    height: 100%;
    overflow-y: visible;
    overflow-x: visible;
    margin-top: 8em;

}
#editbuttoncontainer{
    display: flex;
    justify-content: flex-end;
}
#editbutton{
    background-color: #E65A5B;
    width: 100px;
    height: 35px;
    border-radius: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-family: "Poppins", sans-serif;
    box-shadow: 0px 0px 8px rgba(235, 85, 87, 0.8)
}
.menuImage {
  position: relative;
  top: 2px;
  height: 15px;
  color: red;
  border: solid red 1px;
}
.btn-primary {
  display: inline-block;
}
#credentialwithicon {
  height: 50%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  /* border: solid 1px black; */
}
.subcontainer {
}
#reviewfont {
  color: #5b5b5b;
  font-size: 16px;
  margin: 0;
  padding: 0;
  font-family: "Poppins", sans-serif;
  /* border: solid 1px black; */
}
#namefont {
  font-size: 17px;
  color: black;
  font-family: "Poppins", sans-serif;
  margin: 0;
  padding: 0;
}

#noreview{
  font-size: 18px;
  color: black;
  text-align:center;
  font-weight: 500;
}
#profileContainer {
  display: flex;
  flex-direction: row;
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
@media screen and (min-height: 640px) and (max-height: 720px){
  #parentcontainer{
      height: 100%;
    overflow-y: visible;
    overflow-x: visible;
    margin-top: 8em;
    /* border: solid black 1px; */
  }
  #imageholder{
    width: 100%;
    height: 100%;
    align-self: center;
    margin: 0;
    padding: 0;
    /* border: solid black 1px; */
  }
  #noreview{
    padding: 0;
    margin: 0;
  }
  .third{
    height: 140px;
    /* border: solid 1px black; */
  }
}
@media screen and (min-height: 731px){
  #parentcontainer{
      height: 100%;
    overflow-y: visible;
    overflow-x: visible;
    margin-top: 8em;
    /* border: solid 1px black; */
  }
  #imageholder{
    /* border: solid 1px black; */
    width: 100%;
    height: 100%;
  }
  .third{
    /* border: solid 1px black; */
    height: 300px;


  }
}
@media screen and (min-height: 812px){
  #parentcontainer{
      height: 100%;
    overflow-y: visible;
    overflow-x: visible;
    margin-top: 8em;
    /* border: solid 1px black; */
  }
  #imageholder{
    /* border: solid 1px black; */
     width: 100%;
    height: 100%;
  }
}
@media screen and (min-height: 667px) and (max-height: 670px){
  #imageholder{
    /* border: solid 1px black; */
    width: 100%;
    height: 100%;
  }
}
@media screen and (max-height: 568px){
  #imageholder{
    /* border: solid 1px black; */
    width: 100%;
    height: 100%;
  }
  #noreview{
    font-size: 12px;
  }
  p{
    font-size: 10px;
  }
}
@media screen and (min-height: 1024px){
  #parentcontainer{
    height: 75vh;
    /* border: solid 1px black; */
  }
  #imageholder{
    /* border: solid 1px red; */
    width: 100%;
    height: 100%;
  }
}

.dropdown-right {
    position: relative;
}
ul.nav.nav-tabs.active-1 {
    display: none !important;
}
.alert-warning {
  background-color: #eb5557;
    border-color: #faebcc;
    color: #ffffff;
}
</style>
