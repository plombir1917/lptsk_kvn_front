<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Новости
    </h1>
    <div class="mt-4 flex justify-between items-center">
      <p class="text-gray-600 dark:text-gray-300">
        Управляйте новостями здесь.
      </p>
      <button
        @click="openModal('Создать новость', newsFields, createNews)"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
      >
        Создать новость
      </button>
    </div>
    <!-- Таблица новостей -->
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
              Заголовок
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Ссылка
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
            v-for="news in newsList"
            :key="news.id"
            class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <img
                :src="news.photo"
                alt="Фото"
                class="w-20 h-20 rounded-full mx-auto"
              />
              <button
                v-if="news.isEditing"
                @click="openPhotoModal(news)"
                class="mt-1 px-1 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Изменить фото
              </button>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="news.isEditing"
                v-model="news.title"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ news.title }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <textarea
                v-if="news.isEditing"
                v-model="news.link"
                class="w-full p-2 border rounded"
              ></textarea>
              <span v-else>{{ news.link }}</span>
            </td>

            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <div class="flex gap-1 justify-center">
                <button
                  v-if="news.isEditing"
                  @click="saveNews(news)"
                  class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  Сохранить
                </button>
                <button
                  v-if="news.isEditing"
                  @click="cancelEdit(news)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Отмена
                </button>
                <button
                  v-else
                  @click="editNews(news)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Редактировать
                </button>
                <button
                  @click="deleteNews(news.id)"
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

    <!-- Модальное окно создания новости -->
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

const newsList = ref([]);
const currentNews = ref(null);
const isModalOpen = ref(false);
const isPhotoModalOpen = ref(false);
const modalTitle = ref('');
const modalFields = ref([]);
const modalInitialData = ref({});

const seasons = ref([]);

const newsFields = [
  { name: 'title', label: 'Заголовок', type: 'text' },
  { name: 'link', label: 'Ссылка', type: 'text' },
  { name: 'photo', label: 'Фото', type: 'file' },
  { name: 'season_id', label: 'Сезон', type: 'select', options: seasons },
];

async function fetchNews() {
  const query = `
  query {
    getNews {
      id
      title
      link
      photo
      season_id
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
    if (response.ok && result.data && result.data.getNews) {
      newsList.value = result.data.getNews.map((news) => ({
        ...news,
        isEditing: false,
      }));
    } else {
      console.error('При получении новостей произошла ошибка:', result.errors);
      useToast().error(
        `При получении новостей произошла ошибка. ${result.errors[0].message}`
      );
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    useToast().error(
      'Ошибка при получении новостей. Пожалуйста попробуйте снова.'
    );
  }
}

async function fetchSeasons() {
  const query = `
  query {
    getSeasons {
      id
      year
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
    if (response.ok && result.data && result.data.getSeasons) {
      seasons.value = result.data.getSeasons.map((season) => ({
        label: season.year,
        value: season.id,
      }));
    } else {
      console.error('При получении сезонов произошла ошибка:', result.errors);
      useToast().error(
        `При получении сезонов произошла ошибка. ${result.errors[0].message}`
      );
    }
  } catch (error) {
    console.error('Error fetching seasons:', error);
    useToast().error(
      'Ошибка при получении сезонов. Пожалуйста попробуйте снова.'
    );
  }
}

async function deleteNews(id) {
  const toast = useToast();
  const mutation = `
    mutation {
      deleteNews(id: "${id}") {
        id
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
        body: JSON.stringify({ query: mutation }),
      }
    );

    const result = await response.json();
    if (response.ok && result.data && result.data.deleteNews) {
      newsList.value = newsList.value.filter((news) => news.id !== id);
      toast.success('Новость успешно удалена.');
    } else {
      console.error('Удаление новости не удалось:', result.errors);
      toast.error('Удаление новости не удалось. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка удаления новости:', error);
    toast.error('Ошибка удаления новости. Пожалуйста попробуйте снова.');
  }
}

function editNews(news) {
  news.isEditing = true;
}

function cancelEdit(news) {
  news.isEditing = false;
  fetchNews();
}

async function saveNews(news) {
  const toast = useToast();
  const mutation = `
    mutation($input: UpdateNewsInput!) {
      updateNews(id: "${news.id}", input: $input) {
        id
      }
    }
  `;
  const variables = {
    input: {
      title: news.title,
      link: news.link,
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
    if (response.ok && result.data && result.data.updateNews) {
      fetchNews();
      news.isEditing = false;
      toast.success('Изменения успешно сохранены.');
    } else {
      console.error('Обновление новости не удалось:', result.errors);
      toast.error(
        'Обновление новости не удалось. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка обновления новости:', error);
    toast.error('Ошибка обновления новости. Пожалуйста попробуйте снова.');
  }
}

function openPhotoModal(news) {
  currentNews.value = news;
  isPhotoModalOpen.value = true;
}

function closePhotoModal() {
  isPhotoModalOpen.value = false;
  currentNews.value = null;
}

async function savePhoto(formData) {
  const file = formData.get('photo');
  const toast = useToast();
  try {
    const token = localStorage.getItem('access_token');
    const operations = {
      query: `
        mutation($photo: Upload!, $id: String!) {
          updateNews(id: $id, input: { photo: $photo }) {
            id
          }
        }
      `,
      variables: {
        id: currentNews.value.id.toString(),
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
  fetchNews();
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
    mutation($input: CreateNewsInput!) {
      createNews(input: $input) {
        id
      }
    }
  `;

  const variables = {
    input: {
      title: data.title,
      link: data.link,
      season_id: data.season_id,
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

    const result = await response.json();
    if (response.ok && result.data && result.data.createNews) {
      newsList.value.push(result.data.createNews);
      closeModal();
      toast.success('Новость успешно создана.');
      fetchNews();
    } else {
      console.error('Creating news failed:', result.errors);
      toast.error('Ошибка при создании новости. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка при создании новости:', error);
    toast.error('Ошибка при создании новости. Пожалуйста попробуйте снова.');
  }
}

onMounted(() => {
  fetchNews();
  fetchSeasons();
});

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
</script>
