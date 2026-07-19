"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { Plus, Loader2, Pencil } from "lucide-react"

export interface ActivityDialogProps {
  onActivitySaved: (activity: any) => void
  activity?: any
}

export function ActivityDialog({ onActivitySaved, activity }: ActivityDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(activity?.title || "")
  const [dealName, setDealName] = useState(activity?.deal_name || "")
  const [type, setType] = useState(activity?.type || "call")
  
  // Format date to local datetime-local format for the input if activity exists
  const initialDate = activity?.due_date 
    ? new Date(activity.due_date).toISOString().slice(0, 16)
    : ""
  const [dueDate, setDueDate] = useState(initialDate)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Formata a data e hora baseada no timezone local para UTC
    // Considerando que input type datetime-local retorna YYYY-MM-DDTHH:mm
    const dateObj = new Date(dueDate)
    const isoString = dateObj.toISOString()

    const supabase = createClient()
    
    let result
    if (activity) {
      result = await supabase
        .from('activities')
        .update({
          title,
          deal_name: dealName || null,
          type,
          due_date: isoString
        })
        .eq('id', activity.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('activities')
        .insert({
          title,
          deal_name: dealName || null,
          type,
          due_date: isoString,
          is_completed: false
        })
        .select()
        .single()
    }

    if (result.data && !result.error) {
      onActivitySaved(result.data)
      setOpen(false)
      if (!activity) {
        setTitle("")
        setDealName("")
        setType("call")
        setDueDate("")
      }
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {activity ? (
          <button className="flex h-6 w-6 items-center justify-center rounded border border-sertao-muted/30 text-sertao-muted hover:border-sertao-primary hover:text-sertao-primary bg-sertao-bg hover:bg-sertao-primary/10 transition-all">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        ) : (
          <Button className="bg-sertao-primary hover:bg-sertao-primary/90 text-white gap-2">
            <Plus className="h-4 w-4" />
            Nova Atividade
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{activity ? 'Editar Atividade' : 'Adicionar Nova Atividade'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-sertao-text">O que precisa ser feito?</label>
            <Input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ligar para confirmar proposta" 
              className="bg-sertao-secondary/50 border-sertao-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-sertao-text">Tipo</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-sertao-border bg-sertao-secondary/50 px-3 py-2 text-sm ring-offset-sertao-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sertao-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sertao-primary focus-visible:ring-offset-2 text-sertao-text"
              >
                <option value="call">Ligação</option>
                <option value="meeting">Reunião</option>
                <option value="email">E-mail</option>
                <option value="task">Tarefa (Geral)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-sertao-text">Data e Hora</label>
              <Input 
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-sertao-secondary/50 border-sertao-border text-sertao-text"
                style={{ colorScheme: 'dark' }} // Ajuda em temas escuros para o ícone de calendário
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-sertao-text">Escola/Negócio (Opcional)</label>
            <Input 
              value={dealName}
              onChange={(e) => setDealName(e.target.value)}
              placeholder="Ex: Colégio Progresso" 
              className="bg-sertao-secondary/50 border-sertao-border"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="bg-sertao-primary hover:bg-sertao-primary/90 text-white w-full sm:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Atividade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
