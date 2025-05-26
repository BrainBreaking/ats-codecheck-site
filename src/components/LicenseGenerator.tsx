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
    const [licenses, setLicenses] = useState([]);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user) => {
            setUser(user);
            if (user) {
                const doc = await firestore.collection('claims').doc(user.email).get();
                const claims = doc.exists ? doc.data() : {};
                setCanGenerate(claims.canGenerateLicense === true);
                if (claims.expireAt) {
                    setExpireAt(claims.expireAt);
                }
                if (user && claims.canGenerateLicense === true) {
                    const querySnapshot = await firestore.collection('licenses')
                      .where('user', '==', user.email)
                      .where('inactive', '!=', true)
                      .get();
                    const licenseList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setLicenses(licenseList);
                }
            }
        });
    }, []);

    const generateLicense = async () => {

        if (!mac || !host) {
            setStatus("❌ Please provide both MAC and Host.");
            return;
        }

        setStatus('Generating license...');
        try {
            const token = await firebase.auth().currentUser.getIdToken();
            console.log("Token:",token)
            const response = await fetch('https://us-central1-ats-nonprod.cloudfunctions.net/generateLicense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    mac,
                    host,
                    expireAt,
                    user: firebase.auth().currentUser?.email,
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
                    inactive: false
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

    const deleteLicense = async (id: string) => {
      try {
        await firestore.collection('licenses').doc(id).update({ inactive: true });
        setLicenses((prev) => prev.filter((lic) => lic.id !== id));
        setStatus(`🗑️ License ${id} marked as inactive`);
      } catch (err: any) {
        setStatus(`❌ Failed to delete license: ${err.message}`);
      }
    };

    if (!canGenerate) return <p>🚫 You do not have permission to generate licenses.</p>;

    return (
        <div>
            <h3>🔐 Generate License</h3>
            <input type="text" placeholder="MAC Address" value={mac} onChange={(e) => setMac(e.target.value)} />
            <input type="text" placeholder="Hostname" value={host} onChange={(e) => setHost(e.target.value)} />
            <button onClick={generateLicense}>Generate</button>
            {status && <p>{status}</p>}
            {licenseId && (
                <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(licenseId)}`}
                   download={`license-${mac}-${host}.lic`}>
                    ⬇️ Download License
                </a>
            )}
            <div>
            <h3>📄 Your Licenses</h3>
            <ul>
                {licenses.map((lic) => (
                    <li key={lic.id}>
                        <a
                            href={`data:text/plain;charset=utf-8,${encodeURIComponent(lic.license)}`}
                            download={`license-${lic.mac}-${lic.host}.lic`}
                        >
                            {lic.mac} @ {lic.host} ({new Date(lic.createdAt).toLocaleString()})
                        </a>
                        <button onClick={() => deleteLicense(lic.id)}>❌ Delete</button>
                    </li>
                ))}
            </ul>
            </div>
        </div>
    );
};

export default LicenseGenerator;