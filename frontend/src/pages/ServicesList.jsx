import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';

function createInitialFormState() {
  return {
    title: '',
    description: '',
  };
}

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState(createInitialFormState());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const data = await apiRequest('/services');
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        alert('Failed to load services');
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await apiRequest(`/services/${id}`, { method: 'DELETE' });
      setServices((prev) => prev.filter((service) => service._id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete service');
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
      const created = await apiRequest('/services', {
        method: 'POST',
        body: formValues,
      });

      setServices((prev) => (Array.isArray(prev) ? [...prev, created] : [created]));
      setFormValues(createInitialFormState());
    } catch (error) {
      console.error(error);
      alert('Failed to create service');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading services...</p>;
  }

  return (
    <section>
      <h1>Services</h1>
      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td>{service.title}</td>
                <td>{service.description}</td>
                <td>
                  <button type="button" onClick={() => handleDelete(service._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: '2rem' }}>Add Service</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formValues.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Add Service'}
          </button>
        </div>
      </form>
    </section>
  );
}
