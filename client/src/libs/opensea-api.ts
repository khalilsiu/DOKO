import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.opensea.io/api/v1',
});

export default instance;
