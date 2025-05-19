import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDfKWha2EwdtpgUPnjxjM9SCJ1J5nNEmUM",
  authDomain: "ats-nonprod.firebaseapp.com",
  projectId: "ats-nonprod",
  appId: "ats-nonprod",
};

initializeApp(firebaseConfig);
const auth = getAuth();

export default function SecureDownloadLogin() {
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const version = 'v1.0.0';
      const platform = 'macos'; // Could be dynamic
      const url = `https://securedownload-czucgf4kiq-uc.a.run.app/?version=${version}&platform=${platform}&token=${token}`;
      setDownloadLink(url);
    } catch (err: any) {
      setError('Authentication failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
      <h3>🔐 Secure Download</h3>
      <p>Login with Google to unlock protected downloads.</p>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Authenticating...' : 'Login with Google'}
      </button>
      {downloadLink && (
        <p style={{ marginTop: '1rem' }}>
          ✅ Authenticated. <a href={downloadLink}>Click here to download</a>
        </p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
