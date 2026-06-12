const BACKEND_URL = "https://dvdord.onrender.com";

async function checkUserSession() {
  const usernameDisplay = document.getElementById("usernameDisplay");
  
  try {
    const response = await fetch(`${BACKEND_URL}/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    if (response.status === 401) {
      window.location.href = "/login";
      return;
    }

    const exactData = await response.json();
    usernameDisplay.textContent = exactData.username;
  } catch (error) {
    window.location.href = "/login";
  }
}

document.getElementById("logoutButton").addEventListener("click", async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    if (response.ok) {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error(error);
  }
});

checkUserSession();