const API_URL = "https://dataset-platform-cnjm.onrender.com";

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const message = document.getElementById("message");

  try {
    // ================= REGISTER =================
    const registerRes = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const registerData = await registerRes.json();

    if (!registerRes.ok) {
      message.innerText = registerData.message;
      return;
    }

    // ================= LOGIN =================
    const loginRes = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const loginData = await loginRes.json();

    console.log("Login Response:", loginData); // 🔥 DEBUG

    if (!loginRes.ok) {
      message.innerText = loginData.message;
      return;
    }

    // ================= SAFETY CHECK =================
    if (!loginData.user || !loginData.token) {
      message.innerText = "Login failed ❌";
      return;
    }

    // ================= SAVE DATA =================
    localStorage.setItem("token", loginData.token);
    localStorage.setItem("user", JSON.stringify(loginData.user));

    // ================= REDIRECT =================
    window.location.href = "index.html";

  } catch (error) {
    console.error("Error:", error);
    message.innerText = "Something went wrong ❌";
  }
});