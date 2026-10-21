import { supabase } from './supabaseClient.js'

export async function initializeProfile() {
    // get profile page elements
    const profileName = document.getElementById('profile-name')
    const profileMajor = document.getElementById('profile-major')
    const profileClassStanding = document.getElementById('profile-class-standing')
    const profileTransfer = document.getElementById('profile-transfer')
    const message = document.getElementById('message')
    
    // edit profile elements
    const editProfileButton = document.getElementById('edit-profile-button')
    const editProfileForm = document.getElementById('edit-profile-form')
    const editName = document.getElementById('edit-name')
    const editMajor = document.getElementById('edit-major')
    const editSchoolYear = document.getElementById('edit-school-year')
    const editTransferStudent = document.getElementById('edit-transfer-student')
    const cancelProfileButton = document.getElementById('cancel-profile-button')
    
    // save profile button
    const saveProfileButton = document.getElementById('save-profile-button')
    const profilePictureInput = document.getElementById('profile-picture-input')
    const profilePicturePreview = document.getElementById('profile-picture-preview')
    const profilePicture = document.getElementById('profile-picture')

   
    // get currently signed-in user
    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    // if there is an error or no user is signed in, send them back to login
    if (userError || !user) {
        console.error('User error:', userError)

        window.location.href = './index.html'
        return
    }

    console.log('Loading profile for user:', user.id)

    // retrieve profile belonging to signed-in user
    const {
        data: profile,
        error: profileError
    } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // if the profile could not be loaded, show an error message
    if (profileError) {
        console.error('Profile error:', profileError)

        // only update the message if the message element exists
        if (message) {
            message.textContent = 'Unable to load profile.'
        }

        return
    }

    console.log('Loaded profile:', profile)

    // display saved profile picture
    if (profile.image_path) {
        const {
            data: imageData
        } = supabase.storage
            .from('profile-images')
            .getPublicUrl(profile.image_path)

        const imageUrl = imageData.publicUrl

        profilePicture.src = imageUrl
        profilePicturePreview.src = imageUrl
    }

    // if the name element exists, display the saved name or use Student
    if (profileName) {
        profileName.textContent = profile.name || 'Student'
    }

    // if the major element exists, display the saved major or Not provided
    if (profileMajor) {
        profileMajor.textContent = profile.major || 'Not provided'
    }

    // if the class standing element exists, display the saved value or Not provided
    if (profileClassStanding) {
        profileClassStanding.textContent =
            profile.school_year || 'Not provided'
    }

    // if the transfer student element exists, display the correct transfer status
    if (profileTransfer) {
        // true means the student is a transfer student
        if (profile.transfer_student === true) {
            profileTransfer.textContent = 'Yes'

        // false means the student is not a transfer student
        } else if (profile.transfer_student === false) {
            profileTransfer.textContent = 'No'

        // if no transfer status is saved, show not provided
        } else {
            profileTransfer.textContent = 'Not provided'
        }
    }

    if (profileTransfer) {

        if (profile.transfer_student === true) {
            profileTransfer.textContent = 'Yes'

        } else if (profile.transfer_student === false) {
            profileTransfer.textContent = 'No'

        } else {
            profileTransfer.textContent = 'Not provided'
        }
    }


    // when Edit Profile is clicked, fill the form with current profile data
    editProfileButton.addEventListener('click', () => {

        editName.value = profile.name || ''
        editMajor.value = profile.major || ''
        editSchoolYear.value = profile.school_year || ''

        if (profile.transfer_student === true) {
            editTransferStudent.value = 'true'

        } else if (profile.transfer_student === false) {
            editTransferStudent.value = 'false'

        } else {
            editTransferStudent.value = ''
        }

        editProfileForm.hidden = false
        editProfileButton.hidden = true
    })


    // cancel editing without saving
    cancelProfileButton.addEventListener('click', () => {

        editProfileForm.hidden = true
        editProfileButton.hidden = false
    })

    // save edited profile information
    saveProfileButton.addEventListener('click', async () => {

    const updatedName =
        editName.value.trim()

    const updatedMajor =
        editMajor.value.trim()

    const updatedSchoolYear =
        editSchoolYear.value

    const updatedTransferStudent =
        editTransferStudent.value === ''
            ? null
            : editTransferStudent.value === 'true'

    const selectedFile =
        profilePictureInput.files[0]

    let imagePath =
        profile.image_path

    // basic validation
    if (!updatedName) {
        message.textContent =
            'Name is required.'
        return
    }

    if (selectedFile) {

    const fileExtension =
        selectedFile.name
            .split('.')
            .pop()
            .toLowerCase()

    const storagePath =
        `${user.id}/profile.${fileExtension}`

    const {
        error: uploadError
    } = await supabase.storage
        .from('profile-images')
        .upload(
            storagePath,
            selectedFile,
            {
                upsert: true
            }
        )

    if (uploadError) {

        console.error(
            'Profile image upload error:',
            uploadError
        )

        message.textContent =
            'Unable to upload profile picture.'

        return
    }

    // remember the uploaded file locaiton
    imagePath = storagePath
    }

    // save profile changes to the database
    const {
        data: updatedProfile,
        error: updateError
    } = await supabase
        .from('profiles')
        .update({
            name: updatedName,
            major: updatedMajor || null,
            school_year: updatedSchoolYear || null,
            transfer_student: updatedTransferStudent,
            image_path: imagePath // Update the image path in the profile
        })
        .eq('id', user.id)
        .select()
        .single()


    if (updateError) {

        console.error(
            'Profile update error:',
            updateError
        )

        message.textContent =
            'Unable to save profile changes.'

        return
    }

    console.log( 'Updated profile:', updatedProfile)

    // display newly saved profile picture
    if (updatedProfile.image_path) {

        const {
            data: imageData
        } = supabase.storage
            .from('profile-images')
            .getPublicUrl(updatedProfile.image_path)

        const imageUrl =
            imageData.publicUrl + '?t=' + Date.now()

        profilePicture.src =
            imageUrl

        profilePicturePreview.src =
            imageUrl
    }

    // update displayed profile information
    profileName.textContent =
        updatedProfile.name || 'Student'

    profileMajor.textContent =
        updatedProfile.major || 'Not provided'

    profileClassStanding.textContent =
        updatedProfile.school_year || 'Not provided'


    if (
        updatedProfile.transfer_student === true
    ) {

        profileTransfer.textContent = 'Yes'

    } else if (
        updatedProfile.transfer_student === false
    ) {

        profileTransfer.textContent = 'No'

    } else {

        profileTransfer.textContent =
            'Not provided'
    }


    // leave edit mode
    editProfileForm.hidden = true
    editProfileButton.hidden = false

    message.textContent = 'Profile updated successfully.'
})

    profilePictureInput.addEventListener('change', () => {

    const file =
        profilePictureInput.files[0]

    if (!file) {
        return
    }

    const allowedTypes = [
        'image/jpeg',
        'image/png'
    ]

    if (!allowedTypes.includes(file.type)) {

        message.textContent =
            'Profile pictures must be JPG or PNG.'

        profilePictureInput.value = ''
        return
    }

    const maxFileSize =
        10 * 1024 * 1024

    if (file.size > maxFileSize) {

        message.textContent =
            'Profile pictures must be 10 MB or smaller.'

        profilePictureInput.value = ''
        return
    }

    const previewUrl = URL.createObjectURL(file)

        profilePicturePreview.src =
            previewUrl

        message.textContent = ''

    })

}