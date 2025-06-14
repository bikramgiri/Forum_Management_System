require('dotenv').config() // Load environment variables from a .env file into process.env

const nodemailer = require('nodemailer');
const sendEmail = async(data) => {
      const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                  user: process.env.EMAIL, // Your email address
                  pass: process.env.EMAIL_PASSWORD  // Your email password or app password
            }
      })

      const mailOption = {
            from : "Bikram's Blog bikramgiri264@gmail.com",
            to : data.email,
            subject : data.subject,
            text : data.text
      }

      await transporter.sendMail(mailOption)
}

module.exports = sendEmail

