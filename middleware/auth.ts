// middleware/auth.js

export default defineNuxtRouteMiddleware((to, from) => {
  try {
    let token;
    if (process.client) token = localStorage.getItem('access_token');
  } catch (e) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. Please log in to access this page.',
    });
  }
});
