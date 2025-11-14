import { useEffect, useState } from 'react';
import { apiRequest } from '../api.js';

const initialFormState = {
  title: '',
  description: '',
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormState);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load services on mount
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

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingServiceId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (service) => {
    setFormData({
      title: service.title || '',
      description: service.description || '',
    });
    setEditingServiceId(service._id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (editingServiceId) {
        const updatedService = await apiRequest(`/services/${editingServiceId}`, {
          method: 'PUT',
          body: formData,
        });

        setServices((prev) =>
          prev.map((service) => (service._id === editingServiceId ? updatedService : service)),
        );
      } else {
        const createdService = await apiRequest('/services', {
          method: 'POST',
          body: formData,
        });

        setServices((prev) => [...prev, createdService]);
      }

      resetForm();
    } catch (error) {
      console.error(error);
      alert('Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await apiRequest(`/services/${id}`, { method: 'DELETE' });
      setServices((prev) => prev.filter((service) => service._id !== id));

      if (editingServiceId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete service');
    }
  };

  return (
    <main className="main">
      <div className="page-header">
        <h1>Services</h1>
        <p>Describe the services you provide to clients.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>{editingServiceId ? 'Edit Service' : 'Add Service'}</h2>
          {editingServiceId && (
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
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              className="form-input"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-input"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : editingServiceId ? 'Save changes' : 'Add service'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Service List</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading services…</p>
          ) : services.length === 0 ? (
            <p>No services found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
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
                        <div className="actions">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleEdit(service)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(service._id)}
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
