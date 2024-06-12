<template>
  <div class="max-h-screen overflow-y-auto p-4">
    <h3 class="text-lg font-semibold text-center text-white mb-4">
      {{ monthName }}
    </h3>
    <div v-if="!selectedEvent">
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="day in daysInMonth"
          :key="day"
          :class="{
            'bg-green-100 text-green-800': isEventDay(day) && !isEventPast(day),
            'bg-yellow-100 text-yellow-800':
              isEventDay(day) && isEventPast(day),
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
      <div class="event-card">
        <img
          :src="selectedEvent.photo"
          alt="Event Photo"
          class="w-full h-64 object-cover rounded-t-lg"
        />
        <div class="p-4">
          <h2 class="text-2xl font-semibold mb-2">{{ selectedEvent.name }}</h2>
          <p class="text-gray-700 mb-2">{{ selectedEvent.description }}</p>
          <p class="text-gray-700 mb-2">
            <strong>Место:</strong> {{ selectedEvent.place }}
          </p>
          <p class="text-gray-700 mb-2">
            <strong>Дата:</strong> {{ selectedEvent.date }}
          </p>
          <div v-if="!isEventPastDay(selectedEvent.date)">
            <button
              @click="buyTicket(selectedEvent.link)"
              class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Купить билет
            </button>
          </div>
          <div v-else>
            <p class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">
              Мероприятие прошло
            </p>
          </div>
        </div>
      </div>
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
import { useToast } from 'vue-toastification';

const props = defineProps<{
  selectedMonth: number;
  selectedYear: number;
  events: Array<{
    id: string;
    date: string;
    url: string;
    name: string;
    description: string;
    place: string;
    photo: string;
    link: string;
  }>;
}>();

const daysInMonth = ref<number[]>([]);
const monthName = ref<string>('');
const selectedEvent = ref<{
  id: string;
  date: string;
  url: string;
  name: string;
  description: string;
  place: string;
  photo: string;
  link: string;
} | null>(null);

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

function isEventPast(day: number): boolean {
  const date = new Date(props.selectedYear, props.selectedMonth, day);
  return date < new Date();
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

function buyTicket(link: string) {
  window.open(link, '_blank');
}

function isEventPastDay(dateString: string): boolean {
  const eventDate = new Date(dateString);
  return eventDate < new Date();
}
</script>

<style scoped>
.event-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.event-card:hover {
  transform: translateY(-5px);
}

.event-card img {
  object-fit: cover;
}

.event-card div {
  padding: 1rem;
}
</style>
