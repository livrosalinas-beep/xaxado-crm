"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { Plus, Loader2, Pencil } from "lucide-react"

export interface ContatoDialogProps {
  onContatoSaved: (contato: any) => void
  contato?: any
}

export function ContatoDialog({ onContatoSaved, contato }: ContatoDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nome, setNome] = useState(contato?.nome || "")
  const [empresa, setEmpresa] = useState(contato?.empresa || "")
  const [email, setEmail] = useState(contato?.email || "")
  const [telefone, setTelefone] = useState(contato?.telefone || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    let result
    if (contato) {
      result = await supabase
        .from('contatos')
        .update({
          nome,
          empresa,
          email,
          telefone
        })
        .eq('id', contato.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('contatos')
        .insert({
          nome,
          empresa,
          email,
          telefone,
          status: 'Ativo'
        })
        .select()
        .single()
    }

    if (result.data && !result.error) {
      onContatoSaved(result.data)
      setOpen(false)
      if (!contato) {
        setNome("")
        setEmpresa("")
        setEmail("")
        setTelefone("")
      }
    } else if (result.error) {
      alert("Erro ao salvar contato: " + result.error.message)
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {contato ? (
          <button className="flex h-8 w-8 items-center justify-center rounded border border-sertao-muted/30 text-sertao-muted hover:border-sertao-primary hover:text-sertao-primary bg-sertao-bg hover:bg-sertao-primary/10 transition-all opacity-0 group-hover:opacity-100">
            <Pencil className="h-4 w-4" />
          </button>
        ) : (
          <Button className="bg-sertao-primary text-white hover:bg-sertao-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Novo Contato
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-sertao-bg border-sertao-border">
        <DialogHeader>
          <DialogTitle className="text-sertao-text">{contato ? 'Editar Contato' : 'Adicionar Novo Contato'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-sertao-text">Nome *</label>
            <Input required value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Maria Joaquina" className="bg-sertao-secondary/50 border-sertao-border text-sertao-text" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-sertao-text">Empresa</label>
            <Input value={empresa} onChange={e => setEmpresa(e.target.value)} placeholder="Ex: Vibe Corp" className="bg-sertao-secondary/50 border-sertao-border text-sertao-text" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-sertao-text">E-mail</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="maria@vibe.com" type="email" className="bg-sertao-secondary/50 border-sertao-border text-sertao-text" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-sertao-text">Telefone</label>
              <Input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 99999-9999" className="bg-sertao-secondary/50 border-sertao-border text-sertao-text" />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full mt-4 bg-sertao-primary hover:bg-sertao-primary/90 text-white">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? "Salvando..." : "Salvar Contato"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
