
import { Link } from 'react-router-dom';
import { IoLogoApple } from 'react-icons/io';

const Navbar = () => {
  const navlinks = [
    {
      name: 'Home',
      link: '/',
    },
    {
      name: 'Learn More',
      link: '/learn',
    },
    {
      name: 'About',
      link: '/about',
    },
    {
      name: 'API Docs',
      link: '/apidocs',
    },
  ];
  return (
    <div className='text-gray-700 h-20 w-full z-10 flex justify-between items-center min-h-[65px] px-8' >
      <div className='flex justify-center items-center gap-2'>
        <IoLogoApple className='logo w-8 h-8' />
        {/* <img src={logo} alt="Logo" className="object-contain h-10 w-10" /> */}
        <Link to="/" className='text-2xl font-bold'>AI-paca</Link>
      </div>
      <div className='flex gap-8 items-center font-semibold text-md'>
        {navlinks.map((link) => (
          <Link to={link.link} key={link.name}>

            <div className='hover:underline hover:text-primary-dark-color'>{link.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;