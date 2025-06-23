import React, { useState } from "react";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import UserDetails from "./components/UserDetails";
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
    <div className="container">
      <h1>Gestion des utilisateurs</h1>
      <input
        placeholder="Ton email admin"
        value={adminEmail}
        onChange={(e) => setAdminEmail(e.target.value)}
      />
      <UserForm onCreated={() => setReload(!reload)} />
      <UserList onDelete={deleteUser} onSelect={setSelectedId} key={reload} />
      <UserDetails userId={selectedId} adminEmail={adminEmail} />
    </div>
  );
}

export default App;