"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { MessageSquare, Mail, Plus, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TemplateDialog } from "./TemplateDialog"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setLoading(true)
    const { data } = await supabase.from('message_templates').select('*').order('created_at', { ascending: false })
    if (data) setTemplates(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar esse molde?")) return
    const { error } = await supabase.from('message_templates').delete().eq('id', id)
    if (error) alert("Erro: " + error.message)
    else fetchTemplates()
  }

  return (
    <div className="max-w-6xl mx-auto pb-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-sertao-text mb-2">Mensagens & Templates</h1>
          <p className="text-sertao-muted">Crie moldes inteligentes para enviar WhatsApp e E-mails em 1 clique.</p>
        </div>
        <TemplateDialog onSave={fetchTemplates}>
          <Button className="bg-sertao-primary hover:bg-sertao-primary/90 text-white shadow-md">
            <Plus className="mr-2 h-4 w-4" /> Novo Molde
          </Button>
        </TemplateDialog>
      </div>

      {loading ? (
        <p className="text-sertao-muted">Carregando moldes...</p>
      ) : templates.length === 0 ? (
        <div className="text-center py-20 bg-sertao-secondary/20 rounded-2xl border border-sertao-border border-dashed">
          <MessageSquare className="h-12 w-12 text-sertao-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-sertao-text mb-2">Nenhum molde criado</h3>
          <p className="text-sertao-muted max-w-sm mx-auto mb-6">
            Crie seu primeiro molde de mensagem para começar a enviar comunicações ultrarrápidas para seus clientes.
          </p>
          <TemplateDialog onSave={fetchTemplates}>
            <Button variant="outline" className="border-sertao-primary text-sertao-primary hover:bg-sertao-primary hover:text-white">
              Criar meu primeiro molde
            </Button>
          </TemplateDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-sertao-bg border border-sertao-border rounded-2xl overflow-hidden shadow-sm hover:border-sertao-primary/30 transition-all group flex flex-col">
              <div className="p-5 border-b border-sertao-border/50 flex items-center gap-3">
                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${tpl.type === 'whatsapp' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {tpl.type === 'whatsapp' ? <MessageSquare className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                </div>
                <div className="flex-1 truncate">
                  <h3 className="font-bold text-sertao-text text-lg truncate">{tpl.title}</h3>
                  <p className="text-xs text-sertao-muted uppercase font-bold tracking-wider">{tpl.type}</p>
                </div>
              </div>
              <div className="p-5 bg-sertao-secondary/10 flex-1">
                <p className="text-sm text-sertao-muted font-mono whitespace-pre-wrap line-clamp-4">
                  {tpl.content}
                </p>
              </div>
              <div className="p-4 border-t border-sertao-border/50 bg-sertao-bg flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-sertao-muted/50">ID: {tpl.id.substring(0, 8)}</span>
                <div className="flex gap-2">
                  <TemplateDialog templateToEdit={tpl} onSave={fetchTemplates}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-sertao-primary hover:bg-sertao-primary/10 hover:text-sertao-primary">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TemplateDialog>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(tpl.id)}
                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
