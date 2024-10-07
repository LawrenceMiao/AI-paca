import { useState, useEffect } from 'react';
import axios from 'axios';
import Filters from '../components/Filters';
import MapComponent from '../components/MapComponents';
import DataVisualization from '../components/DataVisualization.jsx';


function Visualization() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/all_data');
        const data = response.data;

        if (data.message) {
          setError(data.message);
        } else {
          setData(data);
          setFilteredData(data);

          // Extract unique animals, cities, and states for filters
          const animalsSet = new Set();
          const citiesSet = new Set();
          const statesSet = new Set();
          data.forEach(item => {
            animalsSet.add(item.animal_name);
            citiesSet.add(item.city);
            statesSet.add(item.state);
          });
          setAnimals(['all', ...Array.from(animalsSet)]);
          setCities(['all', ...Array.from(citiesSet)]);
          setStates(['all', ...Array.from(statesSet)]);
        }
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = data;

    if (selectedAnimal !== 'all') {
      filtered = filtered.filter(item => item.animal_name === selectedAnimal);
    }

    if (selectedCity !== 'all') {
      filtered = filtered.filter(item => item.city === selectedCity);
    }

    if (selectedState !== 'all') {
      filtered = filtered.filter(item => item.state === selectedState);
    }

    if (startDate && endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredData(filtered);
  }, [selectedAnimal, selectedCity, selectedState, startDate, endDate, data]);

  const handleAnimalChange = (animal) => {
    setSelectedAnimal(animal);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  // (Download logic here, remains unchanged)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-2 text-teal-600">Animal Sightings Map</h1>
      <p className="mb-9 text-md text-slate-700 text-center">
        Visualize the data using our interactive map and filter by animal, city, state, and date. Download data in CSV, JSON, or EXCEL format.
      </p>
      {error && <p className="text-red-500">{error}</p>}
      <div className='flex lg:flex-row md:flex-col sm:flex-col sm:items-center lg:items-end justify-between'>
        <Filters
          animals={animals}
          cities={cities}
          states={states}
          selectedAnimal={selectedAnimal}
          selectedCity={selectedCity}
          selectedState={selectedState}
          onAnimalChange={handleAnimalChange}
          onCityChange={handleCityChange}
          onStateChange={handleStateChange}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
        {/* (Download buttons remain unchanged) */}
      </div>
      <MapComponent data={filteredData} />
      <DataVisualization data={filteredData} selectedCity={selectedCity} />
    </div>
  );
}

export default Visualization;
