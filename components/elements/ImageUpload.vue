<template>
  <div>
    <FilePond
      ref="pond"
      name="photo"
      label-idle="Перетащите изображение или <span class='filepond--label-action'>Выберите файл</span>"
      :accepted-file-types="acceptedFileTypes"
      allow-multiple="false"
      @addfile="handleAddFile"
      @removefile="handleRemoveFile"
    />
    <button
      @click="saveImage"
      class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
    >
      Сохранить фото
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

const acceptedFileTypes = ['image/*'];

const FilePond = vueFilePond();
const emit = defineEmits(['save', 'close']);
const file = ref(null);

const handleAddFile = (error, fileItem) => {
  if (!error) {
    file.value = fileItem.file;
    console.log('File added:', file.value);
  } else {
    console.error('Error processing file:', error);
  }
};

const handleRemoveFile = () => {
  file.value = null;
};

const saveImage = async () => {
  if (file.value && file.value instanceof File) {
    try {
      const formData = new FormData();
      formData.append('photo', file.value, file.value.name);
      console.log('FormData:', formData);
      emit('save', formData);
      emit('close');
    } catch (error) {
      console.error('Ошибка сохранения изображения:', error);
    }
  } else {
    console.warn('Файл не выбран или не является объектом File.');
  }
};
</script>
