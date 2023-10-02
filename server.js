const express = require('express')
require('dotenv').config()
const nodemailer = require('nodemailer')
const fs = require('fs')
const multer = require('multer')
const cors = require('cors')
const {
  validateContactForm,
  contactValidation,
} = require('./middlewares/contact')
const {
  validateApplication,
  applicationValidation,
} = require('./middlewares/application')
const { log } = require('console')
// const { validationResult } = require('express-validator')

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: '*',
  })
)

// Endpoint for handling contact form submissions
app.post('/contact', validateContactForm, contactValidation, (req, res) => {
  const { name, email, phone, subject, message } = req.body

  // Configure the Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Create the email message
  const mailOptions = {
    from: email,
    to: 'mmcgovern.dev@gmail.com',
    subject: subject,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
  }

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error)
      res.status(500).json({ error: 'Failed to send email' })
    } else {
      console.log('Email sent:', info.response)
      res.json({ success: true })
    }
  })
})

// Endpoint for handling application form submissions
const uploads = multer({ dest: __dirname + '/uploads' })

app.post(
  '/application',
  uploads.array('resume'),
  validateApplication,
  applicationValidation,
  (req, res) => {
    const { name, email, phone, position, comments } = req.body
    const resume = req.files

    if (!resume.length) {
      const jsonObj = [{ msg: 'Please upload a copy of your resume.' }]
      return res.status(400).json(jsonObj)
    }

    const { originalname, path, mimetype } = resume[0]

    console.log('INFO:', originalname, path, mimetype)

    res.json({ status: 'files received' })

    // Configure the Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Create the email message
    const mailOptions = {
      from: email,
      to: 'mmcgovern.dev@gmail.com',
      subject: 'New Application Received',
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nDesired Position: ${position}\nComments: ${comments}`,
      attachments: [
        {
          path,
          filename: originalname,
          contentType: mimetype,
        },
      ],
    }

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error)
        // delete file in uploads dir
        fs.unlinkSync(path)
        res.status(500).json({ error: 'Failed to send email' })
      } else {
        console.log('Email sent:', info.response)
        // delete file in uploads dir
        fs.unlinkSync(path)
        res.json({ success: true })
      }
    })
  }
)

// Start the server
app.listen(3001, () => {
  console.log('Server started on port 3001')
})
