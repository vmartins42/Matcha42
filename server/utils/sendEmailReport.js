const mailjet = require ('node-mailjet').connect('bc8caf09e822a5131555792993afa48e', '85e284ea4e25486c60edad6f999000d0')

const sendEmailReport = (datas) => {

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
            "Email": "acc.matcha@gmail.com",
            "Name": "support"
          }
        ],
        "Subject": "Signalement d'un utilisateur.",
        "TextPart": "Bonjour",
        "HTMLPart": `
                    <html>
                        <p> Bonjour,</p> 
                        <p>Cet utilisateur à été signalé :</p>
                        <p> Nom d'utilisateur : ${datas.blocked}</p>
                        <p> Email : ${datas.blockedEmail}</p>
                        <p>Signaler par :</p>
                        <p> Nom d'utilisateur : ${datas.username}</p>
                        <p> Email : ${datas.email}</p>
                    </html>
                    ` ,
      }
    ]
  })
  request
    .then((result) => {
    })
    .catch((err) => {
      console.log(err)
    })

}

module.exports = sendEmailReport;