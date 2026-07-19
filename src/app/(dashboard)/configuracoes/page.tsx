"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Loader2, Save, Moon, Sun, User, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/providers/ThemeProvider"

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const [goal, setGoal] = useState("50000")
  const [loadingGoal, setLoadingGoal] = useState(false)
  
  const [user, setUser] = useState<any>(null)
  const [profileName, setProfileName] = useState("")
  const [profileEmail, setProfileEmail] = useState("")
  const [loadingProfile, setLoadingProfile] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
    fetchUser()
  }, [])

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      setProfileEmail(user.email || "")
      setProfileName(user.user_metadata?.name || "")
    }
  }

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('settings').select('*').limit(1).single()
    if (data) {
      setGoal(data.monthly_goal.toString())
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingProfile(true)
    
    // Atualiza o nome nos metadados do usuario autenticado
    const { error } = await supabase.auth.updateUser({
      data: { name: profileName }
    })
    
    if (error) alert("Erro ao salvar perfil: " + error.message)
    else alert("Perfil atualizado com sucesso!")
    
    setLoadingProfile(false)
  }

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingGoal(true)

    // Check if settings exists
    const { data: existing } = await supabase.from('settings').select('id').limit(1)
    
    if (existing && existing.length > 0) {
      const { error } = await supabase
        .from('settings')
        .update({ monthly_goal: parseFloat(goal) || 0, updated_at: new Date().toISOString() })
        .eq('id', existing[0].id)
      
      if (error) alert("Erro ao salvar meta: " + error.message)
      else alert("Meta salva com sucesso!")
    } else {
      const { error } = await supabase
        .from('settings')
        .insert({ monthly_goal: parseFloat(goal) || 0 })
      
      if (error) alert("Erro ao criar meta: " + error.message)
      else alert("Meta salva com sucesso!")
    }

    setLoadingGoal(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      <div>
        <h2 className="text-3xl font-bold text-sertao-text tracking-tight">Configurações</h2>
        <p className="mt-1 text-sm text-sertao-muted">
          Gerencie seu perfil, metas de vendas e aparência do sistema.
        </p>
      </div>

      <div className="grid gap-6">
        
        {/* Painel: Perfil */}
        <div className="bg-sertao-bg border border-sertao-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-sertao-border/50 flex items-center gap-3">
            <div className="h-10 w-10 bg-sertao-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-sertao-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sertao-text text-lg">Meu Perfil</h3>
              <p className="text-sm text-sertao-muted">Informações da sua conta</p>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium text-sertao-text">Nome</label>
                <Input 
                  required
                  value={profileName} 
                  onChange={e => setProfileName(e.target.value)}
                  placeholder="Seu nome"
                  className="bg-sertao-secondary/50 border-sertao-border text-sertao-text" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-sertao-text">E-mail de Acesso</label>
                <Input 
                  disabled 
                  value={profileEmail} 
                  className="bg-sertao-secondary/50 border-sertao-border text-sertao-muted cursor-not-allowed opacity-60" 
                />
              </div>
              <Button type="submit" disabled={loadingProfile} className="bg-sertao-primary hover:bg-sertao-primary/90 text-white">
                {loadingProfile ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Perfil
              </Button>
            </form>
          </div>
        </div>

        {/* Painel: Metas */}
        <div className="bg-sertao-bg border border-sertao-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-sertao-border/50 flex items-center gap-3">
            <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <Target className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-bold text-sertao-text text-lg">Metas de Vendas</h3>
              <p className="text-sm text-sertao-muted">Defina seu alvo financeiro para acompanhar no Dashboard</p>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleSaveGoal} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium text-sertao-text">Meta Mensal de Receita (R$)</label>
                <Input 
                  type="number"
                  step="0.01"
                  required
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  className="bg-sertao-secondary/50 border-sertao-border text-sertao-text" 
                  placeholder="Ex: 50000"
                />
              </div>
              <Button type="submit" disabled={loadingGoal} className="bg-sertao-primary hover:bg-sertao-primary/90 text-white">
                {loadingGoal ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Meta
              </Button>
            </form>
          </div>
        </div>

        {/* Painel: Aparência */}
        <div className="bg-sertao-bg border border-sertao-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-sertao-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                {theme === 'dark' ? <Moon className="h-5 w-5 text-blue-400" /> : <Sun className="h-5 w-5 text-yellow-500" />}
              </div>
              <div>
                <h3 className="font-bold text-sertao-text text-lg">Aparência do Sistema</h3>
                <p className="text-sm text-sertao-muted">Escolha entre o modo claro e escuro</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex gap-4">
              <button 
                onClick={() => setTheme('light')}
                className={`flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${
                  theme === 'light' 
                    ? 'border-sertao-primary bg-sertao-primary/5' 
                    : 'border-sertao-border bg-sertao-secondary/30 hover:border-sertao-primary/50 hover:bg-sertao-secondary/80'
                }`}
              >
                <Sun className={`h-8 w-8 mb-3 ${theme === 'light' ? 'text-sertao-primary' : 'text-sertao-muted'}`} />
                <span className={`font-semibold ${theme === 'light' ? 'text-sertao-text' : 'text-sertao-muted'}`}>Modo Claro</span>
              </button>
              
              <button 
                onClick={() => setTheme('dark')}
                className={`flex-1 flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${
                  theme === 'dark' 
                    ? 'border-sertao-primary bg-sertao-primary/5' 
                    : 'border-sertao-border bg-sertao-secondary/30 hover:border-sertao-primary/50 hover:bg-sertao-secondary/80'
                }`}
              >
                <Moon className={`h-8 w-8 mb-3 ${theme === 'dark' ? 'text-sertao-primary' : 'text-sertao-muted'}`} />
                <span className={`font-semibold ${theme === 'dark' ? 'text-sertao-text' : 'text-sertao-muted'}`}>Modo Escuro</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
