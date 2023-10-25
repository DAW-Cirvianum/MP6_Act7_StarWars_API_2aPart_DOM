const BASE_URL = 'https://swapi.dev/api/';

// export function getMovieCount() {
//   return fetch(`${BASE_URL}films/`)
//     .then((res) => res.json())
//     .then((json) => json.count);
// }

// export async function getMovieCount() {
//   const res = await fetch('https://swapi.dev/api/films/');
//   const data = await res.json();
//   return data.count;
// }

// Una bona opció si teniu ja prou apresa la lògica, és fer una funció genèrica per fer les requests a la API

export async function _getSwapiData(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const data = await res.json();
  return data;
}

export async function getMovieCount() {
  const data = await _getSwapiData('films/');
  console.log(data);
  return data.count;
}

// getMovieCount();

//A vegades veureu també la lògica amb response.ok:
// export async function getSwapiData(path) {
//   const res = await fetch(`${BASE_URL}${path}`);
//   if (res.ok) {
//     const data = await res.json();
//     return data;
//   }
//   throw new Error('Something went wrong');
// }

// EXERCICI 2 - listMovies()

// Hem de recuperar informació parcial de les pel·lícules
// Els "keys" hauran de canviar a l'objecte que jo retorni (alguns)
// "title" --> "name"
// "director" --> "director"
// "release_date" --> "release"
// "episode_id" --> "episodeID"

export async function listMovies() {
  const data = await _getSwapiData('films/');
  const films = data.results.map(
    ({ title, director, release_date, episode_id }) => {
      return {
        name: title,
        director: director,
        release: release_date,
        episodeID: episode_id,
      };
    }
  );
  return films;
}

// EXERCICI 3 - listMoviesSorted()

// Retorna un array amb ordenat alfabèticament (títol) junt amb la informació de l'ex3

async function listMoviesSorted() {
  const data = await listMovies();
  return data.sort((valorA, valorB) => {
    return valorA.name < valorB.name ? -1 : valorA.name > valorB.name ? 1 : 0;
  });
}

//listMoviesSorted().then((data) => console.log(data));

// No podem fer ús de resta per comparar en aquest cas.

// EXERCICI 4 - listEvenMovieSorted
// Retorna un array d'objectes (films) ordenatas per l'element episodi + únicament parells (2, 4, 6...)

// 1. Torno a necessitar el llistat de pelis d'abans. D'aquí podré filtrar en base a ID parell.
// 2. Aplico el sort().

async function listEvenMoviesSorted() {
  const movies = await listMovies();
  // Filtrem els episodis parells
  const moviesFiltered = movies.filter((movie) => movie.episodeID % 2 === 0);
  // Ordenem en base a aquests IDs
  return moviesFiltered.sort((a, b) => a.episodeID - b.episodeID);
}

// listEvenMoviesSorted().then((data) => console.log(data));

// // EXERCICI 5
// // 5.1
//Implementar una funció getMovieInfo(id: string) que donat un id
// d'una pel·lícula, ens retorni una promesa que es resol amb un objecte que conté:name, episodeID, characters.

// Opció Òptima - Fent ús de funcions anteriors.

async function getMovieInfo(id) {
  const movie = await _getSwapiData(`films/${id}`);
  return {
    characters: movie.characters,
    episodeID: movie.episode_id,
    name: movie.title,
  };
}

//getMovieInfo('4').then((data) => console.log(data));

// // 5.2 GetCharacterName(URL: string)

// Implementar una funció getCharacterName(url: string) que donada una URL d'un personatge
// retorni una promesa que es resol amb el nom del personatge.

async function getCharacterName(url) {
  const character = await _getSwapiData(url);
  return character.name;
}

getCharacterName('/people/3').then((data) => console.log(data));

// 5.3 getMovieCharacters(id: string)

async function _getCharacterNames(movie) {
  return Promise.all(
    movie.characters.map(async (url) => {
      const path = url.split('api')[1];
      const data = await _getSwapiData(path);
      return data.name;
    })
  );
}
