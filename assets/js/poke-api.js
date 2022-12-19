
const pokeApi = {}

async function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    pokemon.species = await getPokemonsSpecies(pokeDetail.species.url, "genus");
    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;
  
    const abilities = pokeDetail.abilities.map(
      (abilitySlot) => abilitySlot.ability.name
    );
  
    pokemon.pokeballUrl = "https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
  
    pokemon.abilities = abilities;


    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

function getPokemonsSpecies(url, variavel) {
    return fetch(url)
      .then((response) => response.json())
      .then((species) => species.genera[7])
      .then((speciesGenus) => speciesGenus[variavel]);
  }
