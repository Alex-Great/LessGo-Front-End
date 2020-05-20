<template>
  <div class="friends-component" >
        <div class="clearfix">
            <Loading :data="pendings" :hideOnEmpty="true">
                <h2 slot="title">Friend requests</h2>
                <div id="friends-list">
                    <FriendCard v-for="user in pendings" :user="user">
                        <template slot>
                            <span> wants to be your friend. </span>
                            <div class="pending-buttons">
                                <button @click="onAcceptClick(user)" class="btn btn-accept-request"> <i class="fa fa-check" aria-hidden="true"></i> </button>
                                <button @click="onRejectClick(user)" class="btn btn-primary"> <i class="fa fa-times" aria-hidden="true"></i> </button>
                                <span v-if="idRequesting == user.id">In process...</span>
                            </div>
                        </template>
                    </FriendCard>
                </div>
                <p slot="no-data" class="alert alert-warning"  role="alert">No new requests</p>
                <p slot="loading" class="alert alert-info" role="alert">
                    <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                    Loading requests ...
                </p>
            </Loading>
        </div>

        <h2>Friends</h2>
        <router-link :to="{name: 'friends_search'}" tag="button" class="btn btn-primary search-more"> Search for new friends</router-link>
        <h2>My friends</h2>
        <div class="friend-form form-inline form-inline-with-margin">
            <div class="form-group ">
                <label for="input-name"> Filter by name: </label>
                <input v-on:input="onTextChange" v-model="text" type="text" class="form-control" id="input-name" placeholder="Enter name ...">
            </div>
        </div>
        <Loading :data="friends">
            <div id="friends-list">
                <FriendRequestCard v-for="user in friends" :user="user">
                    <template slot>
                        <div>
                            <div @click="onDeleteClick(user)" class="delete-friend">  <i class="fa fa-times" aria-hidden="true"></i>  </div>
                            <span v-if="idRequesting == user.id">In process...</span>
                        </div>
                    </template>
                </FriendRequestCard>
            </div>
            <p slot="no-data" class="alert alert-warning"  role="alert">{{noResult}}</p>
            <p slot="loading" class="alert alert-info" role="alert">
                <img src="/static/svg/loaderr.gif" alt="" class="ajax-loader" />
                Loading friends ...
            </p>
        </Loading>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Loading from '../Loading.vue';
import FriendCard from './FriendCard';
import FriendRequestCard from './FriendRequestCard';

export default {
    name: 'friends_setting',
    data () {
        return {
            text: '',
            idRequesting: 0
        };
    },
    computed: {
        ...mapGetters({
            friends: 'friends/friends',
            pendings: 'friends/pendings'
        }),

        noResult () {
            if (this.text.length) {
                return 'No results';
            } else {
                return 'You dont have any friends yet.';
            }
        }
    },
    methods: {
        ...mapActions({
            'search': 'friends/friendsSearch',
            'lookPeginds': 'friends/pending',
            'accept': 'friends/accept',
            'reject': 'friends/reject',
            'delete': 'friends/delete'
        }),

        onTextChange () {
            this.search({value: this.text});
        },

        onAcceptClick (user) {
            this.idRequesting = user.id;
            this.accept(user.id).then(() => {
                this.idRequesting = 0;
            }, () => {
                this.idRequesting = 0;
            });
        },

        onRejectClick (user) {
            this.idRequesting = user.id;
            this.reject(user.id).then(() => {
                this.idRequesting = 0;
            }, () => {
                this.idRequesting = 0;
            });
        },

        onDeleteClick (user) {
            this.idRequesting = user.id;
            this.delete(user.id).then(() => {
                this.idRequesting = 0;
            }, () => {
                this.idRequesting = 0;
            });
        }
    },

    mounted () {
        this.search({});
        this.lookPeginds();
    },
    components: {
        Loading,
        FriendCard,
        FriendRequestCard
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .btn-primary {
        padding: .8em;
    }
    h2 {
        margin-top: 0;
        margin-bottom: 0;
    }
    .form-group {
        margin-bottom: 15px;
    }
    .form-group {
        margin-bottom: 0;
    }
    .request-list div.rate-pending_component, .friend-card {
        /* margin: 1.1em auto; */
        margin: 0;
    }
    label {
        margin-right: 1em;
    }
    h2 {
        margin-bottom: .4em;
    }
    .search-more {
        margin-bottom: 1em;
    }
    .friend-form {
        margin-bottom: 0;
    }
    .alert {
        margin-top: 1em;
    }
    @media only screen and (max-width: 768px) {
        .friends-component {
            padding: 1em;
        }
        .friend-card {
            margin: 0;
        }
    }
    @media only screen and (min-width: 767px) {
        .friend-form {
            margin-top: 1.6em;
        }
    }

</style>
