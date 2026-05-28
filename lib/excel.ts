import * as XLSX from 'xlsx'

export function exportToExcel(data: any[], filename: string) {
  // Preparar dados para export
  const exportData = data.map(item => ({
    'Empreendimento': item.empreendimento || '',
    'Processo': item.processo || '',
    'Autor': item.autor || '',
    'Descrição': item.descricao || '',
    'Status': item.status || '',
    'Prioridade': item.prioridade || '',
    'Valor': item.valor ? `R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '',
    'Data Audiência': item.dataAudiencia ? new Date(item.dataAudiencia).toLocaleDateString('pt-BR') : '',
    'Área': item.area || '',
  }))

  // Criar worksheet
  const ws = XLSX.utils.json_to_sheet(exportData)
  
  // Criar workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Processos')
  
  // Salvar arquivo
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export async function importFromExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        // Mapear colunas do Excel para formato do sistema
        const mappedData = jsonData.map((row: any) => ({
          empreendimento: row['Empreendimento'] || row['empreendimento'] || '',
          processo: row['Processo'] || row['processo'] || '',
          autor: row['Autor'] || row['autor'] || '',
          descricao: row['Descrição'] || row['Descricao'] || row['descricao'] || '',
          status: row['Status'] || row['status'] || 'Em Andamento',
          prioridade: row['Prioridade'] || row['prioridade'] || 'Média',
          valor: row['Valor'] ? parseFloat(row['Valor'].toString().replace(/[^\d,.-]/g, '').replace(',', '.')) : null,
          dataAudiencia: row['Data Audiência'] || row['Data Audiencia'] || row['dataAudiencia'] || null,
        }))
        
        resolve(mappedData)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
    reader.readAsArrayBuffer(file)
  })
}