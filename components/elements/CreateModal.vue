<!-- components/DynamicModal.vue -->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-1/3">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ title }}
      </h2>
      <form @submit.prevent="handleSubmit">
        <div v-for="field in fields" :key="field.name" class="mb-4">
          <label
            :for="field.name"
            class="block text-gray-700 dark:text-gray-300"
            >{{ field.label }}</label
          >
          <input
            v-model="formData[field.name]"
            :type="field.type"
            :id="field.name"
            class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="flex justify-end space-x-2">
          <button
            @click="handleClose"
            type="button"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            Отмена
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  title: String,
  fields: Array,
  initialData: Object,
});

const emits = defineEmits(['close', 'submit']);

const formData = ref({ ...props.initialData });

watch(
  () => props.initialData,
  (newData) => {
    formData.value = { ...newData };
  }
);

function handleClose() {
  emits('close');
}

function handleSubmit() {
  emits('submit', formData.value);
}
</script>
