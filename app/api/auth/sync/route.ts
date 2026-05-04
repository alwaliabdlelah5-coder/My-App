import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    const auth = adminAuth();
    if (!auth) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    // Verify the token provided by the client
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Use the example provided by the user: Get full user data server-side
    const userRecord = await auth.getUser(uid);

    return NextResponse.json({
      message: 'User verified and fetched successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      }
    });

  } catch (error: any) {
    console.error('Error in auth sync API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
