import axios, { AxiosError } from 'axios';

const accessKey = '';
const baseURL = 'dictionary.cambridge.org';

const api = axios.create({
    baseURL: 'https://' + baseURL + '/api/v1',
    headers: {
        'accessKey': accessKey,
        'content-type': 'application/json',
    },
});

export const get = api.get;
export const post = api.post;