import heroImage from "../assets/ss.png";
import { Link } from "react-router-dom";
import aipaca from "../assets/aipaca.gif"
import { useRef, useEffect } from "react";
import { motion } from 'framer-motion';

const Home = () => {
  const gifRef = useRef();

  //Gif replay - doesn't just replay automatically
  useEffect(() => {
    const interval = setInterval(() => {
      if (gifRef.current) {
        gifRef.current.src = "";
        gifRef.current.src = aipaca;
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>

      {/* Landing GIF Animation */}
      <motion.div
        className="flex flex-row justify-center"
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1.5,
          ease: 'easeOut'
        }}

      >
        <img ref={gifRef} src={aipaca} alt="A looping GIF" />
      </motion.div>


      {/* Content Section with Scroll Animation */}
      <div
        className="my-64 flex lg:flex-row sm:flex-col sm:gap-20 items-center justify-center md:justify-between mx-auto max-w-7xl py-12 px-4"
      >
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ ease: "easeOut", duration: 1.5 }}
          className="md:w-1/2 text-center md:text-left pr-2">

          <p className="font-bold uppercase my-2 pl-2 text-teal-600">Data for good</p>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-6xl">
            AI-PACA
          </h1>
          <p className="mt-3 text-2xl text-gray-500 sm:mt-5 sm:text-md sm:max-w-xl sm:mx-auto md:mt-5 lg:mx-0">
            Get the data you need for your next research project on animals. Or, help the ecology community by contributing photos!
          </p>

          <div className="mt-5 sm:mt-8 sm:flex sm:justify-center md:justify-start">
            <div className="rounded-md shadow drop-shadow-lg">
              <Link
                to="/about"
                className="w-full flex items-center justify-center font-semibold px-4 py-2 border border-transparent text-base rounded-md text-black hover:text-blue-400 md:py-2 md:text-lg md:px-2"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-3 sm:mt-0 sm:ml-3 drop-shadow-md">
              <Link
                to="/viz"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-semibold rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 md:py-2 md:text-lg md:px-2"
              >
                Visualize Data
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="md:w-1/2 mt-10 drop-shadow-lg">
          <motion.img
            className="object-cover object-center rounded-lg shadow-regular"
            src={heroImage}
            alt="Hero Image"
            initial={{ x: 500, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 1.5 }}
          />
        </div>
      </div>
    </div>
  );

};

export default Home;