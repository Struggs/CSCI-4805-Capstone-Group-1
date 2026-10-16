import { supabase } from './supabaseClient.js'

const profileName = document.getElementById('profile-name')
const message = document.getElementById('message')

async function loadProfile() {

    // get the currently signed-in user
    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
        console.error('User error:', userError)
        window.location.href = './index.html'
        return
    }

    // get this user's profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()

    if (profileError) {
        console.error('Profile error:', profileError)
        message.textContent = 'Unable to load profile.'
        return
    }

    // display profile data
    profileName.textContent = profile.name
}

loadProfile()