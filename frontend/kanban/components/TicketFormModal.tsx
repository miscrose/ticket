import React, { useEffect, useState } from "react";
import { Button } from "../../src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,

  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/ui/dialog";
import { Input } from "../../src/components/ui/input";
import { Label } from "../../src/components/ui/label";
import axios from "axios";
import { SelectBox } from "./selectBox";
import type { selectOption } from "../types/option";




export function TicketFormModal({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const isadmin = localStorage.getItem("role") === "admin";
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<selectOption | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/allUsers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        });
        console.log(res)
        setUsers(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs", err);
      }
    };
    if (isadmin) {
      fetchUsers();
    }
  }, [isadmin]);

 
  const userOptions: selectOption[] = users.map((user) => ({
    key: String(user.id),
    label: user.name,
    ...user,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = { title, description, priority, status };
    if (isadmin && selectedUser) {
      data.user_id = selectedUser.id; 
    }
    if (onSubmit) onSubmit(data);
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Nouveau ticket</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un ticket</DialogTitle>
          
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="priority">Priorité</Label>
            <select
              id="priority"
              className="w-full border rounded p-2"
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
          <div>
            <Label htmlFor="status">Statut</Label>
            <select
              id="status"
              className="w-full border rounded p-2"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="todo">À faire</option>
              <option value="in-progress">En cours</option>
              <option value="done">Terminé</option>
            </select>
          </div>




          {isadmin && (
            <div>
              <Label htmlFor="user">Assigner à</Label>
              <SelectBox
                options={userOptions}
                placeholder="Sélectionner un utilisateur"
                onSelect={setSelectedUser}
              />
            </div>
          )}






          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit">Créer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 