
// Get rem function
const getRem = (rem) => {
    if (!rem) { return parseFloat(getComputedStyle(document.documentElement).fontSize) };
    if (isNaN(rem)) { throw new Error('rem is not defined'); };
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

// Load image './assets/svg/eye-solid.svg'
const openedEyeIcon = document.createElement('img');
openedEyeIcon.src = './assets/svg/eye-solid.svg';
const closedEyeIcon = document.createElement('img');
closedEyeIcon.src = './assets/svg/eye-slash-solid.svg';

// Center the registerCard
const registerCard = document.getElementById('registerCard');
const centerRegisterCard = () => {
    const height = registerCard.offsetHeight;
    const width = registerCard.offsetWidth;

    const winH = window.innerHeight;
    const winW = window.innerWidth;

    registerCard.style.marginTop = `${(winH - height) / 2}px`;
    registerCard.style.marginLeft = `${(winW - width) / 2}px`;
};

// Reposition the Eye Icon
const passwordContainer = document.getElementById('passwordContainer');
const eyeIcon = document.getElementById('eyeIcon');
const passwordInput = document.querySelector('input[name="password"]');
const moveEyeIcon = () => {
    const containerHeight = passwordContainer.offsetHeight;
    eyeIcon.style.top = `${(containerHeight/2) - (eyeIcon.offsetHeight/2)}px`;
    eyeIcon.style.right = `${eyeIcon.offsetWidth/2}px`;

    // Update the pasword input padding
    passwordInput.style.paddingRight = `${eyeIcon.offsetWidth + eyeIcon.offsetWidth/2}px`;
};

// Hiding and Showing the password to the screen
eyeIcon.onclick = () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.src = openedEyeIcon.src;
    } else {
        passwordInput.type = 'password';
        eyeIcon.src = closedEyeIcon.src;
    };
    passwordInput.focus();
    moveEyeIcon();
};



// Call all move and resize functions
centerRegisterCard();
moveEyeIcon();
setTimeout(() => {
    centerRegisterCard();
    moveEyeIcon();
}, 0);
// Listen for window resize
window.onresize = () => {
    centerRegisterCard();
    moveEyeIcon();
};

// Remove window.prompt
delete window.prompt;

const signup = document.getElementById('signup');
const signupForm = document.getElementById('signupForm');
const prompt = document.getElementById('prompt');

signup.onclick = (event) => {
    event.preventDefault();

    // Disable the signup button
    signup.disabled = true;

    // Get all the values from the form
    const username = document.getElementById('username').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Check if all the fields are filled
    if (!username || !firstName || !lastName || !email || !password) {
        prompt.innerHTML = 'Please fill in all the fields';
        prompt.style.opacity = 1;
        return signup.disabled = false;;
    };
    // Check character lengths of the fields
    if (username.length > 20 || firstName.length > 20 || lastName.length > 20 || email.length > 50 || password.length > 20) {
        prompt.innerHTML = 'Please make sure all the fields are less than 20 characters';
        prompt.style.opacity = 1;
        return signup.disabled = false;;
    };
    if (username.length < 6 || firstName.length < 3 || lastName.length < 4 || email.length < 6 || password.length < 6) {
        prompt.innerHTML = 'Please make sure all the fields have the proper length\n(Username: 6-20 characters\n First Name: 3-20 characters\n Last Name: 4-20 characters\n Email: 6-50 characters\n Password: 6-20 characters)';
        prompt.style.opacity = 1;
        return signup.disabled = false;;
    };
    // Check if the email is valid
    if (!/^[^@]+@[^@.]+\.[a-z]+$/i.test(email)) {
        prompt.innerHTML = 'Please make sure the email is valid';
        prompt.style.opacity = 1;
        return signup.disabled = false;;
    };
    // Check if the password is valid
    // It should be at least 8 characters long
    // It should contain at least one number
    // It should contain at least one uppercase letter
    // It should contain at least one lowercase letter
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/.test(password)) {
        prompt.innerHTML = 'The password should be at least 6 characters long and contain at least one number, one uppercase letter and one lowercase letter';
        prompt.style.opacity = 1;
        return signup.disabled = false;;
    };

    // Send the data to the server
    fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        })
    }).then(res => res.json())
    .then(data => {
        if (data.error) {
            prompt.innerHTML = data.error;
            prompt.style.opacity = 1;
        } else {
            if (data.code === '400') {
                prompt.innerHTML = data.message;
                prompt.style.opacity = 1;

                // Re-enable the signup button
                signup.disabled = false;
            } else if (data.code === '200') {
                prompt.innerHTML = 'You have successfully registered';
                prompt.style.opacity = 1;
                // Save the userID and token to local storage
                const user = data.user;
                localStorage.setItem('user', JSON.stringify(user));
                console.log(user);
                // Redirect to the home page
                window.location.href = '/';
                signupForm.reset();
            };
        };
    }).catch((err) => {
        console.log(err);
    });
};