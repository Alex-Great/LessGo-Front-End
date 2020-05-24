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
                    <router-link :to="{name: 'profileDetail', params: { id: 'me'}}">
                        <div class="common-btns" v-imgSrc:profile="user.image"></div>
                    </router-link>
                    <span>Profile</span>
                </div>
            
                <!-- messages -->
                <div class="col-xs-8">
                    <router-link :to="{name: 'messages'}">
                        <div class="common-btns">
                        	<v-icon icon="comment-dots" class="v-icons" />
                        </div>
                    </router-link>
                    <span>Messages</span>
                </div>
            
                <!-- trips -->
                <div class="col-xs-8">
                    <router-link :to="{name: 'your-trips'}">
                        <div class="common-btns">
                        	<v-icon icon="history" class="v-icons" />
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
                        	<v-icon icon="users" class="v-icons" style="width: 34px !important" />
                        </div>
                    </router-link>
                    <span>Communities</span>
                </div>
            
                <!-- wallet -->
                <div class="col-xs-8">
                    <router-link :to="{name: 'wallet'}">
                        <div class="common-btns">
                            <v-icon icon="wallet" class="v-icons" style="width: 26px !important" />
                        </div>
                    </router-link>
                    <span>Wallet</span>
                </div>
                
                <!-- settings -->
                <div class="col-xs-8">
                    <router-link :to="{name: 'settings'}">
                        <div class="common-btns">
                        	<v-icon icon="cog" class="v-icons" />
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
import { mapGetters } from 'vuex';

export default {
    name: 'dropdownMenu',
    data () {
        return {
            showMenu: false,
            fillColor: '#eb5557'
        };
    },
    methods: {
        toggleMenu: function () {
            this.showMenu = !this.showMenu;
            this.$emit('reverse');
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        })
    },
    components: {
        mdbDropdown,
        mdbDropdownItem,
        mdbDropdownMenu,
        mdbDropdownToggle
    }
};
</script>

<style>
    .drop-menu {
        position: absolute !important;
        right: 20px;
        top: 10px;
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