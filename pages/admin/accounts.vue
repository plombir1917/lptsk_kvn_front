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
      <table class="min-w-full bg-white dark:bg-gray-800 overflow-x-auto">
        <thead>
          <tr>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Фото
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Имя
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Фамилия
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Телефон
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Логин
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Роль
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
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
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <img
                :src="account.photo"
                alt="Фото"
                class="w-20 h-20 rounded-full mx-auto"
              />
              <button
                v-if="account.isEditing"
                @click="openPhotoModal(account)"
                class="mt-1 px-1 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Изменить фото
              </button>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="account.isEditing"
                v-model="account.name"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ account.name }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="account.isEditing"
                v-model="account.surname"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ account.surname }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="account.isEditing"
                v-model="account.phone"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ account.phone }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="account.isEditing"
                v-model="account.login"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ account.login }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <select
                v-if="account.isEditing"
                v-model="account.role"
                class="block w-full p-2 border rounded appearance-none"
              >
                <option value="EDITOR">Редактор</option>
                <option value="ADMIN">Администратор</option>
                <option value="DIRECTOR">Директор</option>
              </select>
              <span v-else>{{ account.role }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <div class="flex gap-1 justify-center">
                <button
                  v-if="account.isEditing"
                  @click="saveAccount(account)"
                  class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  Сохранить
                </button>
                <button
                  v-if="account.isEditing"
                  @click="cancelEdit(account)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Отмена
                </button>
                <button
                  v-else
                  @click="editAccount(account)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Редактировать
                </button>
                <button
                  @click="deleteAccount(account.id)"
                  class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
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

    <div
      @click.self="closePhotoModal"
      v-if="isPhotoModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-1/2">
        <ImageUpload @save="savePhoto" @close="closePhotoModal" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import CreateModal from '@/components/elements/CreateModal.vue';
import ImageUpload from '@/components/elements/ImageUpload.vue';

const accounts = ref([]);
const isModalOpen = ref(false);
const isPhotoModalOpen = ref(false);
const currentAccount = ref(null);
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
      accounts.value = result.data.getAccounts.map((account) => ({
        ...account,
        isEditing: false,
      }));
    } else {
      console.error('При получении аккаунтов произошла ошибка:', result.errors);
      useToast().error(
        'При получении аккаунтов произошла ошибка. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Error fetching accounts:', error);
    useToast().error(
      'Ошибка при получении аккаунтов. Пожалуйста попробуйте снова.'
    );
  }
}

async function deleteAccount(id) {
  const toast = useToast();
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
      toast.success('Аккаунт успешно удален.');
    } else {
      console.error('Удаление аккаунта не удалось:', result.errors);
      toast.error('Удаление аккаунта не удалось. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка удаления аккаунта:', error);
    toast.error('Ошибка удаления аккаунта. Пожалуйста попробуйте снова.');
  }
}

function editAccount(account) {
  account.isEditing = true;
}

function cancelEdit(account) {
  account.isEditing = false;
  fetchAccounts();
}

async function saveAccount(account) {
  const toast = useToast();
  const mutation = `
    mutation($input: UpdateAccountInput!) {
      updateAccount(id: "${account.id}", input: $input) {
        id
      }
    }
  `;
  const variables = {
    input: {
      name: account.name,
      surname: account.surname,
      phone: account.phone,
      login: account.login,
      role: account.role,
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
      fetchAccounts();
      account.isEditing = false;
      toast.success('Изменения успешно сохранены.');
    } else {
      console.error('Обновление аккаунта не удалось:', result.errors);
      toast.error(
        'Обновление аккаунта не удалось. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка обновления аккаунта:', error);
    toast.error('Ошибка обновления аккаунта. Пожалуйста попробуйте снова.');
  }
}

function openPhotoModal(account) {
  currentAccount.value = account;
  isPhotoModalOpen.value = true;
}

function closePhotoModal() {
  isPhotoModalOpen.value = false;
  currentAccount.value = null;
}

async function savePhoto(formData) {
  const file = formData.get('photo');
  const toast = useToast();
  try {
    const token = localStorage.getItem('access_token');
    const operations = {
      query: `
        mutation($photo: Upload!, $id: String!) {
          updateAccount(id: $id, input: { photo: $photo }) {
            id
          }
        }
      `,
      variables: {
        id: currentAccount.value.id,
        photo: null,
      },
    };
    const map = {
      0: ['variables.photo'],
    };

    const formData = new FormData();
    formData.append('operations', JSON.stringify(operations));
    formData.append('map', JSON.stringify(map));
    formData.append('0', file, file.name);

    const response = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'apollo-require-preflight': 'true',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}, Response: ${errorText}`
      );
    }

    const result = await response.json();
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      toast.error('Ошибка при изменении фото.');
    } else {
      toast.success('Фото успешно изменено.');
    }
  } catch (error) {
    console.error('Ошибка при изменении фото:', error);
    toast.error('Ошибка при изменении фото.');
  }
  closePhotoModal();
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

async function handleModalSubmit(data, photo) {
  const toast = useToast();
  const mutation = `
    mutation($input: CreateAccountInput!) {
      createAccount(input: $input) {
        id
      }
    }
  `;

  const variables = {
    input: {
      name: data.name,
      surname: data.surname,
      phone: data.phone,
      login: data.login,
      password: data.password,
      role: data.role,
      photo: null,
    },
  };

  try {
    const token = localStorage.getItem('access_token');

    const operations = {
      query: mutation,
      variables: variables,
    };

    const map = {
      0: ['variables.input.photo'],
    };

    const formData = new FormData();
    formData.append('operations', JSON.stringify(operations));
    formData.append('map', JSON.stringify(map));
    formData.append('0', photo);

    const response = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'apollo-require-preflight': 'true',
      },
      body: formData,
    });

    const result = await response.json();
    if (response.ok && result.data && result.data.createAccount) {
      accounts.value.push(result.data.createAccount);
      closeModal();
      toast.success('Аккаунт успешно создан.');
      fetchAccounts();
    } else {
      console.error('Creating account failed:', result.errors);
      toast.error('Ошибка при создании аккаунта. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка при создании аккаунта:', error);
    toast.error('Ошибка при создании аккаунта. Пожалуйста попробуйте снова.');
  }
}

onMounted(() => {
  fetchAccounts();
});
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
</script>

<style>
.filepond--root {
  width: 100%;
}
</style>
