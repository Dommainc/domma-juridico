export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      processos: {
        Row: {
          id: number
          area: string
          empreendimento: string
          autor: string | null
          descricao: string | null
          responsavel: string | null
          prioridade: string
          status: string
          processo: string | null
          valorEnvolvido: number | null
          desfecho: string | null
          valorDesfecho: number | null
          dataInicio: string | null
          dataConclusao: string | null
          dataAudiencia: string | null
          observacoes: string | null
          tags: string | null
          documentos: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          area: string
          empreendimento: string
          autor?: string | null
          descricao?: string | null
          responsavel?: string | null
          prioridade?: string
          status?: string
          processo?: string | null
          valorEnvolvido?: number | null
          desfecho?: string | null
          valorDesfecho?: number | null
          dataInicio?: string | null
          dataConclusao?: string | null
          dataAudiencia?: string | null
          observacoes?: string | null
          tags?: string | null
          documentos?: string | null
        }
        Update: {
          id?: number
          area?: string
          empreendimento?: string
          autor?: string | null
          descricao?: string | null
          responsavel?: string | null
          prioridade?: string
          status?: string
          processo?: string | null
          valorEnvolvido?: number | null
          desfecho?: string | null
          valorDesfecho?: number | null
          dataInicio?: string | null
          dataConclusao?: string | null
          dataAudiencia?: string | null
          observacoes?: string | null
          tags?: string | null
          documentos?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'ti' | 'diretoria' | 'advogada_terceirizada' | 'juridico_interno'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'ti' | 'diretoria' | 'advogada_terceirizada' | 'juridico_interno'
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'ti' | 'diretoria' | 'advogada_terceirizada' | 'juridico_interno'
        }
      }
      comentarios: {
        Row: {
          id: number
          processo_id: number
          user_id: string
          user_name: string
          texto: string
          created_at: string
        }
        Insert: {
          id?: number
          processo_id: number
          user_id: string
          user_name: string
          texto: string
        }
        Update: {
          id?: number
          processo_id?: number
          user_id?: string
          user_name?: string
          texto?: string
        }
      }
    }
  }
}

export type Processo = Database['public']['Tables']['processos']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Comentario = Database['public']['Tables']['comentarios']['Row']

export type UserRole = 'ti' | 'diretoria' | 'advogada_terceirizada' | 'juridico_interno'

export interface ProcessoWithComentarios extends Processo {
  comentarios?: Comentario[]
}