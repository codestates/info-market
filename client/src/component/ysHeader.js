import logo from '../images/logo.png';
import '../css/Header.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import UserMenu from './UserMenu';
import styled from 'styled-components';

const Li = styled.li`
  font-size: 1.2rem;
`;

function Header() {
  // const test = useSelector((state) => state);

  /* 반응형 상태에서 icon 누를시 메뉴 보이고, 일반적으론 안보이게하기 */
  const [isOpen, setIsOpen] = useState(false);

  const handleBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="header-container">
      <nav className="header-navbar">
        <div className="header-logo">
          <FontAwesomeIcon
            icon={faBars}
            className="header-faBars"
            onClick={handleBar}
          />
          <NavLink to="/">
            <img
              src={logo}
              alt="logo "
              className="header-logo"
              style={{ minWidth: '200px' }}
            />
          </NavLink>
        </div>
        <ul className={isOpen ? 'header-menu open' : 'header-menu'}>
          <NavLink
            to="/main"
            style={{ color: 'inherit', textDecoration: 'inherit' }}
          >
            <Li>메인페이지</Li>
          </NavLink>
          <NavLink
            to="/freeboard"
            style={{ color: 'inherit', textDecoration: 'inherit' }}
          >
            <Li>무료 정보 게시판</Li>
          </NavLink>
          <NavLink
            to="/paidboard"
            style={{ color: 'inherit', textDecoration: 'inherit' }}
          >
            <Li>유료 정보 게시판</Li>
          </NavLink>
        </ul>
        <ul className="header-info">
          <UserMenu />
        </ul>
      </nav>
      <hr />
    </div>
  );
}
export default Header;
