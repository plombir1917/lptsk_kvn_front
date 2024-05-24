<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});
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
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        class="bg-box-bg dark:bg-gray-800 p-6 rounded-lg shadow-md hover:bg-blue-100 dark:hover:bg-blue-800"
      >
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Статистика
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-300">
          Некоторая интересная статистика.
        </p>
      </div>
      <div
        class="bg-box-bg dark:bg-gray-800 p-6 rounded-lg shadow-md hover:bg-blue-100 dark:hover:bg-blue-800"
      >
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Отчеты
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-300">Месячные отчеты.</p>
      </div>
      <div
        class="bg-box-bg dark:bg-gray-800 p-6 rounded-lg shadow-md hover:bg-blue-100 dark:hover:bg-blue-800"
      >
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Уведомления
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-300">
          Последние активности.
        </p>
      </div>
    </div>
  </div>
</template>
