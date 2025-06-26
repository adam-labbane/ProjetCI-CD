import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import UserDetails from "./components/UserDetails";
import BlogPosts from "./components/BlogPosts"; // ✅ Nouveau
import API from "./services/api";
import './App.css';

function App() {
  const [reload, setReload] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [adminEmail, setAdminEmail] = useState("");

  const deleteUser = (id) => {
    if (!adminEmail) return alert("Renseigne ton email admin !");
    API.delete(`/users/${id}?admin_email=${adminEmail}`)
      .then(() => {
        alert("Utilisateur supprimé");
        setReload(!reload);
      })
      .catch((err) => alert("Suppression refusée : droits insuffisants"));
  };

  return (
    <Router>
      <div className="container">
        <h1>Mon Application</h1>
        <nav>
          <Link to="/">Utilisateurs</Link> |{" "}
          <Link to="/blog">Billets de blog</Link>
        </nav>
        <hr />

        <Routes>
          <Route path="/" element={
            <>
              <h2>Gestion des utilisateurs</h2>
              <input
                placeholder="Ton email admin"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
              <UserForm onCreated={() => setReload(!reload)} />
              <UserList onDelete={deleteUser} onSelect={setSelectedId} key={reload} />
              <UserDetails userId={selectedId} adminEmail={adminEmail} />
            </>
          } />
          <Route path="/blog" element={<BlogPosts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
