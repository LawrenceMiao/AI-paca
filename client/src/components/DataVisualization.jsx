import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from "framer-motion"
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DataVisualization({ data, selectedCity }) {
  if (!data.length) {
    return <p>No data available for visualization.</p>;
  }

  const animalCounts = {};
  data.forEach(item => {
    if (!animalCounts[item.animal_name]) {
      animalCounts[item.animal_name] = 0;
    }
    animalCounts[item.animal_name]++;
  });

  const barChartData = {
    labels: Object.keys(animalCounts),
    datasets: [
      {
        label: 'Count',
        data: Object.values(animalCounts),
        backgroundColor: '#ADD8E6',
      },
    ],
  };

  // Prepare data for time series chart (sightings over time)
  const dateCounts = {};
  data.forEach(item => {
    const date = new Date(item.created_at).toISOString().split('T')[0];
    if (!dateCounts[date]) {
      dateCounts[date] = 0;
    }
    dateCounts[date]++;
  });

  const sortedDates = Object.keys(dateCounts).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const lineChartData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Sightings',
        data: sortedDates.map(date => dateCounts[date]),
        borderColor: '#ADD8E6',
        backgroundColor: 'rgba(125, 249, 255, 0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: ` ${selectedCity !== 'all' ? `in ${selectedCity}` : ''}`,
      },
    },
  };

  // Line chart options
  const lineChartOptions = {
    responsive: true,

    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${selectedCity !== 'all' ? `in ${selectedCity}` : ''}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
        },
      },
    },
  };

  return (
    <div className="my-14">
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1.7,
          ease: 'easeOut'
        }}
        className='my-24'>
        <h2 className=" text-2xl font-bold mb-2 text-center">
          Animal Distribution {selectedCity !== 'all' ? `in ${selectedCity}` : ''}
        </h2>
        <div className="w-full mb-16 h-96">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </motion.div>

      <motion.div
        initial={{ x: -10, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1.7,
          ease: 'easeOut'
        }}
        className='my-24'>
        <h2 className="text-2xl font-bold mb-2 text-center">
          Sightings Over Time {selectedCity !== 'all' ? `in ${selectedCity}` : ''}
        </h2>
        <div className="w-full h-96">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </motion.div>
    </div>
  );
}

export default DataVisualization;
