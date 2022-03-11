const sgMail = require('@sendgrid/mail')

const sendEmail=(email,code)=>{

    const msg = {
        to: email, // Change to your recipient
        from: 'chakrabortysourav801@gmail.com', // Change to your verified sender
        subject: 'Password reset code for ecommerce website',
        text: `Your secret code for password reset is ${code}` ,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
}

module.exports=sendEmail