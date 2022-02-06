import React from "react";
import { Link } from 'react-router-dom';

function Register(props) {

  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');

  function handleChangePassword(evt) {
    setPassword(evt.target.value)
  }
  function handleChangeEmail(evt) {
    setEmail(evt.target.value)
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onRegister(password, email)
  }

  return (
    <section className="registration">
      <h2 className="registration__heading">Регистрация</h2>
      <form className="form registration-form" name="registration"
        onSubmit={handleSubmit}>
        <input type="email" autoComplete="off" name="email" id="email"
          placeholder="Email" required className="form__input registration-form__input"
          value={email} onChange={handleChangeEmail} />
        <span id="email-error" className="form__error"></span>
        <input type="text" autoComplete="off" name="password" id="password"
          required minLength="3" maxLength="21"
          className="form__input registration-form__input" placeholder="Пароль"
          value={password} onChange={handleChangePassword} />
        <span id="password-error" className="form__error"></span>
        <button className="form__submit-button registration-form__submit-button
         registration-form__submit-button_disabled">Зарегистрироваться</button>
        <div className="registration-form__signin">
          <p className="registration-form__signin-heading" >Уже зарегистрированы?</p>
          <Link to="/sign-in" className="registration-form__login-link">Войти</Link>
        </div>
      </form>
    </section>
  )
}

export default Register;
