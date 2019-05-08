<template>
  <div class="home">
    <image-gallery :photos="photos" />
    <comments :comments="comments" />
    <div v-if="user">
      <h3>Add a Comment</h3>
      <form v-on:submit.prevent="addComment">
        <textarea v-model="text"></textarea>
        <br />
        <button type="submit" class="pure-button">Comment</button>
      </form>
    </div>
    <div v-else>
      <p>If you would like to add a comment, please register for an account or login.</p>
      <router-link to="/register" class="pure-button">Register</router-link> or
      <router-link to="/login" class="pure-button">Login</router-link>
    </div>
</div>
</template>

<script>
import ImageGallery from '@/components/ImageGallery.vue'
import Comments from '@/components/Comments.vue'

export default {
    name: 'photo',
    components: {
      ImageGallery,
      Comments
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      photos() {
        return this.$store.state.photos
      },
      comments() {
        return this.$store.state.comments
      }
    },
    async created() {
      await this.$store.dispatch("getUser");
      await this.$store.dispatch("getComments", this.$route.params.id);
      await this.$store.dispatch("getPhoto", this.$route.params.id);
    },
    data() {
      return {
        text: '',
        error: '',
      }
    },
    methods: {
      escape() {
        this.show = false;
      },
      async addComment() {
        let comment = {
          text: this.text,
          photo: this.$store.state.photos[0],
        }
        this.error = await this.$store.dispatch("addComment", comment);
        if (!this.error) {
          this.text = '';
          await this.$store.dispatch("getComments", this.$route.params.id);
        }
      }
    }
}
</script>
