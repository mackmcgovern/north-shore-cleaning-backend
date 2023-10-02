const { check, validationResult } = require('express-validator')

exports.validateContactForm = [
  check('name')
    .trim()
    .exists()
    .isLength({ min: 2, max: 25 })
    .withMessage('Name must be between 2 and 25 characters.'),
  check('email')
    .trim()
    .exists()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid email.'),
  check('phone')
    .trim()
    .exists()
    .custom(value => {
      const pattern = /^\d{3}-\d{3}-\d{4}$/
      if (!pattern.test(value)) {
        throw new Error('Please enter a valid phone number')
      } else {
        return true
      }
    })
    .withMessage('Please enter a valid phone number'),
  check('subject')
    .trim()
    .exists()
    .isLength({ min: 2, max: 25 })
    .withMessage('Suject is required.'),
  check('message')
    .trim()
    .exists()
    .isLength({ min: 5, max: 500 })
    .withMessage('Message is required.'),
]

exports.contactValidation = (req, res, next) => {
  const results = validationResult(req).array()
  console.log(results)

  console.log(req, 'REQ')
  if (!results.length) return next()

  res.status(400).json(results)
}
