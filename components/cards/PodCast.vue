<template>
  <div
    class="lg:p-1 relative h-auto flex flex-col lg:rounded-2xl lg:bg-box-bg lg:shadow-lg lg:shadow-box-shadow lg:border lg:border-box-border"
  >
    <div class="relative h-max min-h-max">
      <nuxt-img
        :src="coverImage"
        alt="Cover image"
        width="280"
        class="w-full h-32 sm:h-36 md:h-40 lg:h-48 rounded-xl object-cover"
      />
    </div>
    <div
      class="lg:px-2 pt-2 lg:pb-4 xl:px-4 md:pt-4 h-full flex flex-col justify-between"
    >
      <div class="h-full">
        <h2
          class="font-semibold text-base md:text-lg lg:text-xl line-clamp-2 md:line-clamp-3 text-gray-700 dark:text-white"
        >
          {{ title }}
        </h2>
      </div>
      <div class="pt-3 sm:pt-5 min-h-max h-max" v-if="button">
        <button
          @click="openModal"
          class="flex relative group items-center text-white px-5 py-2 bg-blue-500 gap-1 text-sm w-max rounded-full"
        >
          <span
            class="absolute inset-0 rounded-full group-hover:scale-105 origin-center transition-all ease-in-out bg-blue-500"
          >
          </span>
          <span class="relative flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-3 h-3"
            >
              <path
                fill-rule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clip-rule="evenodd"
              />
            </svg>
            Смотреть
          </span>
        </button>
      </div>
    </div>
  </div>

  <transition name="modal">
    <div
      v-if="isModalOpen"
      class="fixed z-50 inset-0 flex items-center justify-center p-4"
    >
      <div
        @click="closeModal"
        class="absolute inset-0 bg-gray-900 opacity-50 z-40"
      ></div>

      <div
        class="relative z-50 bg-gray-700 p-1 rounded-lg max-w-screen-lg w-full h-auto md:w-3/4 md:h-3/4 overflow-hidden"
      >
        <iframe
          :src="videoUrl"
          title="VK video player"
          frameborder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          class="w-full h-64 md:h-full"
        ></iframe>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const { title, href, coverImage, button } = defineProps<{
  button: boolean;
  title: string;
  href: string;
  coverImage: string;
}>();

const isModalOpen = ref(false);
const videoUrl = ref(href);

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}
</script>
