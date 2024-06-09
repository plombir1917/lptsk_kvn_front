<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Команды
    </h1>
    <div class="mt-4 flex justify-between items-center">
      <p class="text-gray-600 dark:text-gray-300">
        Управляйте командами здесь.
      </p>
      <button
        @click="openModal('Создать команду', teamFields, handleModalSubmit)"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
      >
        Создать команду
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
              Название
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Достижения
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Родина
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Рейтинг
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Активна
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
            v-for="team in teams"
            :key="team.id"
            class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <img
                :src="team.photo"
                alt="Фото"
                class="w-20 h-20 rounded-full mx-auto"
              />
              <button
                v-if="team.isEditing"
                @click="openPhotoModal(team)"
                class="mt-1 px-1 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Изменить фото
              </button>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="team.isEditing"
                v-model="team.name"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ team.name }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="team.isEditing"
                v-model="team.achievements"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ team.achievements }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="team.isEditing"
                v-model="team.home"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ team.home }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="team.isEditing"
                v-model="team.rate"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ team.rate }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <select v-model="team.active" class="w-full p-2 border rounded">
                <option :value="true">Да</option>
                <option :value="false">Нет</option>
              </select>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <div class="flex gap-1 justify-center">
                <button
                  v-if="team.isEditing"
                  @click="saveTeam(team)"
                  class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  Сохранить
                </button>
                <button
                  v-if="team.isEditing"
                  @click="cancelEdit(team)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Отмена
                </button>
                <button
                  v-else
                  @click="editTeam(team)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Редактировать
                </button>
                <button
                  @click="deleteTeam(team.id)"
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
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import CreateModal from '@/components/elements/CreateModal.vue';
import ImageUpload from '@/components/elements/ImageUpload.vue';

const teams = ref([]);
const isModalOpen = ref(false);
const isPhotoModalOpen = ref(false);
const currentTeam = ref(null);
const modalTitle = ref('');
const modalFields = ref([]);
const modalInitialData = ref({});

const teamFields = [
  { name: 'name', label: 'Название', type: 'text' },
  { name: 'achievements', label: 'Достижения', type: 'text' },
  { name: 'home', label: 'Родина', type: 'text' },
  { name: 'rate', label: 'Рейтинг', type: 'text' },
  {
    name: 'active',
    label: 'Активна',
    type: 'select',
    options: [
      { label: 'Да', value: true },
      { label: 'Нет', value: false },
    ],
  },
  { name: 'photo', label: 'Фото', type: 'text' },
];

async function fetchTeams() {
  const query = `
  query {
    getTeams {
      id
      name
      achievements
      home
      rate
      active
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
    if (response.ok && result.data && result.data.getTeams) {
      teams.value = result.data.getTeams.map((team) => ({
        ...team,
        isEditing: false,
      }));
    } else {
      console.error('При получении команд произошла ошибка:', result.errors);
      useToast().error(
        'При получении команд произошла ошибка. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Error fetching teams:', error);
    useToast().error(
      'Ошибка при получении команд. Пожалуйста попробуйте снова.'
    );
  }
}

async function deleteTeam(id) {
  const toast = useToast();
  const mutation = `
    mutation {
      deleteTeam(id: "${id}") {
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
    if (response.ok && result.data && result.data.deleteTeam) {
      teams.value = teams.value.filter((team) => team.id !== id);
      toast.success('Команда успешно удалена.');
    } else {
      console.error('Удаление команды не удалось:', result.errors);
      toast.error('Удаление команды не удалось. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка удаления команды:', error);
    toast.error('Ошибка удаления команды. Пожалуйста попробуйте снова.');
  }
}

function editTeam(team) {
  team.isEditing = true;
}

function cancelEdit(team) {
  team.isEditing = false;
  fetchTeams();
}

async function saveTeam(team) {
  const toast = useToast();
  const mutation = `
    mutation {
      updateTeam(id: "${team.id}", input: {
        name: "${team.name}",
        achievements: "${team.achievements}",
        home: "${team.home}"
        rate: "${team.rate}"
        active: "${team.active}"
      }) {
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
    if (response.ok && result.data && result.data.updateTeam) {
      team.isEditing = false;
      toast.success('Команда успешно обновлена.');
    } else {
      console.error('Ошибка обновления команды:', result.errors);
      toast.error('Ошибка обновления команды. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка сохранения команды:', error);
    toast.error('Ошибка сохранения команды. Пожалуйста попробуйте снова.');
  }
}

function openModal(title, fields, submitCallback) {
  modalTitle.value = title;
  modalFields.value = fields;
  isModalOpen.value = true;
  modalInitialData.value = {};
  handleModalSubmit = submitCallback;
}

function closeModal() {
  isModalOpen.value = false;
}

function openPhotoModal(team) {
  currentTeam.value = team;
  isPhotoModalOpen.value = true;
}

function closePhotoModal() {
  isPhotoModalOpen.value = false;
}

async function savePhoto(photoUrl) {
  if (!currentTeam.value) return;

  currentTeam.value.photo = photoUrl;
  await saveTeam(currentTeam.value);
  closePhotoModal();
}

async function handleModalSubmit(data, photo) {
  const toast = useToast();
  const mutation = `
    mutation($input: CreateTeamInput!) {
      createTeam(input: $input) {
        id
      }
    }
  `;

  const variables = {
    input: {
      name: data.name,
      achievements: data.achievements,
      home: data.home,
      rate: data.rate,
      active: data.active,
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
    new FormData();
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
    if (response.ok && result.data && result.data.createTeam) {
      teams.value.push(result.data.createTeam);
      closeModal();
      toast.success('Команда успешно создана.');
      fetchTeams();
    } else {
      console.error('Creating team failed:', result.errors);
      toast.error('Ошибка при создании команды. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка при создании команды:', error);
    toast.error('Ошибка при создании команды. Пожалуйста попробуйте снова.');
  }
}

onMounted(fetchTeams);

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
</script>

<style>
/* Add any styles you need here */
</style>
