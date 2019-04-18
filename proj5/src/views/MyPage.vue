<template>
<div>
  <div v-if="user">
    <div class="header">
      <div>
        <h1>{{user.name}}</h1>
      </div>
      <div>
        <p>
          <button type="button" @click="toggleUpload" class="pure-button">Add an Idea</button>
          <button type="button" @click="logout" class="pure-button">Logout</button>
          <button type="button" @click="suggestions" class="pure-button">Suggestions</button>
          <button type="button" @click="getMyIdeas" class="pure-button">See My Ideas</button>
        </p>
      </div>
    </div>
    <escape-event @escape="escape"></escape-event>
    <uploader :show="show" @escape="escape" @uploadFinished="uploadFinished" />
    <p>Your contributions</p>

    <idea-list :ideas="ideas"></idea-list>
  </div>
  <div v-else>
    <p>If you would like to add an idea, please register for an account or login.</p>
    <router-link to="/register" class="pure-button">Register</router-link> or
    <router-link to="/login" class="pure-button">Login</router-link>
  </div>
</div>
</template>

<script>
import EscapeEvent from '@/components/EscapeEvent.vue'
import Uploader from '@/components/Uploader.vue'
import IdeaList from '@/components/IdeaList.vue'
export default {
  name: 'mypage',
  components: {
    EscapeEvent,
    Uploader,
    IdeaList
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    ideas() {
      return this.$store.state.ideas;
    }
  },
  async created() {
    document.getElementById("app").style.background = "#fff url('https://karunasarawak.com/wp-content/uploads/2017/08/mountain-background.png') no-repeat right top";
    await this.$store.dispatch("getUser");
    await this.$store.dispatch("getMyIdeas");
  },
  methods: {
    async logout() {
      try {
        this.error = await this.$store.dispatch("logout");
      } catch (error) {
        console.log(error);
      }
    },
    async uploadFinished() {
      this.show = false;
      try {
        this.error = await this.$store.dispatch("getMyIdeas");
      } catch (error) {
        console.log(error);
      }
    },
    async getMyIdeas() {
      try {
        this.error = await this.$store.dispatch("getMyIdeas");
      } catch (error) {
        console.log(error);
      }
    },
    async suggestions() {
      try {
        this.error = await this.$store.dispatch("getSuggestions");
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
  }
}
</script>

<style scoped>
.header {
  display: flex;
}
button {
  margin-left: 50px;
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
