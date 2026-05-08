function sendRequest(){
    const response = await fetch('window.location.href/api/contact', {method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
}