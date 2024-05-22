<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});
useHead({
  title: 'Липецкий КВН',
  meta: [
    {
      name: 'description',
      content: 'Сайт Липецкой официальной лиги МС КВН "Университетская"',
    },
  ],
  link: [{ rel: 'icon', type: 'image/png', href: '/kvn-icon.png' }],
});
</script>
<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Dashboard
    </h1>
    <p class="mt-4 text-gray-600 dark:text-gray-300">
      Welcome to the admin panel. Use the sidebar to navigate through the
      different sections.
    </p>
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        class="bg-box-bg dark:bg-gray-800 p-6 rounded-lg shadow-md hover:bg-blue-100 dark:hover:bg-blue-800"
      >
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Statistics
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-300">
          Some interesting stats.
        </p>
      </div>
      <div
        class="bg-box-bg dark:bg-gray-800 p-6 rounded-lg shadow-md hover:bg-blue-100 dark:hover:bg-blue-800"
      >
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Reports
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-300">Monthly reports.</p>
      </div>
      <div
        class="bg-box-bg dark:bg-gray-800 p-6 rounded-lg shadow-md hover:bg-blue-100 dark:hover:bg-blue-800"
      >
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Notifications
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-300">Recent activities.</p>
      </div>
    </div>
  </div>
</template>
