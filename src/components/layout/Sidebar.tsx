import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Users, Columns, Activity, Megaphone, Settings, MessageSquare } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Contatos', href: '/contatos', icon: Users },
  { name: 'Funil de Vendas', href: '/funil', icon: Columns },
  { name: 'Atividades', href: '/atividades', icon: Activity },
  { name: 'Campanhas', href: '/campanhas', icon: Megaphone },
  { name: 'Mensagens', href: '/templates', icon: MessageSquare },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-sertao-border bg-sertao-secondary/50 backdrop-blur-xl">
      <div className="flex h-20 items-center px-4 border-b border-sertao-border gap-2">
        <Image src="/logo.png" alt="Xaxado CRM Logo" width={48} height={48} className="object-contain" />
        <span className="text-3xl text-sertao-primary font-[family-name:var(--font-xilosa)] whitespace-nowrap -mb-2">
          Xaxado CRM
        </span>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex items-center px-3 py-2.5 text-base font-bold rounded-lg text-sertao-muted hover:text-sertao-text hover:bg-sertao-primary/10 transition-all duration-200"
          >
            <item.icon
              className="mr-3 h-5 w-5 flex-shrink-0 text-sertao-muted group-hover:text-sertao-primary transition-colors"
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-sertao-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sertao-primary/10 cursor-pointer transition-all">
          <div className="h-8 w-8 rounded-full bg-sertao-primary flex items-center justify-center text-xs font-medium text-white shadow-inner">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sertao-text">Sérgio</span>
            <span className="text-xs text-sertao-muted">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
