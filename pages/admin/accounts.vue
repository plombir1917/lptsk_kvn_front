<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Аккаунты
    </h1>
    <div class="mt-4 flex justify-between items-center">
      <p class="text-gray-600 dark:text-gray-300">
        Управляйте аккаунтами здесь.
      </p>
      <button
        @click="openModal('Создать аккаунт', accountFields, createAccount)"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
      >
        Создать аккаунт
      </button>
    </div>
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
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Действия
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
              <img
                :src="account.photo"
                alt="Фото"
                class="w-10 h-10 rounded-full"
              />
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
            <td
              class="py-4 px-6 border-b border-gray-200 dark:border-gray-700 space-x-2"
            >
              <NuxtLink
                :to="`/admin/accounts/edit/${account.id}`"
                class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >Редактировать</NuxtLink
              >
              <button
                @click="deleteAccount(account.id)"
                class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <CreateModal
      :isOpen="isModalOpen"
      :title="modalTitle"
      :fields="modalFields"
      :initialData="modalInitialData"
      @close="closeModal"
      @submit="handleModalSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CreateModal from '@/components/elements/CreateModal.vue';

const accounts = ref([]);
const isModalOpen = ref(false);
const modalTitle = ref('');
const modalFields = ref([]);
const modalInitialData = ref({});

const accountFields = [
  { name: 'name', label: 'Имя', type: 'text' },
  { name: 'surname', label: 'Фамилия', type: 'text' },
  { name: 'phone', label: 'Телефон', type: 'text' },
  { name: 'login', label: 'Логин', type: 'text' },
  { name: 'password', label: 'Пароль', type: 'password' },
  { name: 'role', label: 'Роль', type: 'text' },
  { name: 'photo', label: 'Фото', type: 'text' },
];

async function fetchAccounts() {
  const query = `
  query {
    getAccounts {
      id
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
      console.error('При получении аккаунтов произошла ошибка:', result.errors);
      alert(
        'При получении аккаунтов произошла ошибка. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
}

async function deleteAccount(id) {
  const mutation = `
    mutation {
      deleteAccount(id: "${id}") {
        id
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
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();
    if (response.ok && result.data && result.data.deleteAccount) {
      accounts.value = accounts.value.filter((account) => account.id !== id);
      alert('Аккаунт успешно удален.');
    } else {
      console.error('Удаление аккаунта не удалось:', result.errors);
      alert('Удаление аккаунта не удалось. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка удаления аккаунта:', error);
  }
}

function openModal(title, fields, initialData = {}) {
  modalTitle.value = title;
  modalFields.value = fields;
  modalInitialData.value = initialData;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

async function handleModalSubmit(data) {
  const mutation = `
  mutation($input: CreateAccountInput!) {
    createAccount(input: $input) {
      id
      name
      surname
      phone
      login
      password
      role
      photo
    }
  }
  `;
  const variables = {
    input: data,
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
    if (response.ok && result.data && result.data.createAccount) {
      accounts.value.push(result.data.createAccount);
      closeModal();
    } else {
      console.error('Creating account failed:', result.errors);
      alert('Ошибка при создании аккаунта. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка при создании аккаунта:', error);
  }
}

onMounted(fetchAccounts);

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
</script>
