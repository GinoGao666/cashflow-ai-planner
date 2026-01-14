import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
你是一个记账助手。
请从用户的消费描述中，判断消费分类和金额。
只返回 JSON，不要解释，不要多余文字。

分类只能是以下之一：
food, transport, entertainment, shopping, health, utilities
            `,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0,
      }),
    });

    const data = await res.json();
    const content = data.choices[0].message.content;

    return NextResponse.json(JSON.parse(content));
  } catch (err) {
    return NextResponse.json(
      { error: 'AI parse failed' },
      { status: 500 }
    );
  }
}



