import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,

  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import axios from "axios";
import { SelectBox } from "./selectBox";
import type { selectOption } from "../types/option";




export function TicketFormModal({ ticket, isOpen, onOpenChange, onSubmit }: {
  ticket?: any,
  isOpen: boolean,
  onOpenChange: (open: boolean) => void,
  onSubmit?: (data: any) => void
}) {
  const [title, setTitle] = useState(ticket?.title || "");
  const [description, setDescription] = useState(ticket?.description || "");
  const [priority, setPriority] = useState(ticket?.priority || "medium");
  const [status, setStatus] = useState(ticket?.status || "todo");
  const isadmin = localStorage.getItem("role") === "admin";
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<selectOption | null>(ticket?.user ? { key: String(ticket.user.id), label: ticket.user.name, ...ticket.user } : null);

  useEffect(() => {
    setTitle(ticket?.title || "");
    setDescription(ticket?.description || "");
    setPriority(ticket?.priority || "medium");
    setStatus(ticket?.status || "todo");
    setSelectedUser(ticket?.user ? { key: String(ticket.user.id), label: ticket.user.name, ...ticket.user } : null);
  }, [ticket]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/allUsers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        });
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
    const data: any = { ...ticket, title, description, priority, status };
    if (isadmin && selectedUser) {
      data.user_id = selectedUser.id; 
    }
    if (onSubmit) onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{ticket ? "Modifier le ticket" : "Créer un ticket"}</DialogTitle>
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
                value={selectedUser}
              />
            </div>
          )}
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit">{ticket ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 