'use client'

import { X, Save } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type ProcessoModalProps = {
  isOpen: boolean
  onClose: () => void
  area: 'trabalhista' | 'civil' | 'controles' | 'registro'
  onSuccess: () => void
}

export default function ProcessoModal({ isOpen, onClose, area, onSuccess }: ProcessoModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    empreendimento: '',
    processo: '',
    autor: '',
    descricao: '',
    status: 'Em Andamento',
    prioridade: 'Média',
    valor: '',
    dataAudiencia: '',
  })

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('processos')
        .insert([{
          ...formData,
          area,
          valor: formData.valor ? parseFloat(formData.valor) : null,
          dataAudiencia: formData.dataAudiencia || null,
        }])

      if (error) throw error

      alert('✅ Processo cadastrado com sucesso!')
      onSuccess()
      onClose()
      setFormData({
        empreendimento: '',
        processo: '',
        autor: '',
        descricao: '',
        status: 'Em Andamento',
        prioridade: 'Média',
        valor: '',
        dataAudiencia: '',
      })
    } catch (error) {
      console.error('Erro ao cadastrar processo:', error)
      alert('❌ Erro ao cadastrar processo!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-2xl font-bold">➕ Novo Processo {area === 'trabalhista' ? 'Trabalhista' : area === 'civil' ? 'Civil' : area === 'controles' ? 'Controle Interno' : 'Registro'}</h2>
          <button onClick={onClose} className="modal-close">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Empreendimento *</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Ex: Edifício Sunset"
                  value={formData.empreendimento}
                  onChange={(e) => setFormData({ ...formData, empreendimento: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nº Processo *</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Ex: 0000000-00.0000.0.00.0000"
                  value={formData.processo}
                  onChange={(e) => setFormData({ ...formData, processo: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {area === 'civil' ? 'Autor/Réu *' : 'Autor *'}
                </label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Nome completo"
                  value={formData.autor}
                  onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status *</label>
                <select
                  className="input w-full"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option>Em Andamento</option>
                  <option>Arquivado</option>
                  <option>Vitória</option>
                  <option>Condenação</option>
                  {area === 'controles' && <option>Concluído</option>}
                  {area === 'controles' && <option>Pendente</option>}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Prioridade *</label>
                <select
                  className="input w-full"
                  value={formData.prioridade}
                  onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
                  required
                >
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                  <option>Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input w-full"
                  placeholder="0.00"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Data da Audiência</label>
                <input
                  type="date"
                  className="input w-full"
                  value={formData.dataAudiencia}
                  onChange={(e) => setFormData({ ...formData, dataAudiencia: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Descrição *</label>
                <textarea
                  className="input w-full"
                  rows={4}
                  placeholder="Descreva o processo..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                <Save className="h-4 w-4" />
                {loading ? 'Salvando...' : 'Cadastrar Processo'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary flex-1"
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}