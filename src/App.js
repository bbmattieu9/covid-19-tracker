import { 
  FormControl,
  MenuItem, 
  Select } from '@material-ui/core';
import './App.css';
// import logo from '../public/coronavirus-img.png';

function App() {
  return (
    <div className="App">
      <img src="coronavirus-img.png" alt="logo"/>
     <h1>Covid-19-Tracker</h1>
     <FormControl className="app__dropdown">
        <Select
          variant="outlined"
          value="abc"
        >
          <MenuItem value="worldwide">Worldwide</MenuItem>

        </Select>
     </FormControl>
    </div>
  );
}

export default App;
