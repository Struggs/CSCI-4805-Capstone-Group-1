import { supabase } from './supabaseClient.js'

// get page elements
const signupForm = document.getElementById('signup-form')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const confirmPasswordInput = document.getElementById('confirm-password')
const message = document.getElementById('message')

// run when Create Account is clicked
signupForm.addEventListener('submit', async (event) => {

    // stop page from refreshing
    event.preventDefault()

    // get values from form
    const email = emailInput.value.trim()
    const password = passwordInput.value
    const confirmPassword = confirmPasswordInput.value

    // clear old message
    message.textContent = ''

    // check APSU student email
    if (!email.endsWith('@students.apsu.edu')) {
        message.textContent = 'Please use a valid APSU student email.'
        return
    }

    // check passwords match
    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match.'
        return
    }

    // create account with Supabase
    const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,

    options: {
        emailRedirectTo:
            'http://localhost:5173/Project/CampusHub/html/verified.html'
    }
})

    // check for Supabase error
    if (error) {
        console.error('Signup error:', error)
        message.textContent = error.message
        return
    }

    console.log('Signup successful:', data)

    message.textContent =
        'Account created. Check your APSU email for verification.'
})