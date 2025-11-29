export default function emailConfirmHTML() {
  return `    <html>
      <head>
        <title>Email Confirmed</title>
      </head>
      <body>
        <h1>Your email has been confirmed!</h1>
        <p>You can now close this window and <a href="${process.env.URL}/login">log in</a> to your account.</p>
      </body>
    </html>
   `;
}
