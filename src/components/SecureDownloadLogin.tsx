import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// 🔐 Initialize Firebase once
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
  const [platform, setPlatform] = useState('macos');

  const handleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const token = await result.user?.getIdToken();

      const version = 'v1.0.0';
      const downloadUrl = `https://securedownload-czucgf4kiq-uc.a.run.app/?version=${version}&platform=${platform}&token=${token}`;
      window.location.href = downloadUrl;
    } catch (error) {
      console.error('Authentication failed:', error);
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
          >
            <option value="macos">macOS</option>
            <option value="windows">Windows</option>
            <option value="linux">Linux</option>
          </select>
        </label>
        <br /><br />
        <button onClick={handleLogin}>Login with Google</button>
      </div>
  );
};

export default SecureDownloadLogin;