<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Аккаунты
    </h1>
    <p class="mt-4 text-gray-600 dark:text-gray-300">
      Управляйте аккаунтами здесь.
    </p>
    <div class="mt-6 overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Фото
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Имя
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Фамилия
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Телефон
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Логин
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Роль
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="account in accounts"
            :key="account.id"
            class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <td class="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
              {{ account.photo }}
            </td>
            <td class="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
              {{ account.name }}
            </td>
            <td class="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
              {{ account.surname }}
            </td>
            <td class="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
              {{ account.phone }}
            </td>
            <td class="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
              {{ account.login }}
            </td>
            <td class="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
              {{ account.role }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const accounts = ref([]);

async function fetchAccounts() {
  const query = `
  query {
  getAccounts {
    name
    surname
    phone
    login
    role
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
    if (response.ok && result.data && result.data.getAccounts) {
      accounts.value = result.data.getAccounts;
    } else {
      console.error('Fetching profile failed:', result.errors);
      alert('Fetching profile failed. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
}

onMounted(fetchAccounts);

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
</script>
