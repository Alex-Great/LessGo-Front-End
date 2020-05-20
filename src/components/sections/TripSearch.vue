<template>
    <div>
        <div class="searchArea-box">
            <div>
                <v-icon :icon="['fa', 'bullseye']" class="v-icon-search" />
                <gmap-autocomplete
                    @place_changed="setFromtownPlace"
                    placeholder="Leaving from"
                    :value="from_address"
                ></gmap-autocomplete>
            </div>
            <div>
                <v-icon :icon="['fas', 'map-marker-alt']" class="v-icon-search" />
                <gmap-autocomplete
                    @place_changed="setTotownPlace"
                    placeholder="Going to"
                    :value="to_address"
                ></gmap-autocomplete>    
            </div>
        </div>
        <DatePicker
            ref="datepicker"
            @onChange="changeDate"
            :minDate="minDate"
            :format="'D dd MMM'"
        />
    </div>
</template>

<script>
import moment from 'moment';

// import components for this
import DatePicker from '../DatePicker';

export default {
    name: 'tripSearch',
    data () {
        return {
            from_address: '',
            to_address: '',
            date: '',
            minDate: moment().toDate()
        };
    },
    methods: {
        setTotownPlace: function (place) {
            this.to_address = place.formatted_address;
            console.log('setTotownPlace', place);
        },
        setFromtownPlace: function (place) {
            this.from_address = place.formatted_address;
            console.log('setFromtownPlace', place);
        },
        changeDate: function (value) {
            this.date = value;
        }
    },
    watch: {
        from_address: function () {
            if (this.from_address !== '' && this.to_address !== '') {
                let data = {
                    from_town: this.from_address,
                    to_town: this.to_address
                };
                if (this.date !== '') {
                    data.date = this.date;
                } else {
                    data.date = this.minDate;
                }
                this.$emit('searchResult', data);
            }
        },
        to_address: function () {
            if (this.from_address !== '' && this.to_address !== '') {
                let data = {
                    from_town: this.from_address,
                    to_town: this.to_address
                };
                if (this.date !== '') {
                    data.date = this.date;
                } else {
                    data.date = this.minDate;
                }
                this.$emit('searchResult', data);
            }
        },
        date: function () {
            if (this.from_address !== '' && this.to_address !== '') {
                let data = {
                    from_town: this.from_address,
                    to_town: this.to_address
                };
                if (this.date !== '') {
                    data.date = this.date;
                } else {
                    data.date = this.minDate;
                }
                this.$emit('searchResult', data);
            }
        }
    },
    components: {
        DatePicker
    }
};
</script>