import { useEffect, useState } from 'react';
import './App.css';
import {
  FormControl,
  MenuItem,
  Select
} from '@material-ui/core';



function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  // useEffect
  useEffect(() => {
    // create an async function, make a req to the server, wait for response, use the resp data

      const getCountriesData = async () => {
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }));

            setCountries(countries);
        })
      };
      getCountriesData();
  }, []);

  // when select dropdown option is selected by User
  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    console.log('[You selected]: ', countryCode);
    setCountry(countryCode);
  };

  return (
    <div className="App">

      <div className="app__header">
        <img src="coronavirus-img.png" alt="logo" className="app__logo" />

        <FormControl className="app__dropdown">
          <Select
            variant="outlined"
            value={country}
            onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }

          </Select>
        </FormControl>
      </div>

    </div>
  );
}

export default App;
