<template>
  <div class="about-page container about-div">
    <div class="messages-area">
        <h1 style="margin-bottom: unset;">About LessGo</h1>
        <closeIcon :size="12" :classes="'close-message'" />
    </div>
    <p class="lead">
      Lessgo is a Long Distance Ride sharing platform which is fundamentally allows people to share rides togather, as well as that it minimizes the environmental impact of our daily activities.
    </p>
    <h2>Mission</h2>
    <p>The aim of lessgo is to massify the practice of carpooling and encourage the rational and efficient use of the car as a means of transport. This seeks to reduce: </p>


    <ul class="list">

        <li>The emissions of gases that cause the increase of the greenhouse effect in our atmosphere.</li>

        <li> The consumption of fossil fuels (non-renewable resources). </li>

        <li> Traffic congestions that cause great loss of time. </li>

        <li>The levels of smoke and noise in the cities, causing diseases. </li>

        <li> The probability of traffic accidents, with the consequent decrease in mortality. </li>

    </ul>

    <p><li> The probability of traffic accidents, with the consequent decrease in mortality. </li>

    <h2 id="lessgomas">How does lessgo impact our lives?</h2>

    <p>
        When a person carpoolea occur several simultaneous events that affect the life of that person and that of others.
    </p>

    <p>
        First, one of the biggest positive impacts of lessgo is to reinforce social ties. When sharing a trip, people who often did not know each other, generate a link through the talks of the trip. Emerging possibilities of work and new contacts, exchanging points of view on different topics, generating trust among the people, forming even a feeling of "LessGo community". This is achieving a cultural change in front of strangers, in addition to much more entertaining and fun trips.
    </p>

    <p>
        Secondly, the practice of carpooling generates a positive environmental impact when two car drivers who usually travel in separate cars decide to join and travel in the same vehicle leaving the other stored in the garage. If this becomes habitual in people we could reduce the amount of circulating cars and thus also decrease travel time, emissions of greenhouse gases, the consumption of fossil fuels (non-renewable resources), smog and noise pollution that provoke vehicles, among other benefits.
    </p>

    <p>
      Most of the trips that are currently loaded on the platform do not generate a direct environmental impact. These are interurban trips that are occasionally made on weekends. However, they are useful for people to know the practice, they are encouraged to travel with strangers and find a new way of traveling. In the future, when the practice becomes massive, we hope that people will consider carpooling as something viable to apply both to their occasional weekend trips as well as to routine ones, going to work, school, etc. . We also hope that more drivers will let themselves be carried by someone else's car and leave theirs saved.
    </p>

    <p>
        Most of the trips that are currently loaded on the platform do not generate a direct environmental impact. These are interurban trips that are occasionally made on weekends. However, they are useful for people to know the practice, they are encouraged to travel with strangers and find a new way of traveling. In the future, when the practice becomes massive, we hope that people will consider carpooling as something viable to apply both to their occasional weekend trips as well as to routine ones, going to work, school, etc. . We also hope that more drivers will let themselves be carried by someone else's car and leave theirs saved....
    </p>

    <p>
      Carpooling has different positive impacts on society, encourages socialization among strangers, decreases the number of cars circulating with the benefits that this means and represents an economic benefit for users. That is why we believe it is important to encourage this practice and to make people aware so they can make more rational use of the car.
    </p>

    <h2>Environmental impact</h2>

    <p>
        Each time two motorists decide to share the trip in a single vehicle, the emission of 150 g of CO <sub> 2 </sub> into the atmosphere, one of the main gases that contribute to the atmosphere, is avoided - on average, per kilometer traveled. to the greenhouse effect, and the consumption of 0.071 liters of naphtha, a non-renewable source of energy and that is why it must be used rationally.
    </p>

    <h2>Awards</h2>
    <ul class="list">
        <li> Soon ...</li>
    </ul>
    
    <!-- back button -->
    <button @click="onBackClick">Back</button>
  </div>
</template>
<style scoped>
    .jumbotron {
        box-shadow: unset !important;
    }
    .about-page {
        background: white;
        border-radius: 8px;
        box-shadow: 0 0 5px 6px #CCC;
        margin: 3em auto;
        padding: 2em;
    }
    @media (max-width: 767px) {
        .about-page {
            box-shadow: none;
            margin: 0 auto;
        }
    }
    h1 {
        color: #E0191C;
    }
    .list {
        color: #555555;
        list-style-type: circle;
        padding-left: 40px;
    }
    h2 {
        color: #016386;
    }
    .img-ES {
        max-width: 100%;
    }
    .about-div button {
        padding: 15px 30px;
        float: right;
        margin-right: 20px;
        margin-top: 10px;
        border: none;
        border-radius: 10px;
        background: #1c8983;
        box-shadow: 0 0 10px lightgrey;
        color: white;
        font-size: 18px;
    }
</style>


<script>
import bus from '../../services/bus-event.js';
import { mapActions } from 'vuex';

// import components for this
import closeIcon from '../../icon/CloseIcon';

export default {
    name: 'about',
    data () {
        return {
        };
    },
    mounted () {
        bus.on('back-click', this.onBackClick);
    },
    beforeDestroy () {
        bus.off('back-click', this.onBackClick);
    },
    methods: {
        ...mapActions({
            settingReverse: 'settings/reverse'
        }),
        onBackClick () {
            this.settingReverse(true);
            this.$router.push({name: 'settings'});
        }
    },
    components: {
        closeIcon
    }
};
</script>
