export const environment = {
  production: false,
  socketUrl: window.location.hostname === 'localhost' ? 'http://localhost:3000/socket' : 'https://code-sharing-app-api.vercel.app//socket',
  apiUrl:
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api'
      : 'https://https://code-sharing-app-api.vercel.app//api',
};
