<template>
    <div class="messages">
        <!-- messages area -->
        <div class="messages-area">
            <h1>Messages</h1>
            <closeIcon :size="12" :classes="'close-message'" />
            <div class="divide-messages">
                <div @click="selectItem('inbox')">
                    <v-icon icon="inbox" class="v-icons-message" :style="inbox?'color: #1C8983': 'color: #B5B6BC'" />
                    <span :style="inbox? 'color: #1C8983': 'color: #B5B6BC'">INBOX</span>
                </div>
                <div @click="selectItem('notification')">
                    <v-icon icon="bell" class="v-icons-message" :style="notification?'color: #d7eae9': 'color: #c5c6cb'" />
                    <span :style="notification? 'color: #1C8983': 'color: #B5B6BC'">NOTIFICATIONS</span>
                </div>
            </div>

            <!-- search conversation -->
            <div class="search-conversation" v-if="inbox">
                <v-icon icon="search" class="v-icons-message" style="width: 15px !important; height: 15px; margin-top: 4px" />
                <input v-model="conversation" type="text" name="" placeholder="Search conversations" />
            </div>
        </div>

        <!-- members area -->
        <div class="members-area" style="padding: 20px">
            <!-- Inbox -->
            <div class="d-m-a" v-if="inbox">
                <Loading :data="conversations">
                    <div @click="onChat(conversation)" v-for="conversation in conversationLists" class="member-content">
                        <div class="img-circle" v-imgSrc:conversation="conversation.image"></div>
                        <div class="circle-icon">
                            <v-icon icon="car" v-if="conversation.is_driver" />
                            <v-icon icon="user" v-else />
                        </div>
                        <div class="member-detail">
                            <h3>{{ conversation.title }}</h3>
                            <span>{{ conversation.last_message.text }}</span>
                        </div>
                    </div>
                    <li slot="no-data" class="list-group-item alert alert-warning conversations"  role="alert">No Conversations ...</li>
                    <li slot="loading" class="list-group-item alert alert-info converations-loading" role="alert">
                        <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                        Loading conversations ...
                    </li>
                </Loading>
            </div>
            <!-- support -->
            <div class="s-m-a" v-else="notification">
                <!-- notifications for join request as passenger on trip -->
                <notificationBoard v-for="r in pendingRequest" :user="r.user" :trip="findTrip(r.trip_id)" />

                <!-- unreaded notifications -->
                <unreadNotification v-for="data in unreadNotifications" :notification="data" />

                <h2>OLDER NOTIFICATIONS</h2>
                <!-- readed notifications -->
                <readNotification v-for="data in readNotifications" :notification="data" />
            </div>
        </div>    
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Thread } from '../../classes/Threads.js';

// import components for this
import closeIcon from '../../icon/CloseIcon.vue';
import notificationBoard from '../sections/NotificationBoard';
import readNotification from '../sections/readNotification';
import unreadNotification from '../sections/unreadNotification';
import Loading from '../Loading';

export default {
    name: 'messages',
    data () {
        return {
            inbox: true,
            notification: false,
            conversation: '',
            sourceConversations: null,
            conversationLists: null,
            readNotifications: null,
            unreadNotifications: null
        };
    },
    computed: {
        ...mapGetters({
            conversations: 'conversations/list',
            moreConversations: 'conversations/listMorePage',
            users: 'conversations/users',
            selected: 'conversations/selectedConversation',
            trips: 'myTrips/myTrips',
            pendingRequest: 'passenger/pendingRequest',
            notifications: 'notifications/index',
            getOtherUsersTripsAsDriver: 'userTrips/driverTrip'
        })
    },
    async mounted () {
        await this.getAllUsers();
        await this.getPendingRequest();
        await this.conversationsSearch();
        await this.search();
        let allTrips = this.getOtherUsersTripsAsDriver;
        let allNotifications = this.notifications;
        console.log('allNotifications', allNotifications);
        let readedNotifications = [];
        let unreadedNotifications = [];

        allNotifications.forEach(notification => {
            allTrips.forEach(trip => {
                if (notification.readed) { // readed notifications
                    if (notification.extras.trip_id === trip.id) {
                        notification['trip'] = trip;
                        readedNotifications.push(notification);
                    }
                } else { // unreaded notifications
                    if (notification.extras.trip_id === trip.id) {
                        notification['trip'] = trip;
                        unreadedNotifications.push(notification);
                    }
                }
            });
        });

        this.readNotifications = readedNotifications;
        this.unreadNotifications = unreadedNotifications;

        // check driver or passenger
        let userLists = this.conversations;
        userLists.forEach((conversation, index) => {
            this.trips.forEach(trip => {
                trip.passenger.forEach(passenger => {
                    if (conversation.users[0].name === passenger.name) {
                        conversation['is_driver'] = false;
                    } else {
                        conversation['is_driver'] = true;
                    }
                });
            });
        });

        this.conversationLists = userLists;
        this.sourceConversations = this.conversations;
        this.deleteAllTrips();
    },
    methods: {
        ...mapActions({
            conversationsSearch: 'conversations/listSearch',
            tripAsDriver: 'myTrips/tripAsDriver',
            getPendingRequest: 'passenger/getPendingRequest',
            searchUser: 'conversations/getUserList',
            create: 'conversations/createConversation',
            unreadMessage: 'conversations/getUnreaded',
            select: 'conversations/select',
            clear: 'conversations/clearUserList',
            search: 'notifications/index',
            getAllUsers: 'auth/getAllUsers',
            deleteAllTrips: 'userTrips/deleteAllTrips'
        }),
        findTrip: function (id) {
            if (this.trips) {
                return this.trips.find(item => item.id === id);
            }
        },
        selectItem: function (item) {
            if (item === 'inbox') {
                this.inbox = true;
                this.notification = false;
            } else {
                this.inbox = false;
                this.notification = true;
            }
        },
        onChat: function (conversation) {
            this.$router.push({ name: 'conversation-chat', params: { id: conversation.id, status: conversation.is_driver } });
        }
    },
    watch: {
        conversation: function (newValue, oldValue) {
            let searchValue = newValue;
            let regex = new RegExp('^' + searchValue + '|' + searchValue + '.|.' + searchValue, 'i');
            let searchConversations = [];

            this.sourceConversations.forEach(conversation => {
                if (regex.test(conversation.last_message.text)) {
                    searchConversations.push(conversation);
                }
            });

            this.conversationLists = searchConversations;
        }
    },
    beforeDestroy () {
        this.thread.stop();
        this.select(null);
    },
    components: {
        closeIcon,
        Loading,
        notificationBoard,
        readNotification,
        unreadNotification
    }
};
</script>