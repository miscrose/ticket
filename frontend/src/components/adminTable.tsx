import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "./ui/table";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const roles = ["user", "admin"];

export default function AdminTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/allUsers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        });
        setUsers(res.data.users || res.data); // adapte selon la structure de la réponse
      } catch (err) {
       
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/user/${userId}/role`, { role: newRole }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      setUsers(users =>
        users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      // gestion d'erreur
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Nom</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Rôle</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <select
                value={user.role}
                onChange={e => handleRoleChange(user.id, e.target.value)}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </TableCell>
            <TableCell>
              {/* Tu peux ajouter d'autres actions ici */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}