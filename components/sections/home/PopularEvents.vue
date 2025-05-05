<template>
  <section class="pt-16 relative" id="events">
    <div
      aria-hidden="true"
      class="absolute inset-y-0 w-44 left-0 hidden dark:flex"
    >
      <div
        class="h-full md:h-1/2 lg:h-full w-full bg-gradient-to-tr opacity-40 dark:blur-2xl dark:from-[#570cac] dark:opacity-20"
      ></div>
    </div>
    <div class="absolute top-14 inset-x-0 h-64 flex items-start">
      <div
        class="h-24 w-2/3 bg-gradient-to-br from-primary opacity-20 blur-2xl dark:from-[#570cac] dark:invisible dark:opacity-40"
      ></div>
      <div
        class="h-20 w-3/5 bg-gradient-to-r from-[#8cd66a] opacity-40 blur-2xl dark:from-[#670ccf] dark:opacity-40"
      ></div>
    </div>
    <AtomsContainer class-name="relative">
      <div class="flex justify-between pb-6 relative">
        <div>
          <AtomsTitle texte="Популярные мероприятия" />
        </div>
        <div class="flex items-center min-w-max gap-5">
          <AtomsLinkBtn
            href="https://vk.com/video/@hoodsovet"
            variant="primary"
            target="_blank"
          >
            Смотреть все
          </AtomsLinkBtn>
        </div>
      </div>
      <div
        class="grid grid-cols-2 items-stretch sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-8"
      >
        <CardsPodCast
          v-for="event in events"
          :key="event.id"
          :button="true"
          :title="event.name"
          :href="event.link"
          :cover-image="event.photo"
        />
      </div>
    </AtomsContainer>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const events = ref([]);

async function fetchEvents() {
  const query = `
  query {
    getEvents {
      id
      name
      date
      place
      description
      photo
      link
      created_at
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
    if (response.ok && result.data && result.data.getEvents) {
      events.value = result.data.getEvents.map((event) => ({
        ...event,
        date: new Date(event.date).toISOString().split('T')[0],
      }));
    } else {
      console.error(
        'При получении мероприятий произошла ошибка:',
        result.errors
      );
      useToast().error(
        `При получении мероприятий произошла ошибка. ${result.errors[0].message}`
      );
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    useToast().error(
      'Ошибка при получении мероприятий. Пожалуйста попробуйте снова.'
    );
  }
}

onMounted(() => {
  // fetchEvents();
});
</script>

<style scoped>
/* Добавьте стили, если необходимо */
</style>
