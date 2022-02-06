import logo from '../images/logo.svg';
import { Link, useLocation } from 'react-router-dom';

function Header(props) {

  const location = useLocation();

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип место, Россия" />
      <div className="header__container">
        <p className="header__user-email">{props.email}</p>
        {location.pathname === '/signin' && <Link
        to='/signup' className="header__link">Регистрация</Link>}

        {location.pathname === '/signup' && <Link
        to='/signin' className="header__link">Войти</Link>}

        {location.pathname === '/main' && <button type='button'
        className='header__link header__link_type_button' onClick={props.onSignOut}>Выйти</button>}

      </div>

    </header>
  )
};

export default Header;
