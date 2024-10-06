import { useState, useEffect } from 'react';

import axios from 'axios';
import Filters from '../components/Filters';
import MapComponent from '../components/MapComponents';
import DataVisualization from '../components/DataVisualization.jsx';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';

function Visualization() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
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

          // Extract unique animals and cities for filters
          const animalsSet = new Set();
          const citiesSet = new Set();
          data.forEach(item => {
            animalsSet.add(item.animal_name);
            citiesSet.add(item.city);
          });
          setAnimals(['all', ...Array.from(animalsSet)]);
          setCities(['all', ...Array.from(citiesSet)]);
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

    if (startDate && endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredData(filtered);
  }, [selectedAnimal, selectedCity, startDate, endDate, data]);

  const handleAnimalChange = (animal) => {
    setSelectedAnimal(animal);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const downloadData = (format) => {
    if (!filteredData.length) {
      alert('data len is 0');
      return;
    }

    if (format === 'csv') {
      const headers = Object.keys(filteredData[0]).join(',');
      const rows = filteredData.map(item =>
        Object.values(item).map(val => `"${val}"`).join(',')
      );
      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'data.csv');
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(filteredData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      saveAs(blob, 'data.json');
    } else if (format === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, 'data.xlsx');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-9  ">Animal Sightings Map</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className='flex flex-row justify-between items-end'>


        <Filters
          animals={animals}
          cities={cities}
          selectedAnimal={selectedAnimal}
          selectedCity={selectedCity}
          onAnimalChange={handleAnimalChange}
          onCityChange={handleCityChange}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />

        <div className="flex flex-wrap gap-2 mb-4">
          <motion.button
            onClick={() => downloadData('csv')}
            className="bg-blue-400 hover:bg-slate-700 text-white py-2 px-4 rounded"
            initial={{ scale: 1 }}
            whileHover={{ scale: 0.95 }}
          >
            Download CSV
          </motion.button>
          <motion.button
            onClick={() => downloadData('json')}
            className="bg-blue-400 hover:bg-slate-700 text-white py-2 px-4 rounded"
            initial={{ scale: 1 }}
            whileHover={{ scale: 0.95 }}
          >
            Download JSON
          </motion.button>
          <motion.button
            onClick={() => downloadData('excel')}
            className="bg-blue-400 hover:bg-slate-700 text-white py-2 px-4 rounded"
            initial={{ scale: 1 }}
            whileHover={{ scale: 0.95 }}
          >
            Download Excel
          </motion.button>
        </div>

      </div>
      <MapComponent data={filteredData} />
      <DataVisualization data={filteredData} selectedCity={selectedCity} />
    </div>
  );
}

export default Visualization;
