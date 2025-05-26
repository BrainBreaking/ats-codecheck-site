import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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

const firestore = firebase.firestore();

const LicenseGenerator = () => {
    const [user, setUser] = useState(null);
    const [canGenerate, setCanGenerate] = useState(false);
    const [mac, setMac] = useState('');
    const [host, setHost] = useState('');
    const [expireAt, setExpireAt] = useState('');
    const [licenseId, setLicenseId] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user) => {
            setUser(user);
            if (user) {
                const doc = await firestore.collection('claims').doc(user.email).get();
                const claims = doc.exists ? doc.data() : {};
                setCanGenerate(claims.canGenerateLicense === true);
            }
        });
    }, []);

    const generateLicense = async () => {
        setStatus('Generating license...');
        try {
            const token = await user.getIdToken();
            console.log("Token:",token)
            const response = await fetch('https://us-central1-ats-nonprod.cloudfunctions.net/generateLicense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`,
                },
                body: JSON.stringify({
                    mac,
                    host,
                    expireAt,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Unknown error occurred');
            }

            if (data.status === 'success') {
                // Save license info to Firestore
                await firestore.collection('licenses').add({
                    user: firebase.auth().currentUser?.email,
                    mac,
                    host,
                    expireAt,
                    createdAt: new Date().toISOString(),
                    license: data.license,
                });
                setStatus('✅ License created successfully');
                setLicenseId(data.license);
            } else {
                throw new Error(data.error || 'License generation failed');
            }
        } catch (err: any) {
            setStatus(`❌ Error: ${err.message}`);
        }
    };

    if (!canGenerate) return <p>🚫 You do not have permission to generate licenses.</p>;

    return (
        <div>
            <h3>🔐 Generate License</h3>
            <input type="text" placeholder="MAC Address" value={mac} onChange={(e) => setMac(e.target.value)} />
            <input type="text" placeholder="Hostname" value={host} onChange={(e) => setHost(e.target.value)} />
            <input type="text" placeholder="Expiration Date" value={expireAt} onChange={(e) => setExpireAt(e.target.value)} />
            <button onClick={generateLicense}>Generate</button>
            {status && <p>{status}</p>}
            {licenseId && (
                <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify({ mac, host }))}`}
                   download={`license-${licenseId}.lic`}>
                    ⬇️ Download License
                </a>
            )}
        </div>
    );
};

export default LicenseGenerator;