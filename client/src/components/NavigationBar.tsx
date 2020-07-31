import React from 'react';
import { useHistory } from 'react-router-dom';
import '../assets/css/navigationbar.css';
import { Search } from './Search';

interface Props {
  rightItems?: React.ReactNode;
}

function NavigationBar(props: Props) {
  const history = useHistory();

  return (
    <>
      <nav className="navbar">
        <div>
          <span onClick={() => history.push('/home')} />
          <Search />
        </div>
        <div>{props.rightItems}</div>
      </nav>
      <div className="navbar-padding" />
    </>
  );
}

export default NavigationBar;
