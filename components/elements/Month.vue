<template>
  <div>
    <div v-if="view === 'months'">
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="(month, index) in months"
          :key="month"
          :class="{
            'bg-green-100 text-green-800':
              hasEventInMonth(index) && !isMonthPast(index),
            'bg-yellow-100 text-yellow-800':
              hasEventInMonth(index) && isMonthPast(index),
            'bg-blue-100': !hasEventInMonth(index),
            'p-4 rounded-lg text-center cursor-pointer hover:bg-blue-200': true,
            'opacity-50 cursor-not-allowed': isDisabledMonth(index),
          }"
          @click="!isDisabledMonth(index) && selectMonth(index)"
        >
          {{ month }}
        </div>
      </div>
    </div>
    <div v-else>
      <DaysComponent
        :selectedMonth="selectedMonth"
        :selectedYear="selectedYear"
        :events="events"
        @back="view = 'months'"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import DaysComponent from './Days.vue';
import { useToast } from 'vue-toastification';

const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const view = ref('months');
const selectedMonth = ref(0);
const selectedYear = ref(new Date().getFullYear());
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
        date: new Date(event.date).toISOString().split('T')[0],
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

function hasEventInMonth(monthIndex: number): boolean {
  return events.value.some(
    (event: any) => new Date(event.date).getMonth() === monthIndex
  );
}

function isMonthPast(monthIndex: number): boolean {
  const now = new Date();
  const monthStart = new Date(selectedYear.value, monthIndex, 1);
  return monthStart < now && monthStart.getMonth() < now.getMonth();
}

function isDisabledMonth(monthIndex: number): boolean {
  return !hasEventInMonth(monthIndex);
}

function selectMonth(index: number) {
  selectedMonth.value = index;
  view.value = 'days';
}

onMounted(() => {
  fetchEvents();
});
</script>

<style scoped>
/* Add styles if needed */
</style>
