function ImagePopup(props) {
  return (
    <div className={`popup popup-card ${props.isOpen}`} onClick={props.onPopupClick}>
      <div className="popup-card__container">
        <div className="popup-card__image-container">
          <img className="popup-card__image" src={props.card.link} alt={props.card.name} />
          <button className="popup__close-button popup__close-button_type_image-popup"
            type="button" onClick={props.onClose}>
          </button>
        </div>
        <span className="popup-card__image-name">{props.card.name}</span>
      </div>
    </div>
  )
}

export default ImagePopup;
