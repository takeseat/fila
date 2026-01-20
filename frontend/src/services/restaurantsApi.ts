import api from './api';

export const restaurantsApi = {
    startTrial: async () => {
        const { data } = await api.post('/restaurants/trial/start');
        return data;
    }
};
