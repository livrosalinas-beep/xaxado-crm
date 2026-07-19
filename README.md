# Xaxado CRM 🌵

O **Xaxado CRM** é um sistema de Customer Relationship Management (CRM) completo, criado para facilitar a gestão de clientes, campanhas e oportunidades de vendas (focado nas vendas do "Reduca" e do "SAPE"). 

Com uma estética *Vibe Coding*, o Xaxado CRM traz Glassmorphism, Modo Escuro e Transições Inteligentes para entregar uma experiência moderna e altamente profissional (UI Pro Max).

## 🚀 Funcionalidades Principais

*   **Dashboard Interativo:** Visão geral de negócios ganhos, receita no mês, conversões e gráficos de desempenho alimentados em tempo real pelo banco de dados.
*   **Funil de Vendas (Kanban):** Arraste e solte negócios pelas etapas (Prospecção, Contato Inicial, Reunião, Proposta, Negociação, Ganho, Perdido) usando `hello-pangea/dnd`.
*   **Gestão de Contatos:** Lista completa de clientes com opção de busca, atalhos de contato e edição.
*   **Campanhas de Marketing:** Organize clientes por campanhas (ativas, concluídas, pausadas) e acompanhe o ROI.
*   **Comunicação Inteligente (Templates):** Crie moldes de mensagem personalizados (com variáveis como `{{nome}}`) e dispare para o WhatsApp Web ou e-mail com apenas um clique.
*   **Copilot Assistente Vibe (IA):** Assistente inteligente embutido no sistema utilizando a API da OpenAI/Cerebras para prover insights sobre vendas e engajamento, direto na tela do CRM.
*   **Gestão de Metas e Dark Mode:** Configurações globais com personalização de metas mensais e aparência clara/escura do sistema.

## 💻 Tech Stack (Tecnologias)

*   **Frontend:** Next.js 16 (App Router), React.js, TailwindCSS, TypeScript.
*   **UI Components:** Radix UI, Lucide React (Ícones), Recharts (Gráficos).
*   **Backend & Banco de Dados:** Supabase (PostgreSQL) com integração via `@supabase/ssr` para autenticação e banco de dados relacional.
*   **Inteligência Artificial:** OpenAI SDK (configurado para `api.cerebras.ai`).
*   **Hospedagem:** Vercel (Produção).

## 🌐 Link de Produção

O sistema está online e funcionando perfeitamente em:
**🔗 [https://xaxado-crm-liart.vercel.app](https://xaxado-crm-liart.vercel.app)**

> **Acesso:** Faça o login com o e-mail e senha cadastrados no seu Supabase.

## ⚙️ Como rodar o projeto localmente

1. Faça o clone do repositório:
```bash
git clone https://github.com/livrosalinas-beep/xaxado-crm.git
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env.local` na raiz do projeto com as chaves do Supabase e da Inteligência Artificial:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
ZYLOO_KEY=sua_chave_de_ia_aqui
```

4. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o sistema.

## 📜 Histórico de Modificações (Changelog)

*   **v1.0.0 (Julho/2026):**
    *   Deploy na Vercel efetuado com sucesso após resolução de validações do ESLint e TypeScript.
    *   Implementação de roteamento protegido com Middleware.
    *   Criação das tabelas no Supabase (Deals, Contacts, Campaigns, Templates, Activities, Settings).
    *   Adição de Autenticação usando email/senha via `@supabase/ssr`.
    *   Implementação do Módulo Kanban e Drag and Drop.
    *   Integração do Chat "Assistente Vibe" via IA.
    *   Design system Vibe Coding (Glassmorphism e temas dinâmicos).
