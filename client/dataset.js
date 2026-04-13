const API_URL = "https://dataset-platform-cnjm.onrender.com";

// get id from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetchDataset();

async function fetchDataset() {
  const res = await fetch(`${API_URL}/datasets/${id}`);
  const data = await res.json();

  document.getElementById("title").innerText = data.title;
  document.getElementById("description").innerText = data.description;
  document.getElementById("tags").innerText = "Tags: " + data.tags.join(", ");
  document.getElementById("stats").innerText = `Views: ${data.views} | Downloads: ${data.downloads}`;
  document.getElementById("downloadBtn").href = `${API_URL}/download/${id}`;
}