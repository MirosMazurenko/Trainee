import axios from "axios";

axios.defaults.baseURL = `http://localhost:5159/api/`;
axios.defaults.withCredentials = true;

const responseBody = (response) => response.data;

const requests = {
    get: (url, params) => axios.get(url, { params }).then(responseBody),
    post: (url, body) => axios.post(url, body, {
        headers: { 'Content-Type': 'application/json' }
    }).then(responseBody),
    put: (url, body) => axios.put(url, body, {
        headers: { 'Content-Type': 'application/json' }
    }).then(responseBody),
    del: (url) => axios.delete(url).then(responseBody),
};

const Contacts = {
    getContacts: () => requests.get('contacts'),
    getContactById: (id) => requests.get(`contacts/${id}`),
    createContact: (contactDto) => requests.post('contacts', contactDto),
    updateContact: (id, contactDto) => requests.put(`contacts/${id}`, contactDto),
    deleteContact: (id) => requests.del(`contacts/${id}`),
    uploadContacts: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axios.post('contacts/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(responseBody);
    }
};

const agent = {
    Contacts
};

export default agent;