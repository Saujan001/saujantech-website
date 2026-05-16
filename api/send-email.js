export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, business_type, service_interested, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const customerEmail = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Saujan — SaujanTech <hello@saujantech.com.au>',
        to: [email],
        subject: 'Got your message — SaujanTech will be in touch!',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#0A0F2C;padding:32px;text-align:center;border-radius:8px 8px 0 0;">
              <h1 style="color:#06B6D4;margin:0;font-size:26px;">&lt;/&gt; SaujanTech</h1>
              <p style="color:#94A3B8;margin:8px 0 0;font-size:13px;">Smart Websites. Intelligent Automation. Real Results.</p>
            </div>
            <div style="padding:32px;background:#ffffff;">
              <h2 style="color:#1E293B;">Hi ${name}! 👋</h2>
              <p style="color:#475569;line-height:1.7;">
                Thanks for reaching out to SaujanTech! I have received your message
                and will get back to you within <strong>24 hours</strong>.
              </p>
              <div style="background:#F8FAFC;border-left:4px solid #06B6D4;padding:20px;border-radius:4px;margin:24px 0;">
                <p style="margin:0 0 10px;font-weight:bold;color:#1E293B;font-size:14px;">Your enquiry summary:</p>
                <p style="margin:5px 0;color:#475569;font-size:14px;"><strong>Business Type:</strong> ${business_type}</p>
                <p style="margin:5px 0;color:#475569;font-size:14px;"><strong>Interested In:</strong> ${service_interested}</p>
                ${message ? `<p style="margin:5px 0;color:#475569;font-size:14px;"><strong>Message:</strong> ${message}</p>` : ''}
              </div>
              <p style="color:#475569;line-height:1.7;">In the meantime feel free to reach me directly:</p>
              <div style="margin:20px 0;">
                <a href="mailto:hello@saujantech.com.au"
                   style="display:inline-block;background:#2563EB;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;margin-right:10px;">
                  📧 Email Me
                </a>
                <a href="https://wa.me/61413736241"
                   style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
                  💬 WhatsApp
                </a>
              </div>
            </div>
            <div style="background:#0A0F2C;padding:20px;text-align:center;border-radius:0 0 8px 8px;">
              <p style="color:#94A3B8;margin:0;font-size:12px;">© 2026 SaujanTech · Sydney, Australia 🇦🇺 · saujantech.com.au</p>
            </div>
          </div>
        `
      })
    });

    const ownerEmail = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'SaujanTech Website <hello@saujantech.com.au>',
        to: ['hello@saujantech.com.au'],
        reply_to: email,
        subject: `New Enquiry from ${name} — SaujanTech`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#0A0F2C;padding:24px;border-radius:8px 8px 0 0;">
              <h1 style="color:#06B6D4;margin:0;font-size:20px;">🔔 New Enquiry Received</h1>
              <p style="color:#94A3B8;margin:6px 0 0;font-size:13px;">Via saujantech.com.au contact form</p>
            </div>
            <div style="padding:28px;background:#ffffff;">
              <table style="width:100%;border-collapse:collapse;">
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:10px 0;color:#64748B;font-size:13px;font-weight:bold;width:130px;">Name</td>
                  <td style="padding:10px 0;color:#1E293B;font-size:14px;font-weight:bold;">${name}</td>
                </tr>
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:10px 0;color:#64748B;font-size:13px;font-weight:bold;">Email</td>
                  <td style="padding:10px 0;font-size:14px;">
                    <a href="mailto:${email}" style="color:#2563EB;">${email}</a>
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:10px 0;color:#64748B;font-size:13px;font-weight:bold;">Phone</td>
                  <td style="padding:10px 0;color:#1E293B;font-size:14px;">
                    ${phone ? `<a href="tel:${phone}" style="color:#2563EB;">${phone}</a>` : 'Not provided'}
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:10px 0;color:#64748B;font-size:13px;font-weight:bold;">Business</td>
                  <td style="padding:10px 0;color:#1E293B;font-size:14px;">${business_type}</td>
                </tr>
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:10px 0;color:#64748B;font-size:13px;font-weight:bold;">Service</td>
                  <td style="padding:10px 0;color:#1E293B;font-size:14px;">${service_interested}</td>
                </tr>
                ${message ? `
                <tr>
                  <td style="padding:10px 0;color:#64748B;font-size:13px;font-weight:bold;vertical-align:top;">Message</td>
                  <td style="padding:10px 0;color:#1E293B;font-size:14px;">${message}</td>
                </tr>` : ''}
              </table>
              <div style="margin-top:24px;">
                <a href="mailto:${email}"
                   style="display:inline-block;background:#2563EB;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;margin-right:10px;">
                  Reply to ${name}
                </a>
                ${phone ? `
                <a href="tel:${phone}"
                   style="display:inline-block;background:#10B981;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">
                  Call Now
                </a>` : ''}
              </div>
            </div>
            <div style="background:#F8FAFC;padding:14px;text-align:center;border-top:1px solid #E2E8F0;border-radius:0 0 8px 8px;">
              <p style="color:#94A3B8;margin:0;font-size:12px;">Received from saujantech.com.au</p>
            </div>
          </div>
        `
      })
    });

    if (!customerEmail.ok || !ownerEmail.ok) {
      const errData = !customerEmail.ok
        ? await customerEmail.json()
        : await ownerEmail.json();
      console.error('Resend error:', errData);
      return res.status(500).json({ error: 'Email failed', details: errData });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
