const owner = "YOUR_USERNAME";
const repo = "YOUR_REPO";
const branch = "main";

async function getFolders() {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/photos`
  );
  return await res.json();
}

async function getImages(folder) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/photos/${folder}`
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
      document.getElementById("modalImg").src = src;
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
}

init();
