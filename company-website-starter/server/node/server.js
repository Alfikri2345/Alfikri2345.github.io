
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/contact', async (req, res) => {
  const { nama = '', email = '', pesan = '' } = req.body || {};
  const errors = [];
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  if (!nama.trim()) errors.push('Nama wajib diisi.');
  if (!emailRegex.test(email)) errors.push('Email tidak valid.');
  if (!pesan.trim()) errors.push('Pesan wajib diisi.');

  if (errors.length) return res.status(400).json({ success: false, message: errors.join(' ') });

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: 'Pesan Baru dari Form Kontak Website',
      text: `Anda menerima pesan baru dari form kontak website:

Nama: ${nama}
Email: ${email}
Pesan:
${pesan}

— Dikirim otomatis pada ${new Date().toISOString()}`,
      replyTo: email
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal mengirim email. Periksa konfigurasi SMTP.' });
  }
});

const port = parseInt(process.env.PORT || '3000', 10);
app.listen(port, () => console.log(`Server kontak berjalan di http://localhost:${port}`));
