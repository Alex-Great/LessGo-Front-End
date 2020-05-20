<template>
    <div>
        <div @click="toggleMenu">
            <mdb-dropdown class="drop-menu">
                <mdb-dropdown-toggle class="toggle-drop" :style="!showMenu? 'background: white; outline: none': 'background: rgb(28, 137, 131); outline: none'" slot="toggle">
                    <svg :class="'line-icon'" xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu" :style="showMenu? 'color: white; transform: rotate(90deg); transition: .3s;': 'color: rgb(28, 137, 131); transition: .3s;'" ><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </mdb-dropdown-toggle>
            </mdb-dropdown>
        </div>

        <!-- menu area -->
        <div v-show="showMenu" class="menu-area text-center">
            <!-- user detail -->
            <span class="user-detail">
                Hello, <strong>{{ user.name }}</strong>
            </span>
            <div class="row" style="margin-bottom: 20px">
                <!-- profile -->
                <div class="col-xs-8">
                    <router-link :to="{name: 'profile', params: { id: 'me'}}">
                        <div class="common-btns" v-imgSrc:src="profileImg"></div>
                    </router-link>
                <span>Profile</span>
                </div>
            
                <!-- messages -->
                <div class="col-xs-8">
                    <router-link :to="{name: 'messages'}">
                        <div class="common-btns">
                            <messageIcon :size="30" :color="fillColor" style="margin-top: 4px" />
                        </div>
                    </router-link>
                    <span>Messages</span>
                </div>
            
                <!-- trips -->
                <div class="col-xs-8">
                    <router-link :to="{name: 'your-trips'}">
                        <div class="common-btns">
                            <tripIcon :size="30" :color="fillColor" style="margin-top: 4px; margin-left: -3px" />
                        </div>
                    </router-link>
                    <span>Your trips</span>
                </div>
            </div>
            <div class="row">
                <!-- communities -->
                <div class="col-xs-8">
                    <router-link :to="{name: 'communities'}">
                        <div class="common-btns">
                            <communityIcon :size="30" :color="fillColor" style="margin-top: 4px; margin-left: -1px" />
                        </div>
                    </router-link>
                    <span>Communities</span>
                </div>
            
                <!-- wallet -->
                <div class="col-xs-8">
                    <router-link :to="{name: 'wallet'}">
                        <div class="common-btns">
                            <walletIcon :size="30" :color="fillColor" style="margin-top: 2px" />
                        </div>
                    </router-link>
                    <span>Wallet</span>
                </div>
                
                <!-- settings -->
                <div class="col-xs-8">
                    <router-link :to="{name: 'settings'}">
                        <div class="common-btns">
                            <settingIcon :size="30" :color="fillColor" style="margin-top: 4px; margin-left: -1px" />
                        </div>
                    </router-link>
                    <span>Settings</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle } from 'mdbvue';
import { mapGetters, mapActions } from 'vuex';

/* import components for this */
import messageIcon from './MessageIcon.vue';
import tripIcon from './TripIcon.vue';
import communityIcon from './CommunityIcon.vue';
import walletIcon from './WalletIcon.vue';
import settingIcon from './SettingIcon.vue';

export default {
    name: 'menuAreaIcon',
    data () {
    return {
        showMenu: false,
        profileImg: null,
        fillColor: '#eb5557'
        }
    },
    methods: {
        ...mapActions({
            reserve: 'reserve/reserveFlag'
        }),
        toggleMenu: function () {
            console.log('ok');
            this.showMenu = !this.showMenu;
            this.reserve(this.showMenu);
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),
        setProfileImg: function () {
            this.profileImg = '/image/profile/' + this.user.image;
        }
    },
    watch: {
        setProfileImg: function () {

        }
    },
    components: {
        mdbDropdown,
        mdbDropdownItem,
        mdbDropdownMenu,
        mdbDropdownToggle,
        messageIcon,
        tripIcon,
        communityIcon,
        walletIcon,
        settingIcon
    }
};
</script>

<style>
    .drop-menu {
        position: absolute !important;
        right: 20px;
        top: 30px;
        text-align: center;
        cursor: pointer;
        z-index: 10;
    }
    .drop-menu:focus {
        outline: none;
    }
    .toggle-drop {
        background: white;
        padding: unset !important;
        border-radius: 50% !important;
        width: 40px;
        height: 40px;
    }
    .line-icon {
        margin-top: 6px;
    }
</style>