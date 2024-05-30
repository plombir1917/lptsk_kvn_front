<template>
  <transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2
          class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4"
        >
          Календарь мероприятий
        </h2>
        <CalendarComponent @monthSelected="handleMonthSelected" />
        <div class="flex justify-end mt-4">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import CalendarComponent from './Month.vue';

const props = defineProps<{
  isOpen: boolean;
  closeModal: () => void;
}>();

function handleMonthSelected(month: string) {
  console.log('Selected month:', month);
  props.closeModal();
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter, .modal-leave-to /* .modal-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
