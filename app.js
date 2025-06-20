const pokemonList = document.getElementById('pokemon-list');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const mainScreen = document.getElementById('main-screen');
const detailScreen = document.getElementById('detail-screen');
const backBtn = document.getElementById('back-btn');
const detailName = document.getElementById('detail-name');
const detailImage = document.getElementById('detail-image');
const detailList = document.getElementById('detail-list');
const favBtn = document.getElementById('fav-btn');

let currentPage = 1;
const pageSize = 6;
const apiBase = 'https://pokeapi.co/api/v2/pokemon';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

async function fetchPokemonList(page) {
  const offset = (page - 1) * pageSize;
  const url = `${apiBase}?limit=${pageSize}&offset=${offset}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results; 
}

async function fetchPokemonDetails(url) {
  const res = await fetch(url);
  return res.json();
}

function isFavorite(id) {
  return favorites.includes(id);
}

function toggleFavorite(id) {
  if(isFavorite(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavBtn(id);
  renderList();
}

function updateFavBtn(id) {
  if(isFavorite(id)) {
    favBtn.textContent = '★ Remover dos favoritos';
    favBtn.classList.add('bg-yellow-600');
    favBtn.classList.remove('bg-yellow-400');
  } else {
    favBtn.textContent = '☆ Marcar como favorito';
    favBtn.classList.add('bg-yellow-400');
    favBtn.classList.remove('bg-yellow-600');
  }
}

async function renderList() {
  pokemonList.innerHTML = '';
  prevPageBtn.disabled = currentPage === 1;

  const pokemons = await fetchPokemonList(currentPage);

  pokemons.forEach(async (pokemon) => {
    const details = await fetchPokemonDetails(pokemon.url);
    const id = details.id;
    const li = document.createElement('li');
    li.className = "bg-white rounded shadow p-4 cursor-pointer hover:bg-green-50 flex flex-col items-center";

    li.innerHTML = `
      <img src="${details.sprites.front_default}" alt="${pokemon.name}" class="w-24 h-24 mb-2" />
      <span class="font-semibold capitalize">${pokemon.name}</span>
      <button class="mt-2 text-sm text-yellow-500 hover:text-yellow-600" data-id="${id}">
        ${isFavorite(id) ? '★ Favorito' : '☆ Favoritar'}
      </button>
    `;

    li.addEventListener('click', (e) => {
      if(e.target.tagName === 'BUTTON') return;
      openDetail(details);
    });

    li.querySelector('button').addEventListener('click', e => {
      e.stopPropagation();
      toggleFavorite(id);
    });

    pokemonList.appendChild(li);
  });
}

function openDetail(pokemon) {
  mainScreen.classList.add('hidden');
  detailScreen.classList.remove('hidden');

  detailName.textContent = capitalize(pokemon.name);
  detailImage.src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  detailList.innerHTML = '';

  const items = [];

  const tipos = pokemon.types.map(t => capitalize(t.type.name)).join(', ');
  items.push(`Tipo(s): ${tipos}`);

  items.push(`Altura: ${pokemon.height / 10} m`);
  items.push(`Peso: ${pokemon.weight / 10} kg`);

  const habilidades = pokemon.abilities.map(a => capitalize(a.ability.name)).join(', ');
  items.push(`Habilidades: ${habilidades}`);

  const moves = pokemon.moves.slice(0, 2).map(m => capitalize(m.move.name)).join(', ');
  items.push(`Movimentos: ${moves}`);

  if (pokemon.sprites.front_shiny) {
    const img = document.createElement('img');
    img.src = pokemon.sprites.front_shiny;
    img.alt = `${pokemon.name} shiny`;
    img.className = "w-32 h-32 object-contain my-2 mx-auto rounded";
    detailList.appendChild(img);
  }

  items.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    detailList.appendChild(li);
  });

  updateFavBtn(pokemon.id);
  favBtn.onclick = () => {
    toggleFavorite(pokemon.id);
  };
}

backBtn.addEventListener('click', () => {
  detailScreen.classList.add('hidden');
  mainScreen.classList.remove('hidden');
});

prevPageBtn.addEventListener('click', () => {
  if(currentPage > 1) {
    currentPage--;
    renderList();
  }
});

nextPageBtn.addEventListener('click', () => {
  currentPage++;
  renderList();
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

renderList();
