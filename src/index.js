import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountrie, fetchCountries } from './fetchCountries';

const countriesSearch = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const notifyOptions = {
  showOnlyTheLastOne: true,
  cssAnimationStyle: 'from-right',
  width: '360px',
};

const DEBOUNCE_DELAY = 300;

const getCountriesInfo = event => {
  const name = event.target.value.trim();
  console.log(name);

  if (!name) {
    countriesList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(name)
    .then(data => {
      console.log(data);
      console.log(data.length);
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length === 1) {
        const markupCountryInfo = renderCountryInfo(data);
        countryInfo.innerHTML = markupCountryInfo;
        return;
      }
      const markupCountriesList = renderCountriesList(data);
      countriesList.innerHTML = markupCountriesList;
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure(
        'Oops, there is no country with that name',
        notifyOptions
      );
    });
};

countriesSearch.addEventListener(
  'input',
  debounce(getCountriesInfo, DEBOUNCE_DELAY)
);

const renderCountryInfo = data => {
  return data
    .map(
      ({
        name,
        capital,
        population,
        flags,
        languages,
      }) => `<div class="country-info__flag"><img class="country-info__img" src="${
        flags.svg
      }"></div>
    <h2>${name.official}</h2>
    <p><span>Capital: </span>${capital}</p>
    <p><span>Population: </span>${population}</p>
    <p><span>Languages: </span>${Object.values(languages)}</p>`
    )
    .join('');
};

const renderCountriesList = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li class="country__item">
        <img class="country__image" src="${flags.svg}/>
        <p class="country__name">${name.common}</p>
        </li>`
    )
    .join('');
};
