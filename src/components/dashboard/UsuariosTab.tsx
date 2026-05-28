'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { UserProfile, UserRole } from '@/types'
import { ROLE_LABELS } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { UserPlus, Edit2, Save, X } from 'lucide-react'

export default function UsuariosTab() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState<UserRole>('juridico')
  const [editName, setEditName] = useState('')
  const [creating, setCreating] = useState(false)
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', role: 'juridico' as UserRole })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    const { data, error } = await supabase.from('user_profiles').select('*').order('full_name')
    if (!error) setUsers(data as UserProfile[])
    setLoading(false)
  }

  async function handleUpdateRole(userId: string) {
    setSaving(true)
    const { error } = await supabase.from('user_profiles').update({
      role: editRole,
      full_name: editName,
    }).eq('id', userId)
    if (!error) { await loadUsers(); setEditingId(null) }
    setSaving(false)
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      // Create user via Supabase Auth (admin would use service key, but for now use regular signUp)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: { data: { full_name: newUser.full_name } },
      })
      if (signUpError) throw signUpError

      // Update role immediately if user was created
      if (data.user) {
        await supabase.from('user_profiles').upsert({
          id: data.user.id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role,
        })
      }

      setCreating(false)
      setNewUser({ email: '', password: '', full_name: '', role: 'juridico' })
      await loadUsers()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar usuário'
      setError(msg)
    }
    setSaving(false)
  }

  const roleColors: Record<UserRole, string> = {
    ti: '#e94560',
    diretoria: '#ffa800',
    juridico: '#00d9a3',
    advogada_terceirizada: '#4a9eff',
  }

  if (loading) return (
    <div>
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 64, borderRadius: 10, marginBottom: 8 }} />
      ))}
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.2em' }}>👥 Gerenciar Usuários</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85em', marginTop: 4 }}>
            Acesso restrito à equipe de TI. {users.length} usuários cadastrados.
          </p>
        </div>
        <button onClick={() => setCreating(true)} style={{
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #e94560, #c93550)',
          border: 'none', borderRadius: 10,
          color: '#fff', cursor: 'pointer', fontWeight: 700,
          fontFamily: 'Bricolage Grotesque, sans-serif',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 16px rgba(233,69,96,0.3)',
        }}>
          <UserPlus size={16} /> Novo Usuário
        </button>
      </div>

      {/* Create user form */}
      {creating && (
        <div style={{
          background: 'var(--card)', border: '1px solid #e94560', borderRadius: 14,
          padding: 24, marginBottom: 20, animation: 'fadeIn 0.3s ease',
        }}>
          <h3 style={{ marginBottom: 20, fontWeight: 700, color: '#e94560' }}>➕ Criar Novo Usuário</h3>
          <form onSubmit={handleCreateUser}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78em', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                  Nome Completo
                </label>
                <input value={newUser.full_name} onChange={e => setNewUser(u => ({ ...u, full_name: e.target.value }))}
                  required placeholder="Ex: Maria Silva"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', outline: 'none', fontFamily: 'Bricolage Grotesque, sans-serif' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78em', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                  Email
                </label>
                <input type="email" value={newUser.email} onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))}
                  required placeholder="email@domma.com.br"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', outline: 'none', fontFamily: 'Bricolage Grotesque, sans-serif' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78em', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                  Senha Inicial
                </label>
                <input type="password" value={newUser.password} onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))}
                  required minLength={6} placeholder="Mínimo 6 caracteres"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', outline: 'none', fontFamily: 'Bricolage Grotesque, sans-serif' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78em', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                  Nível de Acesso
                </label>
                <select value={newUser.role} onChange={e => setNewUser(u => ({ ...u, role: e.target.value as UserRole }))}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', outline: 'none', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                  <option value="juridico">Jurídico Interno</option>
                  <option value="advogada_terceirizada">Advogada Terceirizada</option>
                  <option value="diretoria">Diretoria</option>
                  <option value="ti">TI</option>
                </select>
              </div>
            </div>
            {error && (
              <div style={{ background: 'rgba(255,87,87,0.15)', border: '1px solid rgba(255,87,87,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#ff5757', fontSize: '0.85em' }}>
                ⚠️ {error}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => { setCreating(false); setError('') }}
                style={{ padding: '10px 20px', background: '#16213e', border: '1px solid #2a2a3e', borderRadius: 8, color: '#f5f5f5', cursor: 'pointer', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Cancelar
              </button>
              <button type="submit" disabled={saving}
                style={{ padding: '10px 24px', background: saving ? '#2a2a3e' : 'linear-gradient(135deg, #e94560, #c93550)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 700, fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                {saving ? 'Criando...' : '✓ Criar Usuário'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users list */}
      <div style={{ background: '#1a1a2e', borderRadius: 14, border: '1px solid #2a2a3e', overflow: 'hidden' }}>
        <table style={{ minWidth: 600 }}>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Email</th>
              <th>Nível de Acesso</th>
              <th>Cadastrado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      background: `linear-gradient(135deg, ${roleColors[u.role]}, #0f3460)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85em',
                    }}>
                      {u.full_name[0]?.toUpperCase()}
                    </div>
                    {editingId === u.id ? (
                      <input value={editName} onChange={e => setEditName(e.target.value)}
                        style={{ padding: '6px 10px', background: '#0f0f1e', border: '1px solid #e94560', borderRadius: 6, color: '#f5f5f5', outline: 'none', width: 160, fontSize: '0.9em' }} />
                    ) : (
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9em' }}>{u.full_name}</div>
                        {u.id === currentUser?.id && <span style={{ color: '#a0a0a0', fontSize: '0.73em' }}>• Você</span>}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ color: '#a0a0a0', fontSize: '0.88em', fontFamily: 'JetBrains Mono, monospace' }}>{u.email}</td>
                <td>
                  {editingId === u.id ? (
                    <select value={editRole} onChange={e => setEditRole(e.target.value as UserRole)}
                      style={{ padding: '6px 10px', background: '#0f0f1e', border: '1px solid #e94560', borderRadius: 6, color: '#f5f5f5', outline: 'none', fontSize: '0.85em' }}>
                      <option value="juridico">Jurídico Interno</option>
                      <option value="advogada_terceirizada">Advogada Terceirizada</option>
                      <option value="diretoria">Diretoria</option>
                      <option value="ti">TI</option>
                    </select>
                  ) : (
                    <span style={{
                      padding: '4px 12px', borderRadius: 12,
                      background: `${roleColors[u.role]}22`,
                      color: roleColors[u.role],
                      border: `1px solid ${roleColors[u.role]}44`,
                      fontSize: '0.8em', fontWeight: 700,
                    }}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  )}
                </td>
                <td style={{ color: '#a0a0a0', fontSize: '0.82em' }}>
                  {new Date(u.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td>
                  {editingId === u.id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleUpdateRole(u.id)} disabled={saving}
                        style={{ padding: '5px 10px', background: 'rgba(0,217,163,0.15)', border: '1px solid rgba(0,217,163,0.3)', borderRadius: 6, color: '#00d9a3', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82em' }}>
                        <Save size={12} /> {saving ? '...' : 'Salvar'}
                      </button>
                      <button onClick={() => setEditingId(null)}
                        style={{ padding: '5px 10px', background: '#16213e', border: '1px solid #2a2a3e', borderRadius: 6, color: '#f5f5f5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82em' }}>
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditingId(u.id); setEditRole(u.role); setEditName(u.full_name) }}
                      style={{ padding: '5px 10px', background: '#16213e', border: '1px solid #2a2a3e', borderRadius: 6, color: '#f5f5f5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82em' }}>
                      <Edit2 size={12} /> Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
