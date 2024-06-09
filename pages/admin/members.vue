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
              Роль
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
                v-model="member.role"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ member.role }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="member.isEditing"
                v-model="member.team"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ member.team }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <div class="flex gap-1 justify-center">
                <button
                  v-if="member.isEditing"
                  @click="saveMember(member)"
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
const isModalOpen = ref(false);
const isPhotoModalOpen = ref(false);
const currentMember = ref(null);
const modalTitle = ref('');
const modalFields = ref([]);
const modalInitialData = ref({});

const memberFields = [
  { name: 'name', label: 'Имя', type: 'text' },
  { name: 'role', label: 'Роль', type: 'text' },
  { name: 'team', label: 'Команда', type: 'text' },
  { name: 'photo', label: 'Фото', type: 'text' },
];

async function fetchMembers() {
  const query = `
  query {
    getMembers {
      id
      name
      role
      team
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
  const toast = useToast();
  const mutation = `
    mutation {
      updateMember(id: "${member.id}", input: {
        name: "${member.name}",
        role: "${member.role}",
        team: "${member.team}"
      }) {
        id
        name
        role
        team
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

async function createMember(data) {
  const toast = useToast();
  const mutation = `
    mutation {
      createMember(input: {
        name: "${data.name}",
        role: "${data.role}",
        team: "${data.team}",
        photo: "${data.photo}"
      }) {
        id
        name
        role
        team
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
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();
    if (response.ok && result.data && result.data.createMember) {
      members.value.push({
        ...result.data.createMember,
        isEditing: false,
      });
      toast.success('Участник успешно создан.');
    } else {
      console.error('Ошибка создания участника:', result.errors);
      toast.error('Ошибка создания участника. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка создания участника:', error);
    toast.error('Ошибка создания участника. Пожалуйста попробуйте снова.');
  }
}

function openPhotoModal(member) {
  currentMember.value = member;
  isPhotoModalOpen.value = true;
}

function closePhotoModal() {
  isPhotoModalOpen.value = false;
}

async function savePhoto(photoUrl) {
  if (!currentMember.value) return;

  currentMember.value.photo = photoUrl;
  await saveMember(currentMember.value);
  closePhotoModal();
}

onMounted(fetchMembers);

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
</script>

<style>
/* Add any styles you need here */
</style>
