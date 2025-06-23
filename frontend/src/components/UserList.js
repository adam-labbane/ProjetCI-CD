import React, { useEffect, useState } from "react";
import API from "../services/api";

const UserList = ({ onDelete, onSelect }) => {
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.firstname} {user.lastname} ({user.email})
            <button onClick={() => onDelete(user.id)}>Supprimer</button>
            <button onClick={() => onSelect(user.id)}>Voir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
