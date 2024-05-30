<template>
  <div class="max-h-screen overflow-y-auto">
    <h3 class="text-lg font-semibold text-center text-white mb-4">
      {{ monthName }}
    </h3>
    <div v-if="!selectedEvent">
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="day in daysInMonth"
          :key="day"
          :class="{
            'bg-green-100 text-green-800': isEventDay(day),
            'bg-blue-100': !isEventDay(day),
            'p-2 rounded-lg text-center cursor-pointer hover:bg-blue-200': true,
            'opacity-50 cursor-not-allowed': isDisabled(day),
          }"
          @click="!isDisabled(day) && selectDay(day)"
        >
          {{ day }}
        </div>
      </div>
      <button
        @click="goBack"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Назад
      </button>
    </div>
    <div v-else>
      <div id="vk_post_-56052247_13636"></div>
      <button
        @click="clearEvent"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Назад
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
  selectedMonth: number;
  selectedYear: number;
  events: Array<{ id: string; date: string; url: string }>;
}>();

const daysInMonth = ref<number[]>([]);
const monthName = ref<string>('');
const selectedEvent = ref<{ id: string; date: string; url: string } | null>(
  null
);

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

function calculateDaysInMonth(monthIndex: number, year: number) {
  const days = new Date(year, monthIndex + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => i + 1);
}

function isEventDay(day: number): boolean {
  const dateString = `${props.selectedYear}-${(props.selectedMonth + 1)
    .toString()
    .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  return props.events.some((event) => event.date === dateString);
}

function isDisabled(day: number): boolean {
  return !isEventDay(day);
}

function selectDay(day: number) {
  const dateString = `${props.selectedYear}-${(props.selectedMonth + 1)
    .toString()
    .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const event = props.events.find((event) => event.date === dateString);
  if (event) {
    selectedEvent.value = event;
    console.log(selectedEvent.value);
    loadVKPost(event.id);
  }
}

function clearEvent() {
  selectedEvent.value = null;
}

watch(
  () => props.selectedMonth,
  (newMonth) => {
    daysInMonth.value = calculateDaysInMonth(newMonth, props.selectedYear);
    monthName.value = months[newMonth];
  },
  { immediate: true }
);

const emit = defineEmits(['back']);

function goBack() {
  emit('back');
}

function loadVKPost(id: string) {
  const first = id.split('_')[0];
  const second = id.split('_')[1];
  console.log(+first, +second);
  const script = document.createElement('script');
  script.src = 'https://vk.com/js/api/openapi.js?173';
  script.onload = () => {
    VK.Widgets.Post(
      `vk_post_${id}`,
      +first,
      +second,
      'wkTnW8GTzftJZWKZdA0w9cRlp-Vx'
    );
  };
  document.body.appendChild(script);
}
</script>

<style scoped>
/* Add styles if needed */
</style>
