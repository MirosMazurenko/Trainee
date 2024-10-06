import { useState, useEffect } from 'react';
import agent from '../api/agent';
import './ContactTable.css';

const ContactTable = () => {
    const [contacts, setContacts] = useState([]);
    const [editingContact, setEditingContact] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            setError('');
            try {
                const fetchedContacts = await agent.Contacts.getContacts();
                if (Array.isArray(fetchedContacts)) {
                    setContacts(fetchedContacts);
                } else {
                    setContacts([]);
                }
            } catch (error) {
                console.error('Error fetching contacts:', error);
                setError('Error fetching contacts. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    const handleEdit = (contact) => {
        setEditingContact({ ...contact });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingContact((prev) => ({
            ...prev,
            [name]: name === 'married' ? (value === 'true') : value,
        }));
    };

    const handleUpdate = async () => {
        if (!editingContact.name) {
            setError('Name is required.');
            return;
        }

        try {
            await agent.Contacts.updateContact(editingContact.id, editingContact);
            setContacts((prevContacts) =>
                prevContacts.map((contact) => (contact.id === editingContact.id ? editingContact : contact))
            );
            setEditingContact(null);
            setError('');
        } catch (error) {
            console.error('Error updating contact:', error);
            setError('Error updating contact. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await agent.Contacts.deleteContact(id);
            setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
        } catch (error) {
            console.error('Error deleting contact:', error);
            setError('Error deleting contact. Please try again.');
        }
    };

    const filteredContacts = contacts.filter((contact) =>
        Object.values(contact).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedContacts = filteredContacts.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === 'object' && aValue instanceof Date) {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const toggleSortDirection = (field) => {
        if (sortField === field) {
            setSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortArrow = (field) => {
        if (sortField === field) {
            return sortDirection === 'asc' ? '▲' : '▼';
        }
        return '';
    };

    return (
        <div className="table-container">
            {loading && <p>Loading contacts...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th onClick={() => toggleSortDirection('name')}>Name {getSortArrow('name')}</th>
                        <th onClick={() => toggleSortDirection('dateOfBirth')}>Date of Birth {getSortArrow('dateOfBirth')}</th>
                        <th onClick={() => toggleSortDirection('married')}>Married {getSortArrow('married')}</th>
                        <th onClick={() => toggleSortDirection('phone')}>Phone {getSortArrow('phone')}</th>
                        <th onClick={() => toggleSortDirection('salary')}>Salary {getSortArrow('salary')}</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedContacts.map((contact) => {
                        const { id, name, dateOfBirth, married, phone, salary } = contact;
                        return (
                            <tr key={id}>
                                <td>
                                    {editingContact?.id === id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editingContact.name}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        name
                                    )}
                                </td>
                                <td>
                                    {editingContact?.id === id ? (
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={editingContact.dateOfBirth.slice(0, 10)}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        new Date(dateOfBirth).toLocaleDateString()
                                    )}
                                </td>
                                <td>
                                    {editingContact?.id === id ? (
                                        <select
                                            name="married"
                                            value={editingContact.married ? 'true' : 'false'}
                                            onChange={handleInputChange}
                                        >
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    ) : (
                                        (married ? 'Yes' : 'No')
                                    )}
                                </td>
                                <td>
                                    {editingContact?.id === id ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={editingContact.phone}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        phone
                                    )}
                                </td>
                                <td>
                                    {editingContact?.id === id ? (
                                        <input
                                            type="number"
                                            name="salary"
                                            value={editingContact.salary}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(salary)
                                    )}
                                </td>
                                <td>
                                    {editingContact?.id === id ? (
                                        <button onClick={handleUpdate}>Save</button>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(contact)}>Edit</button>
                                            <button onClick={() => handleDelete(id)}>Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ContactTable;