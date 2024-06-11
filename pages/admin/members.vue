<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Участники
    </h1>
    <div class="mt-4 flex justify-between items-center">
      <p class="text-gray-600 dark:text-gray-300">
        Управляйте участниками здесь.
      </p>
      <button
        @click="openModal('Создать участника', memberFields, createMember)"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
      >
        Создать участника
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
              Телефон
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Команда
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
            v-for="member in members"
            :key="member.id"
            class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <img
                :src="member.photo"
                alt="Фото"
                class="w-20 h-20 rounded-full mx-auto"
              />
              <button
                v-if="member.isEditing"
                @click="openPhotoModal(member)"
                class="mt-1 px-1 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Изменить фото
              </button>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="member.isEditing"
                v-model="member.name"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ member.name }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="member.isEditing"
                v-model="member.phone"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ member.phone }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <select
                v-if="member.isEditing"
                v-model="member.team.id"
                class="w-full p-2 border rounded"
              >
                <option v-for="team in teams" :key="team.id" :value="team.id">
                  {{ member.team.name }}
                </option>
              </select>
              <span v-else>{{ member.team.name }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <div class="flex gap-1 justify-center">
                <button
                  v-if="member.isEditing"
                  @click="saveMember(member, teams)"
                  class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  Сохранить
                </button>
                <button
                  v-if="member.isEditing"
                  @click="cancelEdit(member)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Отмена
                </button>
                <button
                  v-else
                  @click="editMember(member)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Редактировать
                </button>
                <button
                  @click="deleteMember(member.id)"
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

const members = ref([]);
const teams = ref([]);
const isModalOpen = ref(false);
const isPhotoModalOpen = ref(false);
const currentMember = ref(null);
const modalTitle = ref('');
const modalFields = ref([]);
const modalInitialData = ref({});

const memberFields = [
  { name: 'name', label: 'Имя', type: 'text' },
  { name: 'phone', label: 'Телефон', type: 'text' },
  { name: 'photo', label: 'Фото', type: 'text' },
  { name: 'team_id', label: 'Команда', type: 'select', options: teams },
];

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
        value: team.id,
        label: team.name,
      }));
    } else {
      console.error('При получении команд произошла ошибка:', result.errors);
      useToast().error(
        'При получении команд произошла ошибка. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка при получении команд:', error);
    useToast().error(
      'Ошибка при получении команд. Пожалуйста попробуйте снова.'
    );
  }
}

async function fetchMembers() {
  const query = `
  query {
    getMembers {
      id
      name
      phone
      photo
      team {
        name
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
    if (response.ok && result.data && result.data.getMembers) {
      members.value = result.data.getMembers.map((member) => ({
        ...member,
        isEditing: false,
      }));
    } else {
      console.error(
        'При получении участников произошла ошибка:',
        result.errors
      );
      useToast().error(
        'При получении участников произошла ошибка. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Error fetching members:', error);
    useToast().error(
      'Ошибка при получении участников. Пожалуйста попробуйте снова.'
    );
  }
}

async function deleteMember(id) {
  const toast = useToast();
  const mutation = `
    mutation {
      deleteMember(id: "${id}") {
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
    if (response.ok && result.data && result.data.deleteMember) {
      members.value = members.value.filter((member) => member.id !== id);
      toast.success('Участник успешно удален.');
    } else {
      console.error('Удаление участника не удалось:', result.errors);
      toast.error(
        'Удаление участника не удалось. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка удаления участника:', error);
    toast.error('Ошибка удаления участника. Пожалуйста попробуйте снова.');
  }
}

function editMember(member) {
  member.isEditing = true;
}

function cancelEdit(member) {
  member.isEditing = false;
  fetchMembers();
}

async function saveMember(member) {
  console.log(member.team);
  const toast = useToast();
  const mutation = `
    mutation {
      updateMember(id: "${member.id}", input: {
        name: "${member.name}",
        phone: "${member.phone}",
      }) {
        id
        name
        phone
        team {
        id
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
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();
    if (response.ok && result.data && result.data.updateMember) {
      member.isEditing = false;
      toast.success('Участник успешно обновлен.');
    } else {
      console.error('Ошибка обновления участника:', result.errors);
      toast.error('Ошибка обновления участника. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка сохранения участника:', error);
    toast.error('Ошибка сохранения участника. Пожалуйста попробуйте снова.');
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

async function handleModalSubmit(data, photo) {
  const toast = useToast();
  const mutation = `
    mutation($input: CreateMemberInput!) {
      createMember(input: $input) {
        id
      }
    }
  `;

  const variables = {
    input: {
      name: data.name,
      phone: data.phone,
      photo: null,
      team_id: data.team_id,
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
    if (response.ok && result.data && result.data.createMember) {
      fetchMembers();
      closeModal();
      toast.success('Участник успешно создан.');
    } else {
      console.error('Creating team failed:', result.errors);
      toast.error(
        'Ошибка при создании участника. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка при создании участника:', error);
    toast.error('Ошибка при создании участника. Пожалуйста попробуйте снова.');
  }
}

function openPhotoModal(member) {
  currentMember.value = member;
  isPhotoModalOpen.value = true;
}

function closePhotoModal() {
  isPhotoModalOpen.value = false;
}

async function savePhoto(formData) {
  const file = formData.get('photo');
  const toast = useToast();
  try {
    const token = localStorage.getItem('access_token');
    const operations = {
      query: `
        mutation($photo: Upload!, $id: String!) {
          updateMember(id: $id, input: { photo: $photo }) {
            id
          }
        }
      `,
      variables: {
        id: currentMember.value.id.toString(),
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
  fetchMembers();
  fetchTeams();
  closePhotoModal();
}

onMounted(() => {
  fetchMembers();
  fetchTeams();
});

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
</script>

<style>
/* Add any styles you need here */
</style>
