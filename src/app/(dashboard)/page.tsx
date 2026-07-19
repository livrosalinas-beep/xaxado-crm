"use client"

import { useEffect, useState } from 'react';
import { Users, TrendingUp, Target, Activity } from 'lucide-react';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { createClient } from '@/utils/supabase/client';

export default function Home() {
  const [goal, setGoal] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [wonDealsCount, setWonDealsCount] = useState<number>(0);
  const [conversionRate, setConversionRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // Fetch goal
      const { data: settingsData } = await supabase.from('settings').select('monthly_goal').limit(1).single();
      if (settingsData) {
        setGoal(settingsData.monthly_goal);
      }

      // Fetch won deals for the current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: dealsData } = await supabase
        .from('deals')
        .select('value')
        .eq('stage', 'ganho')
        .gte('created_at', startOfMonth.toISOString());
      
      if (dealsData) {
        const total = dealsData.reduce((acc, curr) => acc + Number(curr.value), 0);
        setRevenue(total);
      }
      
      // Fetch Total Contacts
      const { count: contactsCount } = await supabase
        .from('contatos')
        .select('*', { count: 'exact', head: true });
      
      setTotalClients(contactsCount || 0);

      // Fetch All Deals to calculate Conversion Rate and Won Count
      const { data: allDeals } = await supabase
        .from('deals')
        .select('stage');
        
      if (allDeals && allDeals.length > 0) {
        const won = allDeals.filter(d => d.stage === 'ganho').length;
        setWonDealsCount(won);
        setConversionRate((won / allDeals.length) * 100);
      }

      setLoading(false);
    }
    
    fetchData();
  }, []);

  const progress = goal > 0 ? Math.min((revenue / goal) * 100, 100) : 0;

  // Formata moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  // Estatísticas Dinâmicas
  const stats = [
    { name: 'Total de Clientes', value: totalClients.toString(), icon: Users, change: 'Base Total', changeType: 'positive' },
    { name: 'Receita no Mês', value: formatCurrency(revenue), icon: TrendingUp, change: 'Atual', changeType: 'positive' },
    { name: 'Negócios Ganhos', value: wonDealsCount.toString(), icon: Target, change: 'Sucesso', changeType: 'positive' },
    { name: 'Taxa de Conversão', value: `${conversionRate.toFixed(1)}%`, icon: Activity, change: 'Geral', changeType: 'positive' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-sertao-text sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-sertao-muted">
          Visão geral do seu CRM e oportunidades.
        </p>
      </div>

      {!loading && goal > 0 && (
        <div className="bg-sertao-bg border border-sertao-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h3 className="text-sm font-medium text-sertao-muted uppercase tracking-wider">Meta do Mês</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-sertao-text">{formatCurrency(revenue)}</span>
                <span className="text-sm text-sertao-muted font-medium">de {formatCurrency(goal)}</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xl font-bold ${progress >= 100 ? 'text-green-500' : 'text-sertao-primary'}`}>
                {progress.toFixed(1)}%
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-sertao-secondary/50 rounded-full h-4 overflow-hidden border border-sertao-border/50">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-green-500' : 'bg-sertao-primary'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {progress >= 100 && <p className="text-xs text-green-500 font-bold mt-2 text-right">🎉 Parabéns! Meta batida!</p>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-xl bg-sertao-secondary/50 p-6 border border-sertao-border backdrop-blur-sm"
          >
            <dt>
              <div className="absolute rounded-md bg-sertao-primary/10 p-3">
                <stat.icon className="h-6 w-6 text-sertao-primary" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-sertao-muted">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-bold text-sertao-text">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-bold ${
                  stat.changeType === 'positive' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-[400px]">
          <SalesChart />
        </div>
        <div className="h-[400px]">
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}
