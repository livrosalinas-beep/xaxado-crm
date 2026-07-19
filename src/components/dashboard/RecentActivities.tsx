"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { CheckCircle2, FileEdit, Target, Clock } from "lucide-react"

function formatDistance(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return "Agora mesmo"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`
  return `${Math.floor(diffInSeconds / 86400)} dias atrás`
}

export function RecentActivities() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivities() {
      const supabase = createClient()
      
      // Busca os últimos 5 negócios modificados/criados
      const { data } = await supabase
        .from('deals')
        .select('id, title, stage, created_at, value')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (data) {
        setActivities(data)
      }
      setLoading(false)
    }

    fetchActivities()
  }, [])

  const getIcon = (stage: string) => {
    switch (stage) {
      case 'ganho':
        return { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" }
      case 'perdido':
        return { icon: Target, color: "text-red-600", bg: "bg-red-100" }
      case 'prospeccao':
        return { icon: Clock, color: "text-blue-600", bg: "bg-blue-100" }
      default:
        return { icon: FileEdit, color: "text-purple-600", bg: "bg-purple-100" }
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  return (
    <div className="rounded-xl border border-sertao-border bg-sertao-secondary/50 p-6 backdrop-blur-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-sertao-text mb-6">Últimos Negócios</h3>
      <div className="flex-1 overflow-y-auto pr-2">
        {loading ? (
          <p className="text-sertao-muted text-sm">Carregando...</p>
        ) : activities.length === 0 ? (
          <p className="text-sertao-muted text-sm">Nenhuma atividade recente.</p>
        ) : (
          <div className="space-y-6">
            {activities.map((activity) => {
              const { icon: Icon, color, bg } = getIcon(activity.stage)
              return (
                <div key={activity.id} className="flex gap-4">
                  <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div className="flex flex-col w-full">
                    <span className="text-sm font-semibold text-sertao-text">{activity.title}</span>
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm text-sertao-muted capitalize">{activity.stage.replace('_', ' ')}</span>
                      <span className="text-sm font-medium text-sertao-text">{formatCurrency(activity.value)}</span>
                    </div>
                    <span className="text-xs text-sertao-muted/70 mt-1">
                      {formatDistance(activity.created_at)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
