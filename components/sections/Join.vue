<template>
  <section class="py-20">
    <AtomsContainer>
      <div
        class="w-full relative py-8 md:py-10 px-6 md:px-8 rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-900 dark:to-body-color"
        id="join"
      >
        <div class="absolute right-0 top-0 h-full w-full flex justify-end">
          <span class="flex opacity-20">
            <span
              class="w-16 h-32 rounded-l-full flex bg-primary blur-2xl"
            ></span>
            <span
              class="w-16 h-32 rounded-r-full flex bg-[#f88fc2] blur-2xl mt-14"
            ></span>
          </span>
        </div>

        <div class="absolute left-0 bottom-0 h-full w-full flex items-end">
          <span class="flex opacity-20">
            <span
              class="w-16 h-32 rounded-l-full flex bg-primary blur-2xl"
            ></span>
            <span
              class="w-16 h-32 rounded-r-full flex bg-[#f88fc2] blur-2xl mt-14"
            ></span>
          </span>
        </div>
        <div class="mx-auto text-center max-w-xl md:max-w-2xl relative">
          <h2
            class="text-gray-800 pt-4 dark:text-white font-bold text-4xl md:text-5xl lg:text-6x"
          >
            Будь всегда в курсе актуальных новостей
            <span
              class="text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-[#6ac8d6]"
              >КВН твоего города</span
            >
          </h2>
          <p class="text-gray-600 dark:text-gray-300 pt-8 mx-auto max-w-xl">
            Получай первым приглашения на все мероприятия, участвуй в тренингах
            и держи руку на пульсе културы. Связь🤙🏻
          </p>
          <div class="mx-auto max-w-md sm:max-w-xl pt-10">
            <div id="VkIdSdkOneTap" ref="container"></div>
          </div>
        </div>
      </div>
    </AtomsContainer>
  </section>
</template>

<script lang="ts" setup>
import * as VKID from '@vkid/sdk';
import { ref, onMounted } from 'vue';

VKID.Config.set({
  app: 51926936, // Идентификатор приложения.
  redirectUrl: 'https://vk.com/plombir1917', // Адрес для перехода после авторизации.
  state: 'dj29fnsadjsd82...', // Произвольная строка состояния приложения.
});

// Создание экземпляра кнопки.
const oneTap = new VKID.OneTap();

// Получение контейнера из разметки.
const container = ref(null);
// Отрисовка кнопки в контейнере после монтирования компонента.
onMounted(() => {
  // Проверка наличия кнопки в разметке.
  if (container.value) {
    // Отрисовка кнопки в контейнере с именем приложения APP_NAME, светлой темой и на русском языке.
    oneTap.render({
      container: container.value,
      scheme: VKID.Scheme.LIGHT,
      lang: VKID.Languages.RUS,
    });
  }
});
</script>
