<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Мероприятия
    </h1>
    <div class="mt-4 flex justify-between items-center">
      <p class="text-gray-600 dark:text-gray-300">
        Управляйте мероприятиями здесь.
      </p>
      <button
        @click="openModal('Создать мероприятие', eventFields, createEvent)"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
      >
        Создать мероприятие
      </button>
    </div>
    <!-- Таблица событий -->
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
              Дата
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Место
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Описание
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Ссылка
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Создано
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
            v-for="event in events"
            :key="event.id"
            class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <img
                :src="event.photo"
                alt="Фото"
                class="w-20 h-20 rounded-full mx-auto"
              />
              <button
                v-if="event.isEditing"
                @click="openPhotoModal(event)"
                class="mt-1 px-1 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Изменить фото
              </button>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="event.isEditing"
                v-model="event.name"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ event.name }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="event.isEditing"
                v-model="event.date"
                type="date"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{
                new Date(event.date).toLocaleDateString()
              }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="event.isEditing"
                v-model="event.place"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ event.place }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="event.isEditing"
                v-model="event.description"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ event.description }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <input
                v-if="event.isEditing"
                v-model="event.link"
                class="w-full p-2 border rounded"
              />
              <span v-else>{{ event.link }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <span>{{ new Date(event.created_at).toLocaleDateString() }}</span>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <div class="flex gap-1 justify-center">
                <button
                  v-if="event.isEditing"
                  @click="saveEvent(event)"
                  class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  Сохранить
                </button>
                <button
                  v-if="event.isEditing"
                  @click="cancelEdit(event)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Отмена
                </button>
                <button
                  v-else
                  @click="editEvent(event)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Редактировать
                </button>
                <button
                  @click="deleteEvent(event.id)"
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

    <!-- Модальное окно создания события -->
    <CreateModal
      :isOpen="isModalOpen"
      :title="modalTitle"
      :fields="modalFields"
      :initialData="modalInitialData"
      @close="closeModal"
      @submit="handleModalSubmit"
    />

    <!-- Модальное окно загрузки фото -->
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

const events = ref([]);
const isModalOpen = ref(false);
const isPhotoModalOpen = ref(false);
const currentEvent = ref(null);
const modalTitle = ref('');
const modalFields = ref([]);
const modalInitialData = ref({});

const eventFields = [
  { name: 'name', label: 'Название', type: 'text' },
  { name: 'date', label: 'Дата', type: 'date' },
  { name: 'place', label: 'Место', type: 'text' },
  { name: 'description', label: 'Описание', type: 'text' },
  { name: 'photo', label: 'Фото', type: 'text' },
  { name: 'link', label: 'Ссылка', type: 'text' },
];

async function fetchEvents() {
  const query = `
  query {
    getEvents {
      id
      name
      date
      place
      description
      photo
      link
      created_at
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
    if (response.ok && result.data && result.data.getEvents) {
      events.value = result.data.getEvents.map((event) => ({
        ...event,
        date: new Date(event.date).toISOString().split('T')[0],
        isEditing: false,
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

async function deleteEvent(id) {
  const toast = useToast();
  const mutation = `
    mutation {
      deleteEvent(id: "${id}") {
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
    if (response.ok && result.data && result.data.deleteEvent) {
      events.value = events.value.filter((event) => event.id !== id);
      toast.success('Мероприятие успешно удален.');
    } else {
      console.error('Удаление мероприятия не удалось:', result.errors);
      toast.error(
        'Удаление мероприятия не удалось. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка удаления мероприятия:', error);
    toast.error('Ошибка удаления мероприятия. Пожалуйста попробуйте снова.');
  }
}

function editEvent(event) {
  event.isEditing = true;
}

function cancelEdit(event) {
  event.isEditing = false;
  fetchEvents();
}

async function saveEvent(event) {
  const toast = useToast();
  const mutation = `
    mutation($input: UpdateEventInput!) {
      updateEvent(id: "${event.id}", input: $input) {
        id
      }
    }
  `;
  const variables = {
    input: {
      name: event.name,
      date: event.date,
      place: event.place,
      description: event.description,
      link: event.link,
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
    if (response.ok && result.data && result.data.updateEvent) {
      fetchEvents();
      event.isEditing = false;
      toast.success('Изменения успешно сохранены.');
    } else {
      console.error('Обновление мероприятия не удалось:', result.errors);
      toast.error(
        'Обновление мероприятия не удалось. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка обновления мероприятия:', error);
    toast.error('Ошибка обновления мероприятия. Пожалуйста попробуйте снова.');
  }
}

async function savePhoto(formData) {
  const file = formData.get('photo');
  const toast = useToast();
  try {
    const token = localStorage.getItem('access_token');
    const operations = {
      query: `
        mutation($photo: Upload!, $id: String!) {
          updateEvent(id: $id, input: { photo: $photo }) {
            id
          }
        }
      `,
      variables: {
        id: currentEvent.value.id.toString(),
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
  fetchEvents();
  closePhotoModal();
}

function openPhotoModal(event) {
  currentEvent.value = event;
  isPhotoModalOpen.value = true;
}

function closePhotoModal() {
  isPhotoModalOpen.value = false;
  currentEvent.value = null;
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
    mutation($input: CreateEventInput!) {
      createEvent(input: $input) {
        id
      }
    }
  `;

  const variables = {
    input: {
      name: data.name,
      date: data.date,
      place: data.place,
      description: data.description,
      photo: null,
      link: data.link,
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
    if (response.ok && result.data && result.data.createEvent) {
      events.value.push(result.data.createEvent);
      closeModal();
      toast.success('Мероприятие успешно создано.');
      fetchEvents();
    } else {
      console.error('Creating event failed:', result.errors);
      toast.error(
        'Ошибка при создании мероприятия. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка при создании мероприятия:', error);
    toast.error(
      'Ошибка при создании мероприятия. Пожалуйста попробуйте снова.'
    );
  }
}

onMounted(fetchEvents);

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
</script>
