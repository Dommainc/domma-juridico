'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import { Plus, Download, Upload, FileText, User, DollarSign, ClipboardList } from 'lucide-react'
import type { Processo } from '@/lib/types'

export default function RegistroPage() {
  const [processos, setProcessos] = useState<Processo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos os Status')
  const [prioridadeFilter, setPrioridadeFilter] = useState('Todas Prioridades')

  useEffect(() => {
    loadProcessos()
  }, [])

  async function loadProcessos() {
    try {
      const { data, error } = await supabase
        .from('processos')
        .select('*')
        .eq('area', 'registro')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProcessos(data || [])
    } catch (error) {
      console.error('Erro ao carregar registros:', error)
    } finally {
      setLoading(false)
    }
  }

  const processosFiltrados = processos.filter(p => {
    const matchSearch = !searchTerm || 
      p.empreendimento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchStatus = statusFilter === 'Todos os Status' || p.status === statusFilter
    const matchPrioridade = prioridadeFilter === 'Todas Prioridades' || p.prioridade === prioridadeFilter
    
    return matchSearch && matchStatus && matchPrioridade
  })

  const stats = {
    total: processosFiltrados.length,
    emAndamento: processosFiltrados.filter(p => p.status === 'Em Andamento').length,
    vitorias: processosFiltrados.filter(p => p.status === 'Vitória').length,
    condenacoes: processosFiltrados.filter(p => p.status === 'Condenação').length,
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="header">
          <div>
            <h1 className="header-title">📋 Registro</h1>
            <p className="header-subtitle">Gerenciar registros e documentações</p>
          </div>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4" />
            Novo Registro
          </button>
        </div>

        {/* Filtros */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Buscar por empreendimento, descrição..."
                className="input w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>Todos os Status</option>
              <option>Em Andamento</option>
              <option>Arquivado</option>
              <option>Vitória</option>
              <option>Condenação</option>
            </select>

            <select
              className="input"
              value={prioridadeFilter}
              onChange={(e) => setPrioridadeFilter(e.target.value)}
            >
              <option>Todas Prioridades</option>
              <option>Baixa</option>
              <option>Média</option>
              <option>Alta</option>
              <option>Urgente</option>
            </select>
          </div>

          <div className="flex gap-6">
            <button className="btn btn-primary">
              <Download className="h-4 w-4" />
              Exportar Excel
            </button>
            <button className="btn btn-primary">
              <Upload className="h-4 w-4" />
              Importar Excel
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat-card card">
            <p className="stat-label">TOTAL</p>
            <p className="stat-value">{stats.total}</p>
          </div>

          <div className="stat-card card">
            <p className="stat-label">EM ANDAMENTO</p>
            <p className="stat-value text-yellow-400">{stats.emAndamento}</p>
          </div>

          <div className="stat-card card">
            <p className="stat-label">VITÓRIAS</p>
            <p className="stat-value text-green-400">{stats.vitorias}</p>
          </div>

          <div className="stat-card card">
            <p className="stat-label">CONDENAÇÕES</p>
            <p className="stat-value text-red-400">{stats.condenacoes}</p>
          </div>
        </div>

        {/* Tabela */}
        <div className="card">
          {processosFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <ClipboardList className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg font-medium">Nenhum processo encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>EMPREENDIMENTO</th>
                    <th>PROCESSO</th>
                    <th>DESCRIÇÃO</th>
                    <th>STATUS</th>
                    <th>PRIORIDADE</th>
                    <th>VALOR</th>
                    <th>AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {processosFiltrados.map((processo) => (
                    <tr key={processo.id}>
                      <td className="font-medium">{processo.empreendimento || '-'}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-400" />
                          <span className="text-sm">{processo.processo || '-'}</span>
                        </div>
                      </td>
                      <td className="max-w-xs">
                        <span className="text-sm">{processo.descricao || '-'}</span>
                      </td>
                      <td>
                        <span className={`badge ${
                          processo.status === 'Vitória' ? 'badge-success' :
                          processo.status === 'Condenação' ? 'badge-danger' :
                          processo.status === 'Arquivado' ? 'badge-info' :
                          'badge-warning'
                        }`}>
                          {processo.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          processo.prioridade === 'Urgente' ? 'badge-danger' :
                          processo.prioridade === 'Alta' ? 'badge-warning' :
                          'badge-info'
                        }`}>
                          {processo.prioridade}
                        </span>
                      </td>
                      <td>
                        {processo.valor ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span className="text-sm font-medium">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(processo.valor)}
                            </span>
                          </div>
                        ) : '-'}
                      </td>
                      <td>
                        <button className="btn btn-secondary text-xs px-3 py-1.5">
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}