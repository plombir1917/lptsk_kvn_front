<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'admin',
});

import Gantt from 'frappe-gantt';
import { useToast } from 'vue-toastification';
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

if (typeof window !== 'undefined') {
  Chart.register(...registerables, zoomPlugin);
}

const events = ref([]);
const organizers = ref([]);
const selectedOrganizerId = ref('');
let chart: Chart | null = null;

async function fetchOrganizers() {
  const query = `
  query {
    getAccounts {
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
    if (response.ok && result.data && result.data.getAccounts) {
      organizers.value = result.data.getAccounts;
    } else {
      console.error('Ошибка при получении организаторов:', result.errors);
      useToast().error(
        `Ошибка при получении организаторов. ${result.errors[0].message}`
      );
    }
  } catch (error) {
    console.error('Ошибка при получении организаторов:', error);
    useToast().error(
      'Ошибка при получении организаторов. Пожалуйста попробуйте снова.'
    );
  }
}

async function fetchEvents() {
  if (!selectedOrganizerId.value) return;

  const query = `
  query($id: String!) {
    getEventsByOrganizerId(id: $id) {
      event {
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
      body: JSON.stringify({
        query,
        variables: { id: selectedOrganizerId.value },
      }),
    });

    const result = await response.json();
    console.log(result.data.getEventsByOrganizerId);

    if (response.ok && result.data && result.data.getEventsByOrganizerId) {
      events.value = result.data.getEventsByOrganizerId.map((item: any) => ({
        ...item.event,
        end: new Date(item.event.date).toISOString().split('T')[0],
        start: new Date(item.event.created_at).toISOString().split('T')[0],
        isEditing: false,
      }));
      renderGanttChart(events);
      renderEventChart(events);
    } else {
      console.error('Ошибка при получении мероприятий:', result.errors);
      useToast().error(
        `Ошибка при получении мероприятий. ${result.errors[0].message}`
      );
    }
  } catch (error) {
    console.error('Ошибка при получении мероприятий:', error);
    useToast().error(
      'Ошибка при получении мероприятий. Пожалуйста попробуйте снова.'
    );
  }
}

function handleOrganizerChange(event: any) {
  selectedOrganizerId.value = event.target.value;
  fetchEvents();
}

onMounted(async () => {
  await fetchOrganizers();
  fetchEvents();
});

watch(events, (newEvents) => {
  renderEventChart(newEvents);
});

function renderGanttChart(events: any) {
  new Gantt('#gantt', events.value, {
    header_height: 50,
    column_width: 30,
    step: 24,
    view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
    bar_height: 20,
    bar_corner_radius: 3,
    arrow_curve: 5,
    padding: 18,
    view_mode: 'Day',
    date_format: 'YYYY-MM-DD',
    language: 'ru',
    on_date_change: (task, start, end) =>
      useToast().info(`${task} - ${start} - ${end}`),
    on_progress_change: (task, progress) =>
      useToast().info(`${task} - ${progress}`),
    custom_popup_html: (task) => `
      <div class="details-container">
        <h5>${task.name}</h5>
        <p>Дата начала: ${task.start}</p>
        <p>Дата окончания: ${task.end}</p>
      </div>
    `,
  });
}

function renderEventChart(events: any) {
  const ctx = document.getElementById('eventChart') as HTMLCanvasElement;
  if (!ctx) return;

  const eventCounts: { [key: string]: number } = {};
  events.value.forEach((event: any) => {
    const day = new Date(event.start).toISOString().split('T')[0]; // Get 'YYYY-MM-DD'
    if (eventCounts[day]) {
      eventCounts[day]++;
    } else {
      eventCounts[day] = 1;
    }
  });

  const labels = Object.keys(eventCounts);
  const data = Object.values(eventCounts);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Количество мероприятий',
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day', // Set the unit to 'day'
            tooltipFormat: 'yyyy-MM-dd',
          },
          title: {
            display: true,
            text: 'Время',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Количество мероприятий',
          },
          beginAtZero: true,
        },
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'x',
          },
        },
      },
    },
  });
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
    <div class="mt-6 grid md:grid-cols-2 xl:grid-cols-2 gap-6">
      <div
        class="bg-box-bg dark:bg-gray-800 p-6 rounded-lg shadow-md hover:bg-blue-100 dark:hover:bg-blue-800"
      >
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Статистика
        </h2>
        <label
          for="organizer"
          class="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Выберите организатора:
        </label>
        <select
          id="organizer"
          v-model="selectedOrganizerId"
          @change="handleOrganizerChange"
          class="mt-2 p-2 border border-gray-300 rounded-md"
        >
          <option value="" disabled>Выберите организатора</option>
          <option
            v-for="organizer in organizers"
            :key="organizer.id"
            :value="organizer.id"
          >
            {{ organizer.name }}
          </option>
        </select>
        <div id="gantt" class="gantt-target mt-6"></div>
        <canvas id="eventChart" class="mt-6"></canvas>
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
