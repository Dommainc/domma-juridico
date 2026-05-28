import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Controle Jurídico DOMMA',
  description: 'Sistema de Gestão de Demandas Jurídicas - DOMMA Incorporações',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="bg-pattern" />
        {children}
      </body>
    </html>
  )
}
