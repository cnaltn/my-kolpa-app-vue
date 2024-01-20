<template>
  <div class="container">
    <h1 class="mainTitle">Kolpalık Kapışması</h1>
    <div class="bottom_container">
      <div class="myList" v-for="user in myUsers" :key="user.name">
        <p class="userTitle">{{ user.name }} : {{ user.count }}</p>
        <button class="button" @click="incrementCount(user.name)">Oy Ver</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      myUsers: []
    }
  },
  methods: {
    async getData() {
      try {
        const response = await axios.get('https://kolpa-api.netlify.app/api/users')
        if (response.data && response.data.users) {
          this.myUsers = response.data.users
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
    async incrementCount(userName) {
      try {
        const response = await axios.post('https://kolpa-api.netlify.app/api/increment-count', {
          userName
        })
        if (response.data && response.data.success) {
          const updatedUser = response.data.updatedUser
          const userIndex = this.myUsers.findIndex((user) => user.name === updatedUser.name)

          if (userIndex !== -1) {
            // Update the local data with the updated count value
            this.myUsers[userIndex].count = updatedUser.count
          }
        } else {
          console.error('Failed to increment count:', response.data.message)
        }
      } catch (error) {
        console.error('Error incrementing count:', error)
      }
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  --tw-bg-opacity: 1;
  background-color: rgb(24 24 27 / var(--tw-bg-opacity));
  gap: 100px;
}

.mainTitle {
  text-decoration-color: #a3e635;
  font-weight: 700;
  text-decoration-line: underline;
  font-size: 4.5rem;
  line-height: 1;
  padding-top: 1rem;
  padding-bottom: 1rem;
  color: white;
}

.userTitle {
  font-size: 1.875rem;
  line-height: 2.25rem;
  padding-bottom: 1rem;
  color: white;
}

.bottom_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 100px;
  padding-bottom: 10rem;
}

.myList {
  display: flex;
  flex-direction: column;
}

.button {
  padding: 10px 40px;
  background-color: #a3e635;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  max-width: max-content;
  cursor: pointer;
  height: max-content;
}
</style>
