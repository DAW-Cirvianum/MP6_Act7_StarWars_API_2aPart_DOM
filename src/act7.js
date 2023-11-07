import swapi from './swapi.js';

//Exemple d'inicialització de la llista de pel·lícules. Falten dades!
async function setMovieHeading(movieId, titleSelector, infoSelector, directorSelector) {
  // Obtenim els elements del DOM amb QuerySelector
  const title = document.querySelector(titleSelector);
  const info = document.querySelector(infoSelector);
  const director = document.querySelector(directorSelector)
  // Obtenim la informació de la pelicula
  const movieInfo = await swapi.getMovieInfo(movieId);
  // Modifico la informació
  title.innerHTML = movieInfo.name;
  info.innerHTML = `Episode ${movieInfo.episodeID} - ${movieInfo.release}`;
  director.innerHTML = `Director: ${movieInfo.director}`
}


async function initMovieSelect(selector) {
  // Recuperem les dades del servidor
  const movies = await swapi.listMoviesSorted();
  // Seleccionem el nostre element sobre el que haurem d'actuar (menú desplegable)
  const select = document.querySelector(selector);
  // Com que es tracta d'un select, haurem d'injectar "options" --> https://developer.mozilla.org/es/docs/Web/HTML/Element/select
  const option = document.createElement('option');
  // Inicialitzem amb el valor per defecte que ens demanen i injectem
  option.value = '';
  option.innerText = "Selecciona una pel·lícula";
  select.appendChild(option)
  
  // Ara com ho puc fer per anar posant la resta de pel·lícules... movies és un array amb la info no?
  // Un for of... o un map?
  for (const movie of movies){
    const option = document.createElement('option');
    option.value = movie.episodeID;
    option.innerText = movie.name;
    select.appendChild(option)
  }

  // O amb un map
  // movies.map(movie => {
  //   option.value = movie.episodeID;
  //   option.innerHTML = movie.name;
  //   select.appendChild(option.cloneNode(true));
  // })

}

function deleteAllCharacterTokens() {
  const listCharacters = document.querySelector('.list__characters')
  listCharacters.innerHTML= '';
}

// EVENT HANDLERS //

function addChangeEventToSelectHomeworld() {}

async function _createCharacterTokens() {}

function _addDivChild(parent, className, html) {}

function setMovieSelectCallbacks() {
  // Aquesta funcio ha d'implementar un eventListener sobre el selector de películes
  // 1. Obtenir l'element + 2. Afegir l'eventListener per quan canviï la opció. + 3. Callback a la funció qeu actualitza les dades amb la informació necessari
  const selectMovie = document.querySelector('#select-movie');
  // Podem gestionar la lògica en una funció auxiliar
  selectMovie.addEventListener('change', _handleOnSelectMovieChanged)
}

async function _handleOnSelectMovieChanged(event) {
  const selectHomeWorld = document.querySelector('#select-homeworld')
  selectHomeWorld.innerHTML = ''

  deleteAllCharacterTokens();

  // Obtenir el nou valor del selector
  const episodeID = event.target.value;
  // Cridar a la funció que em permet actualitzar les dades de la pel·lícula
  // COMPTE! episodiID != filmID!
  const movieID = _filmIdToEpisodeId(episodeID);
  const movieData = await swapi.getMovieInfo(movieID);
  // Actualitzem la informació del heading
  //_setMovieHeading(movieData)
  setMovieHeading(movieID,'.movie__title', '.movie__info', '.movie__director');
  // Recuperem la informació de 'homeworld' dels personatges
  const response = await swapi.getMovieCharactersAndHomeworlds(movieID);
  //Obting els homeworlds de tots els personatges de la peli
  const homeworlds = response.characters.map(
    (personatge) => personatge.homeworld
  )
  // Hi ha planetes repetits (diversos personatges amb el mateix 'homeworld')
  // Evitem duplicats i els ordenar alfabèticament
  const cleanHomeworlds = _removeDuplicatesAndSort(homeworlds);
  _populateHomeWorldSelector(cleanHomeworlds)  
 
}

function _filmIdToEpisodeId(episodeID) {
  for (let i in episodeToMovieIDs) {
    // Com que movieId és un string, fem servir el == per comparar (el valor però no el tipus!)
    if (episodeToMovieIDs[i].e == episodeID) {
      console.log("hola!")
      return episodeToMovieIDs[i].m;
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


//Enlloc de tractar els elements del heading de manera individual, podem sobreescriue l'html
//de tot el component directament fent ús de literals 
function _setMovieHeading({ name, episodeID, release, director }) {
  const movieHeader = document.querySelector('#movie-header');

  movieHeader.innerHTML = `
        <h2 class="movie__title">${name}</h2>
        <h4 class="movie__info">Episode ${episodeID} - ${release}</h4>
        <p class="movie__director">Director: ${director}</p>
    `;
}

function _populateHomeWorldSelector(homeworlds) {
  const selectHomeworld = document.querySelector('#select-homeworld')
  const option = document.createElement('option');
  option.innerText="Selecciona un planeta"
  selectHomeworld.appendChild(option)    

  homeworlds.forEach((homeworld) => {
    const option = document.createElement('option');
    option.value = homeworld;
    option.innerText = homeworld;
    selectHomeworld.appendChild(option)    
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
