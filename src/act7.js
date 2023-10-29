import swapi from './swapi.js';

async function setMovieHeading(
  movieId,
  titleSelector,
  infoSelector,
  directorSelector
) {
  // Obtenim els elements del DOM amb QuerySelector
  const title = document.querySelector(titleSelector);
  const info = document.querySelector(infoSelector);
  const director = document.querySelector(directorSelector);
  // Obtenim la informació de la pelicula
  const movieInfo = await swapi.getMovieInfo(movieId);
  // Injectem
  title.innerHTML = movieInfo.name;
  info.innerHTML = `Episode ${movieInfo.episodeID} - ${movieInfo.release}`;
  director.innerHTML = `Director: ${movieInfo.director}`;
}

async function initMovieSelect(selector) {
  const movies = await swapi.listMoviesSorted();
  const select = document.querySelector(selector);
  let option = document.createElement('option');
  option.value = '';
  option.innerHTML = 'Select a movie';
  select.appendChild(option);
  movies.map((movie) => {
    option = document.createElement('option');
    option.value = movie.episodeID;
    option.innerHTML = movie.name;
    select.appendChild(option);
  });
}

function deleteAllCharacterTokens() {
  let listCharacters = document.querySelector('.list__characters');
  listCharacters.innerHTML = '';
}

// EVENT HANDLERS //

function addChangeEventToSelectHomeworld() {
  let selectHomeworld = document.querySelector('#select-homeworld');
  selectHomeworld.addEventListener('change', _createCharacterTokens, false);
}

async function _createCharacterTokens() {
  let selectMovie = document.querySelector('#select-movie');
  let selectHomeworld = document.querySelector('#select-homeworld');

  if (!selectMovie.value) {
    throw Error('No movie selected.');
  }

  if (!selectHomeworld.value) {
    throw Error('No homeworld selected.');
  }

  deleteAllCharacterTokens();

  var ul = document.querySelector('.list__characters');

  let data = await swapi.getMovieCharactersAndHomeworlds(selectMovie.value);

  let filteredCharacters = data.characters.filter(
    (character) => character.homeworld === selectHomeworld.value
  );

  filteredCharacters.map(async (d) => {
    let li = document.createElement('li');
    li.className = 'list__item item character';
    ul.appendChild(li);
    let img = document.createElement('img');
    //Anem a introduir la imatge del personatge
    // Amb split separem la url per /
    const urlParts = d.url.split('/');
    const characterNumber = urlParts[urlParts.length - 2];
    img.src = `/public/assets/people/${characterNumber}.jpg`;
    img.className = 'character__image';
    img.style.maxWidth = '100%'; // Add this line to set the maximum width to 100%
    li.appendChild(img);

    let h2 = document.createElement('h2');
    h2.className = 'character__name';
    h2.innerHTML = d.name;
    li.appendChild(h2);

    _addDivChild(
      li,
      'character__birth',
      '<strong>Birth Year:</strong> ' + d.birth_year
    );
    _addDivChild(
      li,
      'character__eye',
      '<strong>Eye color:</strong> ' + d.eye_color
    );
    _addDivChild(
      li,
      'character__gender',
      '<strong>Gender:</strong> ' + d.gender
    );
    _addDivChild(
      li,
      'character__home',
      '<strong>Home World:</strong> ' + d.homeworld
    );
  });
}

function _addDivChild(parent, className, html) {
  let div = document.createElement('div');
  div.className = className;
  div.innerHTML = html;
  parent.appendChild(div);
}

function setMovieSelectCallbacks() {
  // Busquem l'identificador del selector de pelicules
  const selectMovie = document.querySelector('#select-movie');
  // Cada vegada que canviem ('change') el valor del selector cridem a la funció _handleOnSelectMovieChanged
  // Sintaxi: element.addEventListener(event, function, useCapture)
  selectMovie.addEventListener('change', _handleOnSelectMovieChanged, false);
}

async function _handleOnSelectMovieChanged(event) {
  // Esborrem l'anterior llistat de planetes i personatges, altrament afegirà a la llista dels ja presents
  const selectHomeworld = document.querySelector('#select-homeworld');
  selectHomeworld.innerHTML = '';

  deleteAllCharacterTokens();

  // Obtenim el valor del selector que en aquest cas contindrà el número d'episodi
  const episodeID = event.target.value;
  // Obtenim les dades de la pel·lícula, però compte episodiID != filmID! :(
  const movieID = _filmIdToEpisodeId(episodeID);
  const data = await swapi.getMovieInfo(movieID);
  // Actualitzem el header amb les dades de la pel·lícula
  _setMovieHeading(data);
  // Ex4 --> Ara pels planetes d'origen necessitem les dades de tots els personatges
  const response = await swapi.getMovieCharactersAndHomeworlds(movieID);
  // Necessitem d'entrada una llista amb els planetes d'origen dels diferents personatges:
  const homeworlds = response.characters.map(
    (character) => character.homeworld
  );
  // Per si no ho fem en origen, evitem els duplicats i els ordenem alfabèticament
  const cleanHomeWorlds = _removeDuplicatesAndSort(homeworlds);
  // Amb la llista ordenada ja podem cridar a la funció que actualitza el selector de "homeworlds"
  _populateHomeWorldSelector(cleanHomeWorlds);
}

function _filmIdToEpisodeId(episodeID) {
  for (let list in episodeToMovieIDs) {
    // Com que movieId és un string, fem servir el == per comparar (el valor però no el tipus!)
    if (episodeToMovieIDs[list].e == episodeID) {
      return episodeToMovieIDs[list].m;
    }
  }
}

// "https://swapi.dev/api/films/1/" --> Episode_id = 4 (A New Hope)
// "https://swapi.dev/api/films/2/" --> Episode_id = 5 (The Empire Strikes Back)
// "https://swapi.dev/api/films/3/" --> Episode_id = 6 (Return of the Jedi)
// "https://swapi.dev/api/films/4/" --> Episode_id = 1 (The Phantom Menace)
// "https://swapi.dev/api/films/5/" --> Episode_id = 2 (Attack of the Clones)
// "https://swapi.dev/api/films/6/" --> Episode_id = 3 (Revenge of the Sith)

let episodeToMovieIDs = [
  { m: 1, e: 4 },
  { m: 2, e: 5 },
  { m: 3, e: 6 },
  { m: 4, e: 1 },
  { m: 5, e: 2 },
  { m: 6, e: 3 },
];

/**
 * Esta función actualiza el contenido del header de la aplicación.
 *
 * Dada una película se actualiza el html del header con los datos correctos.
 * En lugar de Jugar con todos los elementos del DOM individualmente sobreescribimos el html
 * de todo el componente directamente utilizando template literals.
 */
function _setMovieHeading({ name, episodeID, release, director }) {
  const movieHeader = document.querySelector('#movie-header');

  movieHeader.innerHTML = `
        <h2 class="movie__title">${name}</h2>
        <h4 class="movie__info">Episode ${episodeID} - ${release}</h4>
        <p class="movie__director">Director: ${director}</p>
    `;
}

function _populateHomeWorldSelector(homeworlds) {
  const selectHomeworld = document.querySelector('#select-homeworld');

  homeworlds.forEach((homeworld) => {
    const option = document.createElement('option');
    option.value = homeworld;
    option.innerText = homeworld;
    selectHomeworld.appendChild(option);
  });
}

/**
 * Funció auxiliar que podem reutilitzar: eliminar duplicats i ordenar alfabèticament un array.
 */
function _removeDuplicatesAndSort(elements) {
  // Al crear un Set eliminem els duplicats
  const set = new Set(elements);
  // tornem a convertir el Set en un array
  const array = Array.from(set);
  // i ordenem alfabèticament
  return array.sort(swapi._compareByName);
}

const act7 = {
  setMovieHeading,
  setMovieSelectCallbacks,
  initMovieSelect,
  deleteAllCharacterTokens,
  addChangeEventToSelectHomeworld,
};

export default act7;
