import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://127.0.0.1:8000/',  // Your Django backend URL
  baseURL: 'https://ai-assessment-engine.onrender.com/'
});

instance.defaults.xsrfCookieName = 'csrftoken';
instance.defaults.xsrfHeaderName = 'X-CSRFToken';
instance.defaults.withCredentials = true;

export default instance;