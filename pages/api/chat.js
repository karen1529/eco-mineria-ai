// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const userMessage = req.body.message;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Eres un asistente experto en minería sostenible.' },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || 'No se obtuvo respuesta de la IA.';
    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error con OpenAI:', error);
    res.status(500).json({ error: 'Error al conectar con la IA' });
  }
}
