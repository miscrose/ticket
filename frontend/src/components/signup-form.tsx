import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"

export function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/signup",
        { name, email, password },
        { headers: { "Accept": "application/json" } }
      )
      console.log(res)
      localStorage.setItem("token", res.data.token)
      navigate("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription")
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-white">Créer un compte</h1>
      </div>
      <div className="grid gap-6 text-white">
        <div className="grid gap-3">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" type="text" placeholder="Votre nom" required value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="vous@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <Button type="submit" className="w-full">
          S'inscrire
        </Button>
      </div>
      <div className="text-center text-sm text-white">
        Vous avez déjà un compte ?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Connectez-vous
        </Link>
      </div>
    </form>
  )
}
