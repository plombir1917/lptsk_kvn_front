<template>
  <main
    class="flex-1 overflow-x-hidden overflow-y-auto bg-body dark:bg-gray-900"
  >
    <div class="container mx-auto px-6 py-8">
      <div
        class="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
      >
        <h2
          class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6"
        >
          Информация профиля
        </h2>
        <form @submit.prevent="updateProfile">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                for="first-name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Имя
              </label>
              <input
                type="text"
                id="first-name"
                v-model="profile.firstName"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label
                for="last-name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Фамилия
              </label>
              <input
                type="text"
                id="last-name"
                v-model="profile.lastName"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>

            <div class="sm:col-span-2">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                v-model="profile.email"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
});
import { ref } from 'vue';
import {
  HomeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline';

// Профильные данные пользователя
const profile = ref({
  firstName: 'Иван',
  lastName: 'Иванов',
  email: 'ivanov@example.com',
});

// Функция для обновления профиля
function updateProfile() {
  console.log('Профиль обновлен:', profile.value);
  // Здесь добавьте свою логику обновления профиля
}

// Функция для выхода
function logout() {
  console.log('Logout clicked');
  // Здесь добавьте свою логику выхода
}
</script>
