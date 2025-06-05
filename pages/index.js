import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const faqs = [
    {
      pregunta: "¿Qué es la minería sostenible?",
      respuesta: "Es la extracción de recursos minerales minimizando el impacto ambiental y maximizando el beneficio social y económico.",
    },
    {
      pregunta: "¿Qué tecnologías se usan para reducir el impacto ambiental?",
      respuesta: "Uso de sensores, drones, energía renovable y sistemas de monitoreo ambiental en tiempo real.",
    },
    {
      pregunta: "¿Cómo se garantiza la seguridad de los trabajadores?",
      respuesta: "Con normativas, monitoreo con IA, capacitación y uso de equipos de protección inteligentes.",
    },
    {
      pregunta: "¿Qué es la remediación ambiental?",
      respuesta: "Es restaurar terrenos y ecosistemas afectados por actividades mineras, como la reforestación o tratamiento de aguas.",
    },
  ];

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfResumen, setPdfResumen] = useState('');
  const [faqAbierta, setFaqAbierta] = useState(null);

  const buscarRespuestaFAQ = (mensaje) => {
    const mensajeMin = mensaje.toLowerCase();
    for (const faq of faqs) {
      if (mensajeMin.includes(faq.pregunta.toLowerCase().slice(0, 20))) {
        return faq.respuesta;
      }
    }
    return null;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    const respuestaFAQ = buscarRespuestaFAQ(input);
    if (respuestaFAQ) {
      setMessages(prev => [...prev, { role: 'bot', content: respuestaFAQ }]);
      setInput('');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const botMessage = { role: 'bot', content: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Error al contactar la IA.' }]);
    }

    setInput('');
    setLoading(false);
  };

  const handlePdfUpload = async (e) => {
    const formData = new FormData();
    formData.append('pdfFile', e.target.files[0]);

    const res = await fetch('/api/resumir_pdf', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setPdfResumen(data.resumen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#312e81] text-white p-4 font-sans">
      <Head><title>EcoMinerIA</title></Head>

      <main className="max-w-4xl mx-auto bg-[#1f2937] p-6 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">EcoMinerIA 🌍</h1>

        <div className="space-y-3 h-[20rem] overflow-y-auto border border-yellow-500 p-4 rounded-md bg-[#111827]">
          {messages.map((msg, index) => (
            <div key={index} className={`text-base ${msg.role === 'user' ? 'text-right text-yellow-300' : 'text-left text-white'}`}>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Haz una pregunta sobre minería sostenible..."
            className="flex-1 p-3 rounded bg-[#0f172a] border border-gray-600 text-white"
          />
          <button
            onClick={sendMessage}
            className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded hover:bg-yellow-500"
          >
            {loading ? '...' : 'Enviar'}
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-xl text-yellow-400 mb-4">❓ Preguntas Frecuentes</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx}>
                <button
                  className="w-full text-left px-4 py-2 bg-[#1e1b4b] hover:bg-[#3730a3] text-yellow-300 font-semibold rounded transition duration-200"
                  onClick={() => setFaqAbierta(faqAbierta === idx ? null : idx)}
                >
                  {faq.pregunta}
                </button>
                {faqAbierta === idx && (
                  <div className="p-3 bg-[#0f172a] border border-yellow-500 rounded-b text-sm text-gray-200">
                    {faq.respuesta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl text-yellow-400 mb-2">📄 Resumen de documento PDF</h2>
          <input type="file" accept=".pdf" onChange={handlePdfUpload} className="mb-2 text-white" />
          {pdfResumen && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">📝 Contenido resumido:</h3>
              <div className="max-h-[300px] overflow-y-auto p-4 border-2 border-yellow-500 rounded-xl bg-[#111827] shadow-inner text-sm whitespace-pre-wrap">
                {pdfResumen}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
