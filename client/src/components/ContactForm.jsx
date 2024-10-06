import { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
    const [csvFile, setCsvFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type !== 'text/csv') {
            alert('Please upload a valid CSV file.');
            setCsvFile(null);
        } else {
            setCsvFile(file);
        }
    };

    const handleUpload = async () => {
        if (!csvFile) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            const response = await axios.post('http://localhost:5159/api/contacts/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept=".csv" />
            <button onClick={handleUpload}>Upload CSV</button>
        </div>
    );
};

export default ContactForm;