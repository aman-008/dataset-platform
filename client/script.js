const API_URL = "https://dataset-platform-cnjm.onrender.com";

// ================= INIT =================
window.onload = () => {
  fetchDatasets();
  checkAuth();
  updateNavbar();
  showProfile();
};

// ================= AUTH CHECK =================
function checkAuth() {
  const token = localStorage.getItem("token");
  const upload = document.querySelector(".upload-container");

  if (!token) {
    upload.innerHTML = "<p>Please login to upload datasets</p>";
  }
}

// ================= NAVBAR =================
function updateNavbar() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const nav = document.getElementById("navActions");

  if (token && user) {
    nav.innerHTML = `
      <span style="color:white; margin-right:10px;">👤 ${user.name}</span>
      <button onclick="logout()">Logout</button>
    `;
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  location.reload();
}

// ================= PROFILE =================
function showProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const profile = document.getElementById("profileSection");

  if (user) {
    profile.innerHTML = `
      <h3>Welcome, ${user.name} 👋</h3>
      <p>${user.email}</p>
    `;
  }
}

// ================= FETCH DATA =================
async function fetchDatasets() {
  const res = await fetch(`${API_URL}/datasets`);
  const data = await res.json();
  displayDatasets(data);
}

// ================= DISPLAY =================
function displayDatasets(data) {
  const container = document.getElementById("datasetList");
  container.innerHTML = "";

  data.forEach(d => {
    container.innerHTML += `
      <div class="dataset">
        <h3 onclick="openDataset('${d._id}')">${d.title}</h3>
        <p>${d.description}</p>
        <p>${d.tags.join(", ")}</p>
        <a href="${API_URL}/download/${d._id}">Download</a>
      </div>
    `;
  });
}

// ================= SEARCH =================
async function searchDatasets() {
  const q = document.getElementById("searchInput").value;
  const res = await fetch(`${API_URL}/search?query=${q}`);
  const data = await res.json();
  displayDatasets(data);
}

// ================= OPEN DETAIL =================
function openDataset(id) {
  window.location.href = `dataset.html?id=${id}`;
}

// ================= UPLOAD =================
document.getElementById("uploadForm").addEventListener("submit", async e => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Login required ❌");
    return;
  }

  const fd = new FormData();
  fd.append("title", title.value);
  fd.append("description", description.value);
  fd.append("tags", tags.value);
  fd.append("file", file.files[0]);

  await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd
  });

  fetchDatasets();
});