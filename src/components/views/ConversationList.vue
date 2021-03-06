<template>
<div class="conversation-component container">
    <span>{{ users }}</span>
    <div class="row">
        <div class="col-sm-12 col-md-12" :class="{'hidden-xs': hide}">
            <div class="conversation_list">
                <ul class="list-group">
                    <li class="list-group-item">
                        <div class="input-group">
                            <input v-model="textSearch" type="text" class="form-control" placeholder="Enter a name and press search" />
                            <span class="input-group-btn"><!--  -->
                                <button class="btn btn-default" type="button" @click="onSearchUser" >
                                    <i class="fa fa-search" aria-hidden="true"></i>
                                </button>
                            </span>
                        </div>
                    </li>
                    <template v-if="textSearch.length == 0">
                        <Loading class="conversation_chat--chats" :data="conversations">
                            <li v-for="conversation in conversations" class="list-group-item conversation_header" @click="onChangeConversation(conversation)" :class="{'unread': conversation.unread, 'active': selected && conversation.id === selected.id  }" v-bind:key="conversation.id">
                                <div class="media">
                                  <div class="media-left">
                                    <div class="conversation_image circle-box" v-imgSrc:conversation="conversation.image"></div>
                                  </div>
                                  <div class="media-body">
                                    <h4 class="media-heading"><span class="conversation-title">{{ conversation.title }}</span></h4>
                                    <span v-if="conversation.last_message"> {{ conversation.last_message.text ? conversation.last_message.text.substring(0, conversation.last_message.text.length < 50 ? conversation.last_message.text.length : 50) + (conversation.last_message.text.length < 50 ? '' : ' ...') : '' }} </span>
                                    <span class="conversation-timestamp" v-if="false">{{ conversation.updated_at | moment("h:mm a") }}</span>
                                  </div>
                                </div>
                            </li>
                            <li v-if="moreConversations" class="list-group-item" >
                                <button class="btn btn-primary btn-block" @click="nextPage">More results</button>
                            </li>
                            <li slot="no-data" class="list-group-item alert alert-warning conversations"  role="alert">No Conversations ...</li>
                            <li slot="loading" class="list-group-item alert alert-info converations-loading" role="alert">
                                <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                                Loading conversations ...
                            </li>
                        </Loading>
                    </template>
                    <template v-else>
                        <Loading class="conversation_chat--search" :data="users" >
                            <li v-for="user in users" class="list-group-item" @click="createConversation(user)" v-bind:key="user.id">
                                <div class="conversation_image circle-box" v-imgSrc:profile="user.image"></div>
                                {{user.name}}
                            </li>
                            <li slot="no-data" class="list-group-item alert alert-warning"  role="alert">No matches</li>
                            <li slot="loading" class="list-group-item alert alert-info" role="alert">
                                Type a name and search
                            </li>
                        </Loading>
                    </template>
                </ul>
            </div>
        </div>
        <div class="col-xs-24 col-sm-16 col-md-16">
            <div class="">
                <router-view></router-view>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import {Thread} from '../../classes/Threads.js';
import Loading from '../Loading.vue';
import router from '../../router';

export default {
    name: 'conversation-list',
    data () {
        return {
            textSearch: ''
        };
    },

    computed: {
        ...mapGetters({
            conversations: 'conversations/list',
            moreConversations: 'conversations/listMorePage',
            users: 'conversations/users',
            selected: 'conversations/selectedConversation',
            isMobile: 'device/isMobile'
        }),

        hide () {
            return this.$route.meta.hide;
        }
    },

    methods: {
        ...mapActions({
            conversationsSearch: 'conversations/listSearch',
            searchUser: 'conversations/getUserList',
            create: 'conversations/createConversation',
            unreadMessage: 'conversations/getUnreaded',
            select: 'conversations/select',
            clear: 'conversations/clearUserList'
        }),

        nextPage () {
            this.conversationsSearch({next: true});
        },

        onSearchUser () {
            this.searchUser(this.textSearch);
        },

        createConversation (user) {
            console.log('createConversation', this.users);
            this.create(user).then((c) => {
                this.textSearch = '';
                this.clear();
                router.push({ name: 'conversation-chat', params: { id: c.id } });
            }).catch(() => {

            });
        },

        onChangeConversation (conversation) {
            router.push({ name: 'conversation-chat', params: { id: conversation.id } });
        }
    },

    beforeDestroy () {
        this.thread.stop();
        this.select(null);
    },

    watch: {
        '$route': function () {
            if (!this.$route.meta.hide) {
                this.select(null);
            }
        },
        isMobile: function () {
            if (!this.isMobile) {
                router.push({ name: 'conversation-chat' });
            }
        },
        textSearch: function (newValue, oldValue) {
            console.log('textSearch', newValue);
            console.log('textSearch', oldValue);
            if (oldValue.length === 0 && newValue.length > 0) {
                this.clear();
            }
        }
    },

    mounted () {
        this.conversationsSearch();
        this.thread = new Thread(() => {
            this.unreadMessage();
        });
        this.thread.run(20000);
        if (!this.isMobile) {
            router.push({ name: 'conversation-chat' });
        }
    },
    updated () {
    },
    components: {
        Loading
    }
};
</script>

<style>
    .app-container.white {
        background-color: #fff;
    }
    .conversation-component.container {
        width: auto;
    }
    .conversation_chat p,
    .message_text {
        font-family: Poppins;
        font-size: 15px;
        text-align: left;
    }
    .conversation_chat h2 {
        font-size: 25px;
        margin-top: .2em;
        margin-bottom: 0;
    }
    .chat_last_connection {
        margin: .4rem 0;
    }

    .btn-full-width {
        width: 100%;
        margin: 0 0 .8em 0;
    }

    .message-wrapper {
        text-align: left;
        margin-bottom: .4em;
    }
    .conversation-component.container {
        margin-bottom: 3rem;
    }
    .conversation_chat--search > li {
        color: #009ce1;
        cursor: pointer;
    }
    .conversation_chat--search > li:hover {
        background-color: #eee;
    }
    .conversation_chat--search li.list-group-item:last-child {
        border-bottom-width: 1px;
    }
    .conversation-title {
        font-size: 18px;
        font-weight: 900;
        color: black;
        font-family: Poppins;
    }
    .list-group-item {
        font-size: 14px;
    }
    .list-group-item.unread,
    .list-group-item.unread:hover,
    .list-group-item.unread:focus {
        background: rgba(254, 153, 0, .25);
    }

    @media only screen and (min-width: 768px) {
        .conversation-title {
            font-size: 18px;
        }
        .conversation_chat p,
        .message_text {
            font-family: Poppins;
            font-size: 15px;
            text-align: left;
        }
        .conversation_chat h2 {
            font-size: 22px;
        }
        .conversation_chat p.chat_last_connection {
            font-size: 13px;
            margin: 0;
        }
        .app-container {
            background-color: transparent;
        }
        .conversation_chat,
        .conversation_chat > div,
        .conversation-component.container .row,
        .conversation-component > .row > div,
        .conversation-component > .row > div > div,
        .conversation_list .list-group
        {
            height: 100%;
        }
        .conversation_chat .list-group-item:nth-child(2) {
            height: calc(100% - 99px);
            overflow-y: auto;
        }
        .conversation-component.container {
            padding-left: 10px;
            padding-right: 10px;
            overflow-y: hidden;
            height: calc(100vh - 150px);
        }
        .conversation-component > .row {
            padding-left: 20px;
            padding-right: 20px;
        }
        .conversation_chat--search {
            height: calc(100% - 66px);
            overflow-y: auto;
            border-bottom: 1px solid #ddd;
        }
    }
   .row {
    margin-left: 0px !important;
    margin-right: 0px !important;
}

li.list-group-item.alert.alert-warning.conversations {
    margin-top: 0em;
}

.converations-loading{
    margin-top: 1em !important;
}
</style>
