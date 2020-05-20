<template>
    <div class="messages">
        <div class="messages-area">
            <h1 style="margin-bottom: unset;">Notifications</h1>
            <closeIcon :size="12" :classes="'close-message'" />
        </div>

        <!-- notification functional areas -->
        <div class="notification-actions">
            <!-- General part -->
            <h2>General</h2>
            <div class="noti-action">
                <div class="noti-section" v-for="data in generalData">
                    <h3>{{ data.title }}</h3>
                    <notiSwitchBtn :title="data.compareKey" @toggle="notiStatus" />
                </div>
            </div>

            <!-- Driver part -->
            <h2>Driver</h2>
            <div class="noti-action">
                <div class="noti-section" v-for="data in driverData">
                    <h3>{{ data.title }}</h3>
                    <notiSwitchBtn :title="data.compareKey" @toggle="notiStatus" />
                </div>
            </div>

            <!-- Community part -->
            <h2>Community</h2>
            <div class="noti-action">
                <div class="noti-section" v-for="data in communityData">
                    <h3>{{ data.title }}</h3>
                    <notiSwitchBtn :title="data.compareKey" @toggle="notiStatus" />
                </div>
            </div>

            <!-- save button -->
            <button @click="saveNotification">Save</button>
        </div>
    </div>
</template>

<script>
// import components for this
import closeIcon from '../../icon/CloseIcon';
import notiSwitchBtn from '../elements/NotiSwitchBtn';

// import json for this
import notificationJson from '../../jsons/notifications.json';

export default {
    name: 'notification',
    data () {
        return {
            generalData: null,
            driverData: null,
            communityData: null,
            notificationData: {
                'ride-req': false,
                'in-mess': false,
                'ride-sta': false,
                'promotional': false,
                'new-ride': false,
                'passenger': false,
                'community': false,
                'membership': false
            }
        };
    },
    methods: {
        notiStatus: function (data) {
            console.log('data', data);
            this.notificationData[data.compareKey] = data.flagStatus;
            console.log('notificationData', this.notificationData);
        },
        saveNotification: function () {
            
        }
    },
    mounted () {
        this.generalData = notificationJson.general;
        this.driverData = notificationJson.driver;
        this.communityData = notificationJson.community;
    },
    components: {
        closeIcon,
        notiSwitchBtn
    }
};
</script>