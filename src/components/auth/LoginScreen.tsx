'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Scale, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginScreen() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn(email, password)
    if (err) setError(err)
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10000,
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: 'absolute', top: '20%', left: '15%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(15,114,229,0.15) 0%, transparent 70%)',
        animation: 'pulse-glow 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '10%',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(0,217,163,0.1) 0%, transparent 70%)',
        animation: 'pulse-glow 10s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: 'var(--card-gradient)',
        padding: '48px 40px',
        borderRadius: 20,
        border: '1px solid var(--border)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(15,114,229,0.1)',
        width: '90%',
        maxWidth: 420,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #0f72e5, #0a5ec2)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(15,114,229,0.4)',
          }}>
            <Scale size={32} color="white" />
          </div>
          <h1 style={{
            fontSize: '1.8em',
            fontWeight: 800,
            background: 'var(--title-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 6,
          }}>
            DOMMA Jurídico
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9em' }}>
            Sistema de Controle Jurídico
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={{
              display: 'block', color: 'var(--text-muted)', fontSize: '0.8em',
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 600,
            }}>E-mail</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={{
                  width: '100%', padding: '12px 12px 12px 40px',
                  background: 'var(--secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--text)',
                  fontSize: '0.95em', outline: 'none',
                  transition: 'all 0.3s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#0f72e5'
                  e.target.style.boxShadow = '0 0 0 3px rgba(15,114,229,0.2)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24, position: 'relative' }}>
            <label style={{
              display: 'block', color: 'var(--text-muted)', fontSize: '0.8em',
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontWeight: 600,
            }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '12px 40px 12px 40px',
                  background: 'var(--secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--text)',
                  fontSize: '0.95em', outline: 'none',
                  transition: 'all 0.3s',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#0f72e5'
                  e.target.style.boxShadow = '0 0 0 3px rgba(15,114,229,0.2)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border)'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(255,87,87,0.15)', border: '1px solid rgba(255,87,87,0.3)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              color: '#ff5757', fontSize: '0.85em',
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? 'var(--border)' : 'linear-gradient(135deg, #0f72e5, #0a5ec2)',
              border: 'none', borderRadius: 10,
              color: '#fff', fontSize: '1em', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Bricolage Grotesque, sans-serif',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(15,114,229,0.4)',
              transition: 'all 0.3s',
              letterSpacing: 0.5,
            }}
          >
            {loading ? '⏳ Entrando...' : '⚖️ Entrar no Sistema'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8em',
          marginTop: 24, lineHeight: 1.5,
        }}>
          Acesso gerenciado pela equipe de TI.<br />
          Em caso de problemas, contate o suporte.
        </p>
      </div>
    </div>
  )
}
