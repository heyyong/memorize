import axios, { AxiosError } from 'axios';

const appId = '751158d8';
const appKey = '	14d4581556902e75921389cfa01c0a34';

const api = axios.create({
    baseURL: 'https://od-api.oxforddictionaries.com',
    headers: {
        app_id: appId,
        app_key: appKey,
    },
});

api.interceptors.response.use((response) => response, (err: AxiosError) => {
    const { data, status, headers } = err.response;
    const { baseURL, url } = err.response.config;

    throw new Error(`url=${baseURL}${url} ${status}`);
})

export const get = api.get;
export const post = api.post;

