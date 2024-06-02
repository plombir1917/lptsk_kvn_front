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

.error-content {
  background: white;
  padding: 40px 60px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

h1 {
  font-size: 3rem;
  color: #ff6b6b;
  margin-bottom: 20px;
}

p {
  font-size: 1.25rem;
  color: #555;
  margin-bottom: 40px;
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

.home-link:hover {
  background-color: #0056b3;
}
</style>
