'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { ROLE_LABELS } from '@/lib/utils'
import { LogOut, Users, Scale, Sun, Moon, Bell } from 'lucide-react'
import { TabType } from '@/types'

interface HeaderProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  notifications?: number
}

const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'trabalhista', label: 'Trabalhista', icon: '👷' },
  { id: 'civil', label: 'Civil', icon: '🏛️' },
  { id: 'controles', label: 'Controles Int.', icon: '📋' },
  { id: 'registro', label: 'Registro', icon: '📁' },
  { id: 'prazos', label: 'Prazos', icon: '⏰' },
]

export default function Header({ activeTab, onTabChange, notifications = 0 }: HeaderProps) {
  const { profile, signOut, canManageUsers } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <div style={{ position: 'relative', zIndex: 10 }}>
      {/* Top bar */}
      <div style={{
        background: 'var(--card-gradient)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '24px 32px',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute', top: '-50%', right: '-20%',
          width: '60%', height: '200%',
          background: 'radial-gradient(circle, rgba(233,69,96,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {/* Logo section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48, height: 48,
              background: 'linear-gradient(135deg, #e94560, #c93550)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(233,69,96,0.4)',
              flexShrink: 0,
            }}>
              <Scale size={24} color="white" />
            </div>
            <div>
              <h1 style={{
                fontSize: '1.5em', fontWeight: 800,
                background: 'var(--title-gradient)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', lineHeight: 1.2,
              }}>
                Controle Jurídico DOMMA
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8em', marginTop: 2 }}>
                Sistema de Gestão de Demandas Jurídicas
              </p>
            </div>
          </div>

          {/* User section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Notification bell */}
            {notifications > 0 && (
              <div style={{ position: 'relative', cursor: 'pointer' }}>
                <Bell size={20} color="var(--text-muted)" />
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  background: '#e94560', color: 'white',
                  width: 16, height: 16, borderRadius: '50%',
                  fontSize: '0.65em', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {notifications}
                </span>
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              style={{
                padding: '8px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                borderRadius: 10, color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                transition: 'all 0.2s',
              }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User info */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 14px',
              background: 'var(--bg-subtle)',
              borderRadius: 10, border: '1px solid var(--border)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #e94560, #0f3460)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85em', flexShrink: 0, color: '#fff',
              }}>
                {(profile?.full_name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85em', lineHeight: 1.2, color: 'var(--text)' }}>
                  {profile?.full_name || 'Usuário'}
                </div>
                <div style={{ color: '#e94560', fontSize: '0.75em', fontWeight: 600 }}>
                  {ROLE_LABELS[profile?.role || 'juridico']}
                </div>
              </div>
            </div>

            {/* Manage users (TI only) */}
            {canManageUsers() && (
              <button
                onClick={() => onTabChange('usuarios')}
                style={{
                  padding: '8px 14px',
                  background: activeTab === 'usuarios' ? 'linear-gradient(135deg, #e94560, #c93550)' : 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: 10, color: activeTab === 'usuarios' ? '#fff' : 'var(--text)',
                  cursor: 'pointer', fontSize: '0.85em', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  transition: 'all 0.2s',
                }}
              >
                <Users size={16} /> Usuários
              </button>
            )}

            {/* Logout */}
            <button
              onClick={signOut}
              style={{
                padding: '8px 14px',
                background: 'rgba(255,87,87,0.1)',
                border: '1px solid rgba(255,87,87,0.2)',
                borderRadius: 10, color: '#ff5757',
                cursor: 'pointer', fontSize: '0.85em',
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'Bricolage Grotesque, sans-serif',
                transition: 'all 0.2s',
              }}
            >
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'nowrap',
        padding: '12px 16px',
        background: 'var(--card)',
        borderRadius: 14, border: '1px solid var(--border)',
        overflowX: 'auto', marginBottom: 24,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '10px 20px',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, #e94560, #c93550)'
                : 'var(--secondary)',
              border: `1px solid ${activeTab === tab.id ? '#e94560' : 'var(--border)'}`,
              borderRadius: 10, color: activeTab === tab.id ? '#fff' : 'var(--text)',
              cursor: 'pointer', fontSize: '0.9em', fontWeight: 600,
              whiteSpace: 'nowrap',
              fontFamily: 'Bricolage Grotesque, sans-serif',
              boxShadow: activeTab === tab.id ? '0 0 20px rgba(233,69,96,0.4)' : 'none',
              transition: 'all 0.25s ease',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
