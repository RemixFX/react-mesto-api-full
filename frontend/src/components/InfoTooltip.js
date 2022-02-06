export default function InfoTooltip(props) {
  return(
    <div className={`popup ${props.isOpen ? 'popup_opened' : ''}`}
    onClick={props.onPopupClick}>
      <div className="popup__container">
        <button className="popup__close-button" type="button"
          onClick={props.onClose}>
        </button>
        <img alt="сообщение об ошибке или успешной регистрации" className="popup__image" src={props.image}/>
        <h3 className="popup__heading popup__heading_type_info">{props.title}</h3>
      </div>
    </div>
  )
}
