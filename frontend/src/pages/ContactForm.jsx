import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createContact, getContact, updateContact } from '../api/index.js';

const initialState = {
  firstname: '',
  lastname: '',
  email: '',
};

export default function ContactForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    async function fetchContact() {
      try {
        const data = await getContact(id);
        setValues({
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          email: data.email || '',
        });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load contact');
      } finally {
        setLoading(false);
      }
    }

    fetchContact();
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        await updateContact(id, values);
      } else {
        await createContact(values);
      }
      navigate('/contacts');
    } catch (err) {
      setError(err.message || 'Failed to save contact');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading contact...</p>;
  }

  return (
    <section>
      <h1>{isEdit ? 'Edit Contact' : 'New Contact'}</h1>
      {error && (
        <p role="alert" style={{ color: 'red' }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstname">First Name</label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            value={values.firstname}
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
            value={values.lastname}
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
            value={values.email}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </button>{' '}
          <button type="button" onClick={() => navigate('/contacts')} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
