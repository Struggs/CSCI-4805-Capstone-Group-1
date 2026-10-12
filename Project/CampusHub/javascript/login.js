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

     // get signed-in user
    const user = data.user

    // check if this user already has a CampusHub profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

    if (profileError) {
        console.error('Profile check error:', profileError)
        message.textContent = 'Unable to load your profile.'
        return
    }

    // existing user already has a profile
    if (profile) {
        window.location.href = './CampusHub.html'
        return
    }

    // account exists but profile has not been created yet
    window.location.href = './createProfile.html'
})