"use client"

import React from "react"
import { Draggable } from "@hello-pangea/dnd"
import { Trash2 } from "lucide-react"
import { DealDialog } from "./DealDialog"

export type Deal = {
  id: string
  title: string
  value: number
  stage: string
  created_at: string
}

interface CardProps {
  deal: Deal
  index: number
  onDelete: (id: string) => void
  onUpdate: (deal: Deal) => void
}

export function Card({ deal, index, onDelete, onUpdate }: CardProps) {
  // Format currency
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(deal.value)

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group bg-sertao-bg border border-sertao-border rounded-xl p-3 mb-3 shadow-sm hover:shadow-md transition-shadow relative ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-sertao-primary rotate-2 z-50' : ''
          }`}
        >
          {/* Actions (aparecem no hover) */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <DealDialog deal={deal} onDealSaved={onUpdate} />
            <button 
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir este negócio?')) {
                  onDelete(deal.id)
                }
              }}
              className="flex h-6 w-6 items-center justify-center rounded border border-red-500/30 text-red-500 hover:bg-red-50 hover:border-red-500 bg-sertao-bg transition-all"
              title="Excluir negócio"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="font-semibold text-sm text-sertao-text mb-1 leading-tight line-clamp-2 pr-12" title={deal.title}>
            {deal.title}
          </div>
          <div className="text-xs font-bold text-sertao-primary truncate">
            {formattedValue}
          </div>
        </div>
      )}
    </Draggable>
  )
}
