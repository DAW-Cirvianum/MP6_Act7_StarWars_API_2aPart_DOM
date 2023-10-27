import swapi, { getMovieCharactersAndHomeworlds, getMovieInfo, compareByName } from './swapi';

export async function setMovieHeading(movieId, titleSelector, infoSelector, directorSelector) {
  // Obtenemos los elementos del DOM con QuerySelector
  const title = document.querySelector(titleSelector);
  const info = document.querySelector(infoSelector);
  const director = document.querySelector(directorSelector);
  // Obtenemos la información de la película
  const movieInfo = await pec2.getMovieInfo(movieId);
  // Sustituimos los datos
  title.innerHTML = movieInfo.name;
  info.innerHTML = `Episode ${movieInfo.episodeID} - ${movieInfo.release}`;
  director.innerHTML = `Director: ${movieInfo.director}`;
}

export async function initMovieSelect(selector) {
  const movies = await pec2.listMoviesSorted();
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

export function deleteAllCharacterTokens() {
  let listCharacters = document.querySelector('.list__characters');
  listCharacters.innerHTML = '';
}

export function addChangeEventToSelectHomeworld() {
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

  let data = await pec2.getMovieCharactersAndHomeworlds(selectMovie.value);

  let filteredCharacters = data.characters.filter(
    (character) => character.homeworld === selectHomeworld.value
  );

  filteredCharacters.map((d) => {
    let li = document.createElement('li');
    li.className = 'list__item item character';
    ul.appendChild(li);

    let img = document.createElement('img');
    img.src = 'assets/user.svg';
    img.className = 'character__image';
    li.appendChild(img);

    let h2 = document.createElement('h2');
    h2.className = 'character__name';
    h2.innerHTML = d.name;
    li.appendChild(h2);

    _addDivChild(li, 'character__birth', '<strong>Birth Year:</strong> ' + d.birth_year);
    _addDivChild(li, 'character__eye', '<strong>Eye color:</strong> ' + d.eye_color);
    _addDivChild(li, 'character__gender', '<strong>Gender:</strong> ' + d.gender);
    _addDivChild(li, 'character__home', '<strong>Home World:</strong> ' + d.homeworld);
  });
}

function _addDivChild(parent, className, html) {
  let div = document.createElement('div');
  div.className = className;
  div.innerHTML = html;
  parent.appendChild(div);
}

function setMovieSelectCallbacks() {
  // Buscamos en la pagina el selector de películas
  const selectMovie = document.querySelector('#select-movie');
  // Cada vez que cambie el valor actualizaremos el header con la nueva pelicula seleccionada
  selectMovie.addEventListener('change', _handleOnSelectMovieChanged, false);
}

async function _handleOnSelectMovieChanged(event) {
  const movieId = event.target.value;
  // Obtener los datos de la pelicula a partir de la funcion previamente implementada
  const data = await getMovieInfo(movieId);
  // Con esos datos tenemos todo lo que necesitamos para rellenar la cabecera de la web
  _setMovieHeading(data);
  // Para los datos de los planetas de origen utilizamos otra funcion previamente implementada
  const response = await getMovieCharactersAndHomeworlds(movieId);
  // Los datos tenemos que filtrarlos un poco: En primer lugar extremos una lista de todos los planetas de origen
  const homeworlds = response.characters.map((character) => character.homeworld);
  // Los ordenamos y eliminamos duplicados
  const cleanHomeWorlds = _removeDuplicatesAndSort(homeworlds);
  // Con la lista ordenada rellenamos el selector
  _populateHomeWorldSelector(cleanHomeWorlds);
}

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
 * Funcion auxiliar que podremos reutilizar en más ocasiones
 */
function _removeDuplicatesAndSort(elements) {
  // Al crear un Set se eliminan automaticamente los duplicados
  const set = new Set(elements);
  // Lo volvemos a transformar en un array
  const array = Array.from(set);
  // Lo ordenamos alfabeticamente
  return array.sort(compareByName);
}

export default {
  setMovieHeading,
  setMovieSelectCallbacks,
  initMovieSelect,
  deleteAllCharacterTokens,
  addChangeEventToSelectHomeworld,
};
