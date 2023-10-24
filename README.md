# StarWars API - Part 1

Aquest projecte te la finalitat de començar a treballar amb APIs i fer peticions a un servidor extern. Haurem de fer servir la lògica asincrònica per tal de fer les peticions i mostrar la informació a l'usuari. D'altra banda necessitarem tècniques de treball amb objectes, arrays i en general els seus mètodes per tal de poder filtrar la informació que ens retorna el servidor.

## :books: Objectius

En aquest projecte treballem amb un servidor extern, per tant no tenim un fitxer JSON amb la informació que necessitem. Necessitem fer peticions a un servidor extern. En aquest cas farem servir l'API de StarWars SWAPI. Aquesta API ens permet fer peticions a diferents **endpoints** per tal de rebre la informació que necessitem. Per exemple, si volem rebre la informació de tots els personatges de StarWars, farem una petició a l'endpoint `https://swapi.dev/api/people/`. Si volem rebre la informació d'un personatge en concret, farem una petició a l'endpoint `https://swapi.dev/api/people/1/`. Com podeu veure, a l'endpoint hi afegim un número que correspon a l'ID del personatge que volem rebre. Això ens permet fer peticions a un servidor extern i rebre la informació que necessitem.

Teniu la documentació de l'API a [https://swapi.dev/documentation](https://swapi.dev/documentation).

## Project Structure

El boilerplate facilitat conté els següents fitxers i carpetes:

```
starwars-api-workspace
├── src
│   ├── index.html
│   ├── index.js
│   ├── swapi.js
│   └── styles.css
├── .eslintrc.json
├── package.json
├── package-lock.json
├── README.md
└── tests
    └── swapi.test.js
```

Treballem amb Eslint, Jest i Parcel. Eslint i Jest ja els hem vist en projectes anteriors. Parcel és un _bundler_ que ens permetrà treballar amb mòduls. A més a més, Parcelo substitueix algunes de les característiques de Webpack i Babel que requeríem per transpilar el nostre codi i fer-lo compatible amb els navegadors desitjats. Ara això ho podem fer a través de la configuració de Parcel.

### `src` Folder

Farem servir la carpeta `src` per desar tot el codi del nostre projecte. Aquesta carpeta conté els següents fitxers:

- `index.html`: L'arxiu HTML que es carrega al navegador.
- `index.js`: L'arxiu JavaScript que s'executa al carregar la pàgina.
- `swapi.js`: L'arxiu JavaScript que conté la lògica per fer les peticions a l'API.
- `styles.css`: L'arxiu CSS que conté l'estil de la pàgina.
- `swapi.test.js`: Els testos son orientatius i poden requerir de canvis (s'han generat automàticament) però us recomanem que els feu servir per comprovar que el vostre codi funciona correctament.

### Configuration Files

- `.babelrc`: The configuration file for Babel.
- `.eslintrc.json`: The configuration file for ESLint.
- `package.json`: The configuration file for npm.

## :pencil: Previ!

Abans de res verifica que pots instalar totes les dependències:

```sh
1. Clona el repositori
2. Instal·la les dependència amb `npm install`.
```

En aquesta pràctica treballarem amb la notació ES Modules. Això vol dir que en comptes de fer servir `require` i `module.exports` farem servir `import` i `export`.

### Fetch

D'altra banda comencem a fer ús del Fetch. Hem après el concepte de les promeses i la manera moderna de gestionar-la a través **d'async/await**.

El Fetch és en definitiva una petició (normalment un HTTP GET) que ens permet fer peticions a un servidor extern i esperar la resposta de manera similar a com ho farien les _Promise_. De fet ens retorna una promesa que es resol amb la resposta del servidor. Per exemple, si volem fer una petició a l'endpoint `https://swapi.dev/api/people/` farem:

```js
fetch('https://swapi.dev/api/people/')
  .then((response) => response.json())
  .then((data) => console.log(data));
```

També podem gestionar gestionar el fetch a través d'**async/await**, per exemple:

```js
const getPeople = async () => {
  const response = await fetch('https://swapi.dev/api/people/');
  const data = await response.json();
  console.log(data);
};
```

### JSON

A l'exemple anterior podem veure que la resposta del servidor és un objecte JavaScript. Això és perquè el servidor ens retorna un JSON que ja sabem que és un format de dades que ens permet intercanviar informació entre diferents plataformes.

Quin tipus tipus de dades retorna la funció **.json()**? Ho hauràs de tenir en compte a l'hora de gestionar la informació que ens retorna el servidor.

El mètode .json() retorna una promesa que en cas d'èxit acabarà sent un parsing de la resposta a format text-JSON (https://developer.mozilla.org/en-US/docs/Web/API/Response/json)

### Ús de l'API

Per utilitzar l'API us recomanem fer ús de la consola que es troba a la pàgina d'inici de l'API:

- https://swapi.dev/

S'hi poden realitzar consultes per verificar les dades obtingudes en el desenvolupament. Alhora, hi ha eines més completes, com ara Postman, que permeten emmagatzemar consultes, exportar dades i treballar amb les API de forma més completa, però el seu coneixement no és objecte d'aquesta PAC.

# :rocket: Comencem!

## Peticions a l'API

En aquesta part haureu de crear una sèrie les funcions asíncrones que es detallen a continuació.

**Notes:**

1. S'entén que totes les funcions han de retornar promeses.
2. Aquests valors s'han d'obtenir des de l'API de Star Wars anteriorment presentada (SWAPI).
3. Els exercicis estan concebuts de manera que sigui un desenvolupament progressiu. HEU D'INTENTAR REUTILITZAR EL CODI!!!
4. Podeu fer funcions auxiliars privades, és a dir, funcions que no siguin exportades i que només serveixin per a la implementació de les funcions públiques. Aquestes funcions acostumen a tenir un nom que comença per `_` (underscore). Per ex:

```js
const _compareByEpisodeID = (a, b) => {
  if (a.episode_id < b.episode_id) {
    return -1;
  }
  if (a.episode_id > b.episode_id) {
    return 1;
  }
  return 0;
};
```

### Exercici 1 (Exemple)

Implementar una funció anomenada `getMovieCount()` que retorna la promesa de retornar el número corresponent a la quantitat de pel·lícules hi ha al servidor. Aquesta funció està implementada com exemple.

**Exemple de retorn esperat un cop resolta la promesa:**

```
6
```

### Exercici 2

Implementar una funció anomenada `listMovies()` que retorni una promesa que es resol amb un array d'objectes Film. Aquests objectes han de tenir només 4 atributs públics:

- `name: string`
- `director: string`
- `release: string`
- `episodeID: number`

**Exemple de retorn esperat un cop resolta la promesa:**

```javascript
[
 {
 "name": "A New Hope",
 "director": "George Lucas",
 "release": "1977-05-25",
 "episodeID": 4
 },
 ...
]
```

### Exercici 3

Implementar una funció anomenada `listMoviesSorted()` que retorna una promesa que es resol amb un array que conté els títols de les pel·lícules ordenats alfabèticament (per títol) juntament amb la informació del director, data de llançament i Id d'episodi.

**Exemple de retorn esperat un cop resolta la promesa:**

```javascript
[
  {
    name: 'A New Hope',
    director: 'George Lucas',
    release: '1977-05-25',
    episodeID: 4,
  },
  {
    name: 'Return of the Jedi',
    director: 'Richard Marquand',
    release: '1983-05-25',
    episodeID: 6,
  },
  {
    name: 'The Phantom Menace',
    director: 'George Lucas',
    release: '1999-05-19',
    episodeID: 1,
  },
];
```

### Exercici 4

Implementar una funció anomenada `listEvenMoviesSorted()` que retorna una promesa que es resol amb un array d'objectes Film ordenats per episodeID de forma ascendent. Només s'han de retornar els episodis parells.

**Nota:** Poseu especial atenció als tipus de dades i a la coerció de tipus a JavaScript (la coerció és la conversió automàtica que fa JavaScript d'un tipus de dada a un altre).

**Exemple de retorn esperat un cop resolta la promesa:**

```javascript
[
  {
    name: 'Attack of the Clones',
    director: 'George Lucas',
    release: '2002-05-16',
    episodeID: 2,
  },
  {
    name: 'A New Hope',
    director: 'George Lucas',
    release: '1977-05-25',
    episodeID: 4,
  },
];
```

### Exercici 5

#### Exercici 5.1

Implementar una funció `getMovieInfo(id: string)` que donat un id d'una pel·lícula, ens retorni una promesa que es resol amb un objecte que conté:

- `name: string` → Conté el nom de la pel·lícula.
- `episodeID: number` → Conté el camp episode_id.
- `characters: Array<string>` → Conté un array amb les URL de les que es pot obtenir la informació d'un personatge.

**Exemple de retorn esperat un cop resolta la promesa:**

```javascript
{
 characters: [
 "http://swapi.dev/api/people/1/",
 "http://swapi.dev/api/people/2/",
 "http://swapi.dev/api/people/3/",
 "http://swapi.dev/api/people/4/",
 "http://swapi.dev/api/people/5/",
 ...
 ],
 episodeID: 4,
 name: "A New Hope",
}
```

#### Exercici 5.2

Reescriure la funció `getCharacterName(URL: string)` que donada una url d'un personatge d'una pel·lícula, retorna una promesa que es resol amb el nom del personatge, utilitzant `async` i `await`.

**Exemple de retorn esperat un cop resolta la promesa:**

```javascript
'Luke Skywalker';
```

#### Exercici 5.3

Implementar una funció `getMovieCharacters(id: string)` que donat un id d'una pel·lícula, retorna una promesa que es resol amb un array que conté els noms dels personatges que apareixen a la mateixa pel·lícula.

- Utilitzant `async` i `await` és més intuïtiva.
- La complexitat d'aquest exercici rau en transformar les adreces que ens arriben a l'atribut characters de la pel·lícula en noms.
- Heu d’utilitzar la funció `getCharacterName`.
- Aquí incorporem un nou concepte, el de `Promise.All`. Aquest ens permet executar un array de promeses i esperar a que totes es resolguin. Per exemple: tenim un array amb diferents API que ens retornen un valor. Volem executar totes les API i esperar a que totes es resolguin per poder retornar el resultat. En aquest cas farem servir `Promise.all`:

```javascript
const getValues = async () => {
  const values = await Promise.all([
    fetch('https://swapi.dev/api/people/1/'),
    fetch('https://swapi.dev/api/people/2/'),
    fetch('https://swapi.dev/api/people/3/'),
  ]);
  console.log(values);
};
```

**Exemple de retorn esperat un cop resolta la promesa:**

```javascript
{
  "name": "A New Hope",
  "episodeID": 4,
  "characters": [
    "Luke Skywalker",
    "C-3PO",
    "R2-D2",
    "Darth Vader",
    "Leia Organa",
    "Owen Lars",
    "Beru Whitesun lars",
    "R5-D4",
    "Biggs Darklighter",
    "Obi-Wan Kenobi",
    "Wilhuff Tarkin",
    "Chewbacca",
    "Han Solo",
    "Greedo",
    "Jabba Desilijic Tiure",
    "Wedge Antilles",
    "Jek Tono Porkins",
    "Raymus Antilles"
  ]
}
```

### Exercici 6

Implementar una funció anomenada `getMovieCharactersAndHomeworlds(id: string)` que retorna una promesa que es resol amb un objecte que conté, tan sols, els següents atributs públics:

- `episodeID: Number`, conjté el camp episode_id.
- `name: String` indicant el títol de la pel·lícula.
- `characters: Un array que conté informació sobre els personatges que surten a la pel·lícula.

# Enhorabona!

En la propera pràctica practicarem amb el DOM per mostrar totes aquestes dades a l'usuari amb una interfície gràfica com aquesta:

![StarWars API](https://imgur.com/yRyyayi.png)
