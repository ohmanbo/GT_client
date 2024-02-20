/* eslint-disable */
import styled from '@emotion/styled';
import {NavLink} from 'react-router-dom';

function Navbar() {
    return (
        <Nav>
          <StyledNavLink to={'/'}>ATLAS GRID</StyledNavLink>
          <StyledNavLink to={'/About/'}>About</StyledNavLink>
        </Nav>
        
    )
}



const Nav = styled.nav`
  
  width: 100%;
  height: 50px;
  padding: 0px;
  margin: 0;

  display: flex;
  text-decoration: none;
  background-color: #050505;
  border-bottom: 4px solid #000;

  margin-left: 50px;
  justify-content: left; // 가로 방향 중앙 정렬
  align-items: center; // 세로 방향 중앙 정렬
  
  
`;


const StyledNavLink = styled(NavLink)`

  width: auto;
  color: #aaa; // 링크의 색상
  padding: 15px; // 패딩
  
  font-size: 15px;
  font-family: 'Helvetica Neue',Helvetica;
  
  
  text-decoration: none; // 텍스트 꾸밈 제거
  align-items: center;
  justify-content: center;

  &:hover {
    color: #4caf50; // 호버 상태일 때 색상 변경
  }

  &.active {
    color: #FFF;
    background-color: rgb(43, 126, 33);
  }
  
`;

export default Navbar;