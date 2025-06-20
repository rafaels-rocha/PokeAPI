const favList = document.getElementById('fav-list');
const backBtn = document.getElementById('back-btn');

const apiBase = 'https://pokeapi.co/api/v2/pokemon';

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

backBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

async function fetchPokemonDetails(url) {
  const res = await fetch(url);
  return res.json();
}

async function fetchPokemonDetailsById(id) {
  const res = await fetch(`${apiBase}/${id}`);
  return res.json();
}

async function renderFavorites() {
  favList.innerHTML = '';

  if (favorites.length === 0) {
    favList.innerHTML = '<p class="col-span-full text-center text-gray-600">Nenhum Pokémon favoritado ainda.</p>';
    return;
  }

  for (const id of favorites) {
    try {
      const pokemon = await fetchPokemonDetailsById(id);

      const li = document.createElement('li');
      li.className = "bg-white rounded shadow p-4 flex flex-col items-center";

      li.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="w-24 h-24 mb-2" />
        <span class="font-semibold capitalize">${pokemon.name}</span>
        <button class="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Remover</button>
      `;

      li.querySelector('button').addEventListener('click', () => {
        removeFavorite(id);
      });

      favList.appendChild(li);

    } catch {
      
    }
  }
}

function removeFavorite(id) {
  favorites = favorites.filter(f => f !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

renderFavorites();
