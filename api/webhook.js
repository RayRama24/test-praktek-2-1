// Serverless Function Node.js (Webhook Receiver dari Supabase) - Format ES Module
export default async function handler(req, res) {
  // Set CORS Header
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-supabase-signature');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Hanya menerima HTTP POST Request untuk Webhook
  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      message: 'Method Not Allowed. Endpoint webhook ini hanya menerima HTTP POST request dari Supabase.'
    });
  }

  try {
    const payload = req.body || {};

    // Tangkap data laporan webhook dari Supabase
    const eventType = payload.type || payload.event || 'INSERT';
    const tableName = payload.table || 'laporan';
    const schemaName = payload.schema || 'public';
    const recordData = payload.record || payload.new || payload;

    return res.status(200).json({
      status: 'success',
      message: 'Laporan Webhook dari Supabase berhasil diterima dan diproses',
      timestamp: new Date().toISOString(),
      webhook_details: {
        event_type: eventType,
        table: tableName,
        schema: schemaName,
        payload_record: recordData
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memproses payload webhook Supabase',
      error: error.message
    });
  }
}
