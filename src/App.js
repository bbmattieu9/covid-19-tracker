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
import  {sortData, prettyStatFormat } from './util';
import "leaflet/dist/leaflet.css";


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng:-40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');


  
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
            setMapCountries(data);
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
      // console.log('[Fetch country detail]:', data);
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(13);
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
              isRed
              active={casesType === 'cases'}
              onClick={(e) => setCasesType('cases')}
                title="Cases" 
                cases={prettyStatFormat(countryInfo.todayCases)} 
                total={prettyStatFormat(countryInfo.cases)} />

            <InfoBox 
                active={casesType === 'recovered'}
                onClick={(e) => setCasesType('recovered')}
                title="Recovered" 
                cases={prettyStatFormat(countryInfo.todayRecovered)} 
                total={prettyStatFormat(countryInfo.recovered)} />

            <InfoBox 
                isRed
                active={casesType === 'deaths'}
                onClick={(e) => setCasesType('deaths')}
                title="Deaths" 
                cases={prettyStatFormat(countryInfo.todayDeaths)} 
                total={prettyStatFormat(countryInfo.deaths)} />
      </div>


      {/* Map */}
      <Map 
      casesType={casesType}
      countries={mapCountries}
      center={mapCenter}
      zoom={mapZoom}
      />

      </div>

     <Card className="app__right">
            <CardContent>
               <h3 className="primary-color">Live cases by country</h3>
              <Table countries={tableData} />

               <h3 className="primary-color line_graphTitle">Worldwide new {casesType}</h3>
               <LineGraph className="app__graph" casesType={casesType} />
            </CardContent>
     </Card>

    </div>
  );
}

export default App;
