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
          Купить билет
        </h2>
        <form @submit.prevent="handlePayment">
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300 mb-2"
              >Имя</label
            >
            <input
              type="text"
              v-model="name"
              class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
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
          <div class="flex items-center justify-between">
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Оплатить
            </button>
            <button
              type="button"
              @click="closeModal"
              class="text-gray-600 dark:text-gray-300"
            >
              Отмена
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
import axios from 'axios';

const config = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
};

const showModal = ref(false);
const amount = 100; // Сумма платежа в копейках (в данном случае 1 рубль)
const description = 'Оплата билета';

const props = defineProps<{
  isOpen: boolean;
  closeModal: () => void;
}>();
const name = ref('');
const email = ref('');

const router = useRouter();

async function handlePayment() {
  console.log(1);
  try {
    const response = await axios.post('https://api.yookassa.ru/v3/payments', {
      amount: {
        value: amount / 100, // Переводим в рубли
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        return_url: 'https://vk.com/plombir1917', // Ссылка на страницу успешной оплаты
      },
      description: description,
      headers: config.headers,
    });
    console.log(response);
    // Перенаправляем пользователя на страницу оплаты
    window.location.href = response.data.confirmation.confirmation_url;
  } catch (error) {
    console.error('Ошибка при оплате:', error);
    // Обработка ошибок
  }
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
