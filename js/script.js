document.addEventListener('DOMContentLoaded', function () {
    const password = document.getElementById('password');
    const passwordMessage = document.querySelector('.password-message');
    const confirmPassword = document.getElementById('password-re-enter');
    const confirmPasswordMessage = document.querySelector('.password-confirm-message');
    const phoneNumber = document.getElementById('phone-number');

    function restrictInputToDigits(event) {
        const key = event.key;
        // Allow only digits (0-9), backspace, and delete
        if (!/^\d$/.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
            event.preventDefault();
        }
    }
    phoneNumber.addEventListener('keydown', restrictInputToDigits);

    // make sure password matches the pattern and is longer than 7 characters
    password.addEventListener('input', function () {
        // Check if password meets the pattern
        if (password.validity.patternMismatch) {
            password.setCustomValidity('Missing a number, uppercase letter, or special character.');
            passwordMessage.textContent = 'Missing a number, uppercase letter, or special character.';
        } else if (password.value.length > 0 && password.value.length < 7) {  // Length validation
            password.setCustomValidity('Password must be at least 7 characters long.');
            passwordMessage.textContent = 'Password must be at least 7 characters long.';
        } else {
            // Clear any custom messages
            password.setCustomValidity('');
            passwordMessage.textContent = ''; // Clear the error message
        }
    });

    // Make sure the password matches 
    confirmPassword.addEventListener('input', function() {
        if (password.value !== confirmPassword.value && confirmPassword.value.length > 0) {
            confirmPassword.setCustomValidity('Passwords do not match.');
            confirmPasswordMessage.textContent = 'Passwords do not match.';
        } else {
            confirmPassword.setCustomValidity('');
            confirmPasswordMessage.textContent = ''; // Clear the message when passwords match
        }
    })
    
});
