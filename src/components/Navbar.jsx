/* eslint-disable */
import styled from '@emotion/styled';
import {NavLink} from 'react-router-dom';

function Navbar() {
    return (
        <div>
          <Nav>
                <NavLink to={'/'}>ATLAS GRID</NavLink>
                <NavLink to={'/About/'}>About</NavLink>
          </Nav>
        </div>
    )
}






export default Navbar;