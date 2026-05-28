'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ROLE_NAMES, canManageUsers } from '@/lib/utils'
import type { UserProfile } from '@/lib/types'
import { Settings, LogOut, Users } from 'lucide-react'

interface HeaderProps {
  user: any
  profile: UserProfile | null
}

export default function Header({ user, profile }: HeaderProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold text-white">⚖️ DOMMA Jurídico</h1>
            <p className="text-sm text-gray-400">Sistema de Gestão de Demandas</p>
          </div>

          {/* User Info + Menu */}
          <div className="flex items-center gap-4">
            {/* Configurações */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Configurações"
              >
                <Settings className="h-5 w-5 text-gray-400" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-xs text-gray-400">Tema</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                    🌓 Alternar Tema
                  </button>
                  
                  {canManageUsers(profile?.role) && (
                    <>
                      <div className="px-4 py-2 border-t border-gray-700 mt-2">
                        <p className="text-xs text-gray-400">Administração</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowMenu(false)
                          router.push('/usuarios')
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <Users className="h-4 w-4" />
                        Gerenciar Usuários
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-600">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  👤 {profile?.full_name || user?.email}
                </p>
                <p className="text-xs text-gray-400">
                  {profile?.role ? ROLE_NAMES[profile.role] : 'Usuário'}
                </p>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-600 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="h-4 w-4 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}