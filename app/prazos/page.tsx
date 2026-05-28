'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import { Plus, Calendar, Clock, AlertTriangle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Processo } from '@/lib/types'

export default function PrazosPage() {
  const [processos, setProcessos] = useState<Processo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProcessos()
  }, [])

  async function loadProcessos() {
    try {
      const { data, error } = await supabase
        .from('processos')
        .select('*')
        .not('dataAudiencia', 'is', null)
        .order('dataAudiencia', { ascending: true })

      if (error) throw error
      setProcessos(data || [])
    } catch (error) {
      console.error('Erro ao carregar prazos:', error)
    } finally {
      setLoading(false)
    }
  }

  function getDaysUntil(date: string) {
    const hoje = new Date()
    const prazo = new Date(date)
    const diff = Math.ceil((prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const processosComPrazo = processos.map(p => ({
    ...p,
    diasRestantes: getDaysUntil(p.dataAudiencia!)
  }))

  const vencidos = processosComPrazo.filter(p => p.diasRestantes < 0)
  const criticos = processosComPrazo.filter(p => p.diasRestantes >= 0 && p.diasRestantes <= 3)
  const urgentes = processosComPrazo.filter(p => p.diasRestantes > 3 && p.diasRestantes <= 7)
  const normais = processosComPrazo.filter(p => p.diasRestantes > 7)

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
            <h1 className="header-title">⏰ Controle de Prazos</h1>
            <p className="header-subtitle">Audiências e datas importantes</p>
          </div>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4" />
            Agendar Audiência
          </button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat-card card">
            <p className="stat-label">VENCIDOS</p>
            <p className="stat-value text-red-400">{vencidos.length}</p>
            <AlertTriangle className="h-6 w-6 text-red-400 mt-2" />
          </div>

          <div className="stat-card card">
            <p className="stat-label">CRÍTICOS (0-3 DIAS)</p>
            <p className="stat-value text-orange-400">{criticos.length}</p>
            <Clock className="h-6 w-6 text-orange-400 mt-2" />
          </div>

          <div className="stat-card card">
            <p className="stat-label">URGENTES (4-7 DIAS)</p>
            <p className="stat-value text-yellow-400">{urgentes.length}</p>
            <Calendar className="h-6 w-6 text-yellow-400 mt-2" />
          </div>

          <div className="stat-card card">
            <p className="stat-label">NORMAIS (8+ DIAS)</p>
            <p className="stat-value text-green-400">{normais.length}</p>
            <Calendar className="h-6 w-6 text-green-400 mt-2" />
          </div>
        </div>

        {/* Próximas Audiências */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">📅 Próximas Audiências</h2>
          
          {processosComPrazo.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg font-medium">Nenhuma audiência agendada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {processosComPrazo.slice(0, 10).map((processo) => (
                <div
                  key={processo.id}
                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          processo.diasRestantes < 0 ? 'bg-red-600 text-white' :
                          processo.diasRestantes <= 3 ? 'bg-orange-600 text-white' :
                          processo.diasRestantes <= 7 ? 'bg-yellow-600 text-black' :
                          'bg-green-600 text-white'
                        }`}>
                          {processo.diasRestantes < 0 ? 'Vencido' :
                           processo.diasRestantes === 0 ? 'HOJE' :
                           processo.diasRestantes === 1 ? 'Amanhã' :
                           `${processo.diasRestantes} dias`}
                        </span>
                        <span className="text-sm text-slate-400">
                          {processo.area?.toUpperCase()}
                        </span>
                      </div>
                      
                      <h3 className="text-white font-semibold mb-1">
                        {processo.empreendimento || 'Sem empreendimento'}
                      </h3>
                      
                      <p className="text-slate-300 text-sm mb-2">
                        {processo.descricao || 'Sem descrição'}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(processo.dataAudiencia)}
                        </span>
                        {processo.autor && (
                          <span>Autor: {processo.autor}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}