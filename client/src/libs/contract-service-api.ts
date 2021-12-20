import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_CONTRACT_SERVICE_API,
});

export default instance;
