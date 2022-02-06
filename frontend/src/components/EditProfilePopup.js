import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  function handleChangeName(evt) {
    setName(evt.target.value)
  }
  function handleChangeDescription(evt) {
    setDescription(evt.target.value)
  }

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm title="Редактировать профиль" name={props.name} buttonText='Сохранить'
      isOpen={props.isOpen ? 'popup_opened' : ''} onSubmitForm={handleSubmit}
      onClose={props.onClose} onPopupClick={props.onPopupClick}>
      <fieldset className="form__field">
        <input type="text" autoComplete="off" name="name" id="name"
          required minLength="2" maxLength="40" className="form__input popup-form__input"
          value={name} onChange={handleChangeName} />
        <span id="name-error" className="form__error"></span>
        <input type="text" autoComplete="off" name="about" id="about"
          required minLength="2" maxLength="200" className="form__input popup-form__input"
          value={description} onChange={handleChangeDescription} />
        <span id="about-error" className="form__error"></span>
      </fieldset>
    </PopupWithForm>
  )
}

export default EditProfilePopup;
