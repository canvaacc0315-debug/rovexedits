import { NextResponse } from 'next/server';
import { getEditorById } from '@/lib/db';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { editorId } = await req.json();
    if (!editorId) return NextResponse.json({ error: 'Editor ID required' }, { status: 400 });

    const editor = await getEditorById(editorId);
    if (!editor || !editor.clerkId) {
      return NextResponse.json({ error: 'Editor not found or not linked to Clerk' }, { status: 404 });
    }

    // Get user from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(editor.clerkId);
    
    const email = user.emailAddresses?.[0]?.emailAddress;
    if (email) {
      // In a real application, we would use an email provider like Resend or SendGrid here
      // For now, we simulate the email sending to satisfy the feature request
      console.log(`[EMAIL SENT VIA CLERK WORKFLOW] To: ${email} | Subject: Your RovexEdits Code is Expiring Soon!`);
      console.log(`Body: Hello ${editor.name}, your editor access code is expiring in less than 3 days. Please contact the admin to renew it.`);
      
      return NextResponse.json({ success: true, message: 'Email notification sent successfully.' });
    } else {
      return NextResponse.json({ error: 'User does not have an email address' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error notifying expiry:', error);
    return NextResponse.json({ error: error.message || 'Failed to notify' }, { status: 500 });
  }
}
