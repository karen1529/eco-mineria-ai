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
    <div className="container py-4">
      <Head><title>EcoMinerIA</title></Head>

      <div className="bg-dark text-white p-5 rounded shadow-lg">
        <h1 className="text-center text-warning mb-4">EcoMinerIA 🌍</h1>

        <div className="border border-warning p-3 mb-4 rounded overflow-auto" style={{ maxHeight: '300px' }}>
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-end text-warning' : 'text-start text-white'}`}>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Haz una pregunta sobre minería sostenible..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-warning" onClick={sendMessage}>
            {loading ? '...' : 'Enviar'}
          </button>
        </div>

        <h2 className="text-warning mt-5 mb-3">❓ Preguntas Frecuentes</h2>
        <div className="accordion" id="faqAccordion">
          {faqs.map((faq, idx) => (
            <div className="accordion-item" key={idx}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${faqAbierta === idx ? '' : 'collapsed'}`}
                  type="button"
                  onClick={() => setFaqAbierta(faqAbierta === idx ? null : idx)}
                >
                  {faq.pregunta}
                </button>
              </h2>
              <div className={`accordion-collapse collapse ${faqAbierta === idx ? 'show' : ''}`}>
                <div className="accordion-body bg-dark text-white">
                  {faq.respuesta}
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-warning mt-5 mb-2">📄 Resumen de documento PDF</h2>
        <input type="file" accept=".pdf" onChange={handlePdfUpload} className="form-control mb-3" />
        {pdfResumen && (
          <div className="border border-warning p-3 bg-secondary rounded">
            <h5 className="text-warning mb-2">📝 Contenido resumido:</h5>
            <pre className="text-white small">{pdfResumen}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
