'use client'

import DashboardLayout from '@/components/DashboardLayout'
import ConfigModal from '@/components/ConfigModal'
import { FileText, Download, Settings, Moon, Users } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function DashboardPage() {
  const [showConfigMenu, setShowConfigMenu] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'tema' | 'usuarios'>('tema')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowConfigMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function openModal(type: 'tema' | 'usuarios') {
    setModalType(type)
    setShowModal(true)
    setShowConfigMenu(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="header">
          <div>
            <h1 className="header-title">⚖️ Controle Jurídico DOMMA</h1>
            <p className="header-subtitle">Sistema de Gestão de Demandas Jurídicas</p>
          </div>
          <div className="header-actions">
            <p className="text-slate-400 text-sm">👤 suporte.ti@dommainc.com.br</p>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                className="btn btn-secondary flex items-center gap-2"
                onClick={() => setShowConfigMenu(!showConfigMenu)}
              >
                <Settings className="h-4 w-4" />
                Configurações
              </button>

              {showConfigMenu && (
                <div className="config-dropdown">
                  <button 
                    className="config-dropdown-item"
                    onClick={() => openModal('tema')}
                  >
                    <Moon className="h-4 w-4" />
                    Tema
                  </button>
                  <button 
                    className="config-dropdown-item"
                    onClick={() => openModal('usuarios')}
                  >
                    <Users className="h-4 w-4" />
                    Usuários
                  </button>
                </div>
              )}
            </div>

            <button className="btn btn-primary">
              <FileText className="h-4 w-4" />
              Importar Planilha Excel
            </button>
            <button className="btn btn-primary">
              <Download className="h-4 w-4" />
              Exportar Relatório Mensal
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="stat-card card">
            <p className="stat-label">TOTAL DE PROCESSOS</p>
            <p className="stat-value">37</p>
          </div>
          <div className="stat-card card">
            <p className="stat-label">EM ANDAMENTO</p>
            <p className="stat-value text-yellow-400">17</p>
          </div>
          <div className="stat-card card">
            <p className="stat-label">VITÓRIAS</p>
            <p className="stat-value text-green-400">2</p>
          </div>
          <div className="stat-card card">
            <p className="stat-label">ARQUIVADOS</p>
            <p className="stat-value">17</p>
          </div>
          <div className="stat-card card">
            <p className="stat-label">CONDENAÇÕES</p>
            <p className="stat-value text-red-400">12</p>
          </div>
        </div>

        <div className="stat-card card">
          <p className="stat-label">VALOR TOTAL ENVOLVIDO</p>
          <p className="stat-value text-green-400">R$ 1.44M</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">📊 Processos por Status</h2>
          </div>
          <div className="card">
            <h2 className="text-xl font-bold mb-4">📈 Processos por Empreendimento (Top 5)</h2>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Resumo por Área</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ÁREA</th>
                <th>TOTAL</th>
                <th>EM ANDAMENTO</th>
                <th>ARQUIVADOS</th>
                <th>VITÓRIAS</th>
                <th>CONDENAÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Trabalhista</td>
                <td>27</td>
                <td>10</td>
                <td>17</td>
                <td>0</td>
                <td>11</td>
              </tr>
              <tr>
                <td className="font-bold">Civil</td>
                <td>9</td>
                <td>7</td>
                <td>0</td>
                <td>2</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="font-bold">Controles Internos</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="font-bold">Registro</td>
                <td>1</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ConfigModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        type={modalType}
      />
    </DashboardLayout>
  )
}