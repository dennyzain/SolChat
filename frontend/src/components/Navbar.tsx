import LogoDesktop from "../assets/logo-desktop.svg";
import Logo from "../assets/logo.svg";

function Navbar() {
  return (
    <nav className="flex w-[90%] sticky top-0 h-[50px] z-50 mx-auto justify-between items-center px-9 backdrop-blur-sm rounded-full">
      <img src={LogoDesktop} alt="Logo" className="hidden md:block" />
      <img src={Logo} alt="Logo" className="block md:hidden" />
    </nav>
  );
}

export default Navbar;
