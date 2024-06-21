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
          <div class="flex items-center gap-4">
            <img
              :src="profile.photo"
              alt="Фото"
              class="w-20 h-20 rounded-full shadow-md"
            />
            <button
              @click="openPhotoModal"
              class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              Изменить фото
            </button>
          </div>
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
          <div class="mt-6 flex justify-between">
            <button
              type="button"
              @click="openChangePasswordModal"
              class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300"
            >
              Сменить пароль
            </button>
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

    <div
      @click.self="closePhotoModal"
      v-if="isPhotoModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-1/2">
        <ImageUpload @save="savePhoto" @close="closePhotoModal" />
      </div>
    </div>

    <div
      @click.self="closeChangePasswordModal"
      v-if="isChangePasswordModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-1/2 dark:bg-gray-700">
        <form @submit.prevent="changePassword">
          <div>
            <label
              for="current-password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Текущий пароль</label
            >
            <input
              type="password"
              id="current-password"
              v-model="passwordData.currentPassword"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-white dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div class="mt-4">
            <label
              for="new-password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Новый пароль</label
            >
            <input
              type="password"
              id="new-password"
              v-model="passwordData.newPassword"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-white dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div class="mt-4">
            <label
              for="confirm-password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >Подтвердите новый пароль</label
            >
            <input
              type="password"
              id="confirm-password"
              v-model="passwordData.confirmPassword"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-white dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div class="mt-6 flex justify-end">
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Изменить пароль
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import ImageUpload from '@/components/elements/ImageUpload.vue';

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});

const profile = ref({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  photo: '',
});

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const isPhotoModalOpen = ref(false);
const isChangePasswordModalOpen = ref(false);
const currentAccount = ref(null);

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
    const response = await fetch(
      'https://lptsk-kvn-back.onrender.com/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      }
    );

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
    const response = await fetch(
      'https://lptsk-kvn-back.onrender.com/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: mutation, variables }),
      }
    );

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

const openPhotoModal = () => {
  isPhotoModalOpen.value = true;
};

const closePhotoModal = () => {
  isPhotoModalOpen.value = false;
};

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
        id: profile.value.id,
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

    const response = await fetch(
      'https://lptsk-kvn-back.onrender.com/graphql',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'apollo-require-preflight': 'true',
        },
        body: formData,
      }
    );

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
  fetchProfile();
  closePhotoModal();
}

const openChangePasswordModal = () => {
  isChangePasswordModalOpen.value = true;
};

const closeChangePasswordModal = () => {
  isChangePasswordModalOpen.value = false;
};

const changePassword = async () => {
  const { currentPassword, newPassword, confirmPassword } = passwordData.value;

  if (newPassword !== confirmPassword) {
    useToast().error('Пароли не совпадают!');
    return;
  }

  const mutation = `
    mutation($input: ChangePasswordInput!) {
      changePassword(input: $input){
      id
      }
    }
  `;

  const variables = {
    input: {
      login: profile.value.email,
      oldPassword: currentPassword,
      newPassword,
    },
  };

  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(
      'https://lptsk-kvn-back.onrender.com/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: mutation, variables }),
      }
    );

    const result = await response.json();

    if (response.ok && result.data) {
      useToast().success('Пароль успешно изменен!');
      closeChangePasswordModal();
    } else {
      useToast().error(
        result.data.changePassword.message ||
          'Ошибка при изменении пароля. Пожалуйста, попробуйте снова.'
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
/* Ваши стили */
</style>
