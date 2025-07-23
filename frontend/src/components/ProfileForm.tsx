import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

export function ProfileForm({ user, onSuccess }: { user: any, onSuccess?: () => void }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.put("http://127.0.0.1:8000/api/profile", {
        name,
        email,
        ...(password && { password }) 
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        }
      });
      setSuccess("Profil mis à jour !");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur lors de la mise à jour");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4  ">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Laisser vide pour ne pas changer" />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <Button type="submit" className="w-full">Mettre à jour</Button>
    </form>
  );
}