import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// 🔐 Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDfKWha2EwdtpgUPnjxjM9SCJ1J5nNEmUM",
  authDomain: "ats-nonprod.firebaseapp.com",
  projectId: "ats-nonprod",
  appId: "ats-nonprod",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const SecureDownloadLogin: React.FC = () => {
  const [platform, setPlatform] = useState('macOS');
  const [status, setStatus] = useState<'idle' | 'logging-in' | 'downloading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    setStatus('logging-in');
    setErrorMsg(null);

    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const token = await result.user?.getIdToken();

      const version = 'latest';
      const downloadUrl = `https://securedownload-czucgf4kiq-uc.a.run.app/?version=${version}&platform=${platform}&token=${token}`;

      setStatus('downloading');
      window.location.href = downloadUrl;
    } catch (error: any) {
      console.error('Authentication failed:', error);
      setStatus('error');
      setErrorMsg('❌ Login failed. Please try again.');
    }
  };

  return (
      <div>
        <h2>🔐 Secure Download</h2>

        <label>
          Choose platform:&nbsp;
          <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              disabled={status !== 'idle'}
          >
            <option value="macOS">macOS</option>
            <option value="Windows">Windows</option>
            <option value="Linux">Linux</option>
          </select>
        </label>

        <br /><br />

        <button onClick={handleLogin} disabled={status !== 'idle'}>
          {status === 'logging-in' ? 'Signing in...' : 'Login with Google'}
        </button>

        {status === 'downloading' && <p>⬇️ Download starting...</p>}
        {status === 'error' && <p style={{ color: 'red' }}>{errorMsg}</p>}
      </div>
  );
};

export default SecureDownloadLogin;