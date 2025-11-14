import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../api/client.js';

const initialState = {
  title: '',
  description: '',
};

export default function ServiceForm() {
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

    async function loadService() {
      try {
        setLoading(true);
        const data = await apiRequest(`/services/${id}`);
        setValues({
          title: data.title || '',
          description: data.description || '',
        });
      } catch (error) {
        console.error(error);
        alert('Failed to load service');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    }

    loadService();
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
        await apiRequest(`/services/${id}`, { method: 'PUT', body: values });
      } else {
        await apiRequest('/services', { method: 'POST', body: values });
      }
      navigate('/services');
    } catch (error) {
      console.error(error);
      alert('Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading service...</p>;
  }

  return (
    <section>
      <h1>{isEdit ? 'Edit Service' : 'New Service'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </button>{' '}
          <button type="button" onClick={() => navigate('/services')} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
