import axios from 'axios';

const baseUrl = 'http://localhost:3000/api';

const serverInstance = axios.create({
    baseURL: baseUrl,
});

export default serverInstance;
