function CheckPassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength <= password.length && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
}

function CheckEmail(email) {
    const hasThingIDontKnowTheNameOf = /[@]/.test(email)
    const emailSplit = email.split("@")[-1]
    const hasDot = /[.]/.test(emailSplit)
    return hasThingIDontKnowTheNameOf && hasDot;
}

function submitForm() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;

    // Perform form validation (e.g., check if fields are not empty)
    if (username === "" || password === "" || email === "") {
        alert("Please fill in all fields.");
        return;
    }
    try{
        if (!CheckPassword(password)){
            alert("Password does not meet the requirements:\n- At least 8 characters\n- At least one uppercase character\n- At least one lowercase character\n- At least one special character\n- At least one digit")
            return;
        }
        if (!CheckEmail){
            alert("Please enter a valid email")
            return
        }
    }
    catch(error){
        alert("Error fetching accounts data: " + error);
        return;
    }
    
}