import { supabase } from './supabaseClient.js'


// gets a profile using a user's ID
export async function getUserProfile(userId) {

    const {
        data: profile,
        error
    } = await supabase
        .from('profiles')
        .select(
            'id, name, image_path, major, school_year, transfer_student'
        )
        .eq('id', userId)
        .single()

    if (error) {
        console.error(
            'Profile lookup error:',
            error
        )

        return null
    }

    return profile
}


// gets the currently signed-in user's profile
export async function getCurrentUserProfile() {

    const {
        data: { user },
        error
    } = await supabase.auth.getUser()

    if (error || !user) {
        console.error(
            'Current user error:',
            error
        )

        return null
    }

    return await getUserProfile(user.id)
}


// turns image_path into an image URL
export function getProfileImageUrl(imagePath) {

    if (!imagePath) {
        return '../images/default-profile.png'
    }

    const {
        data
    } = supabase.storage
        .from('profile-images')
        .getPublicUrl(imagePath)

    return data.publicUrl
}

// open a student's profile using their user ID
export function openStudentProfile(userId) {

    if (!userId) {
        console.error('Student ID is missing')
        return
    }

    // tell the dashboard which student's profile to open
    window.dispatchEvent(new CustomEvent('campushub:view-profile', {
        detail: {
            userId: userId
        }
    }))
}


// make an element open a student's profile when clicked
export function makeProfileClickable(element, userId) {

    if (!element || !userId) {
        return
    }

    // open the selected student's profile
    const openProfile = () => {
        openStudentProfile(userId)
    }

    element.style.cursor = 'pointer'
    element.setAttribute('role', 'link')
    element.tabIndex = 0

    // allow mouse clicks
    element.addEventListener('click', openProfile)

    // allow keyboard navigation
    element.addEventListener('keydown', event => {

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openProfile()
        }
    })
}