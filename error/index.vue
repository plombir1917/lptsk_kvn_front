<template>
  <div class="error-page">
    <div class="error-content">
      <h1>{{ error.statusCode }}</h1>
      <p>{{ error.statusMessage }}</p>
      <NuxtLink to="/" class="home-link">На главную</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const error = useError();
</script>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  text-align: center;
  padding: 20px;
}

/* Dark mode styles */
.dark .error-page {
  background-color: #1a202c; /* Darker background for dark mode */
}

.error-content {
  background: white;
  padding: 40px 60px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

/* Dark mode styles */
.dark .error-content {
  background: #2d3748; /* Darker background for dark mode */
}

h1 {
  font-size: 3rem;
  color: #ff6b6b;
  margin-bottom: 20px;
}

/* Dark mode styles */
.dark h1 {
  color: #feb2b2; /* Slightly lighter red for dark mode */
}

p {
  font-size: 1.25rem;
  color: #555;
  margin-bottom: 40px;
}

/* Dark mode styles */
.dark p {
  color: #a0aec0; /* Lighter grey for dark mode */
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

/* Dark mode styles */
.dark .home-link {
  background-color: #3182ce; /* Slightly lighter blue for dark mode */
}

.home-link:hover {
  background-color: #0056b3;
}

/* Dark mode styles */
.dark .home-link:hover {
  background-color: #2b6cb0; /* Slightly lighter blue on hover for dark mode */
}
</style>
