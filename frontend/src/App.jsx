import { useEffect, useState } from "react";
import { apiRequest } from "./api";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // 页面加载时从后端拿 /users
  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest("/users"); // => http://localhost:3000/users
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

  // 提交表单：新增一个 user
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

  // 删除
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
    <div style={{ padding: "1rem" }}>
      <h1>Users (Frontend + Backend Test)</h1>

      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="firstname"
            placeholder="First name"
            value={form.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="lastname"
            placeholder="Last name"
            value={form.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>

      <h2>User List</h2>
      {users.length === 0 ? (
        <p>No users yet.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>First</th>
              <th>Last</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.firstname}</td>
                <td>{u.lastname}</td>
                <td>{u.email}</td>
                <td>
                  { }
                  <button onClick={() => handleDelete(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
