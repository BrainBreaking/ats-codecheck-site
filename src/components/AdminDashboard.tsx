import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';

// Initialize Firebase (replace with your config)
const firebaseConfig = {
    apiKey: "AIzaSyDfKWha2EwdtpgUPnjxjM9SCJ1J5nNEmUM",
    authDomain: "ats-nonprod.firebaseapp.com",
    projectId: "ats-nonprod",
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const firestore = firebase.firestore();

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, []);

    const login = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
    };

    const logout = async () => {
        await auth.signOut();
    };

    const grantDownload = async () => {
        try {
            await firestore.collection('claims').doc(email).set({ canDownload: true });
            setStatus(`✅ Granted download permission to ${email}`);
        } catch (err) {
            setStatus(`❌ Failed: ${err.message}`);
        }
    };

    const fetchClaims = async () => {
        const snapshot = await firestore.collection('claims').get();
        const data = snapshot.docs.map(doc => ({ email: doc.id, ...doc.data() }));
        setUsers(data);
    };

    return (
        <Card className="p-4 max-w-lg mx-auto mt-10">
            <CardContent>
                <h2 className="text-xl font-bold mb-4">🛡️ Admin Dashboard</h2>
                {!user ? (
                    <Button onClick={login}>Login as Admin</Button>
                ) : (
                    <>
                        <p className="mb-2">Signed in as: {user.email}</p>
                        <Button onClick={logout}>Logout</Button>
                        <div className="my-4">
                            <Input
                                type="email"
                                placeholder="User email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button className="mt-2" onClick={grantDownload}>Grant Access</Button>
                        </div>
                        <Button onClick={fetchClaims}>View All Claims</Button>
                        <ul className="mt-4 text-sm">
                            {users.map(u => (
                                <li key={u.email}>✅ {u.email} — {JSON.stringify(u)}</li>
                            ))}
                        </ul>
                    </>
                )}
                {status && <p className="mt-4 text-sm">{status}</p>}
            </CardContent>
        </Card>
    );
};

export default AdminDashboard;
