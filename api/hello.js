module.exports = (req, res) => {
  const { name = 'Visitor' } = req.query || {};

  // Membaca environment variables yang di-injeksi dari secrets tanpa hardcode
  const supabaseUrlStatus = process.env.SUPABASE_URL ? 'Terhubung (Secrets)' : 'Belum Dikonfigurasi';
  const supabaseKeyStatus = process.env.SUPABASE_ANON_KEY ? 'Terhubung (Secrets Masked)' : 'Belum Dikonfigurasi';

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.status(200).json({
    status: 'success',
    message: `Hello ${name}, welcome to Vercel Serverless Function API!`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    config: {
      supabase_url_status: supabaseUrlStatus,
      supabase_key_status: supabaseKeyStatus
    },
    features: [
      'Vercel Serverless Functions (/api)',
      'Static Public Frontend (/public)',
      'Git Repository Integration',
      'Injected GitHub Secrets (VERCEL_TOKEN, SUPABASE_URL, SUPABASE_ANON_KEY)'
    ]
  });
};
