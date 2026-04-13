const API_URL = "https://dataset-platform-cnjm.onrender.com";

loginForm.onsubmit = async e => {
  e.preventDefault();

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();

  // 🔥 SAVE BOTH
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  location.href = "index.html";
};