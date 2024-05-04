/* eslint-disable no-param-reassign */

import axios from 'axios';
import { getAccessToken } from '../auth/server';

const baseUrl = 'https://jannatandsadaf.com/api/';

const serverInstance = axios.create({
    baseURL: baseUrl,
    // withCredentials: true,
});

serverInstance.interceptors.request.use(async (config) => {
    const token = await getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default serverInstance;
