<template>
    <div class="messages">
        <!-- setting title -->
        <div v-show="settingFlag">
            <div class="messages-area">
                <h1>Settings</h1>
                <closeIcon :size="12" :classes="'close-message'" />
            </div>

            <!-- action area -->
            <div class="setting-action-area">
                <!-- functional areas -->
                <div class="setting-action">
                    <div @click="goTitle('notification')">
                        <v-icon icon="bell" class="settings-v-icon" />
                        <h2>Notifications</h2>
                        <v-icon icon="chevron-right" class="setting-right-icon" />
                    </div>
                    <div @click="goTitle('security')">
                        <v-icon icon="lock" class="settings-v-icon" />
                        <h2>Privacy & Security</h2>
                        <v-icon icon="chevron-right" class="setting-right-icon" />
                    </div>
                    <div @click="goTitle('about')">
                        <v-icon icon="question-circle" class="settings-v-icon" />
                        <h2>About LessGo</h2>
                        <v-icon icon="chevron-right" class="setting-right-icon" />
                    </div>
                </div>

                <!-- logout -->
                <div class="logout" @click="logoutUser">
                    <v-icon icon="sign-out-alt" style="color: #E67D7D" class="settings-v-icon" />
                    <h2>Log out</h2>
                </div>
            </div>
        </div>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

// import components for this
import closeIcon from '../../icon/CloseIcon';

export default {
    name: 'Settings',
    data () {
        return {
            settingFlag: true
        };
    },
    computed: {
        ...mapGetters({
            flag: 'settings/reserveFlag'
        })
    },
    methods: {
        ...mapActions({
            logout: 'auth/logout',
            reverse: 'settings/reverse'
        }),
        goTitle: function (title) {
            switch (title) {
                case 'notification':
                    this.$router.push({name: 'notification'});
                    this.reverse(false);
                    this.settingFlag = false;
                    break;
                case 'security':
                    // this.$router.push({name: 'security'});
                    // this.reverse(false);
                    // this.settingFlag = false;
                    break;
                case 'about':
                    this.$router.push({name: 'about'});
                    this.reverse(false);
                    this.settingFlag = false;
                    break;
                default:
                    break;
            }
        },
        logoutUser: function () {
            this.logout();
        }
    },
    watch: {
        flag: function () {
            console.log('flag', this.flag);
            if (this.flag) {
                this.settingFlag = true;    
            }
        }
    },
    components: {
        closeIcon
    }
};
</script>