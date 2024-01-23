<template>
  <div class="container">
    <h1 class="mainTitle">Kolpalık Kapışması</h1>
    <div class="bottom_container">
      <div v-if="loading" class="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div v-else class="myList" v-for="user in myUsers" :key="user.name">
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
      myUsers: [],
      loading: false
    }
  },
  methods: {
    async getData() {
      try {
        this.loading = true
        const response = await axios.get('https://kolpakapis.netlify.app/api/users')
        if (response.data && response.data.users) {
          this.myUsers = response.data.users
          this.loading = false
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
    async incrementCount(name) {
      try {
        const response = await axios.post('https://kolpakapis.netlify.app/api/increment-count', {
          name
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
        console.error('Çok fazla istek attınız')
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
  align-items: center;
}

.button {
  padding: 10px 40px;
  background-color: #a3e635;
  border: none;
  border-radius: 4px;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  max-width: max-content;
  cursor: pointer;
  height: max-content;
}

.lds-spinner {
  color: official;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-spinner div {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: ' ';
  display: block;
  position: absolute;
  top: 3px;
  left: 37px;
  width: 6px;
  height: 18px;
  border-radius: 20%;
  background: #a3e635;
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
