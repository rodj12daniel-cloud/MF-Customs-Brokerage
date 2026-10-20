# Contact form email setup

The contact forms send submissions through the Vercel `/api/contact` function and Resend. The Resend API key is only read on the server and must never be added to browser code or committed files.

Configure these environment variables in Vercel (and in a local `.env.local` when testing):

- `RESEND_API_KEY`: API key created in Resend.
- `RESEND_FROM_EMAIL`: sender address on a domain verified with Resend, for example `MF Customs Brokerage <website@your-verified-domain.com>`.
- `CONTACT_TO_EMAIL` (optional): inbox that should receive inquiries. It defaults to `rodj12daniel@gmail.com` for the initial test.

After setting the variables, redeploy the Vercel project. The forms report whether the message was sent; if sending fails, they provide the business email as a fallback.
