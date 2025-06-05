// pages/api/resumir_pdf.js
import { formidable } from 'formidable';
import fs from 'fs';
import pdf from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing the files:', err);
      return res.status(500).json({ error: 'Error parsing file' });
    }

    const file = files.pdfFile;

    if (!file || !file[0]?.filepath) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const dataBuffer = fs.readFileSync(file[0].filepath);
      const data = await pdf(dataBuffer);
      const text = data.text.trim().slice(0, 1500);
      return res.status(200).json({ resumen: text });
    } catch (err) {
      console.error('Error reading PDF:', err);
      return res.status(500).json({ error: 'Error reading PDF' });
    }
  });
}
