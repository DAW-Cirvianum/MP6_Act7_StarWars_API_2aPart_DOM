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

getMovieCount().then((data) => console.log(data));

// 2

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

//3

export async function listMoviesSorted() {
  const data = await listMovies();
  return data.sort((a, b) => a.name.localeCompare(b.name));
}

//4

export async function listEvenMoviesSorted() {
  const movies = await listMovies();
  const moviesFiltered = movies.filter((movie) => movie.episodeID % 2 === 0);
  return moviesFiltered.sort((a, b) => a.episodeID - b.episodeID);
}

// listEvenMoviesSorted().then((data) => console.log(data));

export async function getMovieInfo(id) {
  const movie = await _getSwapiData(`films/${id}`);
  return {
    characters: movie.characters,
    episodeID: movie.episode_id,
    name: movie.title,
  };
}

// getMovieInfo('4').then((data) => console.log(data));

export async function getCharacterName(url) {
  const character = await _getSwapiData(url);
  return character.name;
}

// getCharacterName("people/3/").then((data) => console.log(data));

export async function getMovieCharacters(id) {
  const info = await getMovieInfo(id);
  const chars = info.characters;
  const values = await Promise.all(chars.map((url) => getCharacterName(url)));

  info.characters = values;

  console.log(info);

  // return info;
}

// getMovieCharacters("1").then((data) => console.log(data));

// Aneu afegint les functions a exportar aquí
const swapi = {
  getMovieCount,
  listMovies,
  listMoviesSorted,
  listEvenMoviesSorted,
};

export default swapi;
