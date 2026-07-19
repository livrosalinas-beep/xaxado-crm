"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { createClient } from "@/utils/supabase/client"

export function SalesChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChartData() {
      const supabase = createClient()
      
      const { data: deals } = await supabase
        .from('deals')
        .select('created_at, value')
        .eq('stage', 'ganho')
        .order('created_at', { ascending: true })

      if (deals) {
        // Agrupar por mes
        const grouped: Record<string, number> = {}
        const monthsStr = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
        
        deals.forEach(deal => {
          const d = new Date(deal.created_at)
          const monthName = monthsStr[d.getMonth()]
          if (!grouped[monthName]) grouped[monthName] = 0
          grouped[monthName] += Number(deal.value)
        })

        const chartData = Object.keys(grouped).map(k => ({
          name: k,
          total: grouped[k]
        }))

        // Se nao houver dados suficientes, coloca zeros pros meses recentes pra nao ficar vazio
        if (chartData.length === 0) {
          const currentMonth = new Date().getMonth()
          chartData.push({ name: monthsStr[currentMonth], total: 0 })
        }

        setData(chartData)
      }
      setLoading(false)
    }

    fetchChartData()
  }, [])

  return (
    <div className="rounded-xl border border-sertao-border bg-sertao-secondary/50 p-6 backdrop-blur-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-sertao-text mb-4">Receita de Negócios Ganhos</h3>
      <div className="flex-1 w-full min-h-[300px]">
        {loading ? (
          <p className="text-sertao-muted text-sm">Carregando gráfico...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--sertao-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--sertao-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              stroke="var(--sertao-muted)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis
              stroke="var(--sertao-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--sertao-secondary)', 
                borderColor: 'var(--sertao-border)',
                borderRadius: '8px',
                color: 'var(--sertao-text)'
              }} 
              itemStyle={{ color: 'var(--sertao-primary)' }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="var(--sertao-primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
