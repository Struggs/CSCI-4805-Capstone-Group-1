import { supabase } from './supabaseClient.js'

// get page elements
const profileForm = document.getElementById('profile-form')
const nameInput = document.getElementById('name')
const message = document.getElementById('message')

// run when Create Profile is clicked
profileForm.addEventListener('submit', async (event) => {

    // stop page refresh
    event.preventDefault()

    const name = nameInput.value.trim()

    message.textContent = ''

    // name validation
    if (!name) {
        message.textContent = 'Name is required.'
        return
    }

    // check current login session
    const { data: sessionData } = await supabase.auth.getSession()

    console.log('Current session:', sessionData.session)

    // get currently signed-in Supabase user
    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
        console.error('User error:', userError)
        message.textContent = 'You must be signed in to create a profile.'
        return
    }

    // create CampusHub profile
    const { data, error } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            name: name
        })
        .select()

    if (error) {
        console.error('Profile creation error:', error)
        message.textContent = error.message
        return
    }

    console.log('Profile created:', data)

    message.textContent = 'Profile created successfully.'
})