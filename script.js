// Local fallback quotes array
const fallbackQuotes = [
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "You are braver than you believe!", author: "A.A. Milne" },
  { text: "The best way out is always through.", author: "Robert Frost" },
  { text: "If you’re going through hell, keep going.", author: "Winston Churchill" },
  { text: "Why fit in when you were born to stand out!", author: "Dr. Seuss" },
  { text: "Do what you can, with what you have, where you are.", author: "T. Roosevelt" },
  { text: "Mistakes are proof you are trying.", author: "Unknown" }
];

// Elements
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuote');
const quoteCard = document.getElementById('quoteCard');
const toggleTheme = document.getElementById('toggleTheme');
const themeIcon = document.getElementById('themeIcon');
const favoritesToggle = document.getElementById('favoritesToggle');
const favoritesTab = document.getElementById('favoritesTab');
const closeFavorites = document.getElementById('closeFavorites');
const favoritesList = document.getElementById('favoritesList');

// Create favorite button and append if missing
let favoriteBtn = document.querySelector('.favorite-btn');
if (!favoriteBtn) {
  favoriteBtn = document.createElement('button');
  favoriteBtn.className = 'favorite-btn';
  favoriteBtn.title = "Favorite this quote";
  favoriteBtn.innerHTML = '♡'; // outline heart icon default
  quoteCard.appendChild(favoriteBtn);
}

// Favorite quotes state, load from localStorage
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// Current displayed quote reference
let currentQuote = null;

// Check if quote is favorited
function isFavorited(quote) {
  return favorites.some(fav => fav.text === quote.text && fav.author === quote.author);
}

// Update favorite button state
function updateFavoriteBtn(quote) {
  if (!quote) return;
  if (isFavorited(quote)) {
    favoriteBtn.innerHTML = '❤️';
    favoriteBtn.classList.add('favorited');
  } else {
    favoriteBtn.innerHTML = '♡';
    favoriteBtn.classList.remove('favorited');
  }
}

// Save favorites and refresh list
function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavoritesList();
}

// Toggle favorite on favorite button click
favoriteBtn.addEventListener('click', () => {
  if (!currentQuote) return;
  const index = favorites.findIndex(fav => fav.text === currentQuote.text && fav.author === currentQuote.author);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(currentQuote);
  }
  saveFavorites();
  updateFavoriteBtn(currentQuote);
});

// Render favorites list in sidebar
function renderFavoritesList() {
  favoritesList.innerHTML = '';
  if (favorites.length === 0) {
    favoritesList.innerHTML = '<p>No favorites added yet.</p>';
    return;
  }
  favorites.forEach((quote, index) => {
    const quoteEl = document.createElement('div');
    quoteEl.classList.add('favorite-item');
    quoteEl.tabIndex = 0; // Make it keyboard focusable
    quoteEl.innerHTML = `
      <p>${quote.text}</p>
      <span class="author">— ${quote.author}</span>
      <button class="remove-favorite" aria-label="Remove from favorites" data-index="${index}">Remove</button>
    `;
    // Click quote text shows the quote in main card and closes sidebar
    quoteEl.querySelector('p').addEventListener('click', () => {
      showQuote(quote);
      favoritesTab.classList.add('hidden');
    });
    // Remove favorite button handler
    quoteEl.querySelector('.remove-favorite').addEventListener('click', e => {
      e.stopPropagation();
      removeFavorite(index);
    });

    favoritesList.appendChild(quoteEl);
  });
}

// Remove a favorite by index
function removeFavorite(index) {
  favorites.splice(index, 1);
  saveFavorites();
  updateFavoriteBtn();
}

// Show quote in main card and update favorite button
function showQuote(quote) {
  currentQuote = quote;
  quoteText.textContent = quote.text;
  quoteAuthor.textContent = '— ' + quote.author;
  updateFavoriteBtn(quote);
  quoteCard.classList.remove('animated');
  setTimeout(() => quoteCard.classList.add('animated'), 60);
}

// Fetch random quote from API or fallback
async function fetchQuote() {
  try {
    const response = await fetch('https://api.quotable.io/random');
    if (!response.ok) throw new Error('API unavailable');
    const data = await response.json();
    return { text: data.content, author: data.author || 'Unknown' };
  } catch {
    console.warn('API fetch failed; using fallback');
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }
}

// New quote button handler
newQuoteBtn.addEventListener('click', async () => {
  currentQuote = await fetchQuote();
  showQuote(currentQuote);
});

// Theme toggle button handler
toggleTheme.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  if (isDark) {
    document.body.style.backgroundImage = "url('https://wallpapers-clan.com/wp-content/uploads/2024/03/starfall-night-sky-mountains-aesthetic-gif-preview-desktop-wallpaper.gif')";
    themeIcon.textContent = '☀️';
  } else {
    document.body.style.backgroundImage = "url('https://png.pngtree.com/thumb_back/fh260/background/20240104/pngtree-scribbly-textured-vector-illustration-aesthetic-nature-landscape-of-abstract-green-fields-image_13891294.png')";
    themeIcon.textContent = '🌙';
  }
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center center';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load theme on page load
(function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    document.body.style.backgroundImage = "url('https://wallpapers-clan.com/wp-content/uploads/2024/03/starfall-night-sky-mountains-aesthetic-gif-preview-desktop-wallpaper.gif')";
    themeIcon.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    document.body.style.backgroundImage = "url('https://png.pngtree.com/thumb_back/fh260/background/20240104/pngtree-scribbly-textured-vector-illustration-aesthetic-nature-landscape-of-abstract-green-fields-image_13891294.png')";
    themeIcon.textContent = '🌙';
  }
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center center';
})();

// Favorites toggle button handlers to show/hide favorites tab
favoritesToggle.addEventListener('click', () => {
  favoritesTab.classList.toggle('hidden');
  if (!favoritesTab.classList.contains('hidden')) {
    renderFavoritesList();
  }
});

// Close favorites tab
closeFavorites.addEventListener('click', () => {
  favoritesTab.classList.add('hidden');
});

// Initialize first quote
(async function init() {
  currentQuote = await fetchQuote();
  showQuote(currentQuote);
})();
