const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('search');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let allPokemon = [];
let currentStart = 1;
const PAGE_SIZE = 20;

// Colores por tipo ratooooonn
const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD"
};

const getTypeColor = (type) => {
  return typeColors[type] || "#777";
};

const fetchPokemon = async (id) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return res.json();
};

const loadAllPokemon = async () => {
  for (let i = 1; i <= 151; i++) {
    const data = await fetchPokemon(i);
    allPokemon.push({
      name: data.name,
      id: data.id,
      image: data.sprites.other['official-artwork'].front_default,
      types: data.types.map(t => t.type.name),
      height: data.height / 10,
      weight: data.weight / 10
    });
  }
  displayPokemon();
};

const displayPokemon = () => {
  pokedex.innerHTML = '';
  const filtered = getFilteredPokemon();
  const visible = filtered.slice(currentStart - 1, currentStart - 1 + PAGE_SIZE);

  visible.forEach(pokemon => {
    const card = document.createElement('div');
    card.classList.add('card');

    // Fondo dinámico por tipo principal
    const typeColor = getTypeColor(pokemon.types[0]);
    card.style.background = `linear-gradient(145deg, ${typeColor}, #ffffff)`;

    card.innerHTML = `
      <img src="${pokemon.image}" alt="${pokemon.name}" />
      <h2>${capitalize(pokemon.name)}</h2>
      <p>#${pokemon.id.toString().padStart(3, '0')}</p>
    `;
    card.addEventListener('click', () => showDetails(pokemon));
    pokedex.appendChild(card);
  });
};

const getFilteredPokemon = () => {
  const query = searchInput.value.toLowerCase();
  return allPokemon.filter(p => p.name.includes(query));
};

const showDetails = (pokemon) => {
  modalBody.innerHTML = `
    <h2>${capitalize(pokemon.name)}</h2>
    <img src="${pokemon.image}" alt="${pokemon.name}" />
    <p><strong>ID:</strong> #${pokemon.id}</p>
    <p><strong>Tipo:</strong> ${pokemon.types.join(', ')}</p>
    <p><strong>Altura:</strong> ${pokemon.height} m</p>
    <p><strong>Peso:</strong> ${pokemon.weight} kg</p>
  `;
  modal.classList.remove('hidden');
};

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

searchInput.addEventListener('input', () => {
  currentStart = 1;
  displayPokemon();
});

nextBtn.addEventListener('click', () => {
  const total = getFilteredPokemon().length;
  if (currentStart + PAGE_SIZE <= total) {
    currentStart += PAGE_SIZE;
    displayPokemon();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentStart - PAGE_SIZE >= 1) {
    currentStart -= PAGE_SIZE;
    displayPokemon();
  }
});

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

loadAllPokemon();
