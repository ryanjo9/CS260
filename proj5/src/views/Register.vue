<template>
<div>
  <h1>Register for an account</h1>
  <form @submit.prevent="register" class="pure-form pure-form-aligned">
    <fieldset>
      <p class="pure-form-message-inline">All fields are required.</p>
      <br>
      <p class="pure-form-message-inline">Age, relationship status, and budget information is used to choose which ideas to show you.</p>

      <div class="pure-control-group">
        <label for="name">Real Name</label>
        <input v-model="name" type="text" placeholder="Real Name">
      </div>

      <div class="pure-control-group">
        <label for="age">Age</label>
        <input v-model="age" type="text" placeholder="Your age">
      </div>

      <div class="pure-control-group">
        <label for="status">Relationship Status</label>
        <select v-model="status" name="status" >
          <option value="1">Single</option>
          <option value="2">Dating</option>
          <option value="3">Engaged</option>
          <option value="4">Married</option>
          <option value="5">Complicated</option>
        </select>
      </div>

      <div class="pure-control-group">
        <label for="budget">Budget</label>
        <input v-model="budget" type="text" placeholder="I'd spend...">
      </div>

      <div class="pure-control-group">
        <label for="username">Username</label>
        <input v-model="username" type="text" placeholder="Username">
      </div>

      <div class="pure-control-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" placeholder="Password">
      </div>

      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Submit</button>
      </div>
    </fieldset>
  </form>
  <p v-if="error" class="error">{{error}}</p>
</div>
</template>

<script>
export default {
  name: 'register',
  data() {
    return {
      name: '',
      username: '',
      age: null,
      status: null,
      budget: null,
      password: '',
      error: '',
    }
  },
  methods: {
    async register() {
      try {
        this.error = await this.$store.dispatch("register", {
          name: this.name,
          age: this.age,
          relationshipStatus: this.status,
          budget: this.budget,
          username: this.username,
          password: this.password
        });
        if (this.error === "")
          this.$router.push('mypage');
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>
form {
  border: 1px solid #ccc;
  background-color: #eee;
  border-radius: 4px;
  padding: 20px;
}

.pure-controls {
  display: flex;
}

.pure-controls button {
  margin-left: auto;
}
</style>
