<template>
    <div class="welcome-page">
        <img :src="bk_up_Img" class="bk_up_Img" />
        <div class="welcome-detail">
            <h3>Thanks for registering!</h3>
            <span>
                You can now enjoy</br>
                sharing rides and experiences</br>
                with&nbsp;<span style="color: #EB5557; font-size: 22px; font-weight: bold;">LessGo</span>
            </span>
            <button @click="goCommunity">
                Start going for less
            </button>
        </div>
        <img :src="bk_down_Img" class="bk_down_Img" />
    </div>
</template>

<script>
export default {
    name: 'welcomeRegister',
    data () {
        return {
            bk_down_Img: process.env.ROUTE_BASE + 'static/img/Group839.svg',
            bk_up_Img: process.env.ROUTE_BASE + 'static/img/welcome.png'
        };
    },
    methods: {
        goCommunity: function () {
            let status = 'signup';
            console.log('status', status);
            this.$router.push({name: 'communities', params: {status}});
        }
    }
};
</script>