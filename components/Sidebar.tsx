'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Scale, LayoutDashboard, Briefcase, Scale as ScaleIcon, FileText, FolderOpen, Clock, LogOut } from 'lucide-react'

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', emoji: '📊' },
  { href: '/trabalhista', icon: Briefcase, label: 'Trabalhista', emoji: '👷' },
  { href: '/civil', icon: ScaleIcon, label: 'Civil', emoji: '⚖️' },
  { href: '/controles', icon: FolderOpen, label: 'Controles Internos', emoji: '📂' },
  { href: '/registro', icon: FileText, label: 'Registro', emoji: '📋' },
  { href: '/prazos', icon: Clock, label: 'Prazos', emoji: '⏰' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="flex items-center gap-3 mb-2">
          <Scale className="h-8 w-8 text-blue-400" />
          <h1 className="sidebar-title">DOMMA Jurídico</h1>
        </div>
        <p className="sidebar-subtitle">Sistema de Gestão de Demandas Jurídicas</p>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`menu-item ${isActive ? 'active' : ''}`}
            >
              <span className="menu-icon">{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Espaçador para empurrar conteúdo pro final */}
      <div className="flex-1"></div>

      {/* Email e Botão Sair */}
      <div className="p-6 border-t border-slate-700 space-y-4">
        <p className="text-sm text-slate-400">👤 suporte.ti@dommainc.com.br</p>
        <button className="btn btn-secondary w-full text-sm">
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>

      {/* Footer bem lá embaixo */}
      <div className="p-6 text-center border-t border-slate-700">
        <p className="text-xs text-slate-500">DOMMA Incorporações</p>
        <p className="text-xs text-slate-600">© 2026</p>
      </div>
    </div>
  )
}