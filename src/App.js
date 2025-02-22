import { MultiSelectProvider  } from './context/MultiSelectContext';
import MultiSelect from './components/MultiSelect/MultiSelect';
import {countries} from './utilities/data';
import './App.css';
import Results from './components/Results/Results';

const COUNTRY_DATA = countries;
const MAX_ITEMS = 5;

function App() {
  return (
    <div className="main-container">
      <MultiSelectProvider initialState={COUNTRY_DATA} maxItems={MAX_ITEMS}>
        <h1 className="header">Country Selector</h1>
        <MultiSelect />
        <Results />
      </MultiSelectProvider>
    </div>
  );
}

export default App;
