"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Loader2, Trash2, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react"
import { CampaignDialog } from "./CampaignDialog"

type Campaign = {
  id: string
  name: string
  budget: number
  status: string
  created_at: string
}

export default function CampanhasPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    // Fetch Campaigns
    const { data: campsData } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (campsData) setCampaigns(campsData)

    // Fetch Deals to calculate ROI (we only need campaign_id, value, and stage)
    const { data: dealsData } = await supabase
      .from('deals')
      .select('campaign_id, value, stage')
      .not('campaign_id', 'is', null)

    if (dealsData) setDeals(dealsData)

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha? Todos os negócios atrelados a ela perderão o vínculo.')) {
      setCampaigns(current => current.filter(c => c.id !== id))
      await supabase.from('campaigns').delete().eq('id', id)
    }
  }

  const handleUpdate = (updatedCampaign: Campaign) => {
    setCampaigns(current => {
      const exists = current.find(c => c.id === updatedCampaign.id)
      if (exists) {
        return current.map(c => c.id === updatedCampaign.id ? updatedCampaign : c)
      }
      return [updatedCampaign, ...current]
    })
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  return (
    <div className="max-w-6xl mx-auto pb-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-sertao-text mb-2">Campanhas e ROI</h1>
          <p className="text-sertao-muted">Analise o retorno sobre investimento das suas ações de marketing.</p>
        </div>
        <CampaignDialog onCampaignSaved={handleUpdate} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sertao-primary" />
        </div>
      ) : campaigns.length === 0 ? (
         <div className="text-center py-12 bg-sertao-secondary/20 rounded-2xl border border-sertao-border/50">
           <h3 className="text-lg font-medium text-sertao-text mb-2">Nenhuma campanha rodando</h3>
           <p className="text-sertao-muted mb-4">Crie sua primeira campanha para começar a medir seus lucros.</p>
           <CampaignDialog onCampaignSaved={handleUpdate} />
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => {
            // Metrics calculation
            const campDeals = deals.filter(d => d.campaign_id === camp.id)
            const wonDeals = campDeals.filter(d => d.stage === 'ganho')
            
            const totalRevenue = wonDeals.reduce((acc, deal) => acc + Number(deal.value), 0)
            const roi = totalRevenue - camp.budget
            
            // Insight Engine Algorithm (Painel de Insights Inteligente)
            let insight = { message: "Analisando resultados...", color: "text-sertao-muted", icon: Lightbulb, bg: "bg-sertao-secondary/50", border: "border-sertao-border" }
            
            if (camp.status === 'Pausada' || camp.status === 'Concluída') {
              insight = { message: "Campanha inativa. O ROI final foi de " + formatCurrency(roi), color: "text-neutral-400", icon: Lightbulb, bg: "bg-neutral-900/50", border: "border-neutral-800" }
            } else if (roi > camp.budget * 2) {
              insight = { message: "Excelente performance! Considere aumentar o orçamento desta campanha.", color: "text-green-500", icon: TrendingUp, bg: "bg-green-500/10", border: "border-green-500/20" }
            } else if (roi > 0) {
              insight = { message: "Campanha lucrativa. Mantendo uma boa constância de retorno.", color: "text-emerald-400", icon: TrendingUp, bg: "bg-emerald-500/10", border: "border-emerald-500/20" }
            } else if (camp.budget > 0 && totalRevenue === 0) {
              insight = { message: "Alerta de prejuízo: Nenhum negócio fechado ainda. Revise sua estratégia.", color: "text-red-500", icon: AlertTriangle, bg: "bg-red-500/10", border: "border-red-500/20" }
            } else if (roi < 0) {
              insight = { message: "Campanha com ROI negativo. Acompanhe de perto para não perder dinheiro.", color: "text-yellow-500", icon: AlertTriangle, bg: "bg-yellow-500/10", border: "border-yellow-500/20" }
            }

            return (
              <div key={camp.id} className="bg-sertao-bg border border-sertao-border rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
                
                {/* Header do Card */}
                <div className="p-5 border-b border-sertao-border/50 relative">
                  <div className="flex justify-between items-start mb-2 pr-12">
                    <h3 className="font-bold text-sertao-text text-lg line-clamp-2" title={camp.name}>{camp.name}</h3>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold shrink-0 ring-1 ring-inset ${
                      camp.status === 'Ativa' ? 'bg-green-100 text-green-700 ring-green-600/30' :
                      camp.status === 'Pausada' ? 'bg-yellow-100 text-yellow-700 ring-yellow-600/30' :
                      'bg-neutral-100 text-neutral-700 ring-neutral-500/30'
                    }`}>
                      {camp.status}
                    </span>
                  </div>

                  <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <CampaignDialog campaign={camp} onCampaignSaved={handleUpdate} />
                    <button 
                      onClick={() => handleDelete(camp.id)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-red-500/30 text-red-500 hover:bg-red-50 hover:border-red-500 bg-sertao-bg transition-all"
                      title="Excluir campanha"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Corpo do Card (Métricas) */}
                <div className="p-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-sertao-muted mb-1">Custo (Orçamento)</p>
                    <p className="font-bold text-sertao-text">{formatCurrency(camp.budget)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-sertao-muted mb-1">Receita Gerada</p>
                    <p className="font-bold text-green-500">{formatCurrency(totalRevenue)}</p>
                  </div>
                  
                  <div className="col-span-2 pt-3 mt-1 border-t border-sertao-border/30">
                    <p className="text-xs font-medium text-sertao-muted mb-1">ROI (Retorno)</p>
                    <p className={`font-black text-2xl ${roi > 0 ? 'text-green-500' : roi < 0 ? 'text-red-500' : 'text-sertao-text'}`}>
                      {roi > 0 ? '+' : ''}{formatCurrency(roi)}
                    </p>
                  </div>
                </div>

                {/* Insight Algorithm Panel */}
                <div className={`p-4 border-t ${insight.bg} ${insight.border} flex items-start gap-3`}>
                  <insight.icon className={`h-5 w-5 shrink-0 mt-0.5 ${insight.color}`} />
                  <p className={`text-sm font-medium leading-snug ${insight.color}`}>
                    {insight.message}
                  </p>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
