import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopups(props) {
  const avatarRef = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onUpdateAvatar({
      avatar: avatarRef.current.value
    });
  }

  React.useEffect(() => {
    avatarRef.current.value = '';
  }, [props.isOpen]);

  return (
    <PopupWithForm title="Обновить аватар" name={props.name} buttonText='Сохранить'
      isOpen={props.isOpen ? 'popup_opened' : ''} onSubmitForm={handleSubmit}
      onClose={props.onClose} onPopupClick={props.onPopupClick}>
      <fieldset className="form__field">
        <input type="url" autoComplete="off" name="avatar" id="avatar" placeholder="Ссылка на картинку"
          required className="form__input popup-form__input"
          ref={avatarRef} />
        <span id="avatar-error" className="form__error"></span>
      </fieldset>
    </PopupWithForm>
  )
}

export default EditAvatarPopups;
