import pec3 from './pec3/pec3';

console.log('Benvingut a MP6 de DAW!');

// Init basic functions
pec3.setMovieHeading(1, '.movie__title', '.movie__info', '.movie__director');
pec3.initMovieSelect('#select-movie');
pec3.setMovieSelectCallbacks();
pec3.deleteAllCharacterTokens();
pec3.addChangeEventToSelectHomeworld();
