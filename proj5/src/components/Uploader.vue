<template>
<transition v-if="show" name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <h1 class="modal-title">Add an Idea</h1>
        </div>
        <div class="modal-body">
          <p v-if="error" class="error">{{error}}</p>
          <form @submit.prevent="upload">
            <select v-model="category" name="category">
              <option value="sports">Sports</option>
              <option value="drives">Drives</option>
              <option value="hikes">Hikes</option>
              <option value="wut">Wut</option>
            </select>
            <p></p>
            <input v-model="title" placeholder="Title">
            <p></p>
            <textarea v-model="description" placeholder="Description"></textarea>
            <p></p>
            <input v-model="price" placeholder="Price">
            <p></p>
            <input v-model="time" placeholder="When can you use this idea?">
            <button type="button" @click="close" class="pure-button">Close</button>
            <button type="submit" class="pure-button pure-button-secondary">Upload</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  name: 'Uploader',
  props: {
    show: Boolean,
  },
  data() {
    return {
      title: '',
      description: '',
      time: '',
      category: '',
      price: '',
      error: '',
    }
  },
  methods: {
  fileChanged(event) {
    this.file = event.target.files[0]
  },
  close() {
    this.$emit('escape');
  },
  replaceSpaces(name) {
    return name.replace(/ /g, "+");
  },
  directionsLink(name) {
    if (this.selection !== 'wut') {
      return 'https://www.google.com/maps/dir/?api=1&&destination=' + this.replaceSpaces(name);
    } else {
      return undefined;
    }
  },
  reviewsLink(name) {
    if (this.selection !== 'wut') {
      return 'https://www.google.com/maps/search/?api=1&query=' + this.replaceSpaces(name);
    } else {
      return undefined;
    }
  },
  async upload() {
      try {
        let idea = {
          user: this.user,
          title: this.title,
          price: this.price,
          category: this.category,
          directionsLink: this.directionsLink(this.title),
          reviewsLink: this.reviewsLink(this.title),
          description: this.description,
          time: this.time,
        }
        this.error = await this.$store.dispatch("addIdea", idea);
        if (!this.error) {
          this.title = '';
          this.category = '';
          this.description = '';
          this.price = '';
          this.time = '';
          this.$emit('uploadFinished');
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>
input {
  width: 100%;
}

textarea {
  width: 100%;
  height: 100px
}

.pure-button-secondary {
  float: right;
}
</style>
