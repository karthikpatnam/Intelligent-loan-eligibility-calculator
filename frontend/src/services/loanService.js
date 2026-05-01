import api from './api';

export const calculateLoan = async (loanData) => {
    const response = await api.post('/api/calculate', loanData);
    return response.data;
};

export const getHistory = async () => {
    const response = await api.get('/api/history');
    return response.data;
};

export const saveHistory = async (historyData) => {
    const response = await api.post('/api/history', historyData);
    return response.data;
};
