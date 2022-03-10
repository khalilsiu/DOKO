import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.opensea.io/api/v1',
});

instance.interceptors.request.use((config) => {
  config.headers['x-api-key'] = 'bea970cbbdae445a9f01b827f9ac227e';
  return config;
});

export default instance;
