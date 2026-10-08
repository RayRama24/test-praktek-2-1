import crypto from 'crypto';

const TARGET_URL = process.env.WEBHOOK_URL || 'https://test-praktek-2-1.vercel.app/api/webhook';
const HMAC_SECRET = process.env.HMAC_SECRET || process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key-placeholder';

console.log("==================================================================");
console.log("       🚀 UJI 3 SKENARIO KEAMANAN WEBHOOK (TEST_FLOW.JS)         ");
console.log("==================================================================");
console.log(`Target URL  : ${TARGET_URL}`);
console.log(`HMAC Secret : ${HMAC_SECRET}`);
console.log("------------------------------------------------------------------\n");

async function runSecurityTests() {
  const payload = {
    type: 'INSERT',
    table: 'laporan_keamanan',
    schema: 'public',
    record: {
      id: 501,
      status: 'BAHAYA',
      level_ancaman: 'TINGGI',
      detail_pesan: 'Terdeteksi percobaan pembobolan akses admin oleh penyerang'
    }
  };

  const bodyStr = JSON.stringify(payload);
  const validHmac = crypto.createHmac('sha256', HMAC_SECRET).update(bodyStr).digest('hex');
  const temperedHmac = 'invalid_tampered_signature_hash_9999999999999999999999999999';

  let passedTests = 0;

  // TEST 1 = VALID SIGNATURE
  console.log("🔹 TEST 1: VALID SIGNATURE (HMAC Benar)");
  try {
    const res1 = await fetch(TARGET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-signature': validHmac
      },
      body: bodyStr
    });
    const data1 = await res1.json();
    console.log(`   HTTP Status : ${res1.status}`);
    console.log(`   Respon JSON :`, JSON.stringify(data1, null, 2));

    if (res1.status === 200 && data1.status === 'success') {
      console.log("   ✅ PASSED: Request diterima (200 OK) & telegram notifikasi dipicu.\n");
      passedTests++;
    } else {
      console.log("   ❌ FAILED: Diharapkan HTTP 200 OK.\n");
    }
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}\n`);
  }

  // TEST 2 = TEMPERED SIGNATURE
  console.log("🔹 TEST 2: TEMPERED SIGNATURE (Signature Dirusak/Diubah)");
  try {
    const res2 = await fetch(TARGET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-signature': temperedHmac
      },
      body: bodyStr
    });
    const data2 = await res2.json();
    console.log(`   HTTP Status : ${res2.status}`);
    console.log(`   Respon JSON :`, JSON.stringify(data2, null, 2));

    if (res2.status === 401 && data2.status === 'error') {
      console.log("   ✅ PASSED: Request ditolak (401 Unauthorized).\n");
      passedTests++;
    } else {
      console.log("   ❌ FAILED: Diharapkan HTTP 401 Unauthorized.\n");
    }
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}\n`);
  }

  // TEST 3 = MISSING SIGNATURE
  console.log("🔹 TEST 3: MISSING SIGNATURE (Tanpa Header x-signature)");
  try {
    const res3 = await fetch(TARGET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: bodyStr
    });
    const data3 = await res3.json();
    console.log(`   HTTP Status : ${res3.status}`);
    console.log(`   Respon JSON :`, JSON.stringify(data3, null, 2));

    if (res3.status === 400 && data3.status === 'error') {
      console.log("   ✅ PASSED: Request ditolak (400 Bad Request).\n");
      passedTests++;
    } else {
      console.log("   ❌ FAILED: Diharapkan HTTP 400 Bad Request.\n");
    }
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}\n`);
  }

  console.log("==================================================================");
  console.log(`  HASIL PENGUJIANKU: ${passedTests}/3 SKENARIO KEAMANAN LULUS (PASSED) `);
  console.log("==================================================================");
}

runSecurityTests();
