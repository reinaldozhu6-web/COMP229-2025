import { useEffect, useState } from 'react';
import { apiRequest } from '../api.js';

const initialFormState = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormState);
  const [editingUserId, setEditingUserId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load all users when the page mounts
  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await apiRequest('/users');
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        alert('Failed to load users');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingUserId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (user) => {
    setFormData({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || '',
      password: '',
    });
    setEditingUserId(user._id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (editingUserId) {
        const payload = {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
        };

        if (formData.password) {
          payload.password = formData.password;
        }

        const updatedUser = await apiRequest(`/users/${editingUserId}`, {
          method: 'PUT',
          body: payload,
        });

        setUsers((prev) => prev.map((user) => (user._id === editingUserId ? updatedUser : user)));
      } else {
        const createdUser = await apiRequest('/users', {
          method: 'POST',
          body: formData,
        });

        setUsers((prev) => [...prev, createdUser]);
      }

      resetForm();
    } catch (error) {
      console.error(error);
      alert('Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await apiRequest(`/users/${id}`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((user) => user._id !== id));

      if (editingUserId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete user');
    }
  };

  return (
    <main className="main">
      <div className="page-header">
        <h1>Users</h1>
        <p>Manage the people who can access the application.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>{editingUserId ? 'Edit User' : 'Add User'}</h2>
          {editingUserId && (
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
            <label className="form-label" htmlFor="password">
              Password {editingUserId && <small>(leave blank to keep current password)</small>}
            </label>
            <input
              id="password"
              name="password"
              className="form-input"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={editingUserId ? '••••••••' : ''}
              {...(editingUserId ? {} : { required: true })}
            />
          </div>
          <div className="form-field">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : editingUserId ? 'Save changes' : 'Add user'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>User List</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading users…</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.firstname}</td>
                      <td>{user.lastname}</td>
                      <td>{user.email}</td>
                      <td>{user.created ? new Date(user.created).toLocaleString() : '—'}</td>
                      <td>
                        <div className="actions">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(user._id)}
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
