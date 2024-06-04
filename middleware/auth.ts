import { defineNuxtRouteMiddleware, useState } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
  try {
    const isLoading = useState('isLoading', () => true);

    if (process.client) {
      isLoading.value = true;
      const token = localStorage.getItem('access_token');

      if (!token) throw new Error();
      isLoading.value = false;
    }
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. Please log in to access this page.',
    });
  }
});
