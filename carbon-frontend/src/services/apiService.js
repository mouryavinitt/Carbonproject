import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/carbon';

const http = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const postCalculateFootprint = (data) => {
    return http.post('/calculate', data);
};

export default http;
