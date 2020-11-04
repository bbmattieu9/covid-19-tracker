import { useEffect, useState } from 'react';
import './App.css';
import {
  Card,
  FormControl,
  MenuItem,
  Select,
  CardContent
} from '@material-ui/core';

import InfoBox from './InfoBox';
import Map from './Maps';


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});

  
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

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((res) => res.json())
    .then((data) => {
      setCountryInfo(data);
    });
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    // console.log('[You selected]: ', countryCode);
    setCountry(countryCode); 

    const url = countryCode === 'worldwide'
     ? 'https://disease.sh/v3/covid-19/all' 
     : `https://disease.sh/v3/covid-19/countries/${countryCode}?strict=true`;

    await fetch(url)
    .then(response => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);
    });
  };

  return (
    <div className="App">
      <div className="app__left">
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

      {/* App Info Boxes */}
      <div className="app__stats">
            <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />

            <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />

            <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
      </div>


      {/* Map */}
      <Map />

      </div>

     <Card className="app__right">
            <CardContent>
               <h3>Live cases by country</h3>


               <h3>Worldwide new cases</h3>
            </CardContent>
     </Card>

    </div>
  );
}

export default App;
