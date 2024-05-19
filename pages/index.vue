<script setup lang="ts">
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
    <SectionsHomeHeroSection />
    <SectionsHomeLatestNews />
    <SectionsHomePopularEvents />
    <SectionsHomeTeams />
    <SectionsAboutPodux />
    <SectionsWhyUs />
    <SectionsCallToAction />
  </div>
</template>
