const mailjet = require ('node-mailjet').connect('bc8caf09e822a5131555792993afa48e', '85e284ea4e25486c60edad6f999000d0')

const sendEmail = (type, email, hash) => {
  const message = {
    'confirmUser': `Merci de cliquez sur le lien suivant afin de valider votre compte: http://localhost:5000/users/confirm/${hash}`,
    'resetPassword': `Cliquez sur le lien suivant afin de réinitialiser votre mot de passe: http://localhost:5000/users/redirectPassword/${hash}`,
  };
  const subject = {
    'confirmUser': 'Matcha - Merci de valider votre compte',
    'resetPassword': 'Matcha - Réinitialiser votre mot de passe',
  };
  const request = mailjet
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
      {
        "From": {
          "Email": "acc.matcha@gmail.com",
          "Name": "support"
        },
        "To": [
          {
            "Email": email,
            "Name": "support"
          }
        ],
        "Subject": subject[type],
        "TextPart": "Bonjour",
        "HTMLPart": `
                    <html>
                        <p> ${message[type]}</p>
                    </html>
                    ` ,
      }
    ]
  })
  request
    .then((result) => {
      console.log(result.body)
    })
    .catch((err) => {
      console.log(err.statusCode)
    })

}

module.exports = sendEmail;