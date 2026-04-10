//Werkt nog nie, js kut.

function print(message){
    console.log(message);
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
    fetch("accounts.json")
    .then(response => response.json())
    .then(accounts => {
        if (username in accounts) {
            alert(`Username ${username} is already taken.`);
            return;
        }
        accounts[username] = {
        "password": password,
        "email": email
        };
        fetch("/accounts.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(accounts)
        });
    });
    //window.location.href = "Sign-up.html";
}