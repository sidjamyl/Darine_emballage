import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Here you can implement email sending or save to database
    // For now, we'll just log it
    console.log('Contact form submission:', { name, email, phone, message });

    // You could send an email using nodemailer or a service like SendGrid
    // or save to database for admin review

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error handling contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
