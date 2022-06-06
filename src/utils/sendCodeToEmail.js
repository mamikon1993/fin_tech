const nodemailer = require('nodemailer')

const senderAddress = process.env.GMAIL_NAME
const pswd = process.env.GMAIL_PASSWORD

async function sendCodeToEmail(mailAddress, code) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: senderAddress,
      pass: pswd, // ==> local host pswd 'sczjaseokwdxkind', | password from mail settings
    },
    tls: { rejectUnauthorized: false },
  })

  const info = await transporter.sendMail({
    from: senderAddress, // sender address
    to: mailAddress,
    subject: 'Fin Tech',
    text: 'Verify your email.',
    html: `
      <div style= "text-align: center">
        <b> Confirm code: </b>
        <h1>${code}</h1>
      </div>
    `,
  })

  console.log('Mail sended [info]: ' + info.response)
}

module.exports = sendCodeToEmail
