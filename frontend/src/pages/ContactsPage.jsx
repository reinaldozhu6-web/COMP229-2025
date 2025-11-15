import { useEffect, useState } from 'react';
import { apiRequest } from '../api.js';

const initialFormState = {
  firstname: '',
  lastname: '',
  email: '',
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormState);
  const [editingContactId, setEditingContactId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load contacts when the component mounts
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

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingContactId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (contact) => {
    setFormData({
      firstname: contact.firstname || '',
      lastname: contact.lastname || '',
      email: contact.email || '',
    });
    setEditingContactId(contact._id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (editingContactId) {
        const updatedContact = await apiRequest(`/contacts/${editingContactId}`, {
          method: 'PUT',
          body: formData,
        });

        setContacts((prev) =>
          prev.map((contact) => (contact._id === editingContactId ? updatedContact : contact)),
        );
      } else {
        const createdContact = await apiRequest('/contacts', {
          method: 'POST',
          body: formData,
        });

        setContacts((prev) => [...prev, createdContact]);
      }

      resetForm();
    } catch (error) {
      console.error(error);
      alert('Failed to save contact');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await apiRequest(`/contacts/${id}`, { method: 'DELETE' });
      setContacts((prev) => prev.filter((contact) => contact._id !== id));

      if (editingContactId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete contact');
    }
  };

  return (
    <main className="main">
      <div className="page-header">
        <h1>Contacts</h1>
        <p>Maintain the list of people reaching out to you.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>{editingContactId ? 'Edit Contact' : 'Add Contact'}</h2>
          {editingContactId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>
        <form className="card-body form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="firstname">
              First Name
            </label>
            <input
              id="firstname"
              name="firstname"
              className="form-input"
              type="text"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="lastname">
              Last Name
            </label>
            <input
              id="lastname"
              name="lastname"
              className="form-input"
              type="text"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              className="form-input"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : editingContactId ? 'Save changes' : 'Add contact'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Contact List</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading contacts…</p>
          ) : contacts.length === 0 ? (
            <p>No contacts found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
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
                        <div className="actions">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleEdit(contact)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(contact._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
