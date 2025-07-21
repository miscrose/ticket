import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/login",
        { email, password },
        { headers: { "Accept": "application/json" } }
      )
      console.log(res.data)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)
      navigate("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur de connexion")
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-white">Login to your account</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3 text-white">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-3 text-white">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button type="submit" className="w-full ">
            Login
          </Button>
        </div>
      </div>
      <div className="text-center text-sm text-white">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  )
}
