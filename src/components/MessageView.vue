<template>
    <div class="message-wrapper"  v-bind:class="[ author.id == user.id ? 'message-wrapper-me' : '']">
        <div class="message media">
            <div class="media-left" v-if="grupalChat">
                <div class="conversation_image circle-box media-object" v-imgSrc:profile="user.image"  v-if="author.id != user.id"></div>
            </div>
            <div class="media-body">
                <div class="message_author"  v-if="author.id != user.id && grupalChat">
                    <strong>{{ author.name }}</strong>
                </div>
                <div class="message_text">
                    {{ message.text}}
                </div>
                <div class="message_meta">
                    <span class="message_seen" v-if="message.no_of_read - 1 > 0" title="Message seen by the user">
                        <i class="fa fa-check-circle" aria-hidden="true"></i>
                    </span>
                </div>
            </div>
        </div>
        <div>
            <span class="message_time" style="font-size:11px; font-weight:lighter">{{ date }}</span>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    data () {
        return {
        };
    },
    computed: {
        author () {
            let user = this.users.find(item => this.message.user_id === item.id);
            return user || {};
        },
        date () {
            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            if (moment(this.message.created_at)._d < today) {
                return moment(this.message.created_at).format('H:mm A, ddd DD MMM');
            }
            return moment(this.message.created_at).format('LT');
        },
        grupalChat () {
            return false;
        }

    },
    props: [
        'users',
        'message',
        'user'
    ]
};
</script>

<style>
.message {
    border-radius: 25px 25px 25px 5px;
    font-family: Avenir !important;
    box-shadow: 0 0 10px lightgrey;
}
.message-wrapper-me {
    border-radius: 10px 10px 3px 10px !important;
}
.message_text {
    font-family: Avenir;
}
</style>