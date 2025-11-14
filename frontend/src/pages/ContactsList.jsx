import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client.js';

export default function ContactsList() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContacts() {
      try {
        setLoading(true);
        const data = await apiRequest('/contacts');
        setContacts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        alert('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    }

    loadContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await apiRequest(`/contacts/${id}`, { method: 'DELETE' });
      setContacts((prev) => prev.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete contact');
    }
  };

  if (loading) {
    return <p>Loading contacts...</p>;
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Contacts</h1>
        <button type="button" onClick={() => navigate('/contacts/new')}>
          New Contact
        </button>
      </div>
      {contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.firstname}</td>
                <td>{contact.lastname}</td>
                <td>{contact.email}</td>
                <td>
                  <button type="button" onClick={() => navigate(`/contacts/${contact._id}/edit`)}>
                    Edit
                  </button>{' '}
                  <button type="button" onClick={() => handleDelete(contact._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
