<template>
  <div class="home">
    <h2>Things to Do in Utah</h2>
    <h3>(Besides math and programming)</h3>
    <p>For all the engineers, programmers, and other STEM people who like to do things that don't involve staring at a screen.</p>
    <p>Anyone can browse through the list. If you want to "like" an idea, contribute your own, or see suggestions based on what we think you'll like, click on the MyPage link on the side to register for an account</p>
    <idea-list :ideas="ideas" />
  </div>
</template>

<script>
// @ is an alias to /src
import IdeaList from '@/components/IdeaList.vue'

export default {
  name: 'home',
  components: {
    IdeaList
  },
  computed: {
    ideas() {
      return this.$store.state.ideas;
    }
  },
  async created() {
    document.getElementById("app").style.background = "#f3f3f3 url('https://karunasarawak.com/wp-content/uploads/2017/08/mountain-background.png') no-repeat right top";
    await this.$store.dispatch('getAllIdeas');
  },
}
</script>

<style scoped>
  p {
    max-width: 500px;
  }
</style>
