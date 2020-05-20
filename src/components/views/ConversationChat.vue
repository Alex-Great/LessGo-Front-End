<template>
    <div class="conversation_chat row" v-if="conversation">
            <div class="fixed-div">
                <!-- conversation user area -->
                <div class="title-area" style="padding: 10px 20px;">
                    <div class="conversation-image">
                        <div class="img-profile-detail" @click="userProfile" v-imgSrc="conversation.image">
                        </div>
                        <div class="circle-icon conversation-circle">
                            <v-icon icon="car" v-if="status" />
                            <v-icon icon="user" v-else />
                        </div>
                    </div>
                    <div style="margin-left: 20px;">
                        <h3>{{ conversation.title }}</h3>
                        <div v-for="num in redRating" style="float: left; margin-right: 5px;">
                            <v-icon icon="star" class="v-icon-blue" style="color: #1C8983" />
                        </div>
                        <div v-if="!no_review" v-for="num in greyRating" style="float: left; margin-right: 5px;">
                            <v-icon icon="star" class="v-icon-blue" />
                        </div>
                        <div v-if="no_review">
                            <span>No Reviews</span>
                        </div>
                    </div>
                    <closeIcon style="left: 90% !important" :size="12" :classes="'close-message conversation-close'" title="message" />
                </div>

                <!-- view details -->
                <div v-if="!lastPageConversation" class="chat-detail">
                    <span>{{ last_connection_time }}</span>
                    <p style="cursor: pointer;" @click="searchMore">view details</p>
                </div>
            </div>
            
            <!-- Message content area -->
            <div class="chat-view-area-wrapper">
                <div class="chat-view-area">
                    <MessageView ref="messageBox" v-for="m in messages" :message="m" :user="user" :users="conversation.users"></MessageView>
                </div>
            </div>

            <!-- message input area -->
            <div class="list-group-item">
                <div class="input-group">
                    <input ref="ipt-text" id="ipt-text" v-model="message" type="text" class="form-control" placeholder="Type a message..." v-jump:click="'btn-send'" maxlength="255" autocomplete="off">
                    <span class="input-group-btn">
                        <button ref="btn-send" id="btn-send" class="btn" :class="message.length > 0 ? 'active' : ''" type="button" @click="sendMessage" v-jump:focus="'ipt-text'" :disabled="sending">
                            <airMessageIcon :size="15" />
                        </button>
                    </span>
                </div>
            </div>
        </div>

    </div>
    <div v-else>
      <p slot="no-data" class="alert alert-warning"  role="alert">Select conversation</p>

    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import moment from 'moment';

// import components for this
import closeIcon from '../../icon/CloseIcon';
import airMessageIcon from '../../icon/AirMessageIcon';
import MessageView from '../MessageView';
import router from '../../router';
import bus from '../../services/bus-event';

let totalCount = 5;
export default {
    name: 'conversation-chat',
    data () {
        return {
            message: '',
            mustJump: false,
            sending: false,
            redRating: null,
            greyRating: null,
            no_review: false,
            last_connection_time: ''
        };
    },
    computed: {
        ...mapGetters({
            'conversation': 'conversations/selectedConversation',
            'user': 'auth/user',
            'messages': 'conversations/messagesList',
            'lastPageConversation': 'conversations/lastPageConversation',
            'timestampConversation': 'conversations/timestampConversation',
            'title': 'actionbars/title',
            'isMobile': 'device/isMobile',
            'users': 'auth/users'
        }),
        lastConnection () {
            let users = this.conversation.users.filter(item => item.id !== this.user.id);
            console.log('lastConnection', users);
            if (users.length > 1) {
                return '';
            } else {
                return users[0].last_connection;
            }
        }
    },
    methods: {
        ...mapActions({
            'select': 'conversations/select',
            'send': 'conversations/sendMessage',
            'findMessage': 'conversations/findMessage',
            'unreadMessage': 'conversations/getUnreadMessages',
            'setTitle': 'actionbars/setTitle',
            'setSubTitle': 'actionbars/setSubTitle',
            'setImgTitle': 'actionbars/setImgTitle'
        }),

        onClearClick () {
            router.back();
        },
        userProfile () {
            let id = 0;
            if (this.conversation.users[0].id === this.user.id) {
                id = 1;
            };
            
            let userId = this.conversation.users[id].id.toString();
            let data = {
                id: this.id,
                status: this.status
            };
            this.$router.push({name: 'profileDetail', params: {id: userId, titleText: 'chat', data: data}});
        },

        sendMessage () {
            if (this.message.length) {
                this.sending = true;
                this.send(this.message).then(data => {
                    this.sending = false;
                }).catch(() => {
                    this.sending = false;
                });
                this.message = '';
            }
        },

        onBackClick () {
            // router.back();
            router.push({ name: 'conversations-list' });
        },

        jumpEndOfConversation () {
            let scroll = this.$refs.messageBox[0];
            console.log('scroll', scroll.scrollHeight);
            if (this.isMobile) {
                window.scrollTo(0, document.body.scrollHeight);
            } else {
                let div = this.$refs.messagesWrapper;
                if (div) {
                    div.scrollTop = div.scrollHeight;
                }
            }
        },

        searchMore () {
            console.log('conversation', this.conversation);
            console.log('user', this.user);
            this.findMessage({more: true});
        },

        refresh () {
            this.select(parseInt(this.id)).then(() => {
                bus.on('back-click', this.onBackClick);
                if (this.conversation) {
                    this.setTitle(this.conversation.title);
                    this.setSubTitle('Last connection: ' + moment(this.lastConnection).calendar());
                    this.setImgTitle(this.conversation.image);
                }
            });
        }
    },
    beforeDestroy () {
        bus.off('clear-click', this.onClearClick);
    },
    mounted () {
        bus.on('clear-click', this.onClearClick);
        this.refresh();
        console.log('users', this.users);
        console.log('conversation', this.conversation);
        this.users.forEach(user => {
            if (user.id === this.conversation.users[0].id) {
                this.redRating = [];
                this.greyRating = [];
                let ratingCount = user.positive_ratings + user.negative_ratings;
                // rating count
                if (ratingCount !== 0) {
                    for (let i = 0; i < ratingCount; i++) {
                        this.redRating.push(i);
                    }

                    for (let j = 0; j < (totalCount - ratingCount); j++) {
                        this.greyRating.push(j);
                    }
                } else {
                    this.no_review = true;
                }
            }
        });
        this.last_connection_time = moment(this.conversation.last_message.created_at).format('ddd DD/M') + ' at ' + moment(this.conversation.last_message.created_at).format('HA');
    },
    updated () {
        if (this.mustJump) {
            this.jumpEndOfConversation();
            this.mustJump = false;
        }
        if (this.conversation) {
            this.setTitle(this.conversation.title);
            this.setSubTitle('Last connection: ' + moment(this.lastConnection).calendar());
            this.setImgTitle(this.conversation.image);

            bus.emit('header-title-change');
        }
    },
    watch: {
        'id': function () {
            this.refresh();
        },
        isMobile: function () {
            if (!this.id && this.isMobile) {
                router.push({ name: 'conversations-list' });
            }
        },
        messages: function () {
            this.mustJump = true;
        }

    },
    props: {
        id: {
            type: Number,
            required: false,
            default: 0
        },
        status: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    components: {
        MessageView,
        closeIcon,
        airMessageIcon
    }
};
</script>

<style scoped>
    #ipt-text {
        border-radius: 10px 0 0 10px;
        background: #F0F4F3;
        border: none;
    }
    #btn-more {
        padding: 1em 0;
    }
    #btn-send {
        color: #ccc;
        background: #F0F4F3;
        transition: color 200ms linear;
        margin: unset;
        padding: 0 20px;
        height: 40px;
        border: none;
        box-shadow: none !important;
        border-radius: 0 10px 10px 0;
    }
    #btn-send.active {
        color: #333;
    }
    @media only screen and (max-width: 768px) {
        .list-group-item {
            border: 0;
        }
        .list-group-item:last-child {
            border-top: 1px solid #ddd;
            bottom: 0;
            left: 0;
            width: 100%;
            position: fixed;
        }
        .conversation_chat .input-group-btn:last-child>.btn {
            height: 44px;
        }
        .btn, .btn-primary, body, #btn-more {
            font-size: 12px;
            margin-bottom: 1em;
        }
        #messagesWrapper {
            padding-top: 0;
        }
    }
</style>
