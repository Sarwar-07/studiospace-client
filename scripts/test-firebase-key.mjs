import fs from 'node:fs';
import path from 'node:path';

// 1. Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const rawLine of envContent.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx !== -1) {
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
console.log('--- Firebase API Key Diagnostic ---');
console.log(`API Key loaded: ${apiKey ? apiKey.slice(0, 10) + '...' + apiKey.slice(-4) : 'MISSING'}`);
console.log(`Full Key Length: ${apiKey ? apiKey.length : 0}`);

if (!apiKey) {
  console.error('Error: NEXT_PUBLIC_FIREBASE_API_KEY is not defined in .env.local');
  process.exit(1);
}

const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

console.log(`Sending test POST to Identity Toolkit endpoint: https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey.slice(0, 10)}...`);

try {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      returnSecureToken: true
    })
  });

  const status = response.status;
  const statusText = response.statusText;
  const data = await response.json().catch(() => null);

  console.log(`\nHTTP Response Status: ${status} ${statusText}`);
  console.log('Response Body:');
  console.log(JSON.stringify(data, null, 2));

  if (response.ok) {
    console.log('\n[RESULT] Key is valid and request succeeded.');
  } else {
    console.log('\n[DIAGNOSTIC ANALYSIS]');
    const errorMsg = data?.error?.message;
    const errorCode = data?.error?.code;
    const errorStatus = data?.error?.status;

    if (errorMsg === 'API key not valid. Please pass a valid API key.') {
      console.log('-> Key Invalid: Google rejected the key as not valid. It may be mistyped, deleted, expired, or belongs to a different project.');
    } else if (errorMsg?.includes('API_KEY_SERVICE_BLOCKED') || errorMsg?.includes('has not been used in project') || errorMsg?.includes('is disabled')) {
      console.log('-> Service Not Enabled: Identity Toolkit API is not enabled for this Google Cloud project.');
    } else if (errorMsg?.includes('Requests from this') || errorMsg?.includes('blocked') || errorMsg?.includes('IP')) {
      console.log('-> Restriction Error: Key has API or Application restrictions in Google Cloud Console.');
    } else if (errorMsg === 'OPERATION_NOT_ALLOWED') {
      console.log('-> Key is VALID: Identity Toolkit responded, but the requested sign-in provider is disabled in Firebase Console.');
    } else if (errorMsg === 'MISSING_EMAIL' || errorMsg?.includes('EMAIL')) {
      console.log('-> Key is VALID: Google recognized the key and processed the request (reported missing/invalid email).');
    } else {
      console.log(`-> Error: [${errorCode} / ${errorStatus}] ${errorMsg}`);
    }
  }
} catch (err) {
  console.error('Fetch error:', err);
}
