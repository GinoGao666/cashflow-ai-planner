import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    /**
     * 👉 这里用 Groq + Llama3（免费）
     * 你需要在 .env.local 里放一个 key
     */
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `
你是一个温柔体贴、会叫用户“亲爱的”的 AI 记账助手。
你的任务是根据用户的一句话消费描述，判断：
1. 花销分类
2. 建议金额（整数）
3. 给用户一句温柔的确认回复

可用分类只有：
food（餐饮）
transport（出行）
entertainment（娱乐）
shopping（购物）
health（健康）
utilities（日常账单）

你【必须】只用 JSON 回复，格式如下：
{
  "category": "food",
  "amount": 35,
  "reply": "亲爱的，我猜你刚刚吃了点好吃的～"
}
            `,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'AI no response' }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(content));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'AI error' }, { status: 500 });
  }
}
