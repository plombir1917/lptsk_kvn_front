<template>
  <main
    class="flex-1 overflow-x-hidden overflow-y-auto bg-body dark:bg-gray-900"
  >
    <div class="container mx-auto px-6 py-8">
      <div
        class="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Информация профиля
          </h2>
          <img
            :src="profile.photo"
            alt="Profile Photo"
            class="w-20 h-20 rounded-full shadow-md"
          />
        </div>
        <form @submit.prevent="updateProfile">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                for="first-name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >Имя</label
              >
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
                >Фамилия</label
              >
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
                >Email</label
              >
              <input
                type="email"
                id="email"
                v-model="profile.email"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            <div class="sm:col-span-2">
              <label
                for="phone"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >Телефон</label
              >
              <input
                type="tel"
                id="phone"
                v-model="profile.phone"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
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
  middleware: 'auth',
});

import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const profile = ref({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  photo: '',
});

const fetchProfile = async () => {
  const query = `
    query {
      getAccountByToken {
        id
        name
        surname
        login
        phone
        photo
      }
    }
  `;

  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (response.ok && result.data && result.data.getAccountByToken) {
      const account = result.data.getAccountByToken;
      profile.value.id = account.id;
      profile.value.firstName = account.name;
      profile.value.lastName = account.surname;
      profile.value.email = account.login;
      profile.value.phone = account.phone;
      profile.value.photo = account.photo;
    } else {
      alert(
        'Ошибка при получении данных профиля. Пожалуйста, попробуйте снова.'
      );
    }
  } catch (error) {
    alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
  }
};

const updateProfile = async () => {
  const mutation = `
    mutation($input: UpdateAccountInput!) {
      updateAccount(id: "${profile.value.id}", input: $input) {
        name
        surname
        login
        phone
        photo
      }
    }
  `;

  const variables = {
    input: {
      name: profile.value.firstName,
      surname: profile.value.lastName,
      login: profile.value.email,
      phone: profile.value.phone,
    },
  };

  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const result = await response.json();

    if (response.ok && result.data && result.data.updateAccount) {
      useToast().success('Данные профиля успешно обновлены.');
    } else {
      useToast().error(
        'Ошибка при обновлении профиля. Пожалуйста, попробуйте снова.'
      );
    }
  } catch (error) {
    useToast().error('Произошла ошибка. Пожалуйста, попробуйте снова.');
  }
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
button {
  transition: background-color 0.3s;
}
button:hover {
  background-color: #4c51bf;
}
</style>
