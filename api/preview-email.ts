import express from 'express';
import { getEmailHTML } from '../src/utils/emailTemplate';

const app = express();
app.use(express.json());

app.post('/api/preview-email', async (req: any, res: any) => {
    try {
      const { body, bodyFontFamily, emailFormat, paragraphAlign, location } = req.body;
      let html = await getEmailHTML(body || "", { bodyFontFamily, emailFormat, paragraphAlign, location });

      const previewOverride = `
      <style>
        .container {
          max-width: 100% !important;
          width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }
      </style>`;
      html = html.replace('</head>', `${previewOverride}\n</head>`);
      
      res.status(200).json({ html });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});

export default app;
