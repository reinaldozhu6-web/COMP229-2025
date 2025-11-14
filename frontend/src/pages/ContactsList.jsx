import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';

function createInitialFormState() {
  return {
    firstname: '',
    lastname: '',
    email: '',
  };
}

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState(createInitialFormState());
  const [submitting, setSubmitting] = useState(false);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const created = await apiRequest('/contacts', {
        method: 'POST',
        body: formValues,
      });

      setContacts((prev) => (Array.isArray(prev) ? [...prev, created] : [created]));
      setFormValues(createInitialFormState());
    } catch (error) {
      console.error(error);
      alert('Failed to create contact');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading contacts...</p>;
  }

  return (
    <section>
      <h1>Contacts</h1>
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
                  <button type="button" onClick={() => handleDelete(contact._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: '2rem' }}>Add Contact</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstname">First Name</label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            value={formValues.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastname">Last Name</label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            value={formValues.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Add Contact'}
          </button>
        </div>
      </form>
    </section>
  );
}
