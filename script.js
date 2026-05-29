const owner = "masunovandrey";
const repo = "grandma-birthday";
const branch = "main";

let currentGallery = [];
let currentIndex = 0;

const videos = [
  {
    title: "Main Celebration Video",
    url: "https://www.youtube.com/watch?v=CK8mF1otExU"
  }
];

async function getFolders() {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents`
  );
  return await res.json();
}

async function getImages(folder) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`
  );
  const files = await res.json();

  return files
    .filter(f => f.name.match(/\.(jpg|jpeg|png|webp)$/i))
    .map(f => f.download_url);
}

function createGallery(title, images) {
  const section = document.createElement("section");

  const h2 = document.createElement("h2");
  h2.textContent = title;

  const carousel = document.createElement("div");
  carousel.className = "carousel";

  images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;

    img.onclick = () => {

      currentGallery = images;
      currentIndex = images.indexOf(src);
    
      showImage();
    
      document.getElementById("modal").classList.add("active");
    };

    carousel.appendChild(img);
  });

  section.appendChild(h2);
  section.appendChild(carousel);

  document.getElementById("app").appendChild(section);
}

async function init() {
  const folders = await getFolders();

  for (const folder of folders) {
    if (folder.type !== "dir") continue;

    const images = await getImages(folder.name);

    if (images.length > 0) {
      createGallery(folder.name, images);
    }
  }

  // render videos AFTER photos
  for (const video of videos) {
    createVideo(video.title, video.url);
  }
}

function createVideo(title, url) {

  const section = document.createElement("section");

  const h2 = document.createElement("h2");
  h2.textContent = title;

  const iframe = document.createElement("iframe");

  const videoId = new URL(url).searchParams.get("v");

  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.style.width = "100%";
  iframe.style.height = "400px";
  iframe.style.border = "none";

  iframe.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  );

  iframe.setAttribute("allowfullscreen", "");

  section.appendChild(h2);
  section.appendChild(iframe);

  document.getElementById("app").appendChild(section);
}

function showImage() {
  document.getElementById("modalImg").src =
    currentGallery[currentIndex];
}

function nextImage() {

  currentIndex++;

  if (currentIndex >= currentGallery.length) {
    currentIndex = 0;
  }

  showImage();
}

function prevImage() {

  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = currentGallery.length - 1;
  }

  showImage();
}

function closeModal() {
  document.getElementById("modal")
    .classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {

  document
    .getElementById("closeBtn")
    .addEventListener("click", closeModal);

  document
    .getElementById("nextBtn")
    .addEventListener("click", nextImage);

  document
    .getElementById("prevBtn")
    .addEventListener("click", prevImage);

  document
    .getElementById("modal")
    .addEventListener("click", e => {

    const modal = document.getElementById("modal");
    
    if (e.target === modal) {
      closeModal();
    }

    });

});

document.addEventListener("keydown", e => {

  const modal =
    document.getElementById("modal");

  if (!modal.classList.contains("active")) {
    return;
  }

  if (e.key === "ArrowRight") {
    nextImage();
  }

  if (e.key === "ArrowLeft") {
    prevImage();
  }

  if (e.key === "Escape") {
    closeModal();
  }

});

init();
