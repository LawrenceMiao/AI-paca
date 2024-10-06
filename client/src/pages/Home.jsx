import heroImage from "../assets/image.jpg";
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
    <div className="mb-32">

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



      <div
        className="mt-40 flex lg:flex-row sm:flex-col sm:gap-20 items-center justify-center md:justify-between mx-auto max-w-7xl py-12 px-4"
      >
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ ease: "easeOut", duration: 1 }}
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

        <div className="md:w-1/2 my-20 drop-shadow-lg">
          <motion.img
            className="object-cover object-center rounded-lg shadow-regular"
            src={heroImage}
            alt="Hero Image"
            initial={{ x: 500, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 1 }}
          />
        </div>
      </div>
      <motion.div

        src={heroImage}
        alt="Hero Image"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut", duration: 1 }}

        className="flex flex-row items-center mx-20 my-38">
        <p className="text-justify text-2xl text-gray-500 sm:text-md w-full leading-tight">
          In a world where every small action counts, making an impact on ecology can be as simple as snapping a photo.
          Download our app today to join a community of young change-makers dedicated to contributing to meaningful research.
          Our mission is to empower adolescents to observe and documenttheir surroundings, turning everyday moments into
          valuable data that can help protect our planet.
          With just a few taps on the phone, you can play a vital role in the fight for a healthier environment and support ongoing research!
        </p>
      </motion.div>

    </div>
  );

};

export default Home;