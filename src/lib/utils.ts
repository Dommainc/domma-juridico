import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { StatusType, PrioridadeType } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(value: number | null | undefined): string {
  if (!value && value !== 0) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('pt-BR')
  } catch {
    return '-'
  }
}

export function calculateDaysRemaining(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return `${Math.abs(diff)} dias atrás`
    if (diff === 0) return 'Hoje'
    return `${diff} dias`
  } catch {
    return '-'
  }
}

export function getDaysRemainingNumber(dateStr: string | null | undefined): number {
  if (!dateStr) return Infinity
  try {
    const date = new Date(dateStr + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  } catch {
    return Infinity
  }
}

export function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    'Em Andamento': 'andamento',
    'Arquivado': 'arquivado',
    'Vitória': 'vitoria',
    'Condenação': 'condenacao',
    'Concluído': 'concluido',
    'Acordo': 'acordo',
  }
  return map[status] || 'andamento'
}

export function getPrioridadeColor(prioridade: PrioridadeType | string): string {
  const map: Record<string, string> = {
    Alta: 'text-danger',
    Urgente: 'text-danger',
    Média: 'text-warning',
    Baixa: 'text-success',
  }
  return map[prioridade] || 'text-text-muted'
}

export function getStatusBadgeClass(status: StatusType | string): string {
  const map: Record<string, string> = {
    'Em Andamento': 'bg-warning text-bg',
    Arquivado: 'bg-text-muted text-bg',
    Vitória: 'bg-success text-bg',
    Condenação: 'bg-danger text-bg',
    Concluído: 'bg-success text-bg',
    Acordo: 'bg-info text-bg',
  }
  return map[status] || 'bg-text-muted text-bg'
}

export const ROLE_LABELS: Record<string, string> = {
  ti: 'TI',
  diretoria: 'Diretoria',
  juridico: 'Jurídico Interno',
  advogada_terceirizada: 'Advogada Terceirizada',
}

export const AREA_LABELS: Record<string, string> = {
  trabalhista: 'Trabalhista',
  civil: 'Civil',
  controles: 'Controles Int.',
  registro: 'Registro',
}
