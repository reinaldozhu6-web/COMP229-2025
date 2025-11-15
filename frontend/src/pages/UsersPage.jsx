import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest("/users");
        setUsers(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load users");
      }
    })();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser = await apiRequest("/users", {
        method: "POST",
        body: form,
      });
      setUsers((prev) => [...prev, newUser]);
      setForm({ firstname: "", lastname: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      await apiRequest(`/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">
            Manage the people who can access the application.
          </p>
        </div>
        {/* 这里先不用按钮做弹窗，简单点 */}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Add User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">First Name</label>
              <input
                className="form-input"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">Last Name</label>
              <input
                className="form-input"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add user"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>User List</h2>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Created</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5">No users yet.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.firstname}</td>
                    <td>{u.lastname}</td>
                    <td>{u.email}</td>
                    <td>
                      {u.created || u.createdAt
                        ? new Date(u.created || u.createdAt).toLocaleString()
                        : "—"}
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-ghost" type="button">
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => handleDelete(u._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
