import { motion } from 'framer-motion';
const SectionAbout = (props) => {
  return (
    <>
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1.7,
          ease: 'easeOut'
        }}
        className='flex flex-col items-center justify-evenly lg:mx-[250px] md:mx-[1500px]  sm:mx-[100px] mb-48'>
        <div className='md:mb-8 sm:text-center sm:mb-8'>
          <div className='flex flex-row items-center justify-center'>
            <h4 className='text-[4rem] font-semibold mb-4 text-center   w-28 h-28'>{props.num}</h4>

          </div>
          <div className="flex flex-col items-center mb-8">
            <h4 className='text-3xl  text-primary-dark-color  font-bold tracking-tight  mb-2'>{props.title}</h4>
            <div className=' bg-gradient-to-r from-blue-500 to-slate-800 w-[250px] h-1  drop-shadow-lg'>&nbsp;</div>
            <p className='text-sm uppercase font-bold  lg:px-0 lg:pr-2 mb-1 text-teal-600 my-2'> {props.info}
            </p>
          </div>

          <p className='text-lg  lg:px-0 lg:pr-2 mb-1'>{props.desc}</p>

        </div>

        <div className='flex items-center drop-shadow-lg'>
          <div className='w-[400px] h-72 rounded-md  shadow-regular'>
            <img className='w-full h-full  rounded-md' src={props.pic} alt="Image made by Storyset" />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SectionAbout;