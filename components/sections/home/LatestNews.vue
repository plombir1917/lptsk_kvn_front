<template>
  <section class="pt-20 md:pt-24 relative">
    <AtomsContainer>
      <div class="flex justify-between items-center pb-6">
        <div class="">
          <AtomsTitle texte="Последние новости" />
        </div>
        <div class="flex items-center min-w-max relative">
          <AtomsLinkBtn href="https://vk.com/hoodsovet" variant="primary">
            Узнать больше
          </AtomsLinkBtn>
        </div>
      </div>
      <div class="relative">
        <!--  -->
        <div
          class="flex absolute top-1/2 -left-5 -translate-y-1/2 z-10 transition duration-300 ease-linear"
          :class="prevIsVisible ? 'visible opacity-100' : 'insisible opacity-0'"
        >
          <AtomsSwiperNavButton @click="scrollToLeft()">
            <IconsPrevIco />
          </AtomsSwiperNavButton>
        </div>
        <!--  -->
        <div
          class="flex absolute top-1/2 -right-5 -translate-y-1/2 z-10 transition duration-300 ease-linear"
          :class="nextIsVisible ? 'visible opacity-100' : 'insisible opacity-0'"
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
            class="w-11/12 min-w-[91.666667%] xs:w-80 xs:min-w-[20rem] md:w-1/3 md:min-w-[33.333333%] lg:w-1/4 lg:min-w-[25%]"
          >
            <CardsRecentPod
              title="Результаты фестиваля открытия сезона 2024"
              duration="23min"
              href="#"
              cover-image="/images/festival24.jpg"
            />
          </div>

          <div
            class="w-11/12 min-w-[91.666667%] xs:w-80 xs:min-w-[20rem] md:w-1/3 md:min-w-[33.333333%] lg:w-1/4 lg:min-w-[25%]"
          >
            <CardsRecentPod
              title="РОДИТЬСЯ В МАЕ - ВОТ ОНО ВЕЗЕНИЕ!"
              duration="1h:22min"
              href="#"
              cover-image="/images/jeka.jpg"
            />
          </div>

          <div
            class="w-11/12 min-w-[91.666667%] xs:w-80 xs:min-w-[20rem] md:w-1/3 md:min-w-[33.333333%] lg:w-1/4 lg:min-w-[25%]"
          >
            <CardsRecentPod
              title="Обсуждение Студеческой весны 2024. Мы начинаем!"
              duration="12min"
              href="#"
              cover-image="/images/studvesna.jpg"
            />
          </div>

          <div
            class="w-11/12 min-w-[91.666667%] xs:w-80 xs:min-w-[20rem] md:w-1/3 md:min-w-[33.333333%] lg:w-1/4 lg:min-w-[25%]"
          >
            <CardsRecentPod
              title="Билеты на фестиваль!"
              duration="50min"
              href="#"
              cover-image="/images/tickets.jpg"
            />
          </div>
        </div>
      </div>
    </AtomsContainer>
  </section>
</template>

<script lang="ts" setup>
// const scrollLeft = useState('scrollLeft', ()=> 0)
const nextIsVisible = useState('nextIsVisible', () => false);
const prevIsVisible = useState('prevIsVisible', () => false);

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
  if (window !== null) {
    initScroll();
  }
});
</script>