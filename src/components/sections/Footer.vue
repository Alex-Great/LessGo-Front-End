<template>
  <footer class="footer-component">
    <div class="actionbar actionbar-bottom visible-xs" v-if="footerShow" style='height:65px;'>

        <div class="actionbar_item" v-for="item in footerButtons" :class="{ active: item.active }" @click="onClick(item)">
            <span :class="{ big: item.id === 'new-trip', 'width-badges': item.id === 'notifications' }" class="footerItem">
                <span style="align-content:center;">
                    <i size="25" :class="item.icon "></i>
                    <label v-text="item.label" v-if=item.active  style="font-size:12px;display:flex;vertical-align:top;font-style:'Poppins';color:red"></label>
                    <label v-text="item.label" v-else  style="font-size:12px;display:flex;vertical-align:top;font-style:'Poppins';"></label>
                </span>
                <span class="badge" v-if="notificationsCount > 0 && item.id === 'notifications'">{{notificationsCount}}</span>

            </span>
        </div>
    </div>
    <div class="container hidden-xs">
        <div class="row">
            <div class="col-xs-6 col-md-6">
                <h3>About ...</h3>
                <ul>
                    <li><router-link tag="a" :to="{ name:'about' }">LessGo</router-link></li>
                    <li><a href="https://lessgo.app/app/about" target="_blank">Team</a></li>
                </ul>
            </div>
            <div class="col-xs-6 col-md-6">
                <h3>Help</h3>
                <ul>
                    <!--<li><a href="https://lessgo.app/tutoriales.php" target="_blank">Tutoriales de uso</a></li>-->
                    <li><a href="https://lessgo.app/platform-frequently asked questions" target="_blank">Frequent questions (FAQ)</a></li>
                    <li><a href="https://lessgo.app/platform-frequently asked questions" target="_blank">recommendations</a></li>
                </ul>
            </div>
            <div class="col-xs-6 col-md-6">
                <h3>Find us on</h3>
                <ul>
                    <li>
                        <a href="https://www.facebook.com/lessgo">
                            <i class="fa fa-facebook" aria-hidden="true"></i>
                            <span>Facebook</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://twitter.com/lessgo">
                            <i class="fa fa-twitter" aria-hidden="true"></i>
                            <span>Twitter</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.instagram.com/lessgo/?hl=en">
                            <i class="fa fa-instagram" aria-hidden="true"></i>
                            <span>Instagram</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/lessgo">
                            <i class="fa fa-github" aria-hidden="true"></i>
                            <span>Github</span>
                        </a>
                    </li>
                    <li>
                        <a href="mailto://info@lessgo.app">
                            <i class="fa fa-envelope-o" aria-hidden="true"></i>
                            <span>Mail</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="col-xs-6 col-md-6">
                <h3>Legal information</h3>
                <p>
                    Started Rocking from 2019<br />
                    <router-link :to="{name: 'terms'}">Terms and Conditions</router-link>
                </p>
            </div>
        </div>
    </div>
  </footer>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
import svgItem from '../SvgItem';

export default {
    name: 'footer',
    data () {
        return {
        };
    },
    computed: {
        ...mapGetters({
            footerButtons: 'actionbars/footerButtons',
            footerShow: 'actionbars/footerShow',
            notificationsCount: 'notifications/count'
        })
    },
    methods: {
        ...mapActions({
            onClick: 'actionbars/footerButtonClick'
        })
    },
    components: {
        svgItem
    }
};
</script>

<style scoped>

    .footerItem{
        background-color: white;
    }
    h3 {
        font-size: 18px;
    }
    .width-badges {
        position: relative;
    }
    .badge {
        position: absolute;
        right: 5px;
        bottom: 3px;
        font-size: 10px;
        height: auto;
        width: auto;
        padding: 3px 4px!important;
    }
</style>
