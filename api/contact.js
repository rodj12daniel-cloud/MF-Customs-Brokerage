const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidText(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || 'rodj12daniel@gmail.com';

  if (!apiKey || !from) {
    console.error('Contact email is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.');
    return response.status(503).json({ error: 'Contact email is not configured.' });
  }

  const { name, email, phone, services, message } = request.body || {};
  if (
    !isValidText(name, 120)
    || !isValidText(email, 254)
    || !emailPattern.test(email.trim())
    || !isValidText(phone, 50)
    || !isValidText(services, 160)
    || !isValidText(message, 5000)
  ) {
    return response.status(400).json({ error: 'Please provide valid information in every field.' });
  }

  let resendResponse;
  try {
    resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email.trim(),
        subject: 'Website inquiry - MF Customs Brokerage',
        text: [
          `Name: ${name.trim()}`,
          `Email: ${email.trim()}`,
          `Phone: ${phone.trim()}`,
          `Service: ${services.trim()}`,
          '',
          'Message:',
          message.trim(),
        ].join('\n'),
      }),
    });
  } catch (error) {
    console.error('Could not reach Resend while sending contact inquiry:', error);
    return response.status(502).json({ error: 'The email service could not be reached. Please try again.' });
  }

  if (!resendResponse.ok) {
    console.error(`Resend rejected the contact inquiry with status ${resendResponse.status}.`);
    return response.status(502).json({ error: 'The email service could not send your inquiry. Please try again.' });
  }

  return response.status(200).json({ message: 'Inquiry sent.' });
}
