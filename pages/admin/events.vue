<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Мероприятия
    </h1>
    <p class="mt-4 text-gray-600 dark:text-gray-300">
      Управляйте мероприятиями здесь.
    </p>
    <div class="mt-6 overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Название
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Дата
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Место
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Описание
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Фото
            </th>
            <th
              class="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
            >
              Ссылка
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="event in events"
            :key="event.id"
            class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <td class="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
              {{ event.title }}
            </td>
            <td class="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
              {{ event.date }}
            </td>
            <td class="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
              {{ event.location }}
            </td>
            <td class="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
              {{ event.description }}
            </td>
            <td class="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
              <img
                :src="event.photo"
                alt="Event Photo"
                class="h-16 w-16 object-cover rounded-md"
              />
            </td>
            <td class="py-4 px-6 border-b border-gray-200 dark:border-gray-700">
              {{ event.url }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const events = ref([]);

const fetchEvents = async () => {
  try {
    // const response = await axios.get('/api/events'); // URL вашего API
    events.value = response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

onMounted(fetchEvents);

definePageMeta({
  layout: 'admin',
});
</script>
