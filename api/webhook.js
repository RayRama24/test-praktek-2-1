import crypto from 'crypto';

export default async function handler(req, res) {
  // Set CORS Header
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-signature');

  // Handle Preflight Request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      message: 'Method Not Allowed. Endpoint webhook ini hanya menerima HTTP POST request.'
    });
  }

  // a. Periksa apakah header x-signature ada. Jika tidak ada, tolak dengan 400 Bad Request
  const signature = req.headers['x-signature'];
  if (!signature) {
    return res.status(400).json({
      status: 'error',
      message: 'Bad Request: Header x-signature tidak ditemukan.'
    });
  }

  // b. Ambil isi body request sebagai string
  const rawBody = req.body || {};
  const bodyString = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);

  // Secret Key untuk HMAC (diambil dari environment variable HMAC_SECRET / SUPABASE_ANON_KEY / default secret)
  const HMAC_SECRET = process.env.HMAC_SECRET || process.env.SUPABASE_ANON_KEY || 'secret-webhook-key';

  // c. Buat HMAC-SHA256 dari body string
  const calculatedHmac = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(bodyString)
    .digest('hex');

  // d & e. Bandingkan HMAC dengan header x-signature. Jika tidak cocok, tolak dengan 401 Unauthorized
  if (calculatedHmac !== signature) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Validasi signature HMAC-SHA256 gagal.',
      details: {
        provided_signature: signature,
        expected_signature: calculatedHmac
      }
    });
  }

  // Extract data payload dari Supabase untuk notifikasi Telegram
  const record = rawBody.record || rawBody.new || rawBody;
  
  // Tangkap Status Kejadian, Level Ancaman, dan Detail Pesan
  const statusKejadian = record.status || rawBody.status || (record.is_danger ? 'BAHAYA' : 'AMAN');
  const levelAncaman = record.level_ancaman || record.level || record.severity || (statusKejadian === 'BAHAYA' ? 'TINGGI' : 'RENDAH');
  const detailPesan = record.detail_pesan || record.pesan || record.detail || record.judul || record.title || JSON.stringify(record);

  // Format pesan notifikasi Telegram Bot Alert
  const telegramMessage = 
`🚨 *ALERT NOTIFIKASI WEBHOOK SUPABASE*

📌 *Status Kejadian:* ${statusKejadian}
⚠️ *Level Ancaman:* ${levelAncaman}
📝 *Detail Pesan:* ${detailPesan}

📂 *Informasi Payload:*
• Event: \`${rawBody.type || 'INSERT'}\`
• Tabel: \`${rawBody.table || 'laporan_keamanan'}\`
• Schema: \`${rawBody.schema || 'public'}\`
⏱ *Waktu:* ${new Date().toISOString()}`;

  // Menggunakan Environment Variables TELEGRAM_BOT_TOKEN dan TELEGRAM_CHAT_ID (tanpa hardcode)
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  let telegramDeliveryStatus = 'Skipped: TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum dikonfigurasi di Environment Variables';

  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const tgRes = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'Markdown'
        })
      });

      const tgData = await tgRes.json();
      if (tgRes.ok && tgData.ok) {
        telegramDeliveryStatus = 'Notifikasi Telegram berhasil dikirim';
      } else {
        telegramDeliveryStatus = `Gagal mengirim ke Telegram API: ${tgData.description || tgRes.statusText}`;
      }
    } catch (err) {
      telegramDeliveryStatus = `Error koneksi Telegram API: ${err.message}`;
    }
  }

  return res.status(200).json({
    status: 'success',
    message: 'Validasi HMAC-SHA256 berhasil. Laporan webhook diproses dan notifikasi Telegram dipicu.',
    timestamp: new Date().toISOString(),
    alert_summary: {
      status_kejadian: statusKejadian,
      level_ancaman: levelAncaman,
      detail_pesan: detailPesan
    },
    telegram_delivery: telegramDeliveryStatus,
    payload_summary: rawBody
  });
}
