import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://cdn-data.decentraland.org',
});

export default instance;
