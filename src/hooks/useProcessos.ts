'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Processo, AreaType, Comentario, AuditLog } from '@/types'
import { useAuth } from './useAuth'

export function useProcessos(area: AreaType) {
  const { user, profile } = useAuth()
  const [processos, setProcessos] = useState<Processo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProcessos = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('processos')
        .select('*')
        .eq('area', area)
        .order('created_at', { ascending: false })
      if (error) throw error
      setProcessos(data as Processo[])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar dados'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [area, user])

  useEffect(() => {
    fetchProcessos()

    // Realtime subscription
    const channel = supabase
      .channel(`processos-${area}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'processos',
        filter: `area=eq.${area}`,
      }, () => fetchProcessos())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [area, fetchProcessos])

  async function saveProcesso(item: Partial<Processo>): Promise<Processo | null> {
    if (!user) return null
    try {
      const payload: Partial<Processo> & { area: AreaType; user_id: string } = {
        ...item,
        area,
        user_id: user.id,
      }

      const isNew = !item.id
      let savedData: Processo

      if (isNew) {
        const { data, error } = await supabase.from('processos').insert(payload).select().single()
        if (error) throw error
        savedData = data as Processo
      } else {
        const { data, error } = await supabase
          .from('processos')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', item.id!)
          .select()
          .single()
        if (error) throw error
        savedData = data as Processo

        // Log audit
        if (!isNew) {
          const original = processos.find(p => p.id === item.id)
          if (original) {
            const changes = getChanges(original, item)
            if (changes.length > 0) {
              await supabase.from('audit_logs').insert(
                changes.map(c => ({
                  processo_id: item.id,
                  user_id: user.id,
                  user_name: profile?.full_name || user.email,
                  ...c,
                }))
              )
            }
          }
        }
      }

      await fetchProcessos()
      return savedData
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar'
      setError(msg)
      throw new Error(msg)
    }
  }

  async function deleteProcesso(id: number): Promise<boolean> {
    try {
      const { error } = await supabase.from('processos').delete().eq('id', id)
      if (error) throw error
      await fetchProcessos()
      return true
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao deletar'
      setError(msg)
      return false
    }
  }

  return { processos, loading, error, saveProcesso, deleteProcesso, refetch: fetchProcessos }
}

export function useAllProcessos() {
  const { user } = useAuth()
  const [all, setAll] = useState<{ trabalhista: Processo[]; civil: Processo[]; controles: Processo[]; registro: Processo[] }>({
    trabalhista: [], civil: [], controles: [], registro: [],
  })
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase.from('processos').select('*').order('created_at', { ascending: false })
      if (error) throw error
      const grouped: typeof all = { trabalhista: [], civil: [], controles: [], registro: [] }
      for (const p of (data as Processo[])) {
        grouped[p.area as AreaType]?.push(p)
      }
      setAll(grouped)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  return { ...all, loading, refetch: fetch }
}

export async function getComentarios(processoId: number): Promise<Comentario[]> {
  const { data, error } = await supabase
    .from('comentarios')
    .select('*')
    .eq('processo_id', processoId)
    .order('created_at', { ascending: true })
  if (error) return []
  return data as Comentario[]
}

export async function addComentario(
  processoId: number,
  userId: string,
  userName: string,
  texto: string
): Promise<Comentario | null> {
  const { data, error } = await supabase
    .from('comentarios')
    .insert({ processo_id: processoId, user_id: userId, user_name: userName, texto })
    .select()
    .single()
  if (error) return null
  return data as Comentario
}

export async function getAuditLogs(processoId: number): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('processo_id', processoId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data as AuditLog[]
}

function getChanges(original: Partial<Processo>, updated: Partial<Processo>) {
  const watched: (keyof Processo)[] = ['status', 'prioridade', 'responsavel', 'valor_envolvido', 'valor_desfecho', 'desfecho']
  return watched
    .filter(k => original[k] !== updated[k] && updated[k] !== undefined)
    .map(k => ({
      campo: k,
      valor_anterior: String(original[k] ?? ''),
      valor_novo: String(updated[k] ?? ''),
    }))
}
