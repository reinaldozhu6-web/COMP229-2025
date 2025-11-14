import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../api/client.js';

const initialState = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
};

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    async function loadUser() {
      try {
        setLoading(true);
        const data = await apiRequest(`/users/${id}`);
        setValues({
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          email: data.email || '',
          password: '',
        });
      } catch (error) {
        console.error(error);
        alert('Failed to load user');
        navigate('/users');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id, isEdit, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        const payload = { ...values };
        if (!payload.password) {
          delete payload.password;
        }
        await apiRequest(`/users/${id}`, { method: 'PUT', body: payload });
      } else {
        await apiRequest('/users', { method: 'POST', body: values });
      }
      navigate('/users');
    } catch (error) {
      console.error(error);
      alert('Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading user...</p>;
  }

  return (
    <section>
      <h1>{isEdit ? 'Edit User' : 'New User'}</h1>
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
        <div>
          <label htmlFor="password">
            Password {isEdit && <small>(leave blank to keep unchanged)</small>}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            placeholder={isEdit ? '••••••••' : ''}
            {...(isEdit ? {} : { required: true })}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </button>{' '}
          <button type="button" onClick={() => navigate('/users')} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
