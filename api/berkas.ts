import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();

app.get("/api/berkas", (req: any, res: any) => {
    try {
      const getFiles = (dirPath: string, basePath: string) => {
        const fullPath = path.join(process.cwd(), 'public', dirPath);
        if (!fs.existsSync(fullPath)) return [];
        return fs.readdirSync(fullPath)
          .filter((file: string) => fs.statSync(path.join(fullPath, file)).isFile())
          .map((file: string) => ({
            name: file,
            url: `/${dirPath}/${file}`,
            category: basePath
          }));
      };
      
      const files = [
        ...getFiles('gambar/paklaring', 'Paklaring'),
        ...getFiles('gambar/sertifikat', 'Sertifikat (Gambar)'),
        ...getFiles('pdf', 'PDF Umum'),
        ...getFiles('pdf/sertifikat', 'Sertifikat (PDF)')
      ];
      
      res.json({ success: true, data: files });
    } catch (e: any) {
      res.json({ success: false, message: e.message });
    }
});

export default app;
