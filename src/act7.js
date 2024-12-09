import swapi from "./swapi.js";

//Exemple d'inicialització de la llista de pel·lícules. Falten dades!
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
  info.innerHTML = `Episodi ${movieInfo.episodeID} - ${movieInfo.release}`;
  director.innerHTML = `Director: ${movieInfo.director}`;
}
async function initMovieSelect(selector) {
  //Recopero la informacio de les pelicules
  const movies = await swapi.listMoviesSorted();

  // localitzem l'element amb el selector amb id select-movie
  const select = document.querySelector(selector);

  //Afegim la opcio de Seleciona una pelicula
  const opcio = document.createElement("option");
  opcio.value = "";
  opcio.textContent = `Selecciona una opció`;
  select.appendChild(opcio);

  //Afegeixo el nom de les pelicules en el selector
  //ho faig amb un for of
  for (const movie of movies) {
    const opcio = document.createElement("option");
    //opcio.value = movie.episodeID;
    //Mapegem l'episodi amb l'id de la pel·lícula a la BBDD.
    opcio.value = _filmIdToEpisodeId(movie.episodeID);
    opcio.textContent = movie.name;
    select.appendChild(opcio);
  }
}

function setMovieSelectCallbacks() {
  // Busquem l'identificador del selector de pel·líules
  const selectMovie = document.querySelector("#select-movie");

  // Cada vegada que hi hagi un canvi ('change') del valor del selector, cridem el handler.
  // Sintaxi --> element.addEventListener('tipus de esdeveniment', funció_de_callback);
  selectMovie.addEventListener("change", _handleOnSelectMovieChanged);
}

function addChangeEventToSelectHomeworld() {}

function deleteAllCharacterTokens() {}

// EVENT HANDLERS //

async function _createCharacterTokens() {}

function _addDivChild(parent, className, html) {}

async function _handleOnSelectMovieChanged(event) {
  // Obtenir el valor del selector que conté la ID
  const movieID = event.target.value;
  // Modifiquem la capçalera amb la informació d'aquesta pel·lícula
  await setMovieHeading(
    movieID,
    ".movie__title",
    ".movie__info",
    ".movie__director"
  );

  // Ex4
  const result = await swapi.getMovieCharactersAndHomeworlds(movieID);
  const homeworldsTrobats = result.characters.map(({ homeworld }) => homeworld);
  const planetsNonRepeat = new Set(homeworldsTrobats);
  // Podríem tornar a convertir el Set a Array amb [...mySet] o Array.from(mySet)

  // Amb la llista ja neta, cridem a la funció per actualitzar el selector de "homeworlds"
  const selectorHomeworld = document.querySelector("#select-homeworld");
  _populateHomeWorldSelector(planetsNonRepeat, selectorHomeworld);
}

function _filmIdToEpisodeId(episodeID) {
  return episodeToMovieMap[episodeID] || null;
}

const episodeToMovieMap = {
  4: 1, // Episode IV (A New Hope) --> Movie ID 1
  5: 2, // Episode V (The Empire Strikes Back) --> Movie ID 2
  6: 3, // Episode VI (Return of the Jedi) --> Movie ID 3
  1: 4, // Episode I (The Phantom Menace) --> Movie ID 4
  2: 5, // Episode II (Attack of the Clones) --> Movie ID 5
  3: 6, // Episode III (Revenge of the Sith) --> Movie ID 6
};
// "https://swapi.dev/api/films/1/" --> Episode_id = 4 (A New Hope)
// "https://swapi.dev/api/films/2/" --> Episode_id = 5 (The Empire Strikes Back)
// "https://swapi.dev/api/films/3/" --> Episode_id = 6 (Return of the Jedi)
// "https://swapi.dev/api/films/4/" --> Episode_id = 1 (The Phantom Menace)
// "https://swapi.dev/api/films/5/" --> Episode_id = 2 (Attack of the Clones)
// "https://swapi.dev/api/films/6/" --> Episode_id = 3 (Revenge of the Sith)

function _populateHomeWorldSelector(planetsNonRepeat, selectorHomeworld) {
  //Seleccionem l'element html
  selectorHomeworld.innerHTML = `<option>Selecciona un homeworld</option>`;
  planetsNonRepeat.forEach((planetName) => {
    selectorHomeworld.innerHTML += `<option value=${planetName}>${planetName}</option>`;
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
