export const environment = {
  production: false,
  socketUrl: window.location.hostname === 'localhost' ? 'http://localhost:3000/' : 'https://code-sharing-app-api.vercel.app/',
  apiUrl:
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api'
      : 'https://https://code-sharing-app-api.vercel.app/api',
};
