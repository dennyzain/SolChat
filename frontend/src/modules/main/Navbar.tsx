import LogoDesktop from "../../assets/logo-and-text.svg";
function Navbar() {
  return (
    <nav className="flex sticky top-0 h-[50px] z-50 bg-white/50 backdrop-blur-sm justify-between items-center py-2 px-9">
      <div className="w-[90%] mx-auto flex justify-between items-center lg:w-[60%]">
        <img src={LogoDesktop} alt="Logo" width={200} height={200} />

      </div>
    </nav>
  );
}

export default Navbar;
