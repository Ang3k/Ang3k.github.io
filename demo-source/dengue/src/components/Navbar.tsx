import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          Dengue Sense Classifier
        </NavLink>

        <nav className="navbar-links">
          <NavLink to="/" end className="navbar-link">
            Home
          </NavLink>

          <NavLink to="/triagem" className="navbar-link">
            Triagem
          </NavLink>

          <NavLink to="/pipeline" className="navbar-link">
            Pipeline
          </NavLink>

          <NavLink to="/graphics" className="navbar-link">
            Panorama Epidemiológico
          </NavLink>

          <a className="navbar-link navbar-link-external" href="../../projetos/dengue/">
            Estudo de caso ↗
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
