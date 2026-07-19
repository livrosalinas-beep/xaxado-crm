"use client"

import React, { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Phone, Mail, Calendar, CheckSquare, Loader2, Check, Trash2 } from "lucide-react"
import { ActivityDialog } from "./ActivityDialog"

type Activity = {
  id: string
  title: string
  type: 'call' | 'meeting' | 'email' | 'task'
  due_date: string
  is_completed: boolean
  deal_name: string
  created_at: string
}

export default function AtividadesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('is_completed', false)
      .order('due_date', { ascending: true })
    
    if (data && !error) {
      setActivities(data)
    }
    setLoading(false)
  }

  const markAsCompleted = async (id: string) => {
    setActivities(current => current.filter(act => act.id !== id))
    await supabase.from('activities').update({ is_completed: true }).eq('id', id)
  }

  const handleDelete = async (id: string) => {
    setActivities(current => current.filter(act => act.id !== id))
    await supabase.from('activities').delete().eq('id', id)
  }

  const handleUpdate = (updatedActivity: Activity) => {
    setActivities(current => current.map(act => act.id === updatedActivity.id ? updatedActivity : act))
  }

  // Agrupamento de datas
  const now = new Date()
  now.setHours(0, 0, 0, 0) // Início do dia de hoje
  
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1) // Início de amanhã

  const overdue = activities.filter(act => new Date(act.due_date) < now)
  const today = activities.filter(act => {
    const d = new Date(act.due_date)
    return d >= now && d < tomorrow
  })
  const upcoming = activities.filter(act => new Date(act.due_date) >= tomorrow)

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sertao-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto h-full overflow-y-auto pb-12">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-sertao-text mb-2">Suas Atividades</h1>
          <p className="text-sertao-muted">Fique em dia com as tarefas do Reduca e SAPE.</p>
        </div>
        <ActivityDialog onActivitySaved={(newActivity) => setActivities(prev => [...prev, newActivity])} />
      </div>

      <div className="space-y-10">
        <ActivitySection title="Atrasadas" items={overdue} color="red" onComplete={markAsCompleted} onDelete={handleDelete} onUpdate={handleUpdate} />
        <ActivitySection title="Para Hoje" items={today} color="sertao-primary" onComplete={markAsCompleted} onDelete={handleDelete} onUpdate={handleUpdate} />
        <ActivitySection title="Futuras" items={upcoming} color="neutral" onComplete={markAsCompleted} onDelete={handleDelete} onUpdate={handleUpdate} />
        
        {activities.length === 0 && (
          <div className="text-center py-12 bg-sertao-secondary/20 rounded-2xl border border-sertao-border/50">
            <CheckSquare className="mx-auto h-12 w-12 text-sertao-muted/50 mb-4" />
            <h3 className="text-lg font-bold text-sertao-text">Tudo limpo!</h3>
            <p className="text-sertao-muted">Você não tem atividades pendentes no momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ActivitySection({ 
  title, 
  items, 
  color,
  onComplete,
  onDelete,
  onUpdate
}: { 
  title: string, 
  items: Activity[], 
  color: string,
  onComplete: (id: string) => void,
  onDelete: (id: string) => void,
  onUpdate: (activity: Activity) => void
}) {
  if (items.length === 0) return null

  const colorStyles = {
    'red': 'text-red-700 bg-red-100 ring-red-600/30',
    'sertao-primary': 'text-sertao-primary bg-sertao-primary/10 ring-sertao-primary/30',
    'neutral': 'text-sertao-muted bg-sertao-muted/10 ring-sertao-muted/30'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-sertao-border/30 pb-2">
        <h2 className="text-lg font-bold text-sertao-text">{title}</h2>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${colorStyles[color as keyof typeof colorStyles]}`}>
          {items.length}
        </span>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <ActivityCard key={item.id} item={item} onComplete={onComplete} onDelete={onDelete} onUpdate={onUpdate} color={color} />
        ))}
      </div>
    </div>
  )
}

function ActivityCard({ 
  item, 
  onComplete, 
  onDelete, 
  onUpdate, 
  color 
}: { 
  item: Activity, 
  onComplete: (id: string) => void, 
  onDelete: (id: string) => void,
  onUpdate: (activity: Activity) => void,
  color: string 
}) {
  const icons = {
    call: Phone,
    meeting: Calendar,
    email: Mail,
    task: CheckSquare
  }
  const Icon = icons[item.type]

  const dateFormatted = new Date(item.due_date).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short'
  })

  return (
    <div className="group flex items-start gap-4 p-4 rounded-xl border border-sertao-border/50 bg-sertao-secondary/30 hover:bg-sertao-secondary/60 transition-colors">
      <button 
        onClick={() => onComplete(item.id)}
        className="mt-0.5 shrink-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-sertao-muted/30 text-transparent hover:border-green-500 hover:text-green-500 hover:bg-green-50 transition-all"
        title="Marcar como concluída"
      >
        <Check className="h-4 w-4" />
      </button>

      <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="h-4 w-4 text-sertao-muted" />
            <span className="font-bold text-sertao-text text-sm sm:text-base">{item.title}</span>
          </div>
          {item.deal_name && (
            <span className="text-sm text-sertao-muted flex items-center gap-1.5 ml-6">
              <span className="w-1.5 h-1.5 rounded-full bg-sertao-primary/50"></span>
              {item.deal_name}
            </span>
          )}
        </div>

        <div className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border ${
          color === 'red' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
          color === 'sertao-primary' ? 'bg-sertao-primary/10 text-sertao-primary border-sertao-primary/20' :
          'bg-sertao-muted/10 text-sertao-muted border-sertao-muted/20'
        }`}>
          {color === 'red' ? 'Atrasada' : dateFormatted}
        </div>
        
        {/* Actions - appear on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 ml-2">
          <ActivityDialog activity={item} onActivitySaved={onUpdate} />
          <button 
            onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir esta atividade?')) {
                onDelete(item.id)
              }
            }}
            className="flex h-6 w-6 items-center justify-center rounded border border-red-500/30 text-red-500 hover:bg-red-50 hover:border-red-500 bg-sertao-bg transition-all"
            title="Excluir atividade"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
