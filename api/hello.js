module.exports = (req, res) => {
  const { name = 'Visitor' } = req.query || {};
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({
    status: 'success',
    message: `Hello ${name}, welcome to Vercel Serverless Function API!`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    features: [
      'Vercel Serverless Functions (/api)',
      'Static Public Frontend (/public)',
      'Git Repository Integration'
    ]
  });
};
