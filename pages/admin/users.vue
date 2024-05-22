<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Users
    </h1>
    <p class="mt-4 text-gray-600 dark:text-gray-300">Manage your users here.</p>
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        class="bg-box-bg dark:bg-gray-800 p-6 rounded-lg shadow-md hover:bg-blue-100 dark:hover:bg-blue-800"
      >
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          User List
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-300">View all users.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
});
</script>
