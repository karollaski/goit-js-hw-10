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

// ----------------------------------------------------------
const getUniqueCountryInfo = event => {
  const commonCountryName = event.target.textContent;
  fetchCountries(commonCountryName)
    .then(data => {
      data.find(element => {
        if (element.name.common === commonCountryName) {
          countryInfo.classList.add('show-elements');
          const markupCountryInfo = renderCountryInfo([element]);
          countryInfo.innerHTML = markupCountryInfo;
          countriesList.innerHTML = '';
          return;
        }
      });
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure(
        'Oops, there is no country with that name',
        notifyOptions
      );
    });
};
countriesList.addEventListener('click', getUniqueCountryInfo);

// ----------------------------------------------------------

const getCountriesInfo = event => {
  const name = event.target.value.trim();

  if (!name) {
    countriesList.classList.remove('show-elements');
    countryInfo.classList.remove('show-elements');
    countriesList.innerHTML = '';
    countryInfo.innerHTML = '';

    return;
  }
  fetchCountries(name)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length === 1) {
        countryInfo.classList.add('show-elements');
        const markupCountryInfo = renderCountryInfo(data);
        countryInfo.innerHTML = markupCountryInfo;
        countriesList.innerHTML = '';
        return;
      }
      countriesList.classList.add('show-elements');
      const markupCountriesList = renderCountriesList(data);
      countriesList.innerHTML = markupCountriesList;
      countryInfo.innerHTML = '';
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
      }"/></div>
    <h2>${name.official}</h2>
    <p><span class="info-item">Capital: </span>${capital}</p>
    <p><span class="info-item">Population: </span>${population}</p>
    <p><span class="info-item">Languages: </span>${Object.values(
      languages
    )}</p>`
    )
    .join('');
};

const renderCountriesList = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li class="country__item">
        <img class="country__image" src="${flags.svg}"/>
        <p class="country__name">${name.common}</p>
        </li>`
    )
    .join('');
};
