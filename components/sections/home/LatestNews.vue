<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const newsList = ref([]);
const nextIsVisible = useState('nextIsVisible', () => false);
const prevIsVisible = useState('prevIsVisible', () => false);

async function fetchNews() {
  const query = `
  query {
    getNews {
      id
      title
      link
      photo
      season_id
    }
  }
  `;
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    if (response.ok && result.data && result.data.getNews) {
      newsList.value = result.data.getNews;
    } else {
      console.error('При получении новостей произошла ошибка:', result.errors);
      useToast().error(
        `При получении новостей произошла ошибка. ${result.errors[0].message}`
      );
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    useToast().error(
      'Ошибка при получении новостей. Пожалуйста попробуйте снова.'
    );
  }
}

let element: HTMLDivElement;
if (typeof document !== 'undefined') {
  element = document.querySelector('[data-slide-recent]') as HTMLDivElement;
}

function initScroll(): void {
  if (typeof element === 'undefined' || element === null) {
    return;
  }
  prevIsVisible.value = element.scrollLeft <= 0 ? false : true;
  nextIsVisible.value =
    element.scrollLeft >= element.scrollWidth - element.offsetWidth - 1
      ? false
      : true;
}

function scrollToLeft(): void {
  if (typeof element === 'undefined' || element === null) {
    return;
  }
  element.scrollLeft -= element.clientWidth;
}

function scrollToRight(): void {
  if (typeof element === 'undefined' || element === null) {
    return;
  }
  element.scrollLeft += element.clientWidth;
}

onMounted(() => {
  fetchNews();
  if (window !== null) {
    initScroll();
  }
});
</script>

<template>
  <section class="pt-20 md:pt-24 relative" id="news">
    <AtomsContainer>
      <div class="flex justify-between items-center pb-6">
        <div>
          <AtomsTitle texte="Последние новости" />
        </div>
        <div class="flex items-center min-w-max relative">
          <AtomsLinkBtn
            href="https://vk.com/hoodsovet"
            target="_blank"
            variant="primary"
          >
            Узнать больше
          </AtomsLinkBtn>
        </div>
      </div>
      <div class="relative">
        <div
          class="flex absolute top-1/2 -left-5 -translate-y-1/2 z-10 transition duration-300 ease-linear"
          :class="prevIsVisible ? 'visible opacity-100' : 'invisible opacity-0'"
        >
          <AtomsSwiperNavButton @click="scrollToLeft()">
            <IconsPrevIco />
          </AtomsSwiperNavButton>
        </div>
        <div
          class="flex absolute top-1/2 -right-5 -translate-y-1/2 z-10 transition duration-300 ease-linear"
          :class="nextIsVisible ? 'visible opacity-100' : 'invisible opacity-0'"
        >
          <AtomsSwiperNavButton @click="scrollToRight()">
            <IconsNextIco />
          </AtomsSwiperNavButton>
        </div>

        <div
          data-slide-recent
          @scroll="initScroll()"
          class="flex items-stretch gap-5 overflow-hidden overflow-x-auto invisible-scroll"
        >
          <div
            v-for="news in newsList"
            :key="news.id"
            class="w-11/12 min-w-[91.666667%] xs:w-80 xs:min-w-[20rem] md:w-1/3 md:min-w-[33.333333%] lg:w-1/4 lg:min-w-[25%]"
          >
            <CardsRecentPod
              :title="news.title"
              :duration="''"
              :href="news.link"
              :cover-image="news.photo"
            />
          </div>
        </div>
      </div>
    </AtomsContainer>
  </section>
</template>
