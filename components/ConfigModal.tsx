'use client'

import { X, Moon, Sun, Trash2, Plus, UserPlus, Shield, Edit2 } from 'lucide-react'
import { useState, memo, useCallback } from 'react'

type ConfigModalProps = {
  isOpen: boolean
  onClose: () => void
  type: 'tema' | 'usuarios'
}

type Usuario = {
  id: string
  nome: string
  email: string
  nivel: 'T.I' | 'Diretoria' | 'Advogada Externa' | 'Jurídico Interno'
}

// Componente de usuário memorizado para evitar re-renders
const UserCard = memo(({ 
  usuario, 
  podeGerenciarUsuarios, 
  onEdit, 
  onDelete,
  getNivelBadgeClass,
  getNivelDescription 
}: any) => (
  <div className="user-card-improved">
    <div>
      <h3 className="font-semibold text-white mb-1">{usuario.nome}</h3>
      <p className="text-sm text-slate-400 mb-2">{usuario.email}</p>
      <p className="text-xs text-slate-500">{getNivelDescription(usuario.nivel)}</p>
    </div>
    <div>
      <span className={`badge ${getNivelBadgeClass(usuario.nivel)}`}>
        {usuario.nivel}
      </span>
      {podeGerenciarUsuarios && (
        <>
          <button onClick={() => onEdit(usuario)} className="btn-icon-edit" title="Editar">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(usuario.id)} className="btn-icon-danger" title="Excluir">
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  </div>
))

UserCard.displayName = 'UserCard'

export default function ConfigModal({ isOpen, onClose, type }: ConfigModalProps) {
  const [tema, setTema] = useState<'escuro' | 'claro'>('escuro')
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: '1', nome: 'Suporte TI', email: 'suporte.ti@dommainc.com.br', nivel: 'T.I' },
    { id: '2', nome: 'João Diretor', email: 'joao@dommainc.com.br', nivel: 'Diretoria' },
    { id: '3', nome: 'Dra. Maria Silva', email: 'maria@dommainc.com.br', nivel: 'Advogada Externa' },
    { id: '4', nome: 'Carlos Santos', email: 'carlos@dommainc.com.br', nivel: 'Jurídico Interno' },
  ])
  
  const [showAddUser, setShowAddUser] = useState(false)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    nivel: 'Jurídico Interno' as Usuario['nivel']
  })

  const usuarioLogado = { nivel: 'T.I' }
  const podeGerenciarUsuarios = usuarioLogado.nivel === 'T.I'

  const getNivelBadgeClass = useCallback((nivel: Usuario['nivel']) => {
    switch (nivel) {
      case 'T.I': return 'badge-ti'
      case 'Diretoria': return 'badge-diretoria'
      case 'Advogada Externa': return 'badge-advogada'
      case 'Jurídico Interno': return 'badge-juridico'
      default: return 'badge-info'
    }
  }, [])

  const getNivelDescription = useCallback((nivel: Usuario['nivel']) => {
    switch (nivel) {
      case 'T.I': return 'Acesso total + Gerenciar usuários'
      case 'Diretoria': return 'Acesso total a processos'
      case 'Advogada Externa': return 'Adicionar, editar e excluir processos'
      case 'Jurídico Interno': return 'Adicionar, editar e excluir processos'
      default: return ''
    }
  }, [])

  const handleEditUser = useCallback((usuario: Usuario) => {
    if (!podeGerenciarUsuarios) {
      alert('❌ Apenas usuários T.I podem editar usuários!')
      return
    }
    setEditingUser(usuario)
    setNovoUsuario({
      nome: usuario.nome,
      email: usuario.email,
      senha: '',
      nivel: usuario.nivel
    })
    setShowAddUser(true)
  }, [podeGerenciarUsuarios])

  const handleDeleteUser = useCallback((id: string) => {
    if (!podeGerenciarUsuarios) {
      alert('❌ Apenas usuários T.I podem excluir usuários!')
      return
    }
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsuarios(prev => prev.filter(u => u.id !== id))
    }
  }, [podeGerenciarUsuarios])

  const handleSaveUser = useCallback(() => {
    if (!podeGerenciarUsuarios) {
      alert('❌ Apenas usuários T.I podem gerenciar usuários!')
      return
    }

    if (!novoUsuario.nome || !novoUsuario.email) {
      alert('⚠️ Preencha nome e email!')
      return
    }

    if (!editingUser && !novoUsuario.senha) {
      alert('⚠️ Senha é obrigatória para novos usuários!')
      return
    }

    if (editingUser) {
      setUsuarios(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, nome: novoUsuario.nome, email: novoUsuario.email, nivel: novoUsuario.nivel }
          : u
      ))
      alert('✅ Usuário atualizado com sucesso!')
    } else {
      const newUser: Usuario = {
        id: Date.now().toString(),
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        nivel: novoUsuario.nivel
      }
      setUsuarios(prev => [...prev, newUser])
      alert('✅ Usuário adicionado com sucesso!')
    }

    setNovoUsuario({ nome: '', email: '', senha: '', nivel: 'Jurídico Interno' })
    setShowAddUser(false)
    setEditingUser(null)
  }, [editingUser, novoUsuario, podeGerenciarUsuarios])

  const handleCancelEdit = useCallback(() => {
    setShowAddUser(false)
    setEditingUser(null)
    setNovoUsuario({ nome: '', email: '', senha: '', nivel: 'Jurídico Interno' })
  }, [])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-2xl font-bold">
            {type === 'tema' ? '🌙 Configurações de Tema' : '👥 Gerenciar Usuários'}
          </h2>
          <button onClick={onClose} className="modal-close">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="modal-body">
          {type === 'tema' ? (
            <div className="space-y-6">
              <p className="text-slate-400">Escolha o tema da interface:</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setTema('escuro')} className={`tema-option ${tema === 'escuro' ? 'active' : ''}`}>
                  <Moon className="h-8 w-8 mb-3" />
                  <span className="font-semibold">Tema Escuro</span>
                  <span className="text-sm text-slate-400 mt-1">Padrão do sistema</span>
                </button>
                <button onClick={() => setTema('claro')} className={`tema-option ${tema === 'claro' ? 'active' : ''}`}>
                  <Sun className="h-8 w-8 mb-3" />
                  <span className="font-semibold">Tema Claro</span>
                  <span className="text-sm text-slate-400 mt-1">Em breve</span>
                </button>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mt-6">
                <p className="text-yellow-400 text-sm">⚠️ O tema claro estará disponível em breve!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {!podeGerenciarUsuarios && (
                <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Você não tem permissão para gerenciar usuários. Apenas <strong>T.I</strong> pode.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {usuarios.map(usuario => (
                  <UserCard
                    key={usuario.id}
                    usuario={usuario}
                    podeGerenciarUsuarios={podeGerenciarUsuarios}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    getNivelBadgeClass={getNivelBadgeClass}
                    getNivelDescription={getNivelDescription}
                  />
                ))}
              </div>

              {podeGerenciarUsuarios && !showAddUser && (
                <button onClick={() => setShowAddUser(true)} className="btn btn-primary w-full">
                  <UserPlus className="h-4 w-4" />
                  Adicionar Novo Usuário
                </button>
              )}

              {podeGerenciarUsuarios && showAddUser && (
                <div className="add-user-form">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    {editingUser ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        className="input w-full"
                        placeholder="Ex: João Silva"
                        value={novoUsuario.nome}
                        onChange={(e) => setNovoUsuario(prev => ({ ...prev, nome: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">E-mail</label>
                      <input
                        type="email"
                        className="input w-full"
                        placeholder="joao@dommainc.com.br"
                        value={novoUsuario.email}
                        onChange={(e) => setNovoUsuario(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Senha {editingUser && '(deixe em branco para manter)'}
                      </label>
                      <input
                        type="password"
                        className="input w-full"
                        placeholder="••••••••"
                        value={novoUsuario.senha}
                        onChange={(e) => setNovoUsuario(prev => ({ ...prev, senha: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Nível de Permissão</label>
                      <select
                        className="input w-full"
                        value={novoUsuario.nivel}
                        onChange={(e) => setNovoUsuario(prev => ({ ...prev, nivel: e.target.value as Usuario['nivel'] }))}
                      >
                        <option value="Jurídico Interno">Jurídico Interno</option>
                        <option value="Advogada Externa">Advogada Externa</option>
                        <option value="Diretoria">Diretoria</option>
                        <option value="T.I">T.I</option>
                      </select>
                      <p className="text-xs text-slate-500 mt-2">{getNivelDescription(novoUsuario.nivel)}</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button onClick={handleSaveUser} className="btn btn-primary flex-1">
                        {editingUser ? 'Salvar Alterações' : 'Adicionar Usuário'}
                      </button>
                      <button onClick={handleCancelEdit} className="btn btn-secondary flex-1">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}