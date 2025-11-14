import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createService, getService, updateService } from '../api/index.js';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    async function fetchService() {
      try {
        const data = await getService(id);
        setValues({
          title: data.title || '',
          description: data.description || '',
        });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load service');
      } finally {
        setLoading(false);
      }
    }

    fetchService();
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
        await updateService(id, values);
      } else {
        await createService(values);
      }
      navigate('/services');
    } catch (err) {
      setError(err.message || 'Failed to save service');
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
      {error && (
        <p role="alert" style={{ color: 'red' }}>
          {error}
        </p>
      )}
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
