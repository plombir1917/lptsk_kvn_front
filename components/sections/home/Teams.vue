<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
const teams = ref([]);

async function fetchTeams() {
  const query = `
  query {
    getTeams {
      id
      name
      achievments
      home
      rate
      active
      photo
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
    if (response.ok && result.data && result.data.getTeams) {
      teams.value = result.data.getTeams.map((team) => ({
        ...team,
        isEditing: false,
      }));
    } else {
      console.error('При получении команд произошла ошибка:', result.errors);
      useToast().error(
        'При получении команд произошла ошибка. Пожалуйста попробуйте снова.'
      );
    }
  } catch (error) {
    console.error('Error fetching teams:', error);
    useToast().error(
      'Ошибка при получении команд. Пожалуйста попробуйте снова.'
    );
  }
}

onMounted(() => {
  fetchTeams();
});
</script>

<template>
  <section class="pt-16 relative" id="teams">
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
          <AtomsTitle texte="Наши команды" />
        </div>
        <div class="flex items-center min-w-max gap-5">
          <AtomsLinkBtn href="#" variant="primary"> Смотреть все </AtomsLinkBtn>
        </div>
      </div>
      <div
        class="grid grid-cols-2 items-stretch sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-8"
      >
        <CardsPodCast
          v-for="team in teams"
          :key="team.id"
          :button="false"
          :title="team.name"
          :href="'#'"
          :duration="''"
          :cover-image="team.photo"
          :category="team.home"
          :created-at="''"
          :description="team.achievements"
        />
      </div>
    </AtomsContainer>
  </section>
</template>
