// change section machanique
function showForm(form) {
    const forms = {
    login: document.getElementById("login-form"),
    signup: document.getElementById("signup-form"),
    forgot: document.getElementById("forgot-form"),
    code: document.getElementById("code-form"),
    reset: document.getElementById("reset-form")
    };

    const title = document.getElementById("form-title");

    for (let key in forms) {
    forms[key].classList.remove("active");
    }

    forms[form].classList.add("active");

    switch(form) {
    case 'login': title.innerText = "Login"; break;
    case 'signup': title.innerText = "Sign Up"; break;
    case 'forgot': title.innerText = "Forgot Password"; break;
    case 'code': title.innerText = "Verify Code"; break;
    case 'reset': title.innerText = "Reset Password"; break;
    }
}

// handle login event 
function handleLogin(event) {
    event.preventDefault();
    // Here you should validate login credentials
    // For demo, assume success:
    localStorage.setItem('isLoggedIn', 'true');
    // Redirect back to home or navbar page
    window.location.href = 'home.html'; // adjust to your main page
}