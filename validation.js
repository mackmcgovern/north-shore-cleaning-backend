function validateData(email, phone) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  const pattern = /^\d{3}-\d{3}-\d{4}$/
  if (!pattern.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number' })
  }

  console.log('dis shit been validated')
}
