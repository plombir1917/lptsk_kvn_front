<template>
  <transition name="modal">
    <div>
      <AtomsLinkBtn
        href="#"
        @click.prevent="openModal"
        variant="costum"
        costum-span-class="px-6 md:px-7 hover:bg-primary/10"
        costum-text-color="text-blue-500"
        v-if="button"
      >
        <div class="flex items-center gap-3">
          <span class="p-2 rounded-full border border-blue-500">
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
          </span>

          <span> Смотреть видео </span>
        </div>
      </AtomsLinkBtn>

      <Teleport to="body">
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
      </Teleport>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Ref } from 'vue';

// Определение пропсов
const props = defineProps<{
  videoUrl: string;
  button: boolean;
}>();

const isModalOpen: Ref<boolean> = ref(false);

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}
</script>

<style scoped>
/* Добавьте стили, если необходимо */
</style>
