
import { Link, NavLink } from 'react-router-dom';
import logo from "../assets/Screenshot 2024-10-06 123129.png"


const Navbar = () => {
  const navlinks = [
    {
      name: 'Home',
      link: '/',
    },
    {
      name: 'Vizualize',
      link: '/viz',
    },
    {
      name: 'About',
      link: '/about',
    },
  ];
  return (
    <div className='text-gray-900  h-20 w-full z-10 flex justify-between items-center min-h-[65px] px-8' >
      <div className='flex justify-center items-center gap-2'>
        <NavLink to="/">
          <img src={logo} alt="Logo" className="object-contain h-28 w-28" />
        </NavLink>
      </div>
      <div className='flex gap-8 items-center font-semibold text-md'>
        {navlinks.map((link) => (
          <Link to={link.link} key={link.name}>

            <div className='hover:text-blue-400'>{link.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;