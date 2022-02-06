function PopupWithForm(props) {
  return (
    <div className={`popup popup_type_${props.name} ${props.isOpen}`}
      onClick={props.onPopupClick}>
      <div className="popup__container">
        <button className="popup__close-button" type="button"
          onClick={props.onClose}>
        </button>
        <h3 className="popup__heading">{props.title}</h3>
        <form noValidate name={props.name} className="form popup__profileEdit" onSubmit={props.onSubmitForm}>
          {props.children}
          <button className={`form__submit-button popup-form__submit-button ${props.class}`}
            type="submit">{props.buttonText}</button>
        </form>
      </div>
    </div>
  )
}

export default PopupWithForm;
