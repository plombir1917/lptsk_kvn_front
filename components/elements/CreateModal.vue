<!-- components/DynamicModal.vue -->
<template>
  <div
    @click.self="handleClose"
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:text-gray-200"
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
          <template v-if="field.name === 'role'">
            <select
              v-model="formData[field.name]"
              :id="field.name"
              class="dark:text-white mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="EDITOR">Редактор</option>
              <option value="ADMIN">Администратор</option>
              <option value="DIRECTOR">Директор</option>
            </select>
          </template>
          <template v-else-if="field.name === 'photo'">
            <div v-if="photo" class="mt-2">
              <img :src="photoUrl" alt="Фото" class="w-32 h-32 rounded-full" />
            </div>
            <button
              type="button"
              @click="openPhotoModal"
              class="mt-1 w-full px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              Загрузить фото
            </button>
          </template>
          <template v-else>
            <input
              v-model="formData[field.name]"
              :type="field.type"
              :id="field.name"
              class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </template>
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

    <!-- Модалка для загрузки фото -->
    <div
      v-if="isPhotoModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closePhotoModal"
    >
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-1/2" @click.stop>
        <ImageUpload @save="savePhoto" @close="closePhotoModal" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import ImageUpload from '@/components/elements/ImageUpload.vue'; // Путь к вашему компоненту загрузки фото

const props = defineProps({
  isOpen: Boolean,
  title: String,
  fields: Array,
  initialData: Object,
});

const emits = defineEmits(['close', 'submit']);

const formData = ref({ ...props.initialData });
const isPhotoModalOpen = ref(false);

let photo;
let photoUrl;

function savePhoto(formData) {
  photo = formData.get('photo');
  photoUrl = URL.createObjectURL(photo);
  closePhotoModal();
}

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
  emits('submit', formData.value, photo);
}

function openPhotoModal() {
  isPhotoModalOpen.value = true;
}

function closePhotoModal() {
  isPhotoModalOpen.value = false;
}
</script>
