<template>
  <div class="flex h-screen bg-body dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="w-64 bg-box-bg dark:bg-gray-800 shadow-lg">
      <div class="px-4 py-6">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Admin
        </h2>
        <nav class="mt-6">
          <ul>
            <li class="mt-3">
              <nuxt-link
                to="/admin"
                class="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500"
              >
                <HomeIcon class="w-5 h-5 mr-2" />
                Dashboard
              </nuxt-link>
            </li>
            <li class="mt-3">
              <nuxt-link
                to="/admin/users"
                class="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500"
              >
                <UserGroupIcon class="w-5 h-5 mr-2" />
                Users
              </nuxt-link>
            </li>
            <li class="mt-3">
              <nuxt-link
                to="/admin/settings"
                class="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500"
              >
                <Cog6ToothIcon class="w-5 h-5 mr-2" />
                Settings
              </nuxt-link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-box-bg dark:bg-gray-800 shadow">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center">
            <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Admin Panel
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <ElementsThemeSwitcher />
            <button
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              @click="logout"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main
        class="flex-1 overflow-x-hidden overflow-y-auto bg-body dark:bg-gray-900"
      >
        <div class="container mx-auto px-6 py-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import {
  HomeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline';

// Функция для выхода
function logout() {
  // Здесь добавьте свою логику выхода
  console.log('Logout clicked');
}
</script>
