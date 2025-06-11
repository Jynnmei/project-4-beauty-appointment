import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

const NavBarVendor = () => {
  return (
    <header className={styles.navbar}>
      <nav>
        <ul>
          <li>
            <NavLink
              className={(navData) => (navData.isActive ? styles.active : "")}
              to="/manageServices"
            >
              Manage Services
            </NavLink>
          </li>
          <li>
            <NavLink
              className={(navData) => (navData.isActive ? styles.active : "")}
              to="/appointmentsDetails"
            >
              Appointments Details
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBarVendor;
