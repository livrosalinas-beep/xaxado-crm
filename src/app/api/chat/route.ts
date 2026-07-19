import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({
  baseURL: 'https://api.cerebras.ai/v1',
  apiKey: process.env.ZYLOO_KEY, // A chave provida csk-...
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await client.chat.completions.create({
      model: 'gpt-oss-120b',
      messages: [
        { 
          role: 'system', 
          content: 'Você é a IA Global do Xaxado CRM (Assistente Vibe). Seu objetivo é ajudar o Sérgio (professor e empreendedor) a administrar as vendas do "Reduca" e do "SAPE" (produtos educacionais). Dê insights sobre clientes, oportunidades no funil de vendas e atue como um copiloto inteligente e motivador. Seja conciso, profissional e use português do Brasil.' 
        },
        ...messages
      ],
    });

    return NextResponse.json({ 
      message: response.choices[0].message.content 
    });
  } catch (error) {
    console.error('Kimi AI Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao conectar com a IA.' },
      { status: 500 }
    );
  }
}
