<template>
  <ElementsLoadingPage v-if="isLoading" />
  <div
    class="flex flex-col lg:flex-row h-screen bg-body dark:bg-gray-900 overflow-y-auto"
  >
    <!-- Sidebar -->
    <aside
      class="w-full lg:w-64 bg-box-bg dark:bg-gray-800 shadow-lg lg:flex lg:flex-col"
    >
      <div class="px-4 py-6">
        <img
          src="/kvn-logo-no-bg.png"
          alt="КВН Иконка"
          class="h-12 w-12 mx-auto lg:mx-0"
        />
        <nav class="mt-6">
          <ul>
            <li class="mt-3">
              <nuxt-link
                to="/admin"
                :class="[
                  'flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500',
                  isActiveRoute('/admin')
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-500'
                    : '',
                ]"
              >
                <HomeIcon class="w-5 h-5 mr-2" />
                Главная
              </nuxt-link>
            </li>
            <li v-if="role === 'DIRECTOR'" class="mt-3">
              <nuxt-link
                to="/admin/accounts"
                :class="[
                  'flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500',
                  isActiveRoute('/admin/accounts')
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-500'
                    : '',
                ]"
              >
                <IdentificationIcon class="w-5 h-5 mr-2" />
                Аккаунты
              </nuxt-link>
            </li>
            <li v-if="role === 'DIRECTOR' || role === 'ADMIN'" class="mt-3">
              <nuxt-link
                to="/admin/seasons"
                :class="[
                  'flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500',
                  isActiveRoute('/admin/seasons')
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-500'
                    : '',
                ]"
              >
                <SeasonIcon class="w-5 h-5 mr-2" />
                Сезоны
              </nuxt-link>
            </li>
            <li v-if="role === 'DIRECTOR' || role === 'ADMIN'" class="mt-3">
              <nuxt-link
                to="/admin/news"
                :class="[
                  'flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500',
                  isActiveRoute('/admin/news')
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-500'
                    : '',
                ]"
              >
                <NewspaperIcon class="w-5 h-5 mr-2" />
                Новости
              </nuxt-link>
            </li>
            <li v-if="role === 'DIRECTOR' || role === 'ADMIN'" class="mt-3">
              <nuxt-link
                to="/admin/events"
                :class="[
                  'flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500',
                  isActiveRoute('/admin/events')
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-500'
                    : '',
                ]"
              >
                <CalendarIcon class="w-5 h-5 mr-2" />
                Мероприятия
              </nuxt-link>
            </li>
            <li class="mt-3" v-if="role === 'DIRECTOR'">
              <nuxt-link
                to="/admin/organizers"
                :class="[
                  'flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500',
                  isActiveRoute('/admin/organizers')
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-500'
                    : '',
                ]"
              >
                <HandThumbUpIcon class="w-5 h-5 mr-2" />
                Организаторы
              </nuxt-link>
            </li>
            <li v-if="role === 'DIRECTOR' || role === 'EDITOR'" class="mt-3">
              <nuxt-link
                to="/admin/teams"
                :class="[
                  'flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500',
                  isActiveRoute('/admin/teams')
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-500'
                    : '',
                ]"
              >
                <UserGroupIcon class="w-5 h-5 mr-2" />
                Команды
              </nuxt-link>
            </li>
            <li v-if="role === 'DIRECTOR' || role === 'EDITOR'" class="mt-3">
              <nuxt-link
                to="/admin/members"
                :class="[
                  'flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500',
                  isActiveRoute('/admin/members')
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-500'
                    : '',
                ]"
              >
                <FaceSmileIcon class="w-5 h-5 mr-2" />
                Участники
              </nuxt-link>
            </li>
            <li v-if="role === 'DIRECTOR' || role === 'EDITOR'" class="mt-3">
              <nuxt-link
                to="/admin/activity"
                :class="[
                  'flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500',
                  isActiveRoute('/admin/activity')
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-500'
                    : '',
                ]"
              >
                <CalculatorIcon class="w-5 h-5 mr-2" />
                Активность
              </nuxt-link>
            </li>
            <li v-if="role === 'DIRECTOR' || role === 'EDITOR'" class="mt-3">
              <nuxt-link
                to="/admin/contests"
                :class="[
                  'flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500',
                  isActiveRoute('/admin/contests')
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-500'
                    : '',
                ]"
              >
                <ContestIcon class="w-5 h-5 mr-2" />
                Конкурсы
              </nuxt-link>
            </li>
            <li v-if="role === 'DIRECTOR' || role === 'ADMIN'" class="mt-3">
              <nuxt-link
                to="/admin/tickets"
                :class="[
                  'flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500',
                  isActiveRoute('/admin/tickets')
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-500'
                    : '',
                ]"
              >
                <TicketIcon class="w-5 h-5 mr-2" />
                Билеты
              </nuxt-link>
            </li>
            <li class="mt-3">
              <nuxt-link
                to="/admin/profile"
                :class="[
                  'flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-500',
                  isActiveRoute('/admin/profile')
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-500'
                    : '',
                ]"
              >
                <Cog6ToothIcon class="w-5 h-5 mr-2" />
                Настройки
              </nuxt-link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <header class="bg-box-bg dark:bg-gray-800 shadow">
        <div
          class="flex flex-col lg:flex-row items-center justify-between px-6 py-4"
        >
          <div class="flex items-center mb-4 lg:mb-0">
            <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Администрирование
            </h1>
          </div>
          <div
            class="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 items-center"
          >
            <ElementsThemeSwitcher />
            <nuxt-link
              to="/admin/profile"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Профиль
            </nuxt-link>
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
      <main class="flex-1 bg-body dark:bg-gray-900">
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
  CalendarIcon,
  NewspaperIcon,
  TicketIcon,
  IdentificationIcon,
  FaceSmileIcon,
  ArchiveBoxIcon as ContestIcon,
  StarIcon as SeasonIcon,
  HandThumbUpIcon,
  CalculatorIcon,
} from '@heroicons/vue/24/outline';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useState } from '#imports';

const isLoading = useState('isLoading', () => true);

const role = ref('');

const router = useRouter();
const route = useRoute();

// Функция для выхода
function logout() {
  localStorage.removeItem('access_token'); // Remove token from localStorage
  router.push('/'); // Redirect to login page
}

// Функция для проверки активного маршрута
function isActiveRoute(path) {
  return route.path === path;
}

// Получение профиля пользователя
const fetchProfile = async () => {
  const query = `
    query {
      getAccountByToken {
        role
      }
    }
  `;

  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(
      'https://lptsk-kvn-back.onrender.com/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      }
    );

    const result = await response.json();

    if (response.ok && result.data && result.data.getAccountByToken) {
      const account = result.data.getAccountByToken;
      role.value = account.role; // Сохраняем роль пользователя
    } else {
      alert(
        'Ошибка при получении данных профиля. Пожалуйста, попробуйте снова.'
      );
    }
  } catch (error) {
    alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
  }
};

// Получение данных профиля при монтировании компонента
onMounted(async () => {
  await fetchProfile();
  isLoading.value = false;
});

// Обновляем head для страницы
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
