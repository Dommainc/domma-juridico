export function formatMoney(value: number | null | undefined): string {
  if (!value) return 'R$ 0,00'
  
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(2)}M`
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return '-'
  return new Date(date).toLocaleString('pt-BR')
}

export const EMPREENDIMENTOS = [
  'Unic Primavera',
  'Prime Caxias',
  'Seleto Primavera',
  'Reserva Equitativa',
  'Liv Primavera',
  'Rosario 2',
  'Rosario 3',
  'Unic São Gonçalo',
  'Inhauma',
  'Clube Maua',
  'Amorim e Rego',
  'Domma Incorporações',
  'VES',
  'Geral / Todos',
]

export const PRIORIDADES = ['Baixa', 'Média', 'Alta', 'Urgente']

export const STATUS_OPTIONS = ['Em Andamento', 'Arquivado', 'Vitória', 'Condenação']

export const ROLE_NAMES: Record<string, string> = {
  ti: 'TI',
  diretoria: 'Diretoria',
  advogada_terceirizada: 'Advogada Terceirizada',
  juridico_interno: 'Jurídico Interno',
}

export function canDeleteProcesso(role: string | undefined): boolean {
  return role === 'ti' || role === 'diretoria'
}

export function canManageUsers(role: string | undefined): boolean {
  return role === 'ti'
}