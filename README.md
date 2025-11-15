# COMP229-2025 – Portfolio Management Dashboard

This repository contains my COMP229 Assignment 3 project:  
a full-stack Portfolio Management Dashboard built with **Node.js + Express + MongoDB** on the backend and **React + Vite** on the frontend.

The application allows basic CRUD management for:

- Users  
- Projects  
- Services  
- Contacts  

All data is stored in MongoDB and exposed via a RESTful API.  
The React dashboard consumes this API and displays the data in a clean, responsive UI.

---

## 1. Technology Stack

**Backend**

- Node.js
- Express
- MongoDB + Mongoose
- RESTful API design
- Environment variables using `.env`

**Frontend**

- React (Vite)
- React Router (`react-router-dom`)
- Fetch API via a small `apiRequest` helper
- Custom CSS (no UI frameworks, just modern dashboard-style styling)

---

## 2. Project Structure

```text
COMP229-2025/
├─ app/
│  ├─ models/          # Mongoose schemas (User, Project, Service, Contact)
│  ├─ routes/          # Express routers for each resource
│  └─ controllers/     # (If used) business logic for each route
├─ config/
│  └─ db.js            # MongoDB connection configuration
├─ frontend/
│  ├─ index.html
│  ├─ package.json
│  ├─ vite.config.js
│  └─ src/
│     ├─ api.js        # apiRequest() helper for calling the backend
│     ├─ App.jsx       # Main layout + routing (Dashboard shell)
│     ├─ index.css     # Dashboard styling (sidebar, cards, tables, forms)
│     └─ pages/
│        ├─ UsersPage.jsx
│        ├─ ProjectsPage.jsx
│        ├─ ServicesPage.jsx
│        └─ ContactsPage.jsx
├─ index.js            # Express server entry point
├─ package.json        # Backend dependencies & scripts
└─ README.md
````

> Note: The exact file names in `app/` may differ slightly depending on the implementation,
> but each resource (users, projects, services, contacts) has its own router and model.

---

## 3. Features

### 3.1 Users

* List all users
* Create a new user
* (Optional) Edit an existing user
* Delete a user

Typical fields:

* `firstname`
* `lastname`
* `email`
* `password`
* `created` (timestamp / createdAt)

### 3.2 Projects

* List all projects
* Create a new project
* Edit a project
* Delete a project

Typical fields:

* `title`
* `completion` (Date)
* `description`

### 3.3 Services

* List all services
* Create a service
* Edit a service
* Delete a service

Typical fields:

* `title`
* `description`

### 3.4 Contacts

* List all contacts
* Create a contact
* Edit a contact
* Delete a contact

Typical fields:

* `firstname`
* `lastname`
* `email`

---

## 4. Backend – Setup & Running

### 4.1 Prerequisites

* Node.js and npm installed
* A running MongoDB instance (local or cloud, e.g. MongoDB Atlas)

### 4.2 Environment Variables

Create a `.env` file in the **backend root** (`COMP229-2025/`):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/comp229-portfolio
# or your MongoDB Atlas connection string
```

> The code expects the backend to run on **[http://localhost:3000](http://localhost:3000)** and
> the API base path is `/api` (e.g. `http://localhost:3000/api/users`).

### 4.3 Install Dependencies

From the backend root:

```bash
cd COMP229-2025
npm install
```

### 4.4 Run the Server

```bash
npm start
```

You should see something like:

```text
🚀 Server running at http://localhost:3000
✅ Connected to MongoDB
```

---

## 5. Frontend – Setup & Running

### 5.1 Configure API Base URL

In `frontend/.env` (inside the frontend folder):

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

The frontend uses this variable in `src/api.js` to build all API URLs, for example:

* `apiRequest('/users')` → `http://localhost:3000/api/users`
* `apiRequest('/projects')` → `http://localhost:3000/api/projects`

### 5.2 Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 5.3 Run the Frontend Dev Server

```bash
npm run dev
```

Vite will show a local URL (usually `http://localhost:5173`).
Open it in the browser and you should see the dashboard layout.

---

## 6. Frontend Architecture

### 6.1 Routing

`src/App.jsx` defines the main layout and routes:

* A left sidebar with navigation links:

  * `/users`
  * `/projects`
  * `/services`
  * `/contacts`

* A right content area that renders one of the following pages:

  * `<UsersPage />`
  * `<ProjectsPage />`
  * `<ServicesPage />`
  * `<ContactsPage />`

Routing is implemented using **React Router (`react-router-dom`)**.

### 6.2 Data Fetching

`src/api.js` contains a helper:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export async function apiRequest(path, { method = "GET", body } = {}) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text}`);
  }

  return res.json();
}
```

Each page uses this function to call the backend:

* `apiRequest('/users')`
* `apiRequest('/projects')`
* `apiRequest('/services')`
* `apiRequest('/contacts')`

---

## 7. API Endpoints (Summary)

Base URL: `http://localhost:3000/api`

### Users

* `GET /users` – get all users
* `POST /users` – create a user
* `PUT /users/:id` – update a user
* `DELETE /users/:id` – delete a user

### Projects

* `GET /projects`
* `POST /projects`
* `PUT /projects/:id`
* `DELETE /projects/:id`

### Services

* `GET /services`
* `POST /services`
* `PUT /services/:id`
* `DELETE /services/:id`

### Contacts

* `GET /contacts`
* `POST /contacts`
* `PUT /contacts/:id`
* `DELETE /contacts/:id`

---

## 8. Screenshots (for Assignment Submission)

> Replace the placeholders with actual screenshots when submitting.

* **Dashboard – Users Page**
 ![alt text](User.png)
* **Projects Page**
![alt text](Register-1.png)

* **Services Page**
![alt text](Service.png)

* **Contacts Page**
![alt text](Contanct.png)

* **MongoDB Collections**
![alt text](Mongo.png)

---

## 9. How to Run Both Servers Together

1. Start MongoDB (local or ensure your Atlas cluster is running).

2. In one terminal (backend):

   ```bash
   cd COMP229-2025
   npm start
   ```

3. In another terminal (frontend):

   ```bash
   cd COMP229-2025/frontend
   npm run dev
   ```

4. Open the frontend URL (e.g. `http://localhost:5173`) in the browser.

You should be able to:

* Create users, projects, services, and contacts in the React UI
* See the data saved in MongoDB collections
* Edit or delete existing records

---

## 10. Notes

* This project is for **Centennial College – COMP229 (Web Application Development)**.
* The focus is on practicing:

  * Full-stack development with Node/Express and React
  * RESTful API design
  * MongoDB integration
  * Basic UI/UX design for dashboards

