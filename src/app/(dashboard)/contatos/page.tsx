"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone, Loader2, Trash2, MessageSquare } from "lucide-react"
import { ContatoDialog } from "./ContatoDialog"
import { SendMessageDialog } from "@/components/communication/SendMessageDialog"

export default function ContatosPage() {
  const [contatos, setContatos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    fetchContatos()
  }, [])

  async function fetchContatos() {
    setLoading(true)
    const { data, error } = await supabase.from('contatos').select('*').order('created_at', { ascending: false })
    if (data) setContatos(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      setContatos(current => current.filter(c => c.id !== id))
      await supabase.from('contatos').delete().eq('id', id)
    }
  }

  const handleUpdate = (updatedContato: any) => {
    setContatos(current => current.map(c => c.id === updatedContato.id ? updatedContato : c))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-sertao-text sm:truncate sm:text-3xl sm:tracking-tight">
            Contatos
          </h2>
          <p className="mt-1 text-sm text-sertao-muted">
            Gerencie seus clientes e empresas no Supabase.
          </p>
        </div>
        
        <ContatoDialog onContatoSaved={(novo) => setContatos(prev => [novo, ...prev])} />

      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-sertao-muted" />
          <Input 
            placeholder="Buscar por nome, email ou empresa..." 
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-xl border border-sertao-border bg-sertao-secondary/50 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-sertao-text">
            <thead className="bg-sertao-secondary text-xs uppercase text-sertao-muted border-b border-sertao-border">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Nome</th>
                <th scope="col" className="px-6 py-4 font-medium">Empresa</th>
                <th scope="col" className="px-6 py-4 font-medium">Contato</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sertao-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sertao-muted">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Carregando contatos do Supabase...
                  </td>
                </tr>
              ) : contatos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sertao-muted">
                    Nenhum contato encontrado. Clique em &quot;Novo Contato&quot; para começar.
                  </td>
                </tr>
              ) : (
                contatos.map((contato) => (
                  <tr key={contato.id} className="hover:bg-sertao-secondary transition-colors group">
                    <td className="px-6 py-4 font-medium text-sertao-text">
                      {contato.nome}
                    </td>
                    <td className="px-6 py-4">{contato.empresa || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-xs text-sertao-muted">
                          <Mail className="mr-1.5 h-3 w-3" /> {contato.email || '-'}
                        </div>
                        <div className="flex items-center text-xs text-sertao-muted">
                          <Phone className="mr-1.5 h-3 w-3" /> {contato.telefone || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                        contato.status === 'Ativo' 
                          ? 'bg-green-100 text-green-700 ring-green-600/30' 
                          : 'bg-neutral-100 text-neutral-700 ring-neutral-500/30'
                      }`}>
                        {contato.status || 'Ativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <SendMessageDialog contact={{
                          id: contato.id,
                          name: contato.nome,
                          email: contato.email,
                          phone: contato.telefone,
                          company: contato.empresa,
                          role: ''
                        }}>
                          <button 
                            className="flex h-8 w-8 items-center justify-center rounded border border-green-500/30 text-green-500 hover:bg-green-50 hover:border-green-500 bg-sertao-bg transition-all opacity-0 group-hover:opacity-100"
                            title="Enviar Mensagem"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        </SendMessageDialog>

                        <ContatoDialog contato={contato} onContatoSaved={handleUpdate} />
                        <button 
                          onClick={() => handleDelete(contato.id)}
                          className="flex h-8 w-8 items-center justify-center rounded border border-red-500/30 text-red-500 hover:bg-red-50 hover:border-red-500 bg-sertao-bg transition-all opacity-0 group-hover:opacity-100"
                          title="Excluir contato"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
