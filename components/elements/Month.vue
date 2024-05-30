<template>
  <div>
    <div v-if="view === 'months'">
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="(month, index) in months"
          :key="month"
          :class="{
            'bg-green-100 text-green-800': hasEventInMonth(index),
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
import { ref } from 'vue';
import DaysComponent from './Days.vue';

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
const events = ref([
  {
    id: '-56052247_13636',
    date: '2024-04-20',
    url: `'vk_post_-56052247_13636',
      -56052247,
      13636,
      'wkTnW8GTzftJZWKZdA0w9cRlp-Vx'`,
  },
  // Добавьте другие мероприятия здесь
]);

function hasEventInMonth(monthIndex: number): boolean {
  return events.value.some(
    (event) => new Date(event.date).getMonth() === monthIndex
  );
}

function isDisabledMonth(monthIndex: number): boolean {
  return !hasEventInMonth(monthIndex);
}

function selectMonth(index: number) {
  selectedMonth.value = index;
  view.value = 'days';
}
</script>

<style scoped>
/* Add styles if needed */
</style>
