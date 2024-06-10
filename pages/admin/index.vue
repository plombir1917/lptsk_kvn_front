<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'admin',
});
import  Gantt  from 'frappe-gantt';
import { useToast } from 'vue-toastification';

const events = ref([]);



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
      events.value = result.data.getEvents.map((event: any) => ({
        ...event,
        end: new Date(event.date).toISOString().split('T')[0],
        start: new Date(event.created_at).toISOString().split('T')[0],
        isEditing: false,
      }));
      renderGanttChart(events);
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

onMounted(() => {
  fetchEvents();
});

function renderGanttChart(events: any) {
  new Gantt("#gantt", events.value, {
    header_height: 50,
    column_width: 30,
    step: 24,
    view_modes: ["Quarter Day", "Half Day", "Day", "Week", "Month"],
    bar_height: 20,
    bar_corner_radius: 3,
    arrow_curve: 5,
    padding: 18,
    view_mode: "Day",
    date_format: "YYYY-MM-DD",
    language: "ru", 
    on_click: (task) => useToast().info(task),
    on_date_change: (task, start, end) => useToast().info(`${task} - ${start} - ${end}`),
    on_progress_change: (task, progress) => useToast().info(`${task} - ${progress}`),
    on_view_change: (mode) => useToast().info(mode),
    custom_popup_html: (task) => `
      <div class="details-container">
        <h5>${task.name}</h5>
        <p>Дата начала: ${task.start}</p>
        <p>Дата окончания: ${task.end}</p>
      </div>
    `,
  })
}

</script>
<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Главная
    </h1>
    <p class="mt-4 text-gray-600 dark:text-gray-300">
      Добро пожаловать в панель администрирования. Используйте боковое меню для
      навигации по разным разделам.
    </p>
    <div class="mt-6 grid  md:grid-cols-2 xl:grid-cols-2 gap-6">
      <div
        class="bg-box-bg dark:bg-gray-800 p-6 rounded-lg shadow-md hover:bg-blue-100 dark:hover:bg-blue-800"
      >
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Статистика
        </h2>
        <div id="gantt" class="gantt-target"></div>
      </div>
      <div
        class="bg-box-bg dark:bg-gray-800 p-6 rounded-lg shadow-md hover:bg-blue-100 dark:hover:bg-blue-800"
      >
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Отчеты
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-300">Месячные отчеты.</p>
      </div>
    </div>
  </div>
</template>
