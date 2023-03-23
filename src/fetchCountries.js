const fetchCountries = name => {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=,name,official,capital,languages,flags,population`
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.status);
  });
};
export { fetchCountries };
