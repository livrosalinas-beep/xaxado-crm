"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { Plus, Loader2, Pencil } from "lucide-react"

export interface CampaignDialogProps {
  onCampaignSaved: (campaign: any) => void
  campaign?: any
}

export function CampaignDialog({ onCampaignSaved, campaign }: CampaignDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(campaign?.name || "")
  const [budget, setBudget] = useState(campaign ? campaign.budget.toString() : "")
  const [status, setStatus] = useState(campaign?.status || "Ativa")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    let result
    if (campaign) {
      result = await supabase
        .from('campaigns')
        .update({
          name,
          budget: parseFloat(budget) || 0,
          status
        })
        .eq('id', campaign.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('campaigns')
        .insert({
          name,
          budget: parseFloat(budget) || 0,
          status
        })
        .select()
        .single()
    }

    if (result.data && !result.error) {
      onCampaignSaved(result.data)
      setOpen(false)
      if (!campaign) {
        setName("")
        setBudget("")
        setStatus("Ativa")
      }
    } else if (result.error) {
      alert("Erro ao salvar campanha: " + result.error.message)
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {campaign ? (
          <button className="flex h-8 w-8 items-center justify-center rounded border border-sertao-muted/30 text-sertao-muted hover:border-sertao-primary hover:text-sertao-primary bg-sertao-bg hover:bg-sertao-primary/10 transition-all opacity-0 group-hover:opacity-100">
            <Pencil className="h-4 w-4" />
          </button>
        ) : (
          <Button className="bg-sertao-primary hover:bg-sertao-primary/90 text-white gap-2">
            <Plus className="h-4 w-4" />
            Nova Campanha
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-sertao-bg border-sertao-border">
        <DialogHeader>
          <DialogTitle className="text-sertao-text">{campaign ? 'Editar Campanha' : 'Criar Nova Campanha'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-sertao-text">Nome da Campanha</label>
            <Input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Anúncios Facebook (Agosto)" 
              className="bg-sertao-secondary/50 border-sertao-border text-sertao-text"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-sertao-text">Orçamento (R$)</label>
            <Input 
              type="number"
              step="0.01"
              required
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Ex: 500.00" 
              className="bg-sertao-secondary/50 border-sertao-border text-sertao-text"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-sertao-text">Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex h-10 w-full rounded-md border border-sertao-border bg-sertao-secondary/50 px-3 py-2 text-sm text-sertao-text outline-none focus:ring-2 focus:ring-sertao-primary"
            >
              <option value="Ativa">Ativa</option>
              <option value="Pausada">Pausada</option>
              <option value="Concluída">Concluída</option>
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="bg-sertao-primary hover:bg-sertao-primary/90 text-white w-full sm:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Campanha
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
