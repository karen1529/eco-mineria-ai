
export default function handler(req, res) {
  const temas = [
    { nombre: "Impacto ambiental", descripcion: "Efectos de la minería sobre el ecosistema." },
    { nombre: "Normativas legales", descripcion: "Regulación minera en Colombia y el mundo." },
    { nombre: "Minería sostenible", descripcion: "Prácticas responsables para la explotación minera." },
    { nombre: "Seguridad minera", descripcion: "Protocolos y medidas para prevenir accidentes." },
    { nombre: "Recuperación de suelos", descripcion: "Estrategias para reforestar y rehabilitar minas." }
  ];
  res.status(200).json({ temas });
}
