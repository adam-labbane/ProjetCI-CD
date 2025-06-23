import React, { useState, useEffect } from "react";
import API from "../services/api";

const UserDetails = ({ userId, adminEmail }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId && adminEmail) {
      API.get(`/users/${userId}?admin_email=${adminEmail}`)
        .then((res) => setUser(res.data))
        .catch((err) => console.error(err));
    }
  }, [userId, adminEmail]);

  if (!user) return null;

  return (
    <div>
      <h2>Détails de l’utilisateur</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default UserDetails;
