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

// Retorna un array amb els objectes vistos a l'exercici 2 ordenat alfabèticament d'acord amb el títol de la peli

export async function listMoviesSorted() {
  const data = await listMovies();
  console.log(data);
  return data.sort((valorA, valorB) => {
    return valorA.name < valorB.name ? -1 : valorA.name > valorB.name ? 1 : 0;
  });
}

listMoviesSorted().then((data) => console.log(data));

// No podem fer ús de resta per comparar en aquest cas.

// EXERCICI 4 - listEvenMovieSorted
// Retorna un array d'objectes (films) ordenatas per l'element episodi + únicament parells (2, 4, 6...)

// 1. Torno a necessitar el llistat de pelis d'abans. D'aquí podré filtrar en base a ID parell.
// 2. Aplico el sort(). 

function _esParell(valor) {
  return valor % 2 == 0;
}

async function listEvenMovieSorted{
  const newList = await listMovies();

  const filteredMovies = newList.filter((film)=>{
    return _esParell(film.episodeID);
  })
}
