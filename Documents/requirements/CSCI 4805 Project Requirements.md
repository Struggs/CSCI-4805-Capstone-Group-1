# Project Name

CampusHub

The name CampusHub was chosen because the application is intended to provide one central place, or "hub," where Austin Peay State University students can connect with other students, find activities, communicate, and use a student marketplace.

# Team Member Names

* Dallas Chillinsky  
* Elijah Crossan  
* Ezana Kinfe  
* Ian Godfrey

# Abstract

CampusHub is a student social platform designed to help college students connect with others on campus. The primary goal is to help transfer students and students who may be unfamiliar with the campus or Clarksville area meet new people, discover activities, and become more involved with other students.

CampusHub will provide one centralized place where students can create profiles, find and post activities, communicate with other students, and buy or sell items through a student-based marketplace. By keeping the platform focused on the Austin Peay State University community, CampusHub aims to make it easier for students to build connections and become more involved with campus life.

# Tools & Technologies

CampusHub will be developed as a web application that can be accessed through a web browser on both desktop computers and mobile devices.

* Visual Studio Code will be used as the primary development environment.  
* TypeScript will be used as the primary programming language.  
* HTML and CSS will be used for the structure and styling of the web application.  
* React will be used to build and organize the user interface.  
* Bootstrap or Tailwind CSS will be considered for styling and responsive layouts. The final choice will be determined by the team.  
* Supabase will be used for authentication and backend services, including account creation, student email verification, and user sessions.  
* PostgreSQL through Supabase will be used to store application data such as student profiles, activity posts, comments, marketplace listings, and private messages.  
* Supabase Storage will be used to store user-uploaded images such as profile pictures and marketplace listing images.  
* Git and GitHub will be used for version control and the project repository.  
* Discord will be used for team communication and coordination.  
* ChatGPT will be used as an assistive learning and troubleshooting tool in accordance with the team's AI policy.

# Requirements List

## **1\. Account Access and Creation**

### **1.1 Initial Account Access**

1.1.1. When a user accesses the CampusHub website and is not signed in, the system will display the CampusHub account access page.

1.1.2. The account access page will display the CampusHub name.

1.1.3. The account access page will provide an option labeled Sign In for existing users.

1.1.4. The account access page will provide an option labeled Sign Up for new users.

1.1.5. Selecting Sign Up will display the new account registration process.

1.1.6. Selecting Sign In will display the existing-user sign-in form.

### **1.2 Student Email Registration**

1.2.1. The Sign Up process will first request the user's APSU student email address.

1.2.2. The registration form will contain a label for the student email address.

1.2.3. The registration form will contain an input field connected to the student email label.

1.2.3.1. The student email field will be required.

1.2.3.2. The student email field will accept email-formatted input.

1.2.3.3. The entered email address must use the approved APSU student email domain.

1.2.3.4. The current planned student email domain is @students.apsu.edu.

1.2.3.5. If the entered email address does not use the approved APSU student email domain, the system will reject the address.

1.2.3.6. If the email address is rejected, the system will display a message informing the user that a valid APSU student email address is required.

1.2.4. The registration form will contain a button labeled Continue.

1.2.4.1. Selecting Continue will validate the entered email address.

1.2.4.2. The system will check whether the entered email address is already associated with a CampusHub account.

1.2.4.3. If an account already exists using the entered email address, the system will not create another account.

1.2.4.4. If an account already exists, the system will inform the user that the email address is already registered.

1.2.4.5. If the email address is valid and is not already registered, the system will begin the email verification process.

### **1.3 Student Email Verification**

1.3.1. CampusHub will verify a user's APSU student email address before allowing the user to complete account creation.

1.3.2. The system will send a verification code to the APSU student email address entered during registration.

1.3.3. After the verification code is sent, the system will display a verification form.

1.3.4. The verification form will inform the user that a verification code was sent to their student email address.

1.3.5. The verification form will contain an input field for the verification code.

1.3.5.1. The verification code field will be required.

1.3.6. The verification form will contain a button labeled Verify.

1.3.6.1. Selecting Verify will submit the entered verification code.

1.3.6.2. If the verification code matches the code sent to the user's email address, the email address will be considered verified.

1.3.6.3. If the verification code is incorrect, the email address will remain unverified.

1.3.6.4. If the verification code is incorrect, the system will display a message informing the user that the code is invalid.

1.3.6.5. An incorrect verification code will not allow the user to continue account creation.

1.3.7. The verification form will provide an option labeled Resend Code.

1.3.7.1. Selecting Resend Code will send a new verification code to the user's student email address.

1.3.8. The user will not be able to access CampusHub's authenticated features until the student email address has been successfully verified.

1.3.9. After successful email verification, the system will continue to password creation.

### **1.4 Password Creation**

1.4.1. After successful student email verification, the system will display the password creation form.

1.4.2. The password creation form will contain a label for Password.

1.4.3. The password creation form will contain a password input field.

1.4.3.1. The password field will be required.

1.4.3.2. Characters entered into the password field will be hidden from view by default.

1.4.4. The password creation form will contain a label for Confirm Password.

1.4.5. The password creation form will contain a confirm-password input field.

1.4.5.1. The confirm-password field will be required.

1.4.5.2. Characters entered into the confirm-password field will be hidden from view by default.

1.4.5.3. The value entered into the confirm-password field must exactly match the value entered into the password field.

1.4.5.4. If the two password fields do not match, the system will display a message informing the user that the passwords do not match.

1.4.5.5. The user will not be allowed to continue until the password fields match.

### **1.5 Password Requirements**

1.5.1. CampusHub passwords must contain at least eight characters.

1.5.2. CampusHub passwords must contain at least one uppercase letter.

1.5.3. CampusHub passwords must contain at least one lowercase letter.

1.5.4. CampusHub passwords must contain at least one number.

1.5.5. CampusHub passwords must contain at least one special character.

1.5.6. The password creation form will display the password requirements to the user.

1.5.7. The system will prevent account creation if the password does not satisfy all password requirements.

1.5.8. If a password requirement is not satisfied, the system will inform the user that the password does not meet the required format.

1.5.9. The password creation form will contain a button labeled Continue.

1.5.9.1. Selecting Continue will validate the password and confirm-password fields.

1.5.9.2. If both password fields are valid and match, the account creation process will continue to initial profile creation.

### **1.6 Initial Profile Creation**

1.6.1. After the user's student email has been verified and a valid password has been created, the system will display the initial profile creation form.

1.6.2. The initial profile creation form will contain a label for the user's name.

1.6.3. The initial profile creation form will contain an input field connected to the name label.

1.6.3.1. The name field will be required.

1.6.3.2. The name field must contain at least one character.

1.6.3.3. The name field will accept a maximum of 100 characters.

1.6.4. The initial profile creation form will contain a button labeled Create Profile.

1.6.4.1. Selecting Create Profile will validate the required name field.

1.6.4.2. If the name field is empty, the profile will not be created.

1.6.4.3. If the name field is empty, the system will display a message informing the user that a name is required.

1.6.4.4. If the entered name is valid, the system will create the user's initial CampusHub profile.

1.6.5. The user's verified student email address will be associated with the new profile.

1.6.6. The user's entered name will be displayed as the name on their CampusHub profile.

1.6.7. Other profile information will not be required during initial account creation.

1.6.8. The user will be able to add additional profile information later through profile settings.

1.6.9. Additional profile information may include a profile picture, major, school year, classes, and interests.

1.6.10. After the initial profile is successfully created, the user will be directed to the CampusHub home page.

### **1.7 Existing User Sign In**

1.7.1. The CampusHub account access page will provide a Sign In option for users who have already created an account.

1.7.2. Selecting Sign In will display the existing-user sign-in form.

1.7.3. The sign-in form will contain a label for the user's APSU student email address.

1.7.4. The sign-in form will contain an input field connected to the APSU student email address label.

1.7.4.1. The email field will be required.

1.7.4.2. The email field will accept email-formatted input.

1.7.5. The sign-in form will contain a label for the user's password.

1.7.6. The sign-in form will contain a password input field.

1.7.6.1. The password field will be required.

1.7.6.2. Characters entered into the password field will be hidden from view by default.

1.7.6.3. The password field will provide an option to temporarily show or hide the entered password.

1.7.7. The sign-in form will contain a button labeled Sign In.

1.7.7.1. Selecting Sign In will submit the entered email address and password for authentication.

1.7.7.2. The system will prevent the sign-in form from being submitted if the email field is empty.

1.7.7.3. The system will prevent the sign-in form from being submitted if the password field is empty.

1.7.7.4. If a required field is empty, the system will display a message identifying the required field.

1.7.8. The system will verify that the entered email address and password belong to an existing CampusHub account.

1.7.8.1. If the email address and password are correct, the user will be signed into their existing CampusHub account.

1.7.8.2. If the email address or password is incorrect, the user will not be signed in.

1.7.8.3. If the sign-in attempt is unsuccessful, the system will display a message informing the user that the email address or password is incorrect.

1.7.8.4. The error message will not identify whether the email address or the password was specifically incorrect.

1.7.9. The system will verify that the account's APSU student email address has been verified.

1.7.9.1. An account with an unverified student email address will not be allowed to access the CampusHub home page.

1.7.9.2. If the account has not completed email verification, the user will be directed to the student email verification process.

1.7.10. After a successful sign-in, the user will be directed to the CampusHub home page.

### **1.8 Forgot Password**

Since the login mockup already shows Forgot password?, I would include this. It is also a normal enough authentication feature that it makes sense for a senior project without adding much unnecessary scope.

1.8.1. The sign-in form will provide a link labeled Forgot password?.

1.8.2. Selecting Forgot password? will display the password recovery process.

1.8.3. The password recovery form will request the user's APSU student email address.

1.8.3.1. The email field will be required.

1.8.4. The user will be able to submit the entered email address to request a password reset.

1.8.5. If the submitted email address is associated with a CampusHub account, the system will send password recovery instructions to that email address.

1.8.6. The password recovery process will require the user to verify access to the email address before creating a new password.

1.8.7. The new password must satisfy the CampusHub password requirements defined in Section 1.5.

1.8.8. The user will be required to enter the new password a second time to confirm it.

1.8.9. The two new password entries must match before the password can be changed.

1.8.10. After the password is successfully changed, the user will be able to return to the Sign In page and sign in using the new password.

### **2.1 Profile Page**

2.1.1. The Profile Page will only be accessible to authenticated CampusHub users.

2.1.2. Selecting Profile from the CampusHub navigation will open the authenticated user's profile.

2.1.3. The Profile Page will retrieve and display the profile information associated with the authenticated user's account.

2.1.4. The Profile Page will display the user's name.

2.1.5. The Profile Page will display the user's profile picture when one has been uploaded.

2.1.6. If the user has not uploaded a profile picture, the Profile Page will display a default profile image or placeholder.

2.1.7. The Profile Page will display the user's major when one has been provided.

2.1.8. The Profile Page will display the user's school year or class standing when one has been provided.

2.1.9. The Profile Page will display whether the user has identified themselves as a transfer student.

2.1.10. The Profile Page will display the user's interests when one or more interests have been provided.

2.1.11. Optional profile fields that contain no user-provided data will not display empty values.

2.1.12. The user's APSU email address will not be displayed as public profile information.

2.1.13. The authenticated user's Profile Page will contain an Edit Profile option.

2.1.14. Selecting Edit Profile will open the profile editing interface defined in Section 2.2.

2.1.15. Profile information displayed on the page will reflect the most recently saved profile data.

2.1.16. If the profile data cannot be retrieved, the system will display an error message instead of displaying incomplete profile information

### **2.2 Edit Profile**

2.2.1. The authenticated user's Profile Page will contain an Edit Profile option.

2.2.2. Selecting Edit Profile will open the profile editing interface for the authenticated user.

2.2.3. The profile editing interface will load the user's currently saved profile information into the appropriate editable fields.

2.2.4. The profile editing interface will allow the user to modify only the profile associated with the authenticated account.

2.2.5. The profile editing interface will provide editable fields for the user's name, major, school year or class standing, transfer student status, interests, and profile picture.

2.2.6. The user's verified APSU email address will not be editable from the profile editing interface.

2.2.7. The profile editing interface will contain a button labeled Save Changes.

2.2.8. Selecting Save Changes will validate all edited profile fields before any changes are stored.

2.2.9. If one or more edited fields contain invalid data, the system will not save the profile changes.

2.2.10. If validation fails, the system will display an error message identifying the field that must be corrected.

2.2.11. If all edited fields are valid, the system will update the user's stored profile information.

2.2.12. After profile changes are successfully saved, the Profile Page will display the updated information.

2.2.13. The system will display a confirmation message after profile changes are successfully saved.

2.2.14. The profile editing interface will contain a button labeled Cancel.

2.2.15. Selecting Cancel will exit the profile editing interface without saving unsaved changes.

2.2.16. After Cancel is selected, the Profile Page will display the most recently saved profile information.

2.2.17. If the system fails to save valid profile changes, the existing stored profile information will remain unchanged.

2.2.18. If saving fails, the system will display an error message informing the user that the profile changes were not saved.

2.2.19. Successfully saved profile changes will remain available after the user signs out and signs back into CampusHub.

### **2.3 Profile Picture**

2.3.1. A CampusHub profile may contain one profile picture.

2.3.2. A profile picture will be optional.

2.3.3. If a user has not uploaded a profile picture, the system will display a default profile image or placeholder.

2.3.4. The Edit Profile interface will provide an option to upload a profile picture.

2.3.5. Selecting the profile picture upload option will allow the user to select an image file from their device.

2.3.6. The system will only accept profile picture files in .jpg, .jpeg, or .png format.

2.3.7. The system will reject an uploaded profile picture larger than 5 MB.

2.3.8. If an unsupported file type is selected, the system will display an error message informing the user that the file type is not supported.

2.3.9. If the selected image exceeds the maximum file size, the system will display an error message informing the user that the image is too large.

2.3.10. An invalid profile picture file will not replace the user's currently saved profile picture.

2.3.11. A valid uploaded profile picture will be associated with the authenticated user's profile after the profile changes are successfully saved.

2.3.12. Uploading a new profile picture will replace the user's previously saved profile picture.

2.3.13. The Edit Profile interface will provide an option to remove the user's current profile picture.

2.3.14. Removing the profile picture will cause the default profile image or placeholder to be displayed after the profile changes are successfully saved.

2.3.15. Selecting Cancel before saving profile changes will discard any newly selected or removed profile picture changes.

2.3.16. If the profile picture upload fails, the system will display an error message and retain the user's previously saved profile picture.

2.3.17. A successfully saved profile picture will remain associated with the user's profile after the user signs out and signs back in.

### **2.4 Major and School Year / Class Standing**

2.4.1. The Edit Profile interface will contain a field for the user's major.

2.4.2. The major field will be optional.

2.4.3. The major field will accept text input.

2.4.4. The major field will accept a maximum of 100 characters.

2.4.5. If a major is provided and saved successfully, the major will be displayed on the user's Profile Page.

2.4.6. If the major field is left blank, no major will be displayed on the user's Profile Page.

2.4.7. The Edit Profile interface will contain a field for the user's school year or class standing.

2.4.8. The school year or class standing field will be optional.

2.4.9. The school year or class standing field will use a predefined list of selectable values.

2.4.10. The available school year or class standing values will include:

* Freshman  
* Sophomore  
* Junior  
* Senior

2.4.11. The user will be able to select only one school year or class standing value at a time.

2.4.12. If a school year or class standing is selected and saved successfully, the selected value will be displayed on the user's Profile Page.

2.4.13. If no school year or class standing is selected, no school year or class standing will be displayed on the user's Profile Page.

2.4.14. Selecting Cancel before saving changes will discard any unsaved changes made to the major or school year/class standing fields.

2.4.15. If saving the updated major or school year/class standing fails, the previously saved values will remain unchanged.

### **2.5 Transfer Student Status**

2.5.1. The Edit Profile interface will contain a field labeled Transfer Student.

2.5.2. The Transfer Student field will provide Yes and No as selectable options.

2.5.3. The user will be able to select only one Transfer Student option at a time.

2.5.4. The Transfer Student field will be optional.

2.5.5. If Yes is selected and saved, the user's profile will identify the user as a transfer student.

2.5.6. If No is selected, transfer student status will not be displayed on the user's Profile Page.

2.5.7. The saved Transfer Student value may be used by CampusHub to determine eligibility for activity posts limited to transfer students.

2.5.8. The user will be able to change their Transfer Student selection through Edit Profile.

### **2.6 Interests**

2.6.1. The Edit Profile interface will provide an option for the user to add interests to their profile.

2.6.2. Interests will be optional.

2.6.3. The user will be able to enter an interest using a text input field.

2.6.4. Each interest will contain a maximum of 50 characters.

2.6.5. A user will be able to save a maximum of 10 interests.

2.6.6. The system will prevent the user from adding more than 10 interests.

2.6.7. The system will prevent an empty interest from being added.

2.6.8. The user will be able to remove an interest from their profile.

2.6.9. Saved interests will be displayed on the user's Profile Page.

2.6.10. If the user has no saved interests, the Profile Page will not display an empty interests list.

2.6.11. Changes to interests will not become permanent until the user selects Save Changes.

### **2.7 Viewing Another Student's Profile**

2.7.1. An authenticated user will be able to open another CampusHub user's Profile Page.

2.7.2. Another student's Profile Page will display the student's name.

2.7.3. Another student's Profile Page will display the student's profile picture or the default profile image.

2.7.4. Another student's Profile Page will display the student's major when one has been provided.

2.7.5. Another student's Profile Page will display the student's school year or class standing when one has been provided.

2.7.6. Another student's Profile Page will display transfer student status when the student has selected Yes.

2.7.7. Another student's Profile Page will display the student's interests when one or more have been provided.

2.7.8. Another student's verified APSU email address will not be displayed on their Profile Page.

2.7.9. A user viewing another student's profile will not be provided with the Edit Profile option.

2.7.10. A user viewing another student's profile will be provided with a Message option.

2.7.11. Selecting Message will open or begin a private conversation with the student.

### **2.8 Profile Privacy and Permissions**

2.8.1. A user must be authenticated to access CampusHub student profiles.

2.8.2. A user will only be permitted to edit the profile associated with their authenticated account.

2.8.3. A user will not be permitted to modify another user's profile information.

2.8.4. A user's verified APSU email address will not be included as publicly visible profile information.

2.8.5. Profile editing requests will only be accepted for the authenticated user's profile.

2.8.6. Profile information will only be updated after the requested changes successfully pass profile validation.

### **2.9 Profile Error Handling**

2.9.1. If the system cannot retrieve profile information, the system will display an error message.

2.9.2. A profile retrieval failure will not allow incorrect or incomplete profile information to overwrite previously stored profile data.

2.9.3. If a profile update fails, the system will display an error message informing the user that the changes were not saved.

2.9.4. A failed profile update will not overwrite the user's previously saved profile information.

2.9.5. If a profile picture upload fails, the user's previously saved profile picture will remain unchanged.

2.9.6. Invalid profile information will not be saved.

2.9.7. When invalid profile information is entered, the system will identify the field that requires correction.

2.9.8. After a successful profile update, the Profile Page will display the newly saved information.

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
What to do

**Remaining Requirements**

* Section 3: Home Page and Navigation  
  * Main page after login  
  * Navigation menu  
  * Moving between Home, Marketplace, Messages, and Profile  
  * Basic navigation behavior  
* Section 4: Activity Feed  
  * Display activity posts  
  * Information shown on each post  
  * Order of posts  
  * Viewing an individual post  
* Section 5: Create Activity Post  
  * Post description/text  
  * Optional image  
  * Create and cancel post  
  * Required fields and limits  
  * Edit and delete own posts  
* Section 6: Activity Audience Filtering  
  * All students  
  * School year/class standing  
  * Transfer students  
  * Selecting an audience  
  * Determining which users can see a post  
* Section 7: Comments and Activity Responses  
  * View comments  
  * Add comments  
  * Comment requirements  
  * Edit/delete own comments  
* Section 8: Marketplace  
  * Browse marketplace listings  
  * Information displayed on listings  
  * Open individual listing  
  * View seller information  
* Section 9: Create and Manage Marketplace Listings  
  * Item title  
  * Description  
  * Price  
  * Item image  
  * Create listing  
  * Edit/delete own listing  
  * Mark item as sold  
* Section 10: Private Messaging  
  * Conversation list  
  * Start a conversation  
  * Send and receive messages  
  * Message timestamps  
  * Message a student from their profile  
  * Message a seller from a marketplace listing  
* Section 11: Sign Out and Session Behavior  
  * Sign Out button  
  * End authenticated session  
  * Return to Sign In  
  * Prevent signed-out access to protected pages

