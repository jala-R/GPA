const nodemailer=require("nodemailer");




  async function sendMail(to,subject,body){


    let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAILPASSWORD,
        },
      });

      
    let info = await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        text: body,
      });
  }

  module.exports=sendMail