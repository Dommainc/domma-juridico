'use client'

import { useMemo } from 'react'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import type { Processo } from '@/lib/types'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface ChartsProps {
  processos: Processo[]
}

export default function Charts({ processos }: ChartsProps) {
  // Dados para gráfico de status
  const statusData = useMemo(() => {
    const counts = processos.reduce((acc, p) => {
      const status = p.status || 'Sem Status'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            '#3b82f6', // Azul
            '#10b981', // Verde
            '#f59e0b', // Amarelo
            '#ef4444', // Vermelho
          ],
          borderWidth: 2,
          borderColor: '#1e293b',
        },
      ],
    }
  }, [processos])

  // Dados para gráfico de empreendimentos
  const empreendimentosData = useMemo(() => {
    const counts = processos.reduce((acc, p) => {
      const emp = p.empreendimento || 'Sem Empreendimento'
      acc[emp] = (acc[emp] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Top 10 empreendimentos
    const sorted = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)

    return {
      labels: sorted.map(([name]) => name),
      datasets: [
        {
          label: 'Processos por Empreendimento',
          data: sorted.map(([, count]) => count),
          backgroundColor: '#3b82f6',
          borderColor: '#1e3a8a',
          borderWidth: 1,
        },
      ],
    }
  }, [processos])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e5e7eb',
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
  }

  const barOptions = {
    ...options,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#e5e7eb',
          stepSize: 1,
        },
        grid: {
          color: '#374151',
        },
      },
      x: {
        ticks: {
          color: '#e5e7eb',
        },
        grid: {
          color: '#374151',
        },
      },
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Status */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">📊 Processos por Status</h3>
        <div className="h-[300px]">
          <Doughnut data={statusData} options={options} />
        </div>
      </div>

      {/* Gráfico de Empreendimentos */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">🏢 Top 10 Empreendimentos</h3>
        <div className="h-[300px]">
          <Bar data={empreendimentosData} options={barOptions} />
        </div>
      </div>
    </div>
  )
}