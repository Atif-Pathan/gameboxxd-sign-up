document.addEventListener('DOMContentLoaded', function () {
    const password = document.getElementById('password');
    const passwordMessage = document.querySelector('.password-message');
    const confirmPassword = document.getElementById('password-re-enter');
    const confirmPasswordMessage = document.querySelector('.password-confirm-message');
    const phoneNumber = document.getElementById('phone-number');
    const telMessage = document.querySelector('.tel-message');

    function restrictInputToDigits(event) {
        const key = event.key;
        // Allow only digits (0-9), backspace, and delete
        if (!/^\d$/.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
            event.preventDefault();
        }
    }

    function checkPhoneNumberValidity() {
        if (phoneNumber.value.length < 10 || phoneNumber.value.length > 15) {
            telMessage.textContent = 'Must be between 10-15 digits';
            telMessage.style.visibility = 'visible';
            phoneNumber.style.borderColor = 'red';
            phoneNumber.style.boxShadow = '0 0 5px rgba(255, 0, 0, 0.5)';
        } else {
            telMessage.textContent = '';
            telMessage.style.visibility = 'hidden';
            phoneNumber.style.borderColor = 'green';
            phoneNumber.style.boxShadow = '0 0 5px rgba(13, 144, 3, 0.5)';
        }
    }

    function checkPasswordLength() {
        if (password.value === '') {
            // If the password is empty, reset the message and styles
            passwordMessage.textContent = '';
            password.style.borderColor = '2px solid rgb(77, 77, 77)';
            password.style.boxShadow = 'none';
        } else if (password.validity.valid) { // Check if the password meets the pattern
            if (password.value.length < 7) { // Now check for the length
                passwordMessage.textContent = 'Password must be at least 7 characters long'; // Show message for short password
                passwordMessage.style.color = 'red';
                passwordMessage.style.visibility = 'visible';
                password.style.borderColor = 'red';
                password.style.boxShadow = '0 0 5px rgba(255, 0, 0, 0.5)';
            } else {
                passwordMessage.textContent = ''; // Clear message when valid
                passwordMessage.style.visibility = 'hidden';
                password.style.borderColor = 'green';
                password.style.boxShadow = '0 0 5px rgba(13, 144, 3, 0.5)';
            }
        } else {
            // If the pattern is not met, show an appropriate error message
            passwordMessage.textContent = '';
        }
    }

    // Function to check if passwords match
    function checkPasswordsMatch() {
        if ((password.value !== confirmPassword.value) && (confirmPassword.value !== "")) {
            // confirmPassword.setCustomValidity('Passwords do not match'); // Set custom validation message
            confirmPasswordMessage.textContent = 'Passwords do not match'; // Show message under the confirm password field
            confirmPasswordMessage.style.color = 'red'; // Optional: Change text color
            confirmPasswordMessage.style.visibility = 'visible';
            confirmPassword.style.borderColor = 'red';
            confirmPassword.style.boxShadow = '0 0 5px rgba(255, 0, 0, 0.5)';
        } else if (confirmPassword.value === "") {
            confirmPasswordMessage.textContent = ''; // Clear the message
            confirmPasswordMessage.style.visibility = 'hidden';
            confirmPassword.style.border = "2px solid rgb(77, 77, 77)";
            confirmPassword.style.boxShadow = "none";
        } else if (confirmPassword.validity.valid && confirmPassword.value.length >= 7) {
            // confirmPassword.setCustomValidity(''); // Clear custom validity if passwords match
            confirmPasswordMessage.textContent = ''; // Clear the message
            confirmPasswordMessage.style.visibility = 'hidden';
            confirmPassword.style.borderColor = 'green';
            confirmPassword.style.boxShadow = '0 0 5px rgba(13, 144, 3, 0.5)';
        } else {
            confirmPasswordMessage.textContent = ''; // No message
            confirmPasswordMessage.style.visibility = 'hidden';
            confirmPassword.style.borderColor = 'red'; // Show red border for invalid input
            confirmPassword.style.boxShadow = '0 0 5px rgba(255, 0, 0, 0.5)';
        }
    }

    // Attach event listeners to validate on input and keyup
    password.addEventListener('input', checkPasswordLength);
    password.addEventListener('input', checkPasswordsMatch);
    confirmPassword.addEventListener('input', checkPasswordsMatch);
    phoneNumber.addEventListener('keydown', restrictInputToDigits);
    phoneNumber.addEventListener('input', checkPhoneNumberValidity);
});
