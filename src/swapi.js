const BASE_URL = 'https://swapi.dev/api/';

/* export function getMovieCount() {
  return fetch(`${BASE_URL}films/`)
    .then((res) => res.json())
    .then((json) => json.count);
} */

// export async function getMovieCount() {
//   const res = await fetch('https://swapi.dev/api/films/');
//   const data = await res.json();
//   return data.count;
// }

// Una bona opció si teniu ja prou apresa la lògica, és fer una funció genèrica per fer les requests a la API

export async function getSwapiData(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const data = await res.json();
  return data;
}

export async function getMovieCount() {
  const data = await getSwapiData('films/');
  return data.count;
}

// A vegades veureu també la lògica amb response.ok:
// export async function getSwapiData(path) {
//   const res = await fetch(`${BASE_URL}${path}`);
//   if (res.ok) {
//     const data = await res.json();
//     return data;
//   }
//   throw new Error('Something went wrong');
// }

// EXERCICI 2

// Hem de recuperar informació parcial de les películes (data.results)
// Els "keys" d'alguns dels meus objectes canviaran
// "title" --> "name"
// "director"--> "director"
// "release_date" --> "release"
// "episode_id" --> "episdoeID"

// Primer podem crear una funció per fer el map de les películes i retornar un
// nou array amb les dades que ens interessen

export async function listMovies() {
  const data = await getSwapiData('films/');
  let films = data.results.map(
    ({ title, episode_id, director, release_date }) => {
      return {
        name: title,
        director: director,
        release: release_date,
        episodeID: episode_id,
      };
    }
  );
}

// EXERCICI 3

// Aneu afegint les functions a exportar aquí

const swapi = {
  getMovieCount,
  listMovies,
};

export default swapi;
