import hifetch from 'hifetch';

const ENDPOINT = 'https://swapi.co/api';

const characterLoader = id =>
  hifetch({
    url: `${ENDPOINT}/people/${id}/`,
  })
    .send()
    .catch(res => {
      throw new Error(res.message);
    });

const starshipLoader = id =>
  hifetch({
    url: `${ENDPOINT}/starships/${id}/`,
  })
    .send()
    .catch(res => {
      throw new Error(res.message);
    });

const filmLoader = id =>
  hifetch({
    url: `${ENDPOINT}/films/${id}/`,
  })
    .send()
    .catch(res => {
      throw new Error(res.message);
    });

const linkLoader = url =>
  hifetch({
    url,
  })
    .send()
    .catch(res => {
      throw new Error(res.message);
    });

const linksPropLoader = (parent, propName) =>
  Promise.all(parent[propName].map(url => linkLoader(url)));

const resolvers = {
  Query: {
    character: (_, { id }) => characterLoader(id),
    starship: (_, { id }) => starshipLoader(id),
    film: (_, { id }) => filmLoader(id),
  },
  Character: {
    starships: character => linksPropLoader(character, 'starships'),
    films: character => linksPropLoader(character, 'films'),
  },
  Starship: {
    characters: starship => linksPropLoader(starship, 'characters'),
    films: starship => linksPropLoader(starship, 'films'),
  },
  Film: {
    characters: film => linksPropLoader(film, 'characters'),
    starships: film => linksPropLoader(film, 'starships'),
  },
};

export default resolvers;
