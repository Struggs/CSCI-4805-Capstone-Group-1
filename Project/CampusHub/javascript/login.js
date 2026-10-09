import { supabase } from './supabaseClient.js'

// get page elements
const loginForm = document.getElementById('login-form')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const message = document.getElementById('message')

// run when Sign In is clicked
loginForm.addEventListener('submit', async (event) => {

    event.preventDefault()

    const email = emailInput.value.trim()
    const password = passwordInput.value

    message.textContent = ''

    // sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    // show error if login fails
    if (error) {
        console.error('Login error:', error)
        message.textContent = 'Invalid email or password.'
        return
    }

    console.log('Login successful:', data)

    // go to profile creation
    window.location.href = './createProfile.html'
})