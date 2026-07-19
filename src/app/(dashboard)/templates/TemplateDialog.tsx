"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, MessageSquare, Mail, Loader2, Info } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export function TemplateDialog({ 
  children, 
  templateToEdit,
  onSave
}: { 
  children: React.ReactNode, 
  templateToEdit?: any,
  onSave: () => void 
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [title, setTitle] = useState(templateToEdit?.title || "")
  const [content, setContent] = useState(templateToEdit?.content || "")
  const [type, setType] = useState(templateToEdit?.type || "whatsapp")

  const supabase = createClient()

  // Reset form when opening to create new
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && !templateToEdit) {
      setTitle("")
      setContent("")
      setType("whatsapp")
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      title,
      content,
      type
    }

    if (templateToEdit) {
      const { error } = await supabase.from('message_templates').update(payload).eq('id', templateToEdit.id)
      if (error) alert("Erro: " + error.message)
    } else {
      const { error } = await supabase.from('message_templates').insert(payload)
      if (error) alert("Erro: " + error.message)
    }

    setLoading(false)
    setOpen(false)
    onSave()
  }

  const insertVariable = (variable: string) => {
    setContent(prev => prev + ` {{${variable}}}`)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-sertao-bg border-sertao-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-sertao-text">
            {templateToEdit ? "Editar Molde de Mensagem" : "Novo Molde de Mensagem"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSave} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-sertao-text">Nome do Molde</label>
            <Input 
              required
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Cobrança Padrão, Boas Vindas..."
              className="bg-sertao-secondary/50 border-sertao-border text-sertao-text" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-sertao-text">Canal Principal</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('whatsapp')}
                className={`flex-1 py-2 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  type === 'whatsapp' 
                    ? 'border-green-500 bg-green-500/10 text-green-500 font-bold' 
                    : 'border-sertao-border bg-sertao-secondary/50 text-sertao-muted'
                }`}
              >
                <MessageSquare className="h-4 w-4" /> WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setType('email')}
                className={`flex-1 py-2 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  type === 'email' 
                    ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-bold' 
                    : 'border-sertao-border bg-sertao-secondary/50 text-sertao-muted'
                }`}
              >
                <Mail className="h-4 w-4" /> E-mail
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-sertao-text">Texto da Mensagem</label>
            </div>
            
            <div className="bg-sertao-primary/5 border border-sertao-primary/20 rounded-xl p-3 mb-2 flex flex-col gap-2">
              <span className="text-xs text-sertao-primary font-semibold flex items-center gap-1">
                <Info className="h-3 w-3" /> Clique para inserir variáveis no texto:
              </span>
              <div className="flex flex-wrap gap-2">
                {['nome', 'email', 'telefone', 'empresa', 'cargo'].map(vr => (
                  <button 
                    key={vr} 
                    type="button" 
                    onClick={() => insertVariable(vr)}
                    className="text-[10px] uppercase font-bold bg-sertao-primary/20 text-sertao-primary px-2 py-1 rounded-md hover:bg-sertao-primary/30 transition-colors"
                  >
                    {vr}
                  </button>
                ))}
              </div>
            </div>

            <Textarea 
              required
              rows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={`Olá {{nome}}, vimos que você trabalha na {{empresa}}...`}
              className="bg-sertao-secondary/50 border-sertao-border text-sertao-text resize-none font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-sertao-border">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-sertao-border text-sertao-text"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-sertao-primary hover:bg-sertao-primary/90 text-white">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {templateToEdit ? "Salvar Alterações" : "Criar Molde"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
