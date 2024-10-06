import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function Filters({
  animals,
  cities,
  selectedAnimal,
  selectedCity,
  onAnimalChange,
  onCityChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4 z-10">
      <div className="flex flex-col">
        <label className="font-bold mb-1">Animal:</label>
        <select
          value={selectedAnimal}
          onChange={e => onAnimalChange(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {animals.map(animal => (
            <option key={animal} value={animal}>
              {animal}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="font-bold mb-1">City:</label>
        <select
          value={selectedCity}
          onChange={e => onCityChange(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {cities.map(city => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col ">
        <label className="font-bold mb-1">Start Date:</label>
        <DatePicker
          portalId="root"
          selected={startDate}
          onChange={onStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          isClearable
          viewBox="0 0 48 48"
          className="border rounded px-2 py-1 z-10"
        />
      </div>
      <div className="flex flex-col">
        <label className="font-bold mb-1">End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={onEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          isClearable
          popperPlacement="bottom-start"
          className="border rounded px-2 py-1"
        />
      </div>
    </div>
  );
}

export default Filters;
