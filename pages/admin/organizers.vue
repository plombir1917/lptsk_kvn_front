<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Организаторы
    </h1>
    <div class="mt-4 flex justify-between items-center">
      <p class="text-gray-600 dark:text-gray-300">
        Управляйте организаторами здесь.
      </p>
      <button
        @click="
          openModal('Создать организатора', organizerFields, createOrganizer)
        "
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
      >
        Создать организатора
      </button>
    </div>
    <div class="mt-6 overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800 overflow-x-auto">
        <thead>
          <tr>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Имя
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Фамилия
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Ответственность
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
            v-for="organizer in organizers"
            :key="organizer.id"
            class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              {{ organizer.account.name }}
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              {{ organizer.account.surname }}
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              {{ organizer.responsibility }}
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              {{ organizer.event.name }}
            </td>
            <td
              class="py-2 px-1 border-b border-gray-200 dark:border-gray-700 text-center"
            >
              <div class="flex gap-1 justify-center">
                <button
                  @click="editOrganizer(organizer)"
                  class="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Редактировать
                </button>
                <button
                  @click="deleteOrganizer(organizer)"
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

const organizers = ref([]);
const accounts = ref([]);
const events = ref([]);
const isModalOpen = ref(false);
const modalTitle = ref('');
const modalFields = ref([]);
const modalInitialData = ref({});

const organizerFields = [
  { name: 'accountId', label: 'Аккаунт', type: 'select', options: accounts },
  { name: 'eventId', label: 'Мероприятие', type: 'select', options: events },
  { name: 'responsibility', label: 'Ответственность', type: 'text' },
];

async function fetchAccounts() {
  const query = `
  query {
    getAccounts {
      id
      name
      surname
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
    if (response.ok && result.data && result.data.getAccounts) {
      accounts.value = result.data.getAccounts.map((account) => ({
        value: account.id,
        label: `${account.name} ${account.surname}`,
      }));
    } else {
      console.error('При получении аккаунтов произошла ошибка:', result.errors);
      useToast().error(
        'При получении аккаунтов произошла ошибка. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка при получении аккаунтов:', error);
    useToast().error(
      'Ошибка при получении аккаунтов. Пожалуйста попробуйте снова.'
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

async function fetchOrganizers() {
  const query = `
  query {
    getOrganizers {
      account_id
      event_id
      responsibility
      account {
        name
        surname
      }
      event {
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
    if (response.ok && result.data && result.data.getOrganizers) {
      organizers.value = result.data.getOrganizers;
    } else {
      console.error(
        'При получении организаторов произошла ошибка:',
        result.errors
      );
      useToast().error(
        'При получении организаторов произошла ошибка. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка при получении организаторов:', error);
    useToast().error(
      'Ошибка при получении организаторов. Пожалуйста попробуйте снова.'
    );
  }
}

async function createOrganizer(data) {
  const toast = useToast();
  const mutation = `
    mutation {
      createOrganizer(input: {
        account_id: "${data.accountId}",
        event_id: ${data.eventId},
        responsibility: "${data.responsibility}",
      }) {
        account_id
        event_id
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
    if (response.ok && result.data && result.data.createOrganizer) {
      fetchOrganizers();
      closeModal();
      toast.success('Организатор успешно создан.');
    } else {
      console.error('Ошибка при создании организатора:', result.errors);
      toast.error(
        'Ошибка при создании организатора. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка при создании организатора:', error);
    toast.error(
      'Ошибка при создании организатора. Пожалуйста попробуйте снова.'
    );
  }
}

async function deleteOrganizer(data) {
  console.log(data);
  const toast = useToast();
  const mutation = `
    mutation {
      deleteOrganizer(input: { account_id: "${data.account_id}",
        event_id: ${data.event_id},
        }) {
        account_id
        event_id
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
    if (response.ok && result.data && result.data.deleteOrganizer) {
      fetchOrganizers();
      toast.success('Организатор успешно удален.');
    } else {
      console.error('Удаление организатора не удалось:', result.errors);
      toast.error(
        'Удаление организатора не удалось. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка удаления организатора:', error);
    toast.error('Ошибка удаления организатора. Пожалуйста попробуйте снова.');
  }
}

function editOrganizer(organizer) {
  openModal('Редактировать организатора', organizerFields, async (data) => {
    await saveOrganizer(organizer.id, data);
  });
  modalInitialData.value = {
    accountId: organizer.account.id,
    eventId: organizer.event.id,
  };
}

async function saveOrganizer(id, data) {
  const toast = useToast();
  const mutation = `
    mutation {
      updateOrganizer(id: "${id}", input: {
        account_id: "${data.accountId}",
        event_id: "${data.eventId}",
      }) {
        account_id
        event_id
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
    if (response.ok && result.data && result.data.updateOrganizer) {
      fetchOrganizers();
      closeModal();
      toast.success('Организатор успешно обновлен.');
    } else {
      console.error('Ошибка обновления организатора:', result.errors);
      toast.error(
        'Ошибка обновления организатора. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Ошибка сохранения организатора:', error);
    toast.error('Ошибка сохранения организатора. Пожалуйста попробуйте снова.');
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
  await createOrganizer(data);
}

onMounted(() => {
  fetchOrganizers();
  fetchAccounts();
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
