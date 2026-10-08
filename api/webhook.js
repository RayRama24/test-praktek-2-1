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

  // Secret Key untuk HMAC (diambil dari environment variable HMAC_SECRET atau fallback secret)
  const HMAC_SECRET = process.env.HMAC_SECRET || process.env.SUPABASE_ANON_KEY || 'secret-webhook-key';

  // c. Buat HMAC-SHA256 dari body string
  const calculatedHmac = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(bodyString)
    .digest('hex');

  // d. Bandingkan HMAC yang dibuat dengan nilai di header x-signature menggunakan perbandingan string biasa
  // e. Jika tidak cocok, tolak dengan 401 Unauthorized
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

  // Lanjutkan pengiriman ke Telegram jika validasi HMAC berhasil
  let telegramStatus = 'Skipped (Telegram credentials missing)';
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    try {
      const messageText = `📩 *Laporan Webhook Supabase Terverifikasi*\n\n` +
                          `*Event:* \`${rawBody.type || 'INSERT'}\`\n` +
                          `*Tabel:* \`${rawBody.table || 'laporan'}\`\n` +
                          `*Detail:* \`\`\`${JSON.stringify(rawBody.record || rawBody, null, 2)}\`\`\``;

      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'Markdown'
        })
      });
      
      if (tgRes.ok) {
        telegramStatus = 'Sent to Telegram successfully';
      } else {
        telegramStatus = `Telegram API error: ${tgRes.statusText}`;
      }
    } catch (err) {
      telegramStatus = `Telegram send error: ${err.message}`;
    }
  }

  return res.status(200).json({
    status: 'success',
    message: 'Validasi HMAC-SHA256 berhasil. Laporan webhook diproses dan dilanjutkan ke Telegram.',
    timestamp: new Date().toISOString(),
    validation: {
      algorithm: 'HMAC-SHA256',
      signature_matched: true
    },
    telegram_delivery: telegramStatus,
    payload_summary: rawBody
  });
}
