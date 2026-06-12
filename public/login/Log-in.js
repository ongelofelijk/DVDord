async function submitForm() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Perform form validation (e.g., check if fields are not empty)
    if (username === "" || password === "" ) {
        alert("Please fill in all fields.");
        return;
    }
    try{
        const payload = {
            username: username,
            password: password,
        }
        const response = await fetch('/api/login', {method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        console.log('boom')
        if (!response.ok) {
            const responseText= await  response.text()
            throw new Error(`Server error: ${response.status}, with error: ${responseText}`);
        }

        console.log('suces')

    window.location.href = '/me';
    }
    catch(error){
        alert("Error fetching accounts data: " + error);
        return;
    }
    
}