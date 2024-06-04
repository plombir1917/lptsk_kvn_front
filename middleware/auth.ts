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
      statusMessage:
        'Не авторизован. Пожалуйста, войдите, чтобы получить доступ к этой странице.',
    });
  }
});
