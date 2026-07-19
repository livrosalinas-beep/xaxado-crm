"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sertao-bg relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sertao-primary/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sertao-accent/20 blur-[120px]" />

      <div className="relative w-full max-w-md p-8 sm:p-12 mx-4 rounded-3xl border border-sertao-border bg-sertao-secondary/40 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6 relative w-24 h-24">
            <Image 
              src="/logo.png" 
              alt="Xaxado Logo" 
              fill 
              className="object-contain drop-shadow-md"
            />
          </div>
          <h1 className="text-5xl font-[family-name:var(--font-xilosa)] text-sertao-primary mb-2 text-center">
            Xaxado CRM
          </h1>
          <p className="text-sertao-muted text-center text-sm font-medium">
            Gestão de Vendas Reduca e SAPE
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm p-3 rounded-lg text-center font-medium">
              {error === "Invalid login credentials" ? "E-mail ou senha incorretos." : error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-sertao-text ml-1">E-mail</label>
            <Input 
              type="email" 
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="h-12 bg-sertao-bg/50 focus:bg-sertao-bg transition-colors"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-sertao-text">Senha</label>
              <a href="#" className="text-xs text-sertao-primary hover:underline">Esqueceu?</a>
            </div>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="h-12 bg-sertao-bg/50 focus:bg-sertao-bg transition-colors"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 text-base font-bold bg-sertao-primary hover:bg-sertao-primary/90 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 mt-6"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Entrar no CRM"}
          </Button>
        </form>
        
        <div className="mt-8 text-center text-xs text-sertao-muted">
          &copy; {new Date().getFullYear()} Desenvolvido com muito Xaxado
        </div>
      </div>
    </div>
  )
}
