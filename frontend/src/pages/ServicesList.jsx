import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client.js';

export default function ServicesList() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p>Loading services...</p>;
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Services</h1>
        <button type="button" onClick={() => navigate('/services/new')}>
          New Service
        </button>
      </div>
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
                  <button type="button" onClick={() => navigate(`/services/${service._id}/edit`)}>
                    Edit
                  </button>{' '}
                  <button type="button" onClick={() => handleDelete(service._id)}>
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
