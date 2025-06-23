import React, { useState } from "react";
import API from "../services/api";

const UserForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    birthdate: "",
    city: "",
    zipcode: "",
    password: "",
    is_admin: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    API.post("/users", form)
      .then(() => {
        alert("Utilisateur ajouté !");
        onCreated(); // recharger la liste
      })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter un utilisateur</h2>
      {Object.keys(form).map((key) => (
        key !== "is_admin" ? (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={form[key]}
            onChange={handleChange}
          />
        ) : (
          <label key={key}>
            <input
              type="checkbox"
              name="is_admin"
              checked={form.is_admin}
              onChange={handleChange}
            />
            Admin ?
          </label>
        )
      ))}
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default UserForm;