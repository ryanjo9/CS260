<template>
<div>
  <h2>Comments</h2>
  <div class="comment" v-for="comment in comments" v-bind:key="comment._id">
    <p>{{comment.text}}</p>
    <p class="commentDate">
      <span v-if="comment.user.name">{{comment.user.name}}, </span>
      {{formatDate(comment.created)}}
    </p>
  </div>
</div>
</template>

<script>
import moment from 'moment';
export default {
  name: 'Comments',
  props: {
    comments: Array
  },
  methods: {
    formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 15)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    }
  }
}
</script>

<style scoped>
.commentDate {
  margin: 0px;
  font-size: 0.9em;
  font-weight: normal;
}

p {
  margin: 0px;
}

.comment {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}

</style>
