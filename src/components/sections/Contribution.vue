<template>
    <div class="contribution">
        <div class="col-xs-6">
            <div class="con-icons">
                <v-icon icon="gas-pump" class="v-icons-contribution" />
            </div>
            <span>{{ saved_km }}<span class="unit">&nbsp;km</span></span>
            <p>saved</p>
        </div>
        <div class="col-xs-6">
            <div class="con-icons">
                <v-icon icon="cloud" class="v-icons-contribution" style="width: 25px !important" />
            </div>
            <span>{{ co2 }}<span class="unit">&nbsp;kg</span></span>
            <p>CO2eq saved</p>    
        </div>
        <div class="col-xs-6">
            <div class="con-icons">
                <v-icon icon="user" class="v-icons-contribution" />
            </div>
            <span>{{ as_passenger }}<span class="unit">&nbsp;trips</span></span>
            <p>as passenger</p>    
        </div>
        <div class="col-xs-6">
            <div class="con-icons">
                <v-icon icon="car" class="v-icons-contribution" />
            </div>
            <span>{{ as_driver }}<span class="unit">&nbsp;trips</span></span>
            <p>as driver</p>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'contribution',
    data () {
        return {
            as_driver: '',
            as_passenger: '',
            co2: '',
            saved_km: ''
        };
    },
    props: {
        data: {
            type: Object,
            required: false,
            default: null
        },
        testFlag: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    mounted () {
        if (this.testFlag) {
            this.as_driver = 0;
            this.as_passenger = 0;
            this.co2 = 0;
            this.saved_km = 0;
        } else {
            this.as_driver = this.data.as_driver;
            this.as_passenger = this.data.as_passenger;
            this.co2 = this.data.co2;
            this.saved_km = this.data.saved_km;
        }
    }
};
</script>