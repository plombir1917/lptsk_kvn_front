<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Сезоны
    </h1>
    <div class="mt-4 flex justify-between items-center">
      <p class="text-gray-600 dark:text-gray-300">Управляйте сезонами здесь.</p>
      <button
        @click="openModal('Создать сезон', seasonFields, createSeason)"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
      >
        Создать сезон
      </button>
    </div>
    <!-- Таблица сезонов -->
    <div class="mt-6 overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800 overflow-x-auto">
        <thead>
          <tr>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Год
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
            v-for="season in seasons"
            :key="season.id"
            class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="season.isEditing"
                v-model="season.year"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ season.year }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <div class="flex gap-1 justify-center">
                <button
                  v-if="season.isEditing"
                  @click="saveSeason(season)"
                  class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  Сохранить
                </button>
                <button
                  v-if="season.isEditing"
                  @click="cancelEdit(season)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Отмена
                </button>
                <button
                  v-else
                  @click="editSeason(season)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Редактировать
                </button>
                <button
                  @click="deleteSeason(season.id)"
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

    <!-- Модальное окно создания сезона -->
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
import { useToast } from 'vue-toastification';
import CreateModal from '@/components/elements/CreateModal.vue';

const seasons = ref([]);
const isModalOpen = ref(false);
const currentSeason = ref(null);
const modalTitle = ref('');
const modalFields = ref([]);
const modalInitialData = ref({});

const seasonFields = [{ name: 'year', label: 'Год', type: 'number' }];

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
    const response = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    if (response.ok && result.data && result.data.getSeasons) {
      seasons.value = result.data.getSeasons.map((season) => ({
        ...season,
        isEditing: false,
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

async function deleteSeason(id) {
  const toast = useToast();
  const mutation = `
    mutation {
      deleteSeason(id: ${id}) {
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
    if (response.ok && result.data && result.data.deleteSeason) {
      seasons.value = seasons.value.filter((season) => season.id !== id);
      toast.success('Сезон успешно удален.');
    } else {
      console.error('Удаление сезона не удалось:', result.errors);
      toast.error('Удаление сезона не удалось. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка удаления сезона:', error);
    toast.error('Ошибка удаления сезона. Пожалуйста попробуйте снова.');
  }
}

function editSeason(season) {
  season.isEditing = true;
}

function cancelEdit(season) {
  season.isEditing = false;
  fetchSeasons();
}

async function saveSeason(season) {
  const toast = useToast();
  const mutation = `
    mutation($input: UpdateSeasonInput!) {
      updateSeason(id: "${season.id}", input: $input) {
        id
      }
    }
  `;
  const variables = {
    input: {
      year: season.year,
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
    if (response.ok && result.data && result.data.updateSeason) {
      season.isEditing = false;
      toast.success('Изменения успешно сохранены.');
    } else {
      console.error('Обновление сезона не удалось:', result.errors);
      toast.error('Обновление сезона не удалось. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка обновления сезона:', error);
    toast.error('Ошибка обновления сезона. Пожалуйста попробуйте снова.');
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
  const toast = useToast();
  const mutation = `
    mutation($input: CreateSeasonInput!) {
      createSeason(input: $input) {
        id
      }
    }
  `;

  const variables = {
    input: {
      year: data.year,
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
    if (response.ok && result.data && result.data.createSeason) {
      seasons.value.push(result.data.createSeason);
      closeModal();
      toast.success('Сезон успешно создан.');
      fetchSeasons();
    } else {
      console.error('Creating season failed:', result.errors);
      toast.error('Ошибка при создании сезона. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка при создании сезона:', error);
    toast.error('Ошибка при создании сезона. Пожалуйста попробуйте снова.');
  }
}

onMounted(fetchSeasons);

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
</script>
