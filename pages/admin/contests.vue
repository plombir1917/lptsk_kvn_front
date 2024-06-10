<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Конкурсы
    </h1>
    <div class="mt-4 flex justify-between items-center">
      <p class="text-gray-600 dark:text-gray-300">
        Управляйте конкурсами здесь.
      </p>
      <button
        @click="openModal('Создать конкурс', contestFields)"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
      >
        Создать конкурс
      </button>
    </div>
    <!-- Таблица конкурсов -->
    <div class="mt-6 overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800 overflow-x-auto">
        <thead>
          <tr>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Название
            </th>

            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Длительность
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Описание
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
            v-for="contest in contests"
            :key="contest.id"
            class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="contest.isEditing"
                v-model="contest.name"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ contest.name }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="contest.isEditing"
                v-model="contest.duration"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ contest.duration }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <textarea
                v-if="contest.isEditing"
                v-model="contest.description"
                class="w-full p-2 border rounded"
              ></textarea>
              <span v-else>{{ contest.description }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <div class="flex gap-1 justify-center">
                <button
                  v-if="contest.isEditing"
                  @click="saveContest(contest)"
                  class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  Сохранить
                </button>
                <button
                  v-if="contest.isEditing"
                  @click="cancelEdit(contest)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Отмена
                </button>
                <button
                  v-else
                  @click="editContest(contest)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Редактировать
                </button>
                <button
                  @click="deleteContest(contest.id)"
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

    <!-- Модальное окно создания конкурса -->
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

const contests = ref([]);
const isModalOpen = ref(false);
const modalTitle = ref('');
const modalFields = ref([]);
const modalInitialData = ref({});

const contestFields = [
  { name: 'name', label: 'Название', type: 'text' },
  { name: 'duration', label: 'Длительность', type: 'number' },
  { name: 'description', label: 'Описание', type: 'text' },
];

async function fetchContests() {
  const query = `
  query {
    getContests {
      id
      name
      duration
      description
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
    if (response.ok && result.data && result.data.getContests) {
      contests.value = result.data.getContests.map((contest) => ({
        ...contest,
        isEditing: false,
      }));
    } else {
      console.error('При получении конкурсов произошла ошибка:', result.errors);
      useToast().error(
        `При получении конкурсов произошла ошибка. ${result.errors[0].message}`
      );
    }
  } catch (error) {
    console.error('Error fetching contests:', error);
    useToast().error(
      'Ошибка при получении конкурсов. Пожалуйста попробуйте снова.'
    );
  }
}

async function deleteContest(id) {
  const toast = useToast();
  const mutation = `
    mutation {
      deleteContest(id: "${id}") {
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
    if (response.ok && result.data && result.data.deleteContest) {
      contests.value = contests.value.filter((contest) => contest.id !== id);
      toast.success('Конкурс успешно удален.');
    } else {
      console.error('Удаление конкурса не удалось:', result.errors);
      toast.error('Удаление конкурса не удалось. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка удаления конкурса:', error);
    toast.error('Ошибка удаления конкурса. Пожалуйста попробуйте снова.');
  }
}

function editContest(contest) {
  contest.isEditing = true;
}

function cancelEdit(contest) {
  contest.isEditing = false;
  fetchContests();
}

async function saveContest(contest) {
  const toast = useToast();
  const mutation = `
    mutation($input: UpdateContestInput!) {
      updateContest(id: "${contest.id}", input: $input) {
        id
      }
    }
  `;
  const variables = {
    input: {
      name: contest.name,
      description: contest.description,
      duration: contest.duration,
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
    if (response.ok && result.data && result.data.updateContest) {
      contest.isEditing = false;
      toast.success('Изменения успешно сохранены.');
    } else {
      console.error('Обновление конкурса не удалось:', result.errors);
      toast.error(
        'Обновление конкурса не удалось. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка обновления конкурса:', error);
    toast.error('Ошибка обновления конкурса. Пожалуйста попробуйте снова.');
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
    mutation($input: CreateContestInput!) {
      createContest(input: $input) {
        id
      }
    }
  `;

  const variables = {
    input: {
      name: data.name,
      duration: data.duration,
      description: data.description,
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
    if (response.ok && result.data && result.data.createContest) {
      contests.value.push(result.data.createContest);
      closeModal();
      toast.success('Конкурс успешно создан.');
      fetchContests();
    } else {
      console.error('Создание конкурса не удалось:', result.errors);
      toast.error('Ошибка при создании конкурса. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка при создании конкурса:', error);
    toast.error('Ошибка при создании конкурса. Пожалуйста попробуйте снова.');
  }
}

onMounted(() => {
  fetchContests();
});

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
</script>
