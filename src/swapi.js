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

async function _getSwapiData(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error('HTTP error, status = ' + res.status);
    return await res.json();
  } catch (err) {
    console.log('Error >>> Error obtenint pel·lícules del servidor', err);
  }
}

async function getMovieCount() {
  const data = await _getSwapiData('films/');
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

// EXERCICI 2 - listMovies()

// Hem de recuperar informació parcial de les películes (data.results)
// Els "keys" d'alguns dels meus objectes canviaran
// "title" --> "name"
// "director"--> "director"
// "release_date" --> "release"
// "episode_id" --> "episdoeID"

// Primer podem crear una funció per fer el map de les películes i retornar un
// nou array amb les dades que ens interessen

async function listMovies() {
  const data = await _getSwapiData('films/');
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
  return films;
}

// EXERCICI 3 - listMoviesSorted()

// Retorna un array amb ordenat alfabèticament (títol) junt amb la informació de l'ex3

async function listMoviesSorted() {
  const data = await listMovies();
  console.log(data);
  return data.sort((valorA, valorB) => {
    return valorA.name < valorB.name ? -1 : valorA.name > valorB.name ? 1 : 0;
  });
}

// No podem fer ús de resta per comparar en aquest cas:
// "The Empire Strikes Back" - "A New Hope" --> NaN
// Però si podem fer ús dels operadors de comparació:
// "The Empire Strikes Back" > "A New Hope" --> false

//listMoviesSorted().then((data) => console.log(data));

// Aneu afegint les functions a exportar aquí

const swapi = {
  getMovieCount,
  listMovies,
  listMoviesSorted,
};

export default swapi;

// EXERCICI 4
// Implementar una funció anomenada listEvenMoviesSorted() que retorna una
// promesa que es resol amb un array d'objectes Film ordenats per episodeID de
// forma ascendent. Només s'han de retornar els episodis parells.

async function listEvenMoviesSorted() {
  const data = await listMovies();
  // Filtrem els episodis parells
  const newData = data.filter((film) => film.episodeID % 2 === 0);
  // Ordenem els episodis parells amb sort(). Amb números sí que podem fer servir resta.
  return newData.sort((a, b) => a.episodeID - b.episodeID);
  // O tot junt:
  //return data.filter((film) => film.episodeID % 2 === 0).sort((a, b) => a.episodeID - b.episodeID);
}

//listEvenMoviesSorted().then((data) => console.log(data));

// // EXERCICI 5
// // 5.1
//Implementar una funció getMovieInfo(id: string) que donat un id
// d'una pel·lícula, ens retorni una promesa que es resol amb un objecte que conté:name, episodeID, characters.

// Opció Òptima - Fent ús de funcions anteriors.

async function getMovieInfo(id) {
  const movie = await _getSwapiData(`films/${id}`);
  return {
    name: movie.title,
    episodeID: movie.episode_id,
    characters: movie.characters,
  };
}

/* // Opció 1 - FILTER + MAP
async function getMovieInfo(id) {
  // Assegurem-nos que l'ID serà un número
  if (typeof id != 'string') {
    throw new Error("No has introduït un nom d'episodi vàlid per la peli!");
  } else {
    id = Number(id);
    let data = await _getSwapiData('films/');
    // Filtrem únicament les dades d'aquesta pel·lícula ara amb l'episodi ID (a la db: episode_id)
    // I fem un map per exemple per poder accedir a l'array i retornar les propietats desitjades
    // de l'Objecte.
    let newData = data.results
      .filter((film) => film.episode_id === id)
      .map((filteredFilm) => {
        if (filteredFilm) {
          console.log(filteredFilm);
          return {
            characters: filteredFilm.characters,
            episodeID: filteredFilm.episode_id,
            name: filteredFilm.title,
          };
        }
      });
    return newData;
  }
}
getMovieInfo('4').then((data) => console.log(data));

// OPCIÓ 2 -  FIND INDEX - https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/findIndex
// 
async function getMovieInfo2(id) {
  // Assegurem-nos que l'ID serà un número
  if (typeof id != 'string') {
    throw new Error("No has introduït un nom d'episodi vàlid per la peli!");
  } else {
    id = Number(id);
    let data = await _getSwapiData('films/');
    // Cerquem la pel·lícula amb l'ID especificat
    // findIndex retorna el PRIMER ÍNDEX DE L'ARRAY que compleixi la condició
    const index = data.results.findIndex((film) => film.episode_id === id);
    if (index === -1) {
      throw new Error("No s'ha trobat cap pel·lícula amb aquest ID");
    }
    const film = data.results[index];
    return {
      characters: film.characters,
      episodeID: film.episode_id,
      name: film.title,
    };
  }
} 

getMovieInfo2('4').then((data) => console.log(data));
*/

// // 5.2 GetCharacterName(URL: string)

// Implementar una funció getCharacterName(url: string) que donada una URL d'un personatge
// retorni una promesa que es resol amb el nom del personatge.

async function getCharacterName(url) {
  //Podem assegurar-nos que la petició es farà amb https://
  url = url.replace('http://', 'https://');
  // Fem la petició a la API
  const res = await _getSwapiData(url);
  // Retornem el nom del personatge
  return res.name;
}

// 5.3 getMovieCharacters(id: string)

async function getMovieCharacters(id) {
  // Fem la petició a la API
  const movie = await getMovieInfo(id);
  // Substituïm les url dels personatges pel seu Nom. Podem crear-nos una auxiliar
  movie.characters = await _getCharacterNames(movie);
  // Retornem el nom del personatge
  return movie;
}

//I en aquesta funció implementem el nostre "array de Promeses" amb Promise.all
//I podem aprofitar l'anterior funció que ens permet resoldre URL --> Nom del Personatge
async function _getCharacterNames(movie) {
  return Promise.all(
    movie.characters.map((url) => {
      getCharacterName(url);
    })
  );
}

// // EXERCICI 6 - getMovieCharactersAndHomeworld(id: string)
//
