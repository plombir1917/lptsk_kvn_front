<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Активность
    </h1>
    <div class="mt-4 flex justify-between items-center">
      <p class="text-gray-600 dark:text-gray-300">
        Управляйте активностями здесь.
      </p>
      <button
        @click="openModal('Создать активность', activityFields, createActivity)"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
      >
        Создать активность
      </button>
    </div>
    <!-- Таблица активности -->
    <div class="mt-6 overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800 overflow-x-auto">
        <thead>
          <tr>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Команда
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Мероприятие
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Рейтинг
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
            v-for="activity in activityList"
            :key="activity.id"
            class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              {{ activity.team_name }}
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              {{ activity.event_name }}
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              {{ activity.team_rate }}
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <div class="flex gap-1 justify-center">
                <button
                  @click="deleteActivity(activity)"
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

    <!-- Модальное окно создания активности -->
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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import CreateModal from '@/components/elements/CreateModal.vue';

const activityList = ref([]);
const isModalOpen = ref(false);
const modalTitle = ref('');
const modalFields = ref([]);
const modalInitialData = ref({});

const teams = ref([]);
const events = ref([]);

const activityFields = [
  { name: 'team_id', label: 'Команда', type: 'select', options: teams },
  { name: 'event_id', label: 'Мероприятие', type: 'select', options: events },
  { name: 'team_rate', label: 'Рейтинг', type: 'number' },
];

async function fetchData() {
  const query = `
  query {
    getTeams {
      id
      name
      rate
      event {
        event_id
        team_rate
        event {
          name
        }
      }
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
      const data = result.data.getTeams;
      activityList.value = data.flatMap((team) => {
        return team.event
          ? team.event.map((event) => ({
              id: team.id,
              team_name: team.name,
              team_rate: event.team_rate,
              event_id: event.event_id,
              event_name: event.event.name,
            }))
          : [];
      });
    } else {
      console.error('При получении данных произошла ошибка:', result.errors);
      useToast().error(
        `При получении данных произошла ошибка. ${result.errors[0].message}`
      );
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    useToast().error(
      'Ошибка при получении данных. Пожалуйста попробуйте снова.'
    );
  }
}

async function fetchTeams() {
  const query = `
  query {
    getTeams {
      id
      name
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
        label: team.name,
        value: team.id,
      }));
    } else {
      console.error('При получении команд произошла ошибка:', result.errors);
      useToast().error(
        `При получении команд произошла ошибка. ${result.errors[0].message}`
      );
    }
  } catch (error) {
    console.error('Error fetching teams:', error);
    useToast().error(
      'Ошибка при получении команд. Пожалуйста попробуйте снова.'
    );
  }
}

async function fetchEvents() {
  const query = `
  query {
    getEvents {
      id
      name
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
    if (response.ok && result.data && result.data.getEvents) {
      events.value = result.data.getEvents.map((event) => ({
        label: event.name,
        value: event.id,
      }));
    } else {
      console.error(
        'При получении мероприятий произошла ошибка:',
        result.errors
      );
      useToast().error(
        `При получении мероприятий произошла ошибка. ${result.errors[0].message}`
      );
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    useToast().error(
      'Ошибка при получении мероприятий. Пожалуйста попробуйте снова.'
    );
  }
}

async function deleteActivity(data) {
  console.log(data);
  const toast = useToast();
  const mutation = `
    mutation($input: CreateActivityInput!) {
      deleteActivity(input: $input) {
        team_id
      }
    }
  `;

  const variables = {
    input: {
      team_id: data.id, // Замените на правильное значение или удалите, если не нужно
      event_id: data.event_id, // Замените на правильное значение или удалите, если не нужно
      team_rate: 0, // Замените на правильное значение или удалите, если не нужно
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
    if (response.ok && result.data && result.data.deleteActivity) {
      fetchData();
      toast.success('Активность успешно удалена.');
    } else {
      console.error('Удаление активности не удалось:', result.errors);
      toast.error(
        'Удаление активности не удалось. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка удаления активности:', error);
    toast.error('Ошибка удаления активности. Пожалуйста попробуйте снова.');
  }
}

function openModal(title, fields, initialData = {}) {
  modalTitle.value = title;
  modalFields.value = fields;
  modalInitialData.value = true;
  isModalOpen.value = true;
  fetchTeams();
  fetchEvents();
}

function closeModal() {
  isModalOpen.value = false;
}

async function handleModalSubmit(data) {
  const toast = useToast();
  const mutation = `
    mutation($input: CreateActivityInput!) {
      addActivity(input: $input) {
        team_id
      }
    }
  `;

  const variables = {
    input: {
      team_id: data.team_id,
      event_id: data.event_id,
      team_rate: data.team_rate,
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
    if (response.ok && result.data && result.data.addActivity) {
      closeModal();
      toast.success('Активность успешно создана.');
      fetchData();
    } else {
      console.error('Создание активности не удалось:', result.errors);
      toast.error(
        'Ошибка при создании активности. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка при создании активности:', error);
    toast.error('Ошибка при создании активности. Пожалуйста попробуйте снова.');
  }
}

onMounted(() => {
  fetchData();
});

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
</script>
