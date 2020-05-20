<template>
    <div class="communities">
        <!-- community title -->
        <div :style="filterFlag?'filter: blur(3px)': ''">
            <div class="messages-area">
                <h1>Communities</h1>
                <closeIcon :size="12" :classes="'close-message'" />

                <!-- search community -->
                <div class="search-conversation">
                    <v-icon icon="search" class="v-icons-message" style="width: 15px !important; height: 15px; margin-top: 4px" />
                    <input @keyup="onChange" type="text" name="" placeholder="Search communities" />
                </div>
            </div>

            <!-- communities -->
            <div class="communities-area">
                <div v-for="(community, index) in communities" :key="index" class="community-content">
                    <!-- <div class="img-circle" :style="{'background': 'url(' + bank_img + ')'}"></div> -->
                    <div class="img-circle" :style="{'background': 'url(' + community.img_url + ')'}"></div>
                    <div class="community-detail">
                        <h3>{{ community.name }}</h3>
                    </div>
                    <button type="button" @click="showCommunityBoard(community.id)">Join</button>
                </div>
            </div>
        </div>

        <!-- join community -->
        <joinCommunity :show="showCommunityFlag" :data="boardData" />
    </div>
</template>

<script>
// import components for this
import closeIcon from '../../icon/CloseIcon.vue';
import joinCommunity from '../sections/JoinCommunity.vue';

// import json for this
import communityJson from '../../jsons/communities.json';

export default {
    name: 'community',
    data () {
        return {
            communities: communityJson.communities,
            sourceData: communityJson.communities,
            showCommunityFlag: false,
            boardData: {},
            bank_img: process.env.ROUTE_BASE + 'static/img/bank.png',
            filterFlag: false
        }
    },
    props: {
        status: {
            type: String,
            required: false,
            default: ''
        }
    },
    methods: {
        showCommunityBoard: function (id) {
            this.communities.forEach(obj => {
                if (obj.id === id) {
                    this.showCommunityFlag = true;
                    this.filterFlag = true;

                    let data = obj;
                    data['signStatus'] = this.status;
                    this.boardData = data;
                }
            });
        },
        onChange: function (v) {
            let searchValue = v.target.value;
            let regex = new RegExp('^' + searchValue + '|' + searchValue + '.|.' + searchValue, 'i');
            let searchData = [];
            
            // search community
            this.sourceData.forEach(obj => {
                if (regex.test(obj.name)) {
                    searchData.push(obj);
                }
            });

            this.communities = searchData;
        }
    },
    components: {
        closeIcon,
        joinCommunity
    }
};
</script>