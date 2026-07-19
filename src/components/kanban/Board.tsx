"use client"

import React, { useEffect, useState } from "react"
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd"
import { createClient } from "@/utils/supabase/client"
import { Card, Deal } from "./Card"
import { Loader2 } from "lucide-react"
import { DealDialog } from "./DealDialog"

const columnsConfig = [
  { id: 'prospeccao', title: 'Prospecção' },
  { id: 'contato_inicial', title: 'Contato Inicial' },
  { id: 'reuniao', title: 'Reunião' },
  { id: 'proposta', title: 'Proposta Enviada' },
  { id: 'negociacao', title: 'Em Negociação' },
  { id: 'ganho', title: 'Ganho' },
  { id: 'perdido', title: 'Perdido' }
]

export function Board() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data && !error) {
      setDeals(data)
    }
    setLoading(false)
  }

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const newStage = destination.droppableId
    
    // Atualiza otimisticamente a UI
    setDeals(currentDeals => 
      currentDeals.map(deal => 
        deal.id === draggableId ? { ...deal, stage: newStage } : deal
      )
    )

    // Atualiza no banco
    await supabase
      .from('deals')
      .update({ stage: newStage })
      .eq('id', draggableId)
  }

  const handleDelete = async (id: string) => {
    // UI otimista
    setDeals(current => current.filter(d => d.id !== id))
    
    // DB
    await supabase.from('deals').delete().eq('id', id)
  }

  const handleUpdate = (updatedDeal: Deal) => {
    setDeals(current => current.map(d => d.id === updatedDeal.id ? updatedDeal : d))
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sertao-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-sertao-text">Funil de Vendas</h1>
          <p className="text-sertao-muted">Gerencie suas oportunidades arrastando-as entre as colunas.</p>
        </div>
        <DealDialog onDealSaved={(newDeal) => setDeals(prev => [newDeal, ...prev])} />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
          {columnsConfig.map((column) => {
          const columnDeals = deals.filter(deal => deal.stage === column.id)
          const columnTotal = columnDeals.reduce((acc, deal) => acc + Number(deal.value), 0)

          return (
            <div key={column.id} className="flex flex-col flex-1 min-w-[150px] max-w-sm bg-sertao-secondary/30 rounded-2xl border border-sertao-border/50">
              {/* Header da Coluna */}
              <div className="p-3 border-b border-sertao-border/50 bg-sertao-secondary/50 rounded-t-2xl">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-sertao-text text-sm truncate pr-2" title={column.title}>{column.title}</h3>
                  <span className="bg-sertao-primary/10 text-sertao-primary text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    {columnDeals.length}
                  </span>
                </div>
                <div className="text-xs font-medium text-sertao-muted truncate">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(columnTotal)}
                </div>
              </div>

              {/* Área Droppable */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-3 min-h-[150px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-sertao-primary/5' : ''
                    }`}
                  >
                    {columnDeals.map((deal, index) => (
                      <Card 
                        key={deal.id} 
                        deal={deal} 
                        index={index} 
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
    </div>
  )
}
