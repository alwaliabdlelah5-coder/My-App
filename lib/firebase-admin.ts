import * as admin from 'firebase-admin';

let adminApp: admin.app.App | null = null;

export function getFirebaseAdmin() {
  if (!adminApp) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Replace literal '\n' with actual newlines in private key
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      // In production, we'd throw if we strictly need admin, 
      // but for now we'll return null or handle gracefully in routes.
      return null;
    }

    if (admin.apps.length > 0) {
      adminApp = admin.apps[0]!;
    } else {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
  }
  return adminApp;
}

export const adminAuth = () => getFirebaseAdmin()?.auth();
export const adminDb = () => getFirebaseAdmin()?.firestore();
