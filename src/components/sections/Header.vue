<template>
    <header class="header header-component">
        <div class="actionbar actionbar-top visible-xs">
            <div class="actionbar_section actionbar_icon">
                <span v-if="showLogo">
                    <router-link :to="{ name: 'search' }"  v-on:click.native="tripsClick">
                        <img :src="lessgo_logo" />
                    </router-link>
                </span>
                <template v-else v-for="item in leftHeaderButton" v-if="item.show">
                    <span @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
            </div>
             <div class="actionbar_section actionbar_title" :class="subTitle !== '' ? 'header--with-subtitle' : ''">
                <div class="header--image circle-box" v-imgSrc="imgTitle" v-show="imgTitle" ></div>
            </div>
            <div class="actionbar_section actionbar_icon pull-right">

                    <span class="header_notifications" @click="toNotifications" v-if="user && isMobile" >
                        <span class="fa-container">
                            <i :style="notificationsCount > 0 ? 'color: #ec5355' : ''" class="far fa-bell" aria-hidden="true"></i>
                        </span>
                        <span class="badge" v-if="notificationsCount > 0">{{notificationsCount}}</span>
                    </span>

                <template v-for="item in rightHeaderButton" v-if="item.show">
                    <span @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>

                <div class="dropdown-right" v-if="showMenu">
                    
                    <dropdown type="icon">
                        <template slot="button">
                            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                        </template>
                        <li><router-link tag="a" :to="{name: 'about'}"  >About LessGo</router-link></li>
                        <li><router-link :to="{name: 'terms'}" tag="a">Terms and Conditions</router-link></li>
                        <li><a @click="logout" v-if="!isFacebokApp">Logout</a></li>
                    </dropdown>

                </div>
            </div>
        </div>
        <div class="header_content hidden-xs">
   <router-link :to="{ name: 'search', params: { clearSearch: true } }"  v-on:click.native="tripsClick">
                <div class="header_panel-left" v-if="logoHeaderVisibility" >
                    <img :src="background_desktop_mini" v-if="isNotLargeDesktop" />
                    <img :src="background_desktop" v-if="!isNotLargeDesktop" />
                    <!-- <img :src="lessgo_logo"/> -->
                    <!-- <router-link tag="h1" :to="{name: 'search'}" class="header_title"> Lessgo </router-link> -->
                </div>
            </router-link>
            <div class="header_panel-right">
                <modal :name="'modal'" v-if="showModal" @close="showModal = false" :title="'Test'" :body="'Body'">
                    <h3 slot="header">Invite Friends</h3>
                    <div slot="body" class="social-share">
                        <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%lessgo.app%2F" target="_blank" aria-label="Compartir en Facebook" class="lnk lnk-social-network lnk-facebook">
                            <i class="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                        <a href="https://plus.google.com/share?url=https%3A%2F%lessgo.com%2F" target="_blank" aria-label="Compartir en Google+"  class="lnk lnk-social-network lnk-google-plus">
                            <i class="fa fa-google-plus" aria-hidden="true"></i>
                        </a>
                        <a href="https://twitter.com/intent/tweet/?text=Lessgo%3A%20Long%20distance%20carpooling%20application&url=https%3A%2F%2Flessgo.app&via=lessgoapp&hashtags=carpooling" target="_blank" aria-label="Compartir en Twitter"   class="lnk lnk-social-network lnk-twitter">
                            <i class="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                        <a href="whatsapp://send?text=LessGo%3A%20Long%20Distance%20carpooling%20platform%%20https%3A%2F%lessgo.app%2F" target="_blank" aria-label="Compartir en Whats App"   class="lnk lnk-social-network lnk-whatsapp"  v-if="isMobile">
                            <i class="fa fa-whatsapp" aria-hidden="true"></i>
                        </a>
                    </div>
                </modal>
                <button @click="share" type="button" class="btn btn-link">Invite Friends</button>
                <router-link class="btn btn-link trips-link" :to="{name: 'search', params: { clearSearch: true }}">Trips</router-link>
                <!--<router-link class="btn btn-link" v-if="!logged" :to="{name: 'trips'}">information</router-link>-->
                <!--<router-link class="btn btn-link" v-if="!logged" :to="{name: 'register'}">Register</router-link>-->
                <router-link class="btn btn-primary" btn-lg v-if="!logged" :to="{name: 'login'}">Login</router-link>


                <span class="header_notifications" @click="toNotifications" v-if="logged">
                    <span class="fa-container">
                        <i class="far fa-bell background" aria-hidden="true"></i>
                        <i :style="notificationsCount > 0 ? 'color: #ec5355' : ''" class="far fa-bell" aria-hidden="true"></i>
                    </span>
                    <span class="badge" v-if="notificationsCount > 0">{{notificationsCount}}</span>
                </span>

                <div class="header_profile" v-if="user">
                    <span > {{user.name}} </span>
                    <dropdown type="info" v-if="logged" >
                        <template slot="button">
                            <div class="circle-box header_profile_image" v-imgSrc:profile="user.image"></div>
                        </template>
                        <li>
                            <router-link :to="{name: 'my-trips'}">My trips</router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'conversations-list'}">Messages</router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'profile', params: {id: 'me'}}">Profile</router-link>
                        </li>
                        <li role="separator" class="divider"></li>
                        <!-- <li>
                            <router-link :to="{name: 'acerca_de'}">About</router-link>
                        </li>
                        <li role="separator" class="divider"></li>
                        <li>
                            <router-link :to="{name: 'profile_update'}">Configuration</router-link>
                        </li> -->
                        <li><a @click="logout" v-if="!isFacebokApp">Logout</a></li>
                    </dropdown>
                </div>


                <router-link v-if="logged" :to="{name: 'new-trip'}" class="btn btn-primary btn-lg">Create Trip</router-link>

            </div>
            <div class="cf"></div>
        </div>
    </header>
</template>

<script>
import {mapGetters} from 'vuex';
import {dropdown} from 'vue-strap';
import router from '../../router';
import bus from '../../services/bus-event.js';
import modal from '../Modal';

export default {
    name: 'header',

    data () {
        return {
            background_desktop_mini: '/static/img/background_desktop_mini.png',
            background_desktop: '/static/img/background_desktop.png',
            lessgo_logo: '/static/img/lessgo_logo.png',
            showModal: false
        };
    },

    mounted () {
        bus.on('header-title-change', this.onHeaderChange);
    },

    computed: {
        ...mapGetters({
            logged: 'auth/checkLogin',
            user: 'auth/user',
            notificationsCount: 'notifications/count',
            title: 'actionbars/title',
            subTitle: 'actionbars/subTitle',
            imgTitle: 'actionbars/imgTitle',
            showMenu: 'actionbars/showMenu',
            leftHeaderButton: 'actionbars/leftHeaderButton',
            rightHeaderButton: 'actionbars/rightHeaderButton',
            logoHeaderVisibility: 'actionbars/headerLogoVisibility',
            isNotLargeDesktop: 'device/isNotLargeDesktop',
            isFacebokApp: 'device/isFacebokApp',
            isMobile: 'device/isMobile'
        }),

        showLogo () {
            for (let i = 0; i < this.leftHeaderButton.length; i++) {
                if (this.leftHeaderButton[i].show) {
                    return false;
                }
            }
            return true;
        }
    },

    methods: {
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

    components: {
        dropdown,
        modal
    }
};
</script>

<style scoped>
    .trips-link {
        font-weight: bold;
    }
    .actionbar_icon img {
    width: 4em;
    margin-left: .3em;
    position: relative;
    display: flex;
    justify-content: center;
    align-content: center;
}

    .header_panel-right {
        min-width: 50%;
        text-align: right;
    }
    @media (max-width: 1050px) {
        .header_panel-right {
            min-width: 70%;
        }
    }
</style>
