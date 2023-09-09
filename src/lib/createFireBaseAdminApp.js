import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY || {});

export function createFirebaseAdminApp() {
  // if already created, return the same instance
  if (admin.apps.length > 0) {
    return { app: admin.app(), db: getFirestore() };
  }

  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  const db = getFirestore(app);
  return { app, db };
}
