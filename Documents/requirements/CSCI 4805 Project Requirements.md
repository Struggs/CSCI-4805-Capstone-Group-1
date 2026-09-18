# **Project Name**

CampusHub  
The name CampusHub was chosen because the application is intended to provide one central place, or "hub," where Austin Peay State University students can connect with other students, find activities, communicate, and use a student marketplace.

# **Team Member Names**

* Dallas Chillinsky  
* Elijah Crossan  
* Ezana Kinfe  
* Ian Godfrey

# **Abstract**

CampusHub is a student social platform designed to help college students connect with others on campus. The primary goal is to help transfer students and students who may be unfamiliar with the campus or Clarksville area meet new people, discover activities, and become more involved with other students.  
CampusHub will provide one centralized place where students can create profiles, find and post activities, communicate with other students, and buy or sell items through a student-based marketplace. By keeping the platform focused on the Austin Peay State University community, CampusHub aims to make it easier for students to build connections and become more involved with campus life.

# **Tools & Technologies**

CampusHub will be developed as a web application that can be accessed through a web browser on both desktop computers and mobile devices.

* Visual Studio Code will be used as the primary development environment.  
* JavaScript will be used as the primary programming language.  
* HTML and CSS will be used for the structure and styling of the web application.  
* React will be used to build and organize the user interface.  
* Bootstrap or Tailwind CSS will be considered for styling and responsive layouts. The final choice will be determined by the team.  
* Supabase will be used for authentication and backend services, including account creation, student email verification, and user sessions.  
* PostgreSQL through Supabase will be used to store application data such as student profiles, activity posts, comments, marketplace listings, and private messages.  
* Supabase Storage will be used to store user-uploaded images such as profile pictures and marketplace listing images.  
* Git and GitHub will be used for version control and the project repository.  
* Discord will be used for team communication and coordination.  
* ChatGPT will be used as an assistive learning and troubleshooting tool in accordance with the team's AI policy.

# **Requirements List**

## **1\. Account Access and Creation**

### **1.1 Initial Account Access**

* **1.1.1.** When a user accesses the CampusHub website and is not signed in, the system will display the CampusHub account access page.  
* **1.1.2.** The account access page will display the CampusHub name.  
* **1.1.3.** The account access page will provide an option labeled Sign In for existing users.  
* **1.1.4.** The account access page will provide an option labeled Sign Up for new users.  
* **1.1.5.** Selecting Sign Up will display the new account registration process.  
* **1.1.6.** Selecting Sign In will display the existing-user sign-in form.

### **1.2 Student Email Registration**

* **1.2.1.** The Sign Up process will first request the user's APSU student email address.  
* **1.2.2.** The registration form will contain a label for the student email address.  
* **1.2.3.** The registration form will contain an input field connected to the student email label.  
  * **1.2.3.1.** The student email field will be required.  
  * **1.2.3.2.** The student email field will accept email-formatted input.  
  * **1.2.3.3.** The entered email address must use the approved APSU student email domain.  
  * **1.2.3.4.** The current planned student email domain is @students.apsu.edu.  
  * **1.2.3.5.** If the entered email address does not use the approved APSU student email domain, the system will reject the address.  
  * **1.2.3.6.** If the email address is rejected, the system will display a message informing the user that a valid APSU student email address is required.  
* **1.2.4.** The registration form will contain a button labeled Continue.  
  * **1.2.4.1.** Selecting Continue will validate the entered email address.  
  * **1.2.4.2.** The system will check whether the entered email address is already associated with a CampusHub account.  
  * **1.2.4.3.** If an account already exists using the entered email address, the system will not create another account.  
  * **1.2.4.4.** If an account already exists, the system will inform the user that the email address is already registered.  
  * **1.2.4.5.** If the email address is valid and is not already registered, the system will begin the email verification process.

### **1.3 Student Email Verification**

* **1.3.1.** CampusHub will verify a user's APSU student email address before allowing the user to complete account creation.  
* **1.3.2.** The system will send a verification code to the APSU student email address entered during registration.  
* **1.3.3.** After the verification code is sent, the system will display a verification form.  
* **1.3.4.** The verification form will inform the user that a verification code was sent to their student email address.  
* **1.3.5.** The verification form will contain an input field for the verification code.  
  * **1.3.5.1.** The verification code field will be required.  
* **1.3.6.** The verification form will contain a button labeled Verify.  
  * **1.3.6.1.** Selecting Verify will submit the entered verification code.  
  * **1.3.6.2.** If the verification code matches the code sent to the user's email address, the email address will be considered verified.  
  * **1.3.6.3.** If the verification code is incorrect, the email address will remain unverified.  
  * **1.3.6.4.** If the verification code is incorrect, the system will display a message informing the user that the code is invalid.  
  * **1.3.6.5.** An incorrect verification code will not allow the user to continue account creation.  
* **1.3.7.** The verification form will provide an option labeled Resend Code.  
  * **1.3.7.1.** Selecting Resend Code will send a new verification code to the user's student email address.  
* **1.3.8.** The user will not be able to access CampusHub's authenticated features until the student email address has been successfully verified.  
* **1.3.9.** After successful email verification, the system will continue to create passwords.

### **1.4 Password Creation**

* **1.4.1.** After successful student email verification, the system will display the password creation form.  
* **1.4.2.** The password creation form will contain a label for Password.  
* **1.4.3.** The password creation form will contain a password input field.  
  * **1.4.3.1.** The password field will be required.  
  * **1.4.3.2.** Characters entered into the password field will be hidden from view by default.  
* **1.4.4.** The password creation form will contain a label for Confirm Password.  
* **1.4.5.** The password creation form will contain a confirm-password input field.  
  * **1.4.5.1.** The confirm-password field will be required.  
  * **1.4.5.2.** Characters entered into the confirm-password field will be hidden from view by default.  
  * **1.4.5.3.** The value entered into the confirm-password field must exactly match the value entered into the password field.  
  * **1.4.5.4.** If the two password fields do not match, the system will display a message informing the user that the passwords do not match.  
  * **1.4.5.5.** The user will not be allowed to continue until the password fields match.

### **1.5 Password Requirements**

* **1.5.1.** CampusHub passwords must contain at least eight characters.  
* **1.5.2.** CampusHub passwords must contain at least one uppercase letter.  
* **1.5.3.** CampusHub passwords must contain at least one lowercase letter.  
* **1.5.4.** CampusHub passwords must contain at least one number.  
* **1.5.5.** CampusHub passwords must contain at least one special character.  
* **1.5.6.** The password creation form will display the password requirements to the user.  
* **1.5.7.** The system will prevent account creation if the password does not satisfy all password requirements.  
* **1.5.8.** If a password requirement is not satisfied, the system will inform the user that the password does not meet the required format.  
* **1.5.9.** The password creation form will contain a button labeled Continue.  
  * **1.5.9.1.** Selecting Continue will validate the password and confirm-password fields.  
  * **1.5.9.2.** If both password fields are valid and match, the account creation process will continue to initial profile creation.

### **1.6 Initial Profile Creation**

* **1.6.1.** After the user's student email has been verified and a valid password has been created, the system will display the initial profile creation form.  
* **1.6.2.** The initial profile creation form will contain a label for the user's name.  
* **1.6.3.** The initial profile creation form will contain an input field connected to the name label.  
  * **1.6.3.1.** The name field will be required.  
  * **1.6.3.2.** The name field must contain at least one character.  
  * **1.6.3.3.** The name field will accept a maximum of 100 characters.  
* **1.6.4.** The initial profile creation form will contain a button labeled Create Profile.  
  * **1.6.4.1.** Selecting Create Profile will validate the required name field.  
  * **1.6.4.2.** If the name field is empty, the profile will not be created.  
  * **1.6.4.3.** If the name field is empty, the system will display a message informing the user that a name is required.  
  * **1.6.4.4.** If the entered name is valid, the system will create the user's initial CampusHub profile.  
* **1.6.5.** The user's verified student email address will be associated with the new profile.  
* **1.6.6.** The user's entered name will be displayed as the name on their CampusHub profile.  
* **1.6.7.** Other profile information will not be required during initial account creation.  
* **1.6.8.** The user will be able to add additional profile information later through profile settings.  
* **1.6.9.** Additional profile information may include a profile picture, major, school year, classes, and interests.  
* **1.6.10.** After the initial profile is successfully created, the user will be directed to the CampusHub home page.

### **1.7 Existing User Sign In**

* **1.7.1.** The CampusHub account access page will provide a Sign In option for users who have already created an account.  
* **1.7.2.** Selecting Sign In will display the existing-user sign-in form.  
* **1.7.3.** The sign-in form will contain a label for the user's APSU student email address.  
* **1.7.4.** The sign-in form will contain an input field connected to the APSU student email address label.  
  * **1.7.4.1.** The email field will be required.  
  * **1.7.4.2.** The email field will accept email-formatted input.  
* **1.7.5.** The sign-in form will contain a label for the user's password.  
* **1.7.6.** The sign-in form will contain a password input field.  
  * **1.7.6.1.** The password field will be required.  
  * **1.7.6.2.** Characters entered into the password field will be hidden from view by default.  
  * **1.7.6.3.** The password field will provide an option to temporarily show or hide the entered password.  
* **1.7.7.** The sign-in form will contain a button labeled Sign In.  
  * **1.7.7.1.** Selecting Sign In will submit the entered email address and password for authentication.  
  * **1.7.7.2.** The system will prevent the sign-in form from being submitted if the email field is empty.  
  * **1.7.7.3.** The system will prevent the sign-in form from being submitted if the password field is empty.  
  * **1.7.7.4.** If a required field is empty, the system will display a message identifying the required field.  
* **1.7.8.** The system will verify that the entered email address and password belong to an existing CampusHub account.  
  * **1.7.8.1.** If the email address and password are correct, the user will be signed into their existing CampusHub account.  
  * **1.7.8.2.** If the email address or password is incorrect, the user will not be signed in.  
  * **1.7.8.3.** If the sign-in attempt is unsuccessful, the system will display a message informing the user that the email address or password is incorrect.  
  * **1.7.8.4.** The error message will not identify whether the email address or the password was specifically incorrect.  
* **1.7.9.** The system will verify that the account's APSU student email address has been verified.  
  * **1.7.9.1.** An account with an unverified student email address will not be allowed to access the CampusHub home page.  
  * **1.7.9.2.** If the account has not completed email verification, the user will be directed to the student email verification process.  
* **1.7.10.** After a successful sign-in, the user will be directed to the CampusHub home page.

### **1.8 Forgot Password**

Since the login mockup already shows Forgot password?, I would include this. It is also a normal enough authentication feature that it makes sense for a senior project without adding much unnecessary scope.

* **1.8.1.** The sign-in form will provide a link labeled Forgot password?.  
* **1.8.2.** Selecting Forgot password? will display the password recovery process.  
* **1.8.3.** The password recovery form will request the user's APSU student email address.  
  * **1.8.3.1.** The email field will be required.  
* **1.8.4.** The user will be able to submit the entered email address to request a password reset.  
* **1.8.5.** If the submitted email address is associated with a CampusHub account, the system will send password recovery instructions to that email address.  
* **1.8.6.** The password recovery process will require the user to verify access to the email address before creating a new password.  
* **1.8.7.** The new password must satisfy the CampusHub password requirements defined in Section 1.5.  
* **1.8.8.** The user will be required to enter the new password a second time to confirm it.  
* **1.8.9.** The two new password entries must match before the password can be changed.  
* **1.8.10.** After the password is successfully changed, the user will be able to return to the Sign In page and sign in using the new password.

## **2\. Profile Navigation**

### **2.1 Profile Page**

* **2.1.1.** The Profile Page will only be accessible to authenticated CampusHub users.  
* **2.1.2.** Selecting Profile from the CampusHub navigation will open the authenticated user's profile.  
* **2.1.3.** The Profile Page will retrieve and display the profile information associated with the authenticated user's account.  
* **2.1.4.** The Profile Page will display the user's name.  
* **2.1.5.** The Profile Page will display the user's profile picture when one has been uploaded.  
* **2.1.6.** If the user has not uploaded a profile picture, the Profile Page will display a default profile image or placeholder.  
* **2.1.7.** The Profile Page will display the user's major when one has been provided.  
* **2.1.8.** The Profile Page will display the user's school year or class standing when one has been provided.  
* **2.1.9.** The Profile Page will display whether the user has identified themselves as a transfer student.  
* **2.1.10.** The Profile Page will display the user's interests when one or more interests have been provided.  
* **2.1.11.** Optional profile fields that contain no user-provided data will not display empty values.  
* **2.1.12.** The user's APSU email address will not be displayed as public profile information.  
* **2.1.13.** The authenticated user's Profile Page will contain an Edit Profile option.  
* **2.1.14.** Selecting Edit Profile will open the profile editing interface defined in Section 2.2.  
* **2.1.15.** Profile information displayed on the page will reflect the most recently saved profile data.  
* **2.1.16.** If the profile data cannot be retrieved, the system will display an error message instead of displaying incomplete profile information

### **2.2 Edit Profile**

* **2.2.1.** The authenticated user's Profile Page will contain an Edit Profile option.  
* **2.2.2.** Selecting Edit Profile will open the profile editing interface for the authenticated user.  
* **2.2.3.** The profile editing interface will load the user's currently saved profile information into the appropriate editable fields.  
* **2.2.4.** The profile editing interface will allow the user to modify only the profile associated with the authenticated account.  
* **2.2.5.** The profile editing interface will provide editable fields for the user's name, major, school year or class standing, transfer student status, interests, and profile picture.  
* **2.2.6.** The user's verified APSU email address will not be editable from the profile editing interface.  
* **2.2.7.** The profile editing interface will contain a button labeled Save Changes.  
* **2.2.8.** Selecting Save Changes will validate all edited profile fields before any changes are stored.  
* **2.2.9.** If one or more edited fields contain invalid data, the system will not save the profile changes.  
* **2.2.10.** If validation fails, the system will display an error message identifying the field that must be corrected.  
* **2.2.11.** If all edited fields are valid, the system will update the user's stored profile information.  
* **2.2.12.** After profile changes are successfully saved, the Profile Page will display the updated information.  
* **2.2.13.** The system will display a confirmation message after profile changes are successfully saved.  
* **2.2.14.** The profile editing interface will contain a button labeled Cancel.  
* **2.2.15.** Selecting Cancel will exit the profile editing interface without saving unsaved changes.  
* **2.2.16.** After Cancel is selected, the Profile Page will display the most recently saved profile information.  
* **2.2.17.** If the system fails to save valid profile changes, the existing stored profile information will remain unchanged.  
* **2.2.18.** If saving fails, the system will display an error message informing the user that the profile changes were not saved.  
* **2.2.19.** Successfully saved profile changes will remain available after the user signs out and signs back into CampusHub.

### **2.3 Profile Picture**

* **2.3.1.** A CampusHub profile may contain one profile picture.  
* **2.3.2.** A profile picture will be optional.  
* **2.3.3.** If a user has not uploaded a profile picture, the system will display a default profile image or placeholder.  
* **2.3.4.** The Edit Profile interface will provide an option to upload a profile picture.  
* **2.3.5.** Selecting the profile picture upload option will allow the user to select an image file from their device.  
* **2.3.6.** The system will only accept profile picture files in .jpg, .jpeg, or .png format.  
* **2.3.7.** The system will reject an uploaded profile picture larger than 5 MB.  
* **2.3.8.** If an unsupported file type is selected, the system will display an error message informing the user that the file type is not supported.  
* **2.3.9.** If the selected image exceeds the maximum file size, the system will display an error message informing the user that the image is too large.  
* **2.3.10.** An invalid profile picture file will not replace the user's currently saved profile picture.  
* **2.3.11.** A valid uploaded profile picture will be associated with the authenticated user's profile after the profile changes are successfully saved.  
* **2.3.12.** Uploading a new profile picture will replace the user's previously saved profile picture.  
* **2.3.13.** The Edit Profile interface will provide an option to remove the user's current profile picture.  
* **2.3.14.** Removing the profile picture will cause the default profile image or placeholder to be displayed after the profile changes are successfully saved.  
* **2.3.15.** Selecting Cancel before saving profile changes will discard any newly selected or removed profile picture changes.  
* **2.3.16.** If the profile picture upload fails, the system will display an error message and retain the user's previously saved profile picture.  
* **2.3.17.** A successfully saved profile picture will remain associated with the user's profile after the user signs out and signs back in.

### **2.4 Major and School Year / Class Standing**

* **2.4.1.** The Edit Profile interface will contain a field for the user's major.  
* **2.4.2.** The major field will be optional.  
* **2.4.3.** The major field will accept text input.  
* **2.4.4.** The major field will accept a maximum of 100 characters.  
* **2.4.5.** If a major is provided and saved successfully, the major will be displayed on the user's Profile Page.  
* **2.4.6.** If the major field is left blank, no major will be displayed on the user's Profile Page.  
* **2.4.7.** The Edit Profile interface will contain a field for the user's school year or class standing.  
* **2.4.8.** The school year or class standing field will be optional.  
* **2.4.9.** The school year or class standing field will use a predefined list of selectable values.  
* **2.4.10.** The available school year or class standing values will include:  
* Freshman  
* Sophomore  
* Junior  
* Senior  
* **2.4.11.** The user will be able to select only one school year or class standing value at a time.  
* **2.4.12.** If a school year or class standing is selected and saved successfully, the selected value will be displayed on the user's Profile Page.  
* **2.4.13.** If no school year or class standing is selected, no school year or class standing will be displayed on the user's Profile Page.  
* **2.4.14.** Selecting Cancel before saving changes will discard any unsaved changes made to the major or school year/class standing fields.  
* **2.4.15.** If saving the updated major or school year/class standing fails, the previously saved values will remain unchanged.

### **2.5 Transfer Student Status**

* **2.5.1.** The Edit Profile interface will contain a field labeled Transfer Student.  
* **2.5.2.** The Transfer Student field will provide Yes and No as selectable options.  
* **2.5.3.** The user will be able to select only one Transfer Student option at a time.  
* **2.5.4.** The Transfer Student field will be optional.  
* **2.5.5.** If Yes is selected and saved, the user's profile will identify the user as a transfer student.  
* **2.5.6.** If No is selected, transfer student status will not be displayed on the user's Profile Page.  
* **2.5.7.** The saved Transfer Student value may be used by CampusHub to determine eligibility for activity posts limited to transfer students.  
* **2.5.8.** The user will be able to change their Transfer Student selection through Edit Profile.

### **2.6 Interests**

* **2.6.1.** The Edit Profile interface will provide an option for the user to add interests to their profile.  
* **2.6.2.** Interests will be optional.  
* **2.6.3.** The user will be able to enter an interest using a text input field.  
* **2.6.4.** Each interest will contain a maximum of 50 characters.  
* **2.6.5.** A user will be able to save a maximum of 10 interests.  
* **2.6.6.** The system will prevent the user from adding more than 10 interests.  
* **2.6.7.** The system will prevent an empty interest from being added.  
* **2.6.8.** The user will be able to remove an interest from their profile.  
* **2.6.9.** Saved interests will be displayed on the user's Profile Page.  
* **2.6.10.** If the user has no saved interests, the Profile Page will not display an empty interests list.  
* **2.6.11.** Changes to interests will not become permanent until the user selects Save Changes.

### **2.7 Viewing Another Student's Profile**

* **2.7.1.** An authenticated user will be able to open another CampusHub user's Profile Page.  
* **2.7.2.** Another student's Profile Page will display the student's name.  
* **2.7.3.** Another student's Profile Page will display the student's profile picture or the default profile image.  
* **2.7.4.** Another student's Profile Page will display the student's major when one has been provided.  
* **2.7.5.** Another student's Profile Page will display the student's school year or class standing when one has been provided.  
* **2.7.6.** Another student's Profile Page will display transfer student status when the student has selected Yes.  
* **2.7.7.** Another student's Profile Page will display the student's interests when one or more have been provided.  
* **2.7.8.** Another student's verified APSU email address will not be displayed on their Profile Page.  
* **2.7.9.** A user viewing another student's profile will not be provided with the Edit Profile option.  
* **2.7.10.** A user viewing another student's profile will be provided with a Message option.  
* **2.7.11.** Selecting Message will open or begin a private conversation with the student.

### **2.8 Profile Privacy and Permissions**

* **2.8.1.** A user must be authenticated to access CampusHub student profiles.  
* **2.8.2.** A user will only be permitted to edit the profile associated with their authenticated account.  
* **2.8.3.** A user will not be permitted to modify another user's profile information.  
* **2.8.4.** A user's verified APSU email address will not be included as publicly visible profile information.  
* **2.8.5.** Profile editing requests will only be accepted for the authenticated user's profile.  
* **2.8.6.** Profile information will only be updated after the requested changes successfully pass profile validation.

### **2.9 Profile Error Handling**

* **2.9.1.** If the system cannot retrieve profile information, the system will display an error message.  
* **2.9.2.** A profile retrieval failure will not allow incorrect or incomplete profile information to overwrite previously stored profile data.  
* **2.9.3.** If a profile update fails, the system will display an error message informing the user that the changes were not saved.  
* **2.9.4.** A failed profile update will not overwrite the user's previously saved profile information.  
* **2.9.5.** If a profile picture upload fails, the user's previously saved profile picture will remain unchanged.  
* **2.9.6.** Invalid profile information will not be saved.  
* **2.9.7.** When invalid profile information is entered, the system will identify the field that requires correction.  
* **2.9.8.** After a successful profile update, the Profile Page will display the newly saved information.

## **3\. Home Page and Navigation**

### **3.1 Home Page Access**

* **3.1.1.** After a successful sign in, the user will be directed to the CampusHub Home Page.  
* **3.1.2.** After a new user completes initial profile creation, the user will be directed to the CampusHub Home Page.  
* **3.1.3.** The Home Page will only be accessible to authenticated CampusHub users.  
* **3.1.4.** If an unauthenticated user attempts to access the Home Page, the system will redirect the user to the account access page.  
* **3.1.5.** The Home Page will serve as the primary landing page for authenticated users.  
* **3.1.6.** The Home Page will provide access to the CampusHub activity feed.

### **3.2 Main Navigation**

* **3.2.1.** The CampusHub interface will contain a main navigation menu for authenticated users.  
* **3.2.2.** The main navigation menu will provide access to `Home`.  
* **3.2.3.** The main navigation menu will provide access to `Marketplace`.  
* **3.2.4.** The main navigation menu will provide access to `Messages`.  
* **3.2.5.** The main navigation menu will provide access to `Profile`.  
* **3.2.6.** The main navigation menu will provide access to `Sign Out`.  
* **3.2.7.** The main navigation menu will remain available while the user is accessing authenticated CampusHub pages.

### **3.3 Home Navigation**

* **3.3.1.** Selecting `Home` from the main navigation menu will open the CampusHub Home Page.  
* **3.3.2.** Selecting Home while already on the Home Page will keep the user on the Home Page.  
* **3.3.3.** Returning to the Home Page will display the current activity feed.

### **3.4 Marketplace Navigation**

* **3.4.1.** Selecting `Marketplace` from the main navigation menu will open the Marketplace page.  
* **3.4.2.** The Marketplace page will only be accessible to authenticated users.  
* **3.4.3.** Selecting Marketplace from another CampusHub page will navigate the user to the Marketplace without signing the user out.

### **3.5 Messages Navigation**

* **3.5.1.** Selecting `Messages` from the main navigation menu will open the user's private messaging area.  
* **3.5.2.** The Messages page will only be accessible to authenticated users.  
* **3.5.3.** Selecting Messages from another CampusHub page will navigate the user to the messaging area without ending the authenticated session.

### **3.6 Profile Navigation**

* **3.6.1.** Selecting `Profile` from the main navigation menu will open the authenticated user's Profile Page.  
* **3.6.2.** The Profile Page will display the profile associated with the currently authenticated account.  
* **3.6.3.** Selecting Profile will not allow the user to access another user's editable profile information.

### **3.7 Basic Navigation Behavior**

* **3.7.1.** Navigation links will open the CampusHub section associated with the selected option.  
* **3.7.2.** The system will maintain the user's authenticated session while the user moves between CampusHub pages.  
* **3.7.3.** Moving between CampusHub pages will not require the user to sign in again during an active session.  
* **3.7.4.** The currently selected section will be visually identifiable in the main navigation.  
* **3.7.5.** Navigation controls will remain functional after the user moves between CampusHub sections.  
* **3.7.6.** If a requested CampusHub page fails to load, the system will display an error message.  
* **3.7.7.** A failed page load will not automatically end the user's authenticated session.  
* **3.7.8.** The user will be able to navigate to another available CampusHub section after a page-loading error.

### **3.8 Sign Out Navigation**

* **3.8.1.** The main navigation menu will contain a `Sign Out` option.  
* **3.8.2.** Selecting Sign Out will begin the sign-out process.  
* **3.8.3.** Detailed sign-out and session-ending behavior will be defined in the Sign Out and Session Behavior section.

## **4\. Activity Feed**

### **4.1 Display Activity Posts**

* **4.1.1.** The CampusHub Home Page will display an activity feed consisting of posts created by authenticated CampusHub users.  
* **4.1.2.** The activity feed will only display posts where the authenticated user meets the target audience filter requirements defined in Section 6\.  
* **4.1.3.** If there are no activity posts available, a message will be displayed in the activity feed indicating that there are no available posts.  
* **4.1.4.** The activity feed will update dynamically in real-time when new posts are created, edited, or deleted.  
* **4.1.5.** If the user is not connected to the internet when accessing the feed or when real-time updates occur, the system will display an error message indicating that connection has been lost and cached posts cannot be updated.

### **4.2 Information shown on each post**

* **4.2.1.** Each activity post displayed in the feed will show the name of the student who created the post.  
* **4.2.2.** Each activity post will display the profile picture or default profile image of the student who created the post.  
* **4.2.3.** Selecting the poster's name or profile picture will open that student's Profile Page as defined in Section 2.7.  
* **4.2.4.** Each activity post will display the full text or description that the author is required to provide to post.  
* **4.2.5.** Each activity post will display an uploaded image if the author attached one to the post.  
* **4.2.6.** If the author did not attach an image, no image placeholder will be displayed for that post.  
* **4.2.7.** Each activity post will display the timestamp indicating when the post was created, date and time..  
* **4.2.8.** Each activity post will display the target audience filter selected by the author.  
* **4.2.9.** Each activity post will display the total number of comments and interactions associated with the post.

### **4.3 Order of posts**

* **4.3.1.** Activity posts in the feed will be displayed in reverse chronological order by default.  
* **4.3.2.** The most recently created activity posts will appear at the top of the activity feed.  
* **4.3.3.** Older activity posts will appear further down the feed.

### **4.4 Viewing an Individual Post**

* **4.4.1.** Selecting an activity post from the feed will open the individual post view.  
* **4.4.2.** The individual post view will display all information associated with the post, including author details, full text, attached image, timestamp, and target audience, and a back button.  
  * **4.4.2.1.** Clicking the back arrow will take the user to the previous page.  
* **4.4.3.** The individual post view will display the complete list of comments associated with the post.  
* **4.4.4.** The individual post view will provide access to the comment creation feature defined in Section 7\.  
* **4.4.5.** If the authenticated user is the author of the post, the individual post view will provide options to edit or delete the post.

## **5\. Create Activity Post**

### **5.1 Post Description / Text**

* **5.1.1.** The CampusHub interface will provide a control allowing authenticated users to create a new activity post.  
* **5.1.2.** The create post interface will contain a text input field for the post description.  
* **5.1.3.** The post description field will accept alphanumeric characters, punctuation, and standard symbols.  
* **5.1.4.** The post description field will require at least one character.  
* **5.1.5.** The post description field will accept a maximum of 500 characters.  
* **5.1.6.** The interface will display a character counter showing remaining characters.  
* **5.1.7.** The system will prevent text input beyond 500 characters.

### **5.2 Optional image**

* **5.2.1.** The create post interface will provide an option to attach an image.  
* **5.2.2.** Attaching an image to an activity post will be optional.  
* **5.2.3.** The system will accept image files only in .jpg, .jpeg, and .png formats.  
* **5.2.4.** The system will reject any uploaded image exceeding 5 MB in size.  
* **5.2.5.** If an unsupported file type is selected, the system will reject the file and display an error message stating that the format is not supported.  
* **5.2.6.** If a selected file exceeds 5 MB, the system will reject the file and display an error message stating that the file size exceeds the limit.  
* **5.2.7.** The create post interface will display an image thumbnail preview once an image is selected.  
* **5.2.8.** The interface will provide an option to remove the selected image before publishing which will return the post to the prior state.

### **5.3 Create and Cancel Post**

* **5.3.1.** The create post interface will contain a button labeled Post.  
* **5.3.2.** Selecting Post will check for any errors in all post fields before submission.  
* **5.3.3.** If submission is successful, the system will publish the post, close the creation interface, and insert the post at the top of the activity feed.  
* **5.3.4.** The create post interface will contain a button labeled Cancel.  
* **5.3.5.** Selecting Cancel will discard all entered text, attached images, and selected audience settings.  
* **5.3.6.** If Cancel is selected after text or an image has been entered, the system will request confirmation before discarding the draft.  
* **5.3.7.** Confirming cancellation will close the creation interface and return the user to the activity feed.

### **5.4 Required Fields and Limits**

* **5.4.1.** The post description field will be required.  
* **5.4.2.** The target audience selection field defined in Section 6 will be required.  
* **5.4.3.** If a user attempts to submit a post with an empty description, the system will halt submission and display an error message indicating that description text is required.  
* **5.4.4.** If a user attempts to submit a post without selecting a target audience, the system will halt submission and display an error message indicating that an audience must be selected.  
* **5.4.5.** A post may contain a maximum of one attached image.  
* **5.4.6.** If network connectivity is lost during submission, the system will display an error message indicating that the post failed to publish and retain the user's entered draft.

### **5.5 Edit and Delete Own Posts**

* **5.5.1.** An authenticated user will be permitted to edit or delete only the activity posts created by their own account.  
* **5.5.2.** The individual post view for a user's own post will contain an Edit option.  
* **5.5.3.** Selecting Edit will open an editing interface showing the post's current description, attached image, and target audience.  
* **5.5.4.** The user will be able to modify the description, replace or remove the attached image, and change the target audience.  
* **5.5.5.** The editing interface will contain a button labeled Save Changes.  
* **5.5.6.** Selecting Save Changes will validate the updated post fields and update the stored post if valid.  
* **5.5.7.** Successfully saved post edits will be immediately transfered to the activity feed.  
* **5.5.8.** The individual post view for a user's own post will contain a Delete option.  
* **5.5.9.** Selecting Delete will prompt the user to confirm the deletion before the post is removed.  
* **5.5.10.** If deletion is confirmed, the system will permanently remove the activity post and all associated comments from the activity feed.

## **6\. Activity Audience Filtering**

### **6.1 All Students**

* **6.1.1.** The post creation interface will provide a target audience selection option labeled All Students.  
* **6.1.2.** Selecting All Students will make the activity post visible to all authenticated CampusHub users in their activity feeds.

### **6.2 School Year / Class Standing**

* **6.2.1.** The post creation interface will provide a target audience selection option allowing posts to be filtered by school year or class standing.  
* **6.2.2.** When selecting a school year filter, the user will be able to choose from Freshman, Sophomore, Junior, or Senior class standings.  
* **6.2.3.** The user will be able to select a single class standing or multiple specific class standings for a single post.  
* **6.2.4.** If a school year filter is selected, the activity post will only be displayed in the activity feeds of authenticated users whose profile matches one of the selected class standings.

### **6.3 Transfer Students**

* **6.3.1.** The post creation interface will provide a target audience selection option labeled Transfer Students Only.  
* **6.3.2.** If Transfer Students Only is selected, the activity post will only be displayed in the activity feeds of authenticated users who have identified themselves as transfer students on their profile (Transfer Student set to Yes).

### **6.4 Selecting an Audience**

* **6.4.1.** The post creation interface will require the author to select exactly one primary audience category (All Students, Specific Class Standing(s), or Transfer Students Only) before publishing an activity post.  
* **6.4.2.** If no audience category is selected, the system will prevent the post from being created and display an error message.

### **6.5 Determining Which Users Can See a Post**

* **6.5.1.** The system will evaluate each authenticated user's profile attributes against the audience filter specified by the post author.  
* **6.5.2.** An activity post targeted to All Students will be visible to all users.  
* **6.5.3.** An activity post targeted to specific class standings will be visible only to users whose profile class standing matches the target list.  
* **6.5.4.** An activity post targeted to transfer students will be visible only to users whose profile indicates transfer student status.  
* **6.5.5.** If a user does not meet the criteria specified by a post's audience filter, that post will be omitted from the user's activity feed entirely.

## **7\. Comments and Activity Responses**

### **7.1 View Comments**

* **7.1.1.** There will be a comment button  
* **7.1.2.** Once the comment button is clicked the user will be able to view posted comments  
* **7.1.3.** Deleted comments will not be able to be viewed  
* **7.1.4.** There will be a scroll bar  
  * **7.1.4.1.** The scroll bar will allow the user to scroll through the currently displayed comments  
* **7.1.5.** There will be a View More Comments button  
  * **7.1.5.1.** A maximum of 25 comments will initially populate  
  * **7.1.5.2.** The View More Comments button will only be visible under the following conditions:  
    * **7.1.5.2.1.** There are more than 25 comments posted  
    * **7.1.5.2.2.** There are additional comments that have not been populated  
  * **7.1.5.3.** Once the View More Comments button is clicked, additional comments will populate  
    * **7.1.5.3.1.** A maximum of 25 additional comments will populate at a time  
    * **7.1.5.3.2.** The additional comments will populate under the bottom-most currently displayed comment  
    * **7.1.5.3.3.** The View More Comments button will remain visible if additional comments have not been populated  
    * **7.1.5.3.4.** The View More Comments button will no longer be visible once all comments have been populated  
* **7.1.6.** Longer comments will be shortened when initially displayed  
  * **7.1.6.1.** Shortened comments will have a View More button  
  * **7.1.6.2.** Once the View More button is clicked, the entire comment will be displayed  
  * **7.1.6.3.** Once the entire comment is displayed, the View More button will change to View Less  
  * **7.1.6.4.** Once the View Less button is clicked, the comment will return to its shortened display

### **7.2 Add Comments**

* **7.2.1.** There will be an Add Comment text box  
  * **7.2.1.1.** The text box will allow the user to type a comment  
  * **7.2.1.2.** The text box will display the user’s profile picture next to it  
* **7.2.2.** There will be a Post Comment button  
  * **7.2.2.1.** The Post Comment button will submit the text entered in the Add Comment text box  
  * **7.2.2.2.** The Post Comment button will only allow the comment to be posted if all comment requirements in Section 7.3 are met  
* **7.2.3.** Once a comment is successfully posted, the comment will be added to the selected post  
  * **7.2.3.1.** The posted comment will display the user’s profile picture  
  * **7.2.3.2.** The posted comment will display the user’s name  
  * **7.2.3.3.** The posted comment will display the comment text  
  * **7.2.3.4.** The posted comment will display the time it was posted  
* **7.2.4.** Once the comment is successfully posted, the Add Comment text box will be cleared  
* **7.2.5.** The number of comments displayed on the post will increase by one after a comment is successfully posted  
* **7.2.6.** If the comment cannot be posted, the comment will not be added to the post  
  * **7.2.6.1.** The user will be notified that the comment was not successfully posted

### **7.3 Comment Requirements**

* **7.3.1.** Comments will have a maximum character limit of 1,000 characters  
  * **7.3.1.1.** The user will not be able to enter additional characters once the maximum character limit has been reached  
  * **7.3.1.2.** A character counter will display the number of characters entered compared to the maximum character limit  
* **7.3.2.** Comments must contain at least one character  
  * **7.3.2.1.** Comments containing only spaces will be considered empty  
  * **7.3.2.2.** Empty comments will not be able to be posted  
* **7.3.3.** Comments will allow the use of the following characters:  
  * **7.3.3.1.** Letters  
  * **7.3.3.2.** Numbers  
  * **7.3.3.3.** Punctuation  
  * **7.3.3.4.** Special characters  
  * **7.3.3.5.** Emojis  
* **7.3.4.** Comments will allow multiple lines of text  
  * **7.3.4.1.** Pressing Enter while typing a comment will create a new line rather than submit the comment  
* **7.3.5.** Comments must meet all requirements before they can be posted  
  * **7.3.5.1.** If a comment does not meet the requirements, the Post Comment button will be disabled

### **7.4 Edit/Delete Own Comments**

* **7.4.1.** There will be an options button on comments posted by the user  
  * **7.4.1.1.** The options button will contain an Edit Comment option  
  * **7.4.1.2.** The options button will contain a Delete Comment option  
  * **7.4.1.3.** The Edit Comment and Delete Comment options will only be available to the user who posted the comment  
* **7.4.2.** Selecting Edit Comment will allow the user to modify the comment  
  * **7.4.2.1.** The original comment will populate in an editable text box  
  * **7.4.2.2.** There will be a Save button  
    * **7.4.2.2.1.** Selecting the Save button will update the comment with the edited text  
    * **7.4.2.2.2.** The edited comment must meet all comment requirements in Section 7.3  
  * **7.4.2.3.** There will be a Cancel button  
    * **7.4.2.3.1.** Selecting the Cancel button will discard any changes made to the comment  
    * **7.4.2.3.2.** The original comment will remain unchanged  
  * **7.4.2.4.** Successfully edited comments will display an Edited indicator  
* **7.4.3.** Selecting Delete Comment will display a confirmation message  
  * **7.4.3.1.** The confirmation message will contain a Delete button  
    * **7.4.3.1.1.** Selecting the Delete button will delete the comment  
    * **7.4.3.1.2.** The deleted comment will no longer be viewable  
    * **7.4.3.1.3.** The comment count on the post will decrease by one  
  * **7.4.3.2.** The confirmation message will contain a Cancel button  
    * **7.4.3.2.1.** Selecting the Cancel button will close the confirmation message  
    * **7.4.3.2.2.** The comment will not be deleted

## **8\. Marketplace**

### **8.1 Browse Marketplace Listings**

* **8.1.1.** There will be a Marketplace button in the navigation menu  
  * **8.1.1.1.** Selecting the Marketplace button will open the Marketplace page  
* **8.1.2.** The Marketplace page will display available listings  
  * **8.1.2.1.** Listings marked as sold will not be displayed as available  
  * **8.1.2.2.** Listings that have been deleted will not be displayed  
* **8.1.3.** Marketplace listings will be displayed in a grid format  
* **8.1.4.** There will be a search bar  
  * **8.1.4.1.** The search bar will allow the user to search for Marketplace listings  
  * **8.1.4.2.** Search results will update based on the text entered into the search bar  
  * **8.1.4.3.** The search will compare the entered text to listing titles  
  * **8.1.4.4.** If no listings match the search, the user will be notified that no results were found  
* **8.1.5.** There will be a Category filter  
  * **8.1.5.1.** The Category filter will allow the user to select a Marketplace category  
  * **8.1.5.2.** Only listings within the selected category will be displayed  
  * **8.1.5.3.** The available categories will include:  
    * **8.1.5.3.1.** Textbooks  
    * **8.1.5.3.2.** Electronics  
    * **8.1.5.3.3.** Dorm Essentials  
    * **8.1.5.3.4.** Clothing  
    * **8.1.5.3.5.** Tickets  
    * **8.1.5.3.6.** Other  
* **8.1.6.** There will be a Price filter  
  * **8.1.6.1.** The Price filter will allow the user to limit listings based on price  
  * **8.1.6.2.** The user will be able to enter a minimum price  
  * **8.1.6.3.** The user will be able to enter a maximum price  
  * **8.1.6.4.** Only listings within the selected price range will be displayed  
* **8.1.7.** There will be a Condition filter  
  * **8.1.7.1.** The Condition filter will allow the user to select an item condition  
  * **8.1.7.2.** The available conditions will include:  
    * **8.1.7.2.1.** New  
    * **8.1.7.2.2.** Like New  
    * **8.1.7.2.3.** Good  
    * **8.1.7.2.4.** Fair  
  * **8.1.7.3.** Only listings matching the selected condition will be displayed  
* **8.1.8.** The user will be able to apply multiple filters at the same time  
  * **8.1.8.1.** A listing must meet all selected filters to be displayed  
* **8.1.9.** There will be an option to clear the selected filters  
  * **8.1.9.1.** Clearing the filters will return the Marketplace to displaying all available listings  
* **8.1.10.** A limited number of listings will populate at one time  
  * **8.1.10.1.** There will be a View More button when additional listings are available  
  * **8.1.10.2.** Selecting View More will populate additional listings below the currently displayed listings  
  * **8.1.10.3.** The View More button will no longer be displayed once all matching listings have populated

### **8.2 Information Displayed on Listings**

* **8.2.1.** Each Marketplace listing will display the item’s primary image  
* **8.2.2.** Each Marketplace listing will display the item title  
* **8.2.3.** Each Marketplace listing will display the asking price  
* **8.2.4.** Each Marketplace listing will display the item condition  
* **8.2.5.** Each Marketplace listing will display information about the seller  
  * **8.2.5.1.** The seller’s profile picture will be displayed  
  * **8.2.5.2.** The seller’s name will be displayed  
* **8.2.6.** Each Marketplace listing will display when the listing was posted  
* **8.2.7.** If a listing does not contain an uploaded image, a default Marketplace image will be displayed  
* **8.2.8.** The information displayed on a Marketplace listing will correspond to the item being sold  
  * **8.2.8.1.** The displayed image will belong to the selected listing  
  * **8.2.8.2.** The displayed title will belong to the selected listing  
  * **8.2.8.3.** The displayed price will belong to the selected listing  
  * **8.2.8.4.** The displayed condition will belong to the selected listing  
  * **8.2.8.5.** The displayed seller information will belong to the user who created the listing  
* **8.2.9.** Listings that are no longer available will display their current status  
  * **8.2.9.1.** Listings marked as sold will display a Sold indicator  
  * **8.2.9.2.** Listings marked as removed will not be displayed in the normal Marketplace browsing page

### **8.3 Open Individual Listing**

* **8.3.1.** The user will be able to select a Marketplace listing  
  * **8.3.1.1.** Selecting a listing will open the individual listing page for that item  
* **8.3.2.** The individual listing page will display the item title  
* **8.3.3.** The individual listing page will display the asking price  
* **8.3.4.** The individual listing page will display the item condition  
* **8.3.5.** The individual listing page will display the item category  
* **8.3.6.** The individual listing page will display the full item description  
* **8.3.7.** The individual listing page will display when the listing was posted  
* **8.3.8.** The individual listing page will display all images uploaded for the item  
  * **8.3.8.1.** One image will be displayed as the primary image  
  * **8.3.8.2.** Additional images will be displayed as smaller preview images  
  * **8.3.8.3.** Selecting a preview image will display that image as the primary image  
* **8.3.9.** If no image was uploaded for the listing, a default Marketplace image will be displayed  
* **8.3.10.** The individual listing page will display the current listing status  
  * **8.3.10.1.** Available listings will be identified as available  
  * **8.3.10.2.** Sold listings will be identified as sold  
* **8.3.11.** The individual listing page will display information about the seller  
  * **8.3.11.1.** Seller information will follow the requirements defined in Section 8.4  
* **8.3.12.** The information displayed on the individual listing page will correspond to the selected listing  
* **8.3.13.** There will be a button that allows the user to return to the Marketplace page

### **8.4 View seller information**

* **8.4.1.** The individual Marketplace listing will display information about the seller  
  * **8.4.1.1.** The seller’s profile picture will be displayed  
  * **8.4.1.2.** The seller’s name will be displayed  
* **8.4.2.** The seller information displayed will belong to the user who created the listing  
* **8.4.3.** The seller’s name and profile picture will be selectable  
  * **8.4.3.1.** Selecting the seller’s name will open the seller’s profile  
  * **8.4.3.2.** Selecting the seller’s profile picture will open the seller’s profile  
* **8.4.4.** The seller’s profile will display according to the profile requirements defined in Section 2  
* **8.4.5.** There will be a Message Seller button  
  * **8.4.5.1.** The Message Seller button will function according to the private messaging requirements defined in Section 10

## **9\. Create and Manage Marketplace Listings**

* **9.1.1.** Only CampusHub users that are authenticated can make marketplace listings.  
* **9.1.2.** A Create Listing option will be included on the Marketplace page.  
* **9.1.3.** Selecting the Create Listing option will open up a form where information can be entered about the item they want to sell.  
* **9.1.4.** The form will include a field for the item title.  
* **9.1.5.** The form will require the item title.  
* **9.1.6.** The title will require at least 1 character.  
* **9.1.7.** The title will have a limit of 100 characters.  
* **9.1.8.** The title field cannot be left empty.  
* **9.1.9.** The form will have an item description field.  
* **9.1.10.** The form will require the item description.  
* **9.1.11.** The item description will require at least 1 character.  
* **9.1.12.** The item description will have a limit of 1000 characters.  
* **9.1.13.** The item description cannot be left empty.  
* **9.1.14.** The form will include a field for asking price.  
* **9.1.15.** The form will require an asking price.  
* **9.1.16.** The asking price field must be entered as a number.  
* **9.1.17.** The asking price field number cannot be a negative number.  
* **9.1.18.** The asking price field number can include up to two decimal places.  
* **9.1.19.** If the asking price field is entered incorrectly or missing, the listing will not be made.  
* **9.1.20.** An option of uploading an image of the item will be allowed.  
* **9.1.21.** The option of uploading an image will not be mandatory.  
* **9.1.22.** A marketplace listing can only have one image.  
* **9.1.23.** Formats of images accepted will be .jpg, .jpeg, and .png.  
* **9.1.24.** Images that are 5 MB or larger will not be accepted  
* **9.1.25.** If the user attempts to select an image that is an unsupported type, the system will notify the user.  
* **9.1.26.** If the user attempts to select an image larger than 5 MB, the system will notify the user.  
* **9.1.27.** Images that do not meet the requirements, will not be applied to the listing.  
* **9.1.28.** The form will include a create listing button.  
* **9.1.29.** Selecting the create listing button will then check the information given by the user.  
* **9.1.30.** If a required field is missing or incorrectly entered, the listing will not be made.  
* **9.1.31.** The system will notify the user of which required field has an issue.  
* **9.1.32.** If all required fields are accepted, the listing will go through.  
* **9.1.33.** The listing will be connected to the user's account.  
* **9.1.34.** After the listing is successfully created, other CampusHub users will be able to view the listing.  
* **9.1.35.** After the listing is created, the user will be taken back to the Marketplace or taken to a new listing.  
* **9.1.36.** The listing form will have a cancel button.  
* **9.1.37.** Selecting the cancel button will close the listing form.  
* **9.1.38.** Information that has not been saved will be deleted.  
* **9.1.39.** Canceling the form will not create a new listing.

### **9.2 Marketplace Listing Ownership and Permissions**

* **9.2.1.** All Listings will be linked to the account that created it.  
* **9.2.2.** The owner and seller of the item will automatically be considered the user who created the listing.  
* **9.2.3.** Only the owner of a listing can edit it.  
* **9.2.4.** Only the owner of a listing can delete it.  
* **9.2.5.** Only the owner of a listing can mark it as sold.  
* **9.2.6.** Users that are not the owner of the listing will not be able to delete, edit, or change the status of the listing in any way.  
* **9.2.7.** Other users will still be able to view and contact the seller through CampusHub private messaging.

### **9.3 Edit Marketplace Listing**

* **9.3.1.** Owners of a listing will have the option to edit their listing.  
* **9.3.2.** Selecting the edit option will open the listing edit page.  
* **9.3.3.** The editing page will show all the current information about the listing.  
* **9.3.4.** The item title will be displayed.  
* **9.3.5.** The item description will be displayed.  
* **9.3.6.** The item asking price will be displayed.  
* **9.3.7.** The item images will be displayed.  
* **9.3.8.** The owner will be able to change the item title.  
* **9.3.9.** The owner will be able to change the item description.  
* **9.3.10.** The owner will be able to change the item's asking price.  
* **9.3.11.** The owner will be able to change or delete the item images.  
* **9.3.12.** All changed information will still need to follow the requirement of section 9.1.  
* **9.3.13.** The editing page will have a save changes button.  
* **9.3.14.** Selecting the save changes button will update the listing’s information.  
* **9.3.15.** If any changed information is invalid, the changes will not be saved.  
* **9.3.16.** The system will notify the user to which field is invalid.  
* **9.3.17.** If all changes are valid, the updated information will be saved.  
* **9.3.18.** The listing will then display the updated information.  
* **9.3.19.** The editing page will have a cancel button.  
* **9.3.20.** Selecting the cancel button will leave the editing page with no new changes.  
* **9.3.21.** The listing will show the information that was shown previously.  
* **9.3.22.** If the system is unable to save the changes, the previous listing will stay the same.  
* **9.3.23.** If saving does not go through, the user will be shown a message explaining why it failed.

### **9.4 Delete Marketplace Listing**

* **9.4.1.** Owners of listings will have a delete option for the listings they created.  
* **9.4.2.** Selecting the delete option will give a confirmation message prior to the listing being removed.  
* **9.4.3.** The confirmation message will give the owner of the listing the option to continue with deletion.  
* **9.4.4.** Confirming the deletion will completely remove the listing from the marketplace.  
* **9.4.5.** After deletion the listing will no longer appear in the marketplace.  
* **9.4.6.** The confirmation message will also give the owner the option to cancel.  
* **9.4.7.** Selecting the cancel option will close the confirmation message.  
* **9.4.8.** The listing will remain unchanged.  
* **9.4.9.** Users cannot delete marketplace listings if they are not the owner of that listing.  
* **9.4.10.** If deletion fails, a message will appear notifying the user as to why the action failed.

### **9.5 Mark Marketplace Listing as Sold**

* **9.5.1.** The owner of the listing will have an option to mark the listing as sold.  
* **9.5.2.** A listing as sold will be displayed with a sold status.  
* **9.5.3.** The sold status will be saved with the listing.  
* **9.5.4.** A sold listing will not be treated the same as an active marketplace listing.  
* **9.5.5.** The owner of the listing is the only user allowed to change the sold status.  
* **9.5.6.** Marking the listing as sold does not indicate that the payment was made through the marketplace.  
* **9.5.7.** CampusHub will not by any means process payments between buyers and sellers.  
* **9.5.8.** Buyers and sellers will decide on their own how they want to complete that transaction outside of CampusHub.

### **9.6 Marketplace Listing Error Handling**

* **9.6.1.** Invalid marketplace listing will not be shown in the marketplace.  
* **9.6.2.** When invalid marketplace listing information is entered, the system will show the field that requires correction.  
* **9.6.3.** If the system cannot create the marketplace listing, the system will display an error message.  
* **9.6.4.** If the system cannot get a marketplace listing, the system will display an error message.  
* **9.6.5.** If a marketplace listing update fails, the previous information will remain unchanged.  
* **9.6.6.** If a marketplace image upload fails, the system will display an error message.

## **10\. Private Messaging**

* **10.1.1.** Only CampusHub users will be able to use the private messaging feature.  
* **10.1.2.** The menu will include a messaging option.  
* **10.1.3.** Selecting messages will open the CampusHub users’ messaging page.  
* **10.1.4.** Users who are signed out will not be able to view or send messages.  
* **10.1.5.** Messages will be saved so users can view them after signing in or out.

### **10.2 Conversation List**

* **10.2.1.** The messages page will show the user’s previous conversations  
* **10.2.2.** Each conversation will show which CampusHub user the conversation was with  
* **10.2.3.** The other user’s name will be displayed  
* **10.2.4.** The other user’s profile picture will be displayed if that users’ choose to have one  
* **10.2.5.** Each conversation will show the most recent message  
* **10.2.6.** The time of the most recent message will be displayed  
* **10.2.7.** Selecting a conversation will open the messages between the two users  
* **10.2.8.** A conversation will only be visible to the two users in it

### **10.3 Start a Conversation from a Student Profile**

* **10.3.1.** Users do not need other user’s phone number or email to contact them through CampusHub  
* **10.3.2.** Selecting a message from another student's profile will open a private messaging chat with that user.  
* **10.3.3.** If a conversation between two users previously exists, selecting the message will open the previous conversation.  
* **10.3.4.** If no previous conversation exists, selecting a message will allow the user to begin a new conversation.  
* **10.3.5.** The user will not need to provide the other student's phone number or APSU email to begin the private messaging.

### **10.4 Start a Conversation from a Marketplace Listing**

* **10.4.1.** Marketplace Listings will include an option for users to contact the seller  
* **10.4.2.** CampusHub’s private messaging will be used when contacting the seller  
* **10.4.3.** Selecting the contact option will create a conversation with the owner of the listing  
* **10.4.4.** If there is a prior conversation between the user and the owner that existing conversation will open up  
* **10.4.5.** If they do not have a prior conversation a new one will be created  
* **10.4.6.** The owner and the user can use the conversation to discuss the listing and decide how they want to create the sale

### **10.5 Send a Private Message**

* **10.5.1.** An opened conversation will include a text box for the user to type in  
* **10.5.2.** The field will accept text  
* **10.5.3.** A message will require at least one non-space character  
* **10.5.4.** Empty messages cannot be sent  
* **10.5.5.** Up to 1000 characters can be contained in a message  
* **10.5.6.** The messaging will include a send button  
* **10.5.7.** Selecting the send button will attempt to send the message  
* **10.5.8.** The system will first check whether the message meets the requirements  
* **10.5.9.** If the message doesn’t meet the requirements, it will not be sent  
* **10.5.10.** If the message does meet the requirements, it will be sent and saved as a part of the conversation  
* **10.5.11.** Once the message is sent successfully, it will appear in the conversation  
* **10.5.12.** The other user will be able to view the message from the same conversation  
* **10.5.13.** The text box will be cleared if the message is sent successfully

### **10.6 Receive and View Messages**

* **10.6.1.** Users can view messages sent to them.  
* **10.6.2.** Messages will display which user sent them.  
* **10.6.3.** Messages will be displayed in chronological order.  
* **10.6.4.** Timestamps will be provided for each message.  
* **10.6.5.** After signing out, saved messages will remain available.

### **10.7 Messaging Privacy and Permissions**

* **10.7.1.** Only the users will be able to view private conversations.  
* **10.7.2.** Users cannot view or access conversations they are not a part of.  
* **10.7.3.** While signed out, users cannot send messages.  
* **10.7.4.** In private messaging, APSU email will not be displayed.

### **10.8 Messaging Error Handling**

* **10.8.1.** Failed messages will not be treated as sent.  
* **10.8.2.** An Error message will be displayed if the message cannot be sent.  
* **10.8.3.** The system will display an error message if the conversation cannot be loaded.  
* **10.8.4.** Saved messages will not be deleted if messages become unavailable.

### **11.1 Sign Out and Session Behavior**

* **11.1.1.** CampusHub users will have a sign out button.  
* **11.1.2.** Selecting the sign out button will end the user's session.  
* **11.1.3.** After signing out the user will be returned to the account access page.  
* **11.1.4.** Users' saved information will not be deleted if signed out.  
* **11.1.5.** Users must sign in again to access protected features.

### **11.2 Protected Page Access**

* **11.2.1.** Users who are signed-out cannot access protected CampusHub pages.  
* **11.2.2.** These protected pages include profiles, the marketplace, private messaging, and activity features.  
* **11.2.3.** Signed-out users attempting to access a protected page will be returned to the account access page.  
* **11.2.4.** Protected features will be able to be accessed again after the users sign in.

### **11.3 Session Behavior**

* **11.3.1.** The user's session will remain active while moving between CampusHub pages.  
* **11.3.2.** Users will not have to sign in again every time they change pages.  
* **11.3.3.** If the session becomes invalid the user will be signed out.  
* **11.3.4.** The user will need to be signed in before accessing any protected features.

### **11.4 Session Security**

* **11.4.1.** CampusHub will use the user's authenticated session to determine whether they are signed in.  
* **11.4.2.** Only signed-in users will have protected actions.  
* **11.4.3.** Users will only be able to manage listings and profiles connected to their own account.  
* **11.4.4.** Private conversations will only be available to the users involved.

