import { Bell, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-sertao-border bg-sertao-secondary/50 px-4 shadow-sm backdrop-blur-xl sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Buscar
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-sertao-muted"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-sertao-text placeholder:text-sertao-muted focus:ring-0 sm:text-sm"
            placeholder="Buscar clientes, negócios, notas..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-sertao-muted hover:text-sertao-primary transition-colors"
          >
            <span className="sr-only">Ver notificações</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
