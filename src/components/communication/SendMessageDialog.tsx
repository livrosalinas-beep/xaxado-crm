"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MessageSquare, Mail, Send, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
}

export function SendMessageDialog({ 
  children, 
  contact 
}: { 
  children: React.ReactNode, 
  contact: Contact 
}) {
  const [open, setOpen] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      fetchTemplates()
    } else {
      setSelectedTemplate(null)
    }
  }

  const fetchTemplates = async () => {
    setLoading(true)
    const { data } = await supabase.from('message_templates').select('*').order('created_at', { ascending: false })
    if (data) {
      setTemplates(data)
      if (data.length > 0) setSelectedTemplate(data[0])
    }
    setLoading(false)
  }

  // Replace variables in text with contact real info
  const parseMessage = (text: string) => {
    if (!text) return ""
    return text
      .replace(/{{nome}}/gi, contact.name || "")
      .replace(/{{telefone}}/gi, contact.phone || "")
      .replace(/{{email}}/gi, contact.email || "")
      .replace(/{{empresa}}/gi, contact.company || "")
      .replace(/{{cargo}}/gi, contact.role || "")
  }

  const handleSend = () => {
    if (!selectedTemplate) return

    const message = parseMessage(selectedTemplate.content)
    
    if (selectedTemplate.type === 'whatsapp') {
      // Formatar telefone: remover tudo que nao for numero
      const cleanPhone = contact.phone ? contact.phone.replace(/\D/g, '') : ''
      const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`
      window.open(url, '_blank')
    } else if (selectedTemplate.type === 'email') {
      const url = `mailto:${contact.email}?subject=${encodeURIComponent(selectedTemplate.title)}&body=${encodeURIComponent(message)}`
      window.open(url, '_blank')
    }
    
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-sertao-bg border-sertao-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-sertao-text flex items-center gap-2">
            <Send className="h-5 w-5 text-sertao-primary" />
            Enviar Mensagem para {contact.name.split(' ')[0]}
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="py-8 flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin text-sertao-primary" />
          </div>
        ) : templates.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sertao-muted mb-4">Você ainda não criou nenhum molde de mensagem.</p>
            <Button variant="outline" className="border-sertao-primary text-sertao-primary" onClick={() => window.location.href='/templates'}>
              Criar meu primeiro molde
            </Button>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-sertao-text">1. Escolha o Molde</label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto pr-1">
                {templates.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      selectedTemplate?.id === tpl.id 
                        ? 'border-sertao-primary bg-sertao-primary/10' 
                        : 'border-sertao-border bg-sertao-secondary/50 hover:bg-sertao-secondary'
                    }`}
                  >
                    <div className={tpl.type === 'whatsapp' ? 'text-green-500' : 'text-blue-500'}>
                      {tpl.type === 'whatsapp' ? <MessageSquare className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                    </div>
                    <span className="font-semibold text-sertao-text text-sm truncate">{tpl.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedTemplate && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-sertao-text">2. Pré-visualização</label>
                <div className="bg-sertao-secondary/30 border border-sertao-border rounded-xl p-4 min-h-[100px]">
                  <p className="text-sm font-mono text-sertao-text whitespace-pre-wrap">
                    {parseMessage(selectedTemplate.content)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-sertao-border">
              <Button 
                onClick={handleSend}
                disabled={!selectedTemplate}
                className={`text-white w-full flex items-center justify-center gap-2 ${
                  selectedTemplate?.type === 'whatsapp' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {selectedTemplate?.type === 'whatsapp' ? (
                  <><MessageSquare className="h-4 w-4" /> Abrir no WhatsApp Web</>
                ) : (
                  <><Mail className="h-4 w-4" /> Abrir no E-mail</>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
