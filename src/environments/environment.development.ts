export const environment = {
  production: true,
  socketUrl:
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000/'
      : 'https://code-sharing-app-api.vercel.app/',
  apiUrl:
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api'
      : 'https://code-sharing-app-api.vercel.app/api',
};
