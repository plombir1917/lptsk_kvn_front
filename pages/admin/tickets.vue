<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Билеты
    </h1>
    <div class="mt-4 flex justify-between items-center">
      <p class="text-gray-600 dark:text-gray-300">Управляйте билетами здесь.</p>
      <button
        @click="openModal('Создать билет', ticketFields, createTicket)"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
      >
        Создать билет
      </button>
    </div>
    <div class="mt-6 overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800 overflow-x-auto">
        <thead>
          <tr>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Ссылка
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Мероприятие
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
            v-for="ticket in tickets"
            :key="ticket.id"
            class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <a
                :href="ticket.link"
                target="_blank"
                class="text-blue-500 hover:underline"
              >
                {{ ticket.link }}
              </a>
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              {{ ticket.event.name }}
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <div class="flex gap-1 justify-center">
                <button
                  @click="editTicket(ticket)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Редактировать
                </button>
                <button
                  @click="deleteTicket(ticket.id)"
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
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import CreateModal from '@/components/elements/CreateModal.vue';

const tickets = ref([]);
const events = ref([]);
const isModalOpen = ref(false);
const modalTitle = ref('');
const modalFields = ref([]);
const modalInitialData = ref({});

const ticketFields = [
  { name: 'link', label: 'Ссылка', type: 'text' },
  { name: 'eventId', label: 'Мероприятие', type: 'select', options: events },
];

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
        value: event.id,
        label: event.name,
      }));
    } else {
      console.error(
        'При получении мероприятий произошла ошибка:',
        result.errors
      );
      useToast().error(
        'При получении мероприятий произошла ошибка. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка при получении мероприятий:', error);
    useToast().error(
      'Ошибка при получении мероприятий. Пожалуйста попробуйте снова.'
    );
  }
}

async function fetchTickets() {
  const query = `
  query {
    getTickets {
      id
      link
      event {
        id
        name
      }
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
    if (response.ok && result.data && result.data.getTickets) {
      tickets.value = result.data.getTickets;
    } else {
      console.error('При получении билетов произошла ошибка:', result.errors);
      useToast().error(
        'При получении билетов произошла ошибка. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка при получении билетов:', error);
    useToast().error(
      'Ошибка при получении билетов. Пожалуйста попробуйте снова.'
    );
  }
}

async function createTicket(data) {
  const toast = useToast();
  const mutation = `
    mutation {
      createTicket(input: {
        link: "${data.link}",
        event_id: ${data.eventId},
      }) {
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
    if (response.ok && result.data && result.data.createTicket) {
      fetchTickets();
      closeModal();
      toast.success('Билет успешно создан.');
    } else {
      console.error('Ошибка при создании билета:', result.errors);
      toast.error('Ошибка при создании билета. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка при создании билета:', error);
    toast.error('Ошибка при создании билета. Пожалуйста попробуйте снова.');
  }
}

async function deleteTicket(id) {
  const toast = useToast();
  const mutation = `
    mutation {
      deleteTicket(id: ${id}) {
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
    if (response.ok && result.data && result.data.deleteTicket) {
      tickets.value = tickets.value.filter((ticket) => ticket.id !== id);
      toast.success('Билет успешно удален.');
    } else {
      console.error('Удаление билета не удалось:', result.errors);
      toast.error('Удаление билета не удалось. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка удаления билета:', error);
    toast.error('Ошибка удаления билета. Пожалуйста попробуйте снова.');
  }
}

function editTicket(ticket) {
  openModal('Редактировать билет', ticketFields, async (data) => {
    await saveTicket(ticket.id, data);
  });
  modalInitialData.value = {
    link: ticket.link,
    eventId: ticket.event.id,
  };
}

async function saveTicket(id, data) {
  const toast = useToast();
  const mutation = `
    mutation {
      updateTicket(id: ${+id}, input: {
        link: "${data.link}",
        event_id: ${+data.eventId},
      }) {
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
    if (response.ok && result.data && result.data.updateTicket) {
      fetchTickets();
      closeModal();
      toast.success('Билет успешно обновлен.');
    } else {
      console.error('Ошибка обновления билета:', result.errors);
      toast.error('Ошибка обновления билета. Пожалуйста попробуйте снова.');
    }
  } catch (error) {
    console.error('Ошибка сохранения билета:', error);
    toast.error('Ошибка сохранения билета. Пожалуйста попробуйте снова.');
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

async function handleModalSubmit(data) {
  await createTicket(data);
}

onMounted(() => {
  fetchTickets();
  fetchEvents();
});

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
</script>

<style>
/* Add any styles you need here */
</style>
