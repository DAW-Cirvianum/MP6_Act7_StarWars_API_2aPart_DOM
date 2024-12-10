import swapi from "./swapi.js";

let currentInfoDisplay;

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

function addChangeEventToSelectHomeworld(event) {
  const homeworldSelector = document.querySelector("#select-homeworld");

  homeworldSelector.addEventListener("change", _createCharacterTokens);
}

function deleteAllCharacterTokens() {
  const charactersList = document.querySelector(".list");
  charactersList.innerHTML = "";
}

// EVENT HANDLERS //

async function _createCharacterTokens(event) {
  deleteAllCharacterTokens();
  const ul = document.querySelector(".list");
  const homeworld = event.target.value;
  const characters = currentInfoDisplay.characters.filter(
    (character) => character.homeworld == homeworld
  );

  // Aquesta és l'estructura que hem d'aconseguir:
  // <li class="list__item item character">
  //           <img src="assets/user.svg" class="character__image" />
  //           <h2 class="character__name">Leia Skywalker</h2>
  //           <div class="character__birth">
  //             <strong>Birth Year:</strong> 19 BBY
  //           </div>
  //           <div class="character__eye"><strong>Eye color:</strong> Blue</div>
  //           <div class="character__gender"><strong>Gender:</strong> Male</div>
  //           <div class="character__home">
  //             <strong>Home World:</strong> Tatooine
  //           </div>
  // </li>

  for (const character of characters) {
    const li = document.createElement("li");
    const img = document.createElement("img");
    const h2 = document.createElement("h2");

    li.classList.add("list__item", "item", "character");
    //Anem a introduir la imatge del personatge:
    const urlParts = character.url.split("/");
    console.log(urlParts);
    const characterNumber = urlParts[urlParts.length - 1];
    // o també:

    const characterUrl = new URL(character.url);
    const segments = characterUrl.pathname.match(/[^/]+/g); // Obté només els segments del camí
    const characterNumber = segments ? segments.at(-1) : null;

    img.src = `/people/${characterNumber}.jpg`;
    img.className = "character__image";
    img.style.maxWidth = "100%";
    img.className = "character__image";
    h2.className = "character__name";
    h2.innerText = character.name;
    li.append(img, h2);

    _addDivChild(
      li,
      "character__birth",
      "<strong>Birth Year: </strong>" + character.birth_year
    );
    _addDivChild(
      li,
      "character__eye",
      "<strong>Eye color: </strong>" + character.eye_color
    );
    _addDivChild(
      li,
      "character__gender",
      "<strong>Gender: </strong>" + character.gender
    );
    _addDivChild(
      li,
      "character__home",
      "<strong>Homeworld: </strong>" + character.homeworld
    );

    // div1.className = "character__birth";
    // div1.innerHTML = `<strong>Birth Year:</strong> ${character.birth_year}`;

    // div2.className = "character__eye";
    // div2.innerHTML = `<strong>Eye color:</strong> ${character.eye_color}`;

    // div3.className = "character__gender";
    // div3.innerHTML = `<strong>Gender:</strong> ${character.gender}`;

    // div4.className = "character__home";
    // div4.innerHTML = `<strong>Home World:</strong> ${character.homeworld}`;

    // li.append(img, h2, div1, div2, div3, div4);
    ul.appendChild(li);
  }
}

function _addDivChild(parent, className, html) {
  const div = document.createElement("div");
  div.className = className;
  div.innerHTML = html;
  parent.appendChild(div);
}

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
  currentInfoDisplay = await swapi.getMovieCharactersAndHomeworlds(movieID);
  const homeworldsTrobats = currentInfoDisplay.characters.map(
    ({ homeworld }) => homeworld
  );
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
