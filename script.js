const API_KEY = '46096987-e5b0c2a6bdb3c90f6d1aa0cb8'; // Replace with your Pixabay API key
const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('search');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalAuthor = document.getElementById('modalAuthor');
const downloadButton = document.getElementById('downloadButton');
let currentImageUrl = '';
let currentImageTitle = '';

searchInput.addEventListener('input', fetchImages);

function fetchImages() {
    const query = searchInput.value || 'nature'; // Default query
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&per_page=20`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayImages(data.hits);
        })
        .catch(error => {
            gallery.innerHTML = `<p>Failed to fetch images: ${error.message}</p>`;
        });
}

function displayImages(images) {
    gallery.innerHTML = '';
    images.forEach(image => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        const imgElement = document.createElement('img');
        imgElement.src = image.webformatURL;
        imgElement.alt = image.tags;
        imgElement.onclick = () => openModal(image.largeImageURL, image.tags, image.user); // Pass author
        
        const infoElement = document.createElement('div');
        infoElement.className = 'post-info';
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = image.tags; // Display tags as title
        const authorElement = document.createElement('p');
        authorElement.textContent = `by ${image.user}`; // Author
        const tagsElement = document.createElement('p');
        tagsElement.className = 'tags';
        tagsElement.textContent = image.tags; // Tags

        infoElement.appendChild(titleElement);
        infoElement.appendChild(authorElement);
        infoElement.appendChild(tagsElement);
        postElement.appendChild(imgElement);
        postElement.appendChild(infoElement);
        gallery.appendChild(postElement);
    });
}

function openModal(imageUrl, title, author) {
    modal.style.display = "flex"; 
    modalImage.src = imageUrl;
    modalTitle.innerHTML = title; 
    modalAuthor.innerHTML = `by ${author}`; 
    currentImageUrl = imageUrl;
    currentImageTitle = title;
}

function closeModal() {
    modal.style.display = "none";
}

downloadButton.onclick = function() {
    const link = document.createElement('a');
    link.href = currentImageUrl;
    link.download = currentImageTitle;
    link.click();
};

function toggleFavorite() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.includes(currentImageUrl)) {
        favorites.splice(favorites.indexOf(currentImageUrl), 1);
        alert("Removed from favorites");
    } else {
        favorites.push(currentImageUrl);
        alert("Added to favorites");
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Initial fetch
fetchImages();
function shareImage() {
    if (navigator.share) {
        navigator.share({
            title: modalTitle.innerText,
            text: `Check out this image by ${modalAuthor.innerText}`,
            url: currentImageUrl
        })
        .then(() => console.log('Image shared successfully'))
        .catch((error) => console.error('Error sharing the image:', error));
    } else {
        alert('Sharing not supported on this browser.');
    }
}
