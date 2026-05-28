'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ROLE_NAMES } from '@/lib/utils'
import type { UserProfile } from '@/lib/types'
import { UserPlus, Trash2, Shield } from 'lucide-react'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    loadCurrentUser()
    loadUsuarios()
  }, [])

  async function loadCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setCurrentUser(data)
    }
  }

  async function loadUsuarios() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsuarios(data || [])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  if (currentUser?.role !== 'ti') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">🔒 Acesso Negado</h1>
        <div className="card">
          <p className="text-gray-400">Apenas usuários com perfil TI podem acessar esta página.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">👥 Gerenciar Usuários</h1>
          <p className="text-gray-400 mt-1">Administração de acessos e permissões</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Criar Usuário
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Perfil</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Criado em</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 text-white">
                    {usuario.full_name || 'Sem nome'}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {usuario.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white flex items-center gap-1 w-fit">
                      <Shield className="h-3 w-3" />
                      {ROLE_NAMES[usuario.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="p-2 hover:bg-red-600 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4 text-gray-300" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card bg-blue-900/20 border-blue-700">
        <h3 className="text-lg font-semibold text-white mb-2">ℹ️ Informação</h3>
        <p className="text-gray-300 text-sm">
          A criação de novos usuários deve ser feita através do Supabase Auth. 
          Após o cadastro, defina o perfil do usuário executando o SQL no Supabase:
        </p>
        <pre className="bg-gray-800 p-3 rounded mt-3 text-xs text-gray-300 overflow-x-auto">
{`UPDATE public.user_profiles
SET role = 'ti' -- ou 'diretoria', 'advogada_terceirizada', 'juridico_interno'
WHERE email = 'email@domma.com.br';`}
        </pre>
      </div>
    </div>
  )
}