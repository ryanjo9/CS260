<template>
<div>
  <div v-if="user">
    <div class="header">
      <div>
        <h1>{{user.name}}</h1>
      </div>
      <div>
        <p>
          <a @click="toggleUpload"><i class="far fa-image"></i></a>
          <a href="#" @click="logout"><i class="fas fa-sign-out-alt"></i></a>
        </p>
      </div>
    </div>
    <escape-event @escape="escape"></escape-event>
    <uploader :show="show" @escape="escape" @uploadFinished="uploadFinished" />
    <image-gallery :photos="photos" />
  </div>
  <div v-else>
    <p>If you would like to upload photos, please register for an account or login.</p>
    <router-link to="/register" class="pure-button">Register</router-link> or
    <router-link to="/login" class="pure-button">Login</router-link>
  </div>
</div>
</template>

<script>
import EscapeEvent from '@/components/EscapeEvent.vue'
import Uploader from '@/components/Uploader.vue'
import ImageGallery from '@/components/ImageGallery.vue'

export default {
  name: 'mypage',
  components: {
    EscapeEvent,
    Uploader,
    ImageGallery,

  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    photos() {
      return this.$store.state.photos;
    }
  },
  data() {
    return {
      show: false,
    }
  },
  async created() {
    await this.$store.dispatch("getUser");
    await this.$store.dispatch("getMyPhotos");
  },
  methods: {
    async logout() {
      try {
        this.error = await this.$store.dispatch("logout");
      } catch (error) {
        console.log(error);
      }
    },
    escape() {
      this.show = false;
    },
    toggleUpload() {
      this.show = true;
    },
    async uploadFinished() {
      this.show = false;
      try {
        this.error = await this.$store.dispatch("getMyPhotos");
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>

<style scoped>
.header {
  display: flex;
}

.header a {
  padding-left: 50px;
  color: #222;
  font-size: 2em;
}

.header svg {
  margin-top: 12px;
}
</style>
