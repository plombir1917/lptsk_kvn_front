<template>
  <transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <h2
          class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4"
        >
          Войти
        </h2>
        <div class="px-4 py-6 flex justify-center">
          <img
            src="/kvn-logo-no-bg.png"
            alt="КВН Иконка"
            class="h-30 w-30 md:h-30 md:w-30 lg:h-30 lg:w-30"
          />
        </div>
        <form @submit.prevent="login">
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300 mb-2"
              >Email</label
            >
            <input
              type="email"
              v-model="email"
              class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300 mb-2"
              >Пароль</label
            >
            <input
              type="password"
              v-model="password"
              class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              type="button"
              @click="closeModal"
              class="text-gray-600 dark:text-gray-300"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  isOpen: boolean;
  closeModal: () => void;
}>();

const email = ref('');
const password = ref('');

const router = useRouter();

async function login() {
  const query = `
    mutation {
      login(input: {login: "${email.value}", password: "${password.value}"}) {
        access_token
      }
    }
  `;

  try {
    const response = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (response.ok && result.data && result.data.login) {
      const accessToken = result.data.login.access_token;
      console.log('Access Token:', accessToken);

      // Сохраняем токен в localStorage
      localStorage.setItem('access_token', accessToken);

      // Редирект на страницу /admin после успешного логина
      props.closeModal();
      router.push('/admin');
    } else {
      console.error('Login failed:', result.errors);
      alert('Login failed. Please check your credentials and try again.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred. Please try again.');
  }
}

// Пример функции для выполнения авторизованного запроса
async function fetchWithAuth(query: string) {
  const token = localStorage.getItem('access_token');
  const response = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  return response.json();
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter, .modal-leave-to /* .modal-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>