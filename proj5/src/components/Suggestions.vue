<template>
<div>
  <div id="activityButtons">
    <p>
      <button v-on:click="chooseSports">SPORTS</button>
      <button v-on:click="chooseHikes">HIKES</button>
      <button v-on:click="chooseDrives">DRIVES</button>
      <button v-on:click="chooseWut">WUT</button>
    </p>
  </div>
  <div class="idea" v-for="idea in selection" v-bind:key="idea._id">
    <label>
      <p class="ideaTitle">{{idea.title}}</p>
      <p v-if='idea.description'>{{ idea.description }}</p>
      <p v-if='idea.price'>Price: <i>${{ idea.price }}</i></p>
      <p v-if='idea.when'>When: {{ idea.when }}
      <p v-if='idea.directionsLink'><a v-bind:href="idea.directionsLink">Directions</a></p>
      <p v-if='idea.reviewsLink'><a v-bind:href="idea.reviewsLink">Google Reviews</a></p>
    </label>
    <p class="ideaDate">
      <span v-if="idea.user.name">{{idea.user.name}}, </span>
      {{formatDate(idea.created)}}
    </p>
  </div>
</div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Ideas',
  props: {
    ideas: Object
  },
  computed: {
    selection() {
      if (this.ideas) {
        return this.ideas[this.category];
      }
      else return [];
    }
  },
  data() {
    return {
      category: 'sports'
    }
  },
  methods: {
    formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 15)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    },
    chooseSports() {
      this.category = 'sports';
    },
    chooseDrives() {
      this.category = 'drives';
    },
    chooseHikes() {
      this.category = 'hikes';
    },
    chooseWut() {
      this.category = 'wut';
    }
  }
}
</script>
<style scoped>
.ideaTitle {
  margin: 0px;
  font-size: 1.2em;
}

.ideaDate {
  margin: 0px;
  font-size: 0.9em;
  font-weight: normal;
}

p {
  margin: 0px;
}

.idea {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 94%;
}
button {
    font-family: 'Arvo';
    font-size: 1em;
}

button{
  background:#1AAB8A;
  color:#fff;
  border:none;
  position:relative;
  height:30px;
  margin-top: 10px;
  min-width: 79px;
  font-size:1.0em;
  cursor:pointer;
  transition:800ms ease all;
  outline:none;
}
button:hover{
  background:#fff;
  color:#1AAB8A;
}
button:before,button:after{
  content:'';
  position:absolute;
  top:0;
  right:0;
  height:2px;
  width:0;
  background: #1AAB8A;
  transition:400ms ease all;
}
button:after{
  right:inherit;
  top:inherit;
  left:0;
  bottom:0;
}
button:hover:before,button:hover:after{
  width:100%;
  transition:800ms ease all;
}

</style>
