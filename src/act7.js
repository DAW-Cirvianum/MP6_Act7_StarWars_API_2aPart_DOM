import swapi from './swapi.js';

//Exemple d'inicialització de la llista de pel·lícules. Falten dades!
async function setMovieHeading(movieId, titleSelector, infoSelector, directorSelector) {
  // Obtenim els elements del DOM amb QuerySelector
  const title = document.querySelector(titleSelector);  
  const info = document.querySelector(infoSelector)
  const director = document.querySelector(directorSelector)

  console.log(movieId)

  if (!movieId){
    title.innerHTML = ''
    info.innerHTML = ''
    director.innerHTML = ''
    return
  }
  // Obtenim la informació de la pelicula
  const movieInfo = await swapi.getMovieInfo(movieId);
  // Injectem
  title.innerHTML = movieInfo.name
  info.innerHTML = `Episode ${movieInfo.episodeID} - ${movieInfo.release}`
  director.innerHTML = `Director: ${movieInfo.director}`
}

async function initMovieSelect(selector) {
  // Recuperem les dades del servidor
  const movies = await swapi.listMoviesSorted();
  //console.log(movies)
  
  // Seleccionem el nostre element sobre el que hem d'actuar (menú desplegable "movies")
  const select = document.querySelector(selector);

  // Com que el primer element no forma part de la llista de pelis, vaig a fer-ho a mà
  const option = document.createElement('option')
  // Inicialitzo amb el valor per defecte que em demanen "Selecciona una pel·lícula"
  option.value = '';
  option.textContent = "Selecciona una pel·lícula" 
  select.appendChild(option)

  // Com ho faig per anar passant la resta de pel·lícules?
  // 'movies' és un array d'objectes per tant: for..of, map, foreach.
  
  movies.forEach(movie => {
    const option = document.createElement('option')
    option.value = _filmIdToEpisodeId(movie.episodeID)
    option.textContent = movie.name
    select.appendChild(option)
  })
}

function deleteAllCharacterTokens() {}

// EVENT HANDLERS //

function addChangeEventToSelectHomeworld() {}

async function _createCharacterTokens() {}

function _addDivChild(parent, className, html) {}

function setMovieSelectCallbacks() {
  // Busquem l'identificador del selector de pel·lícules 
  const selectMovie = document.querySelector('#select-movie')
  // Cada vegada que canviem ('change') el valor del selector cridem a la funció _handleOnSelectMovieChanged
  // Sintaxi: element.addEventListener(event, function)
  selectMovie.addEventListener('change', _handleOnSelectMovieChanged)
}

async function _handleOnSelectMovieChanged(event) {
  // Obtenir el valor del selector que en aquest cas conté l'id de la peli
  const movieID = event.target.value
  // Modifiquem la capçalera amb la informació corresponent amb aquesta peli
  // Si existeix un "target"
    await setMovieHeading(movieID, '.movie__title', '.movie__info', '.movie__director');

}

function _filmIdToEpisodeId(episodeID) {
  const mapping = episodeToMovieIDs.find(item => item.e === episodeID)
  if (mapping){
    return mapping.m
  } else {
    return null
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

function _setMovieHeading({ name, episodeID, release, director }) {}

function _populateHomeWorldSelector(homeworlds) {}

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
