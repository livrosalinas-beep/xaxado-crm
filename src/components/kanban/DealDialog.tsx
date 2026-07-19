"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { Plus, Loader2, Pencil } from "lucide-react"
import { Deal } from "./Card"

interface DealDialogProps {
  onDealSaved: (deal: Deal) => void
  deal?: Deal
}

export function DealDialog({ onDealSaved, deal }: DealDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [campaigns, setCampaigns] = useState<any[]>([])
  
  const [title, setTitle] = useState(deal?.title || "")
  const [value, setValue] = useState(deal ? deal.value.toString() : "")
  const [stage, setStage] = useState(deal?.stage || "prospeccao")
  const [campaignId, setCampaignId] = useState(deal?.campaign_id || "")

  const supabase = createClient()

  // Buscar campanhas apenas quando abrir o dialog
  useEffect(() => {
    if (open) {
      fetchCampaigns()
    }
  }, [open])

  const fetchCampaigns = async () => {
    const { data } = await supabase
      .from('campaigns')
      .select('id, name')
      .eq('status', 'Ativa')
      .order('created_at', { ascending: false })
    
    if (data) setCampaigns(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    let result
    if (deal) {
      result = await supabase
        .from('deals')
        .update({
          title,
          value: parseFloat(value) || 0,
          stage,
          campaign_id: campaignId || null
        })
        .eq('id', deal.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('deals')
        .insert({
          title,
          value: parseFloat(value) || 0,
          stage,
          campaign_id: campaignId || null
        })
        .select()
        .single()
    }

    if (result.data && !result.error) {
      onDealSaved(result.data)
      setOpen(false)
      if (!deal) {
        setTitle("")
        setValue("")
        setStage("prospeccao")
        setCampaignId("")
      }
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {deal ? (
          <button className="flex h-6 w-6 items-center justify-center rounded border border-sertao-muted/30 text-sertao-muted hover:border-sertao-primary hover:text-sertao-primary bg-sertao-bg hover:bg-sertao-primary/10 transition-all">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        ) : (
          <Button className="bg-sertao-primary hover:bg-sertao-primary/90 text-white gap-2">
            <Plus className="h-4 w-4" />
            Novo Negócio
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{deal ? 'Editar Negócio' : 'Adicionar Novo Negócio'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-sertao-text">Nome da Escola/Negócio</label>
            <Input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Colégio Visão" 
              className="bg-sertao-secondary/50 border-sertao-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-sertao-text">Valor Estimado (R$)</label>
            <Input 
              type="number"
              step="0.01"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ex: 1500.00" 
              className="bg-sertao-secondary/50 border-sertao-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-sertao-text">Fase Inicial</label>
            <select 
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="flex h-10 w-full rounded-md border border-sertao-border bg-sertao-secondary/50 px-3 py-2 text-sm ring-offset-sertao-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sertao-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sertao-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-sertao-text"
            >
              <option value="prospeccao">Prospecção</option>
              <option value="contato_inicial">Contato Inicial</option>
              <option value="reuniao">Reunião</option>
              <option value="proposta">Proposta Enviada</option>
              <option value="negociacao">Em Negociação</option>
              <option value="ganho">Ganho</option>
              <option value="perdido">Perdido</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-sertao-text">Origem (Opcional)</label>
            <select 
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-sertao-border bg-sertao-secondary/50 px-3 py-2 text-sm ring-offset-sertao-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sertao-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sertao-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-sertao-text"
            >
              <option value="">Nenhuma Campanha / Outro</option>
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="bg-sertao-primary hover:bg-sertao-primary/90 text-white w-full sm:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Negócio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
