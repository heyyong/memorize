import axios, { AxiosError } from 'axios';

const accessKey = '1o1YvxjYOb05LJHG4D0NpvZFeQncfVaQy2pKdojub63gx66fUpTV6OiBtds4Tk79';
const baseURL = 'dictionary.cambridge.org';

const api = axios.create({
    baseURL: 'https://' + baseURL + '/api/v1',
    headers: {
        'accessKey': accessKey,
        'content-type': 'application/json',
    },
});

api.interceptors.response.use(a => a, (err) => {
    const { response } = err;
    throw new Error(`errorCode=${response.data.errorCode}, errorMessage=${response.data.errorMessage}, httpCode=${response.status}`);
});

export const get = api.get;
export const post = api.post;