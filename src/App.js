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
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import  {sortData } from './util';
import "leaflet/dist/leaflet.css";


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  
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

            const sortedData = sortData(data);
            setTableData(sortedData);
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
        <span><h2 className="primary-color">Covid-19 Tracker</h2></span>

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
            <InfoBox 
                title="Cases" 
                cases={countryInfo.todayCases} 
                total={countryInfo.cases} />

            <InfoBox 
                title="Recovered" 
                cases={countryInfo.todayRecovered} 
                total={countryInfo.recovered} />

            <InfoBox 
                title="Deaths" 
                cases={countryInfo.todayDeaths} 
                total={countryInfo.deaths} />
      </div>


      {/* Map */}
      <Map />

      </div>

     <Card className="app__right">
            <CardContent>
               <h3 className="primary-color">Live cases by country</h3>
              <Table countries={tableData} />

               <h3 className="primary-color">Worldwide new cases</h3>
               <LineGraph />
            </CardContent>
     </Card>

    </div>
  );
}

export default App;
