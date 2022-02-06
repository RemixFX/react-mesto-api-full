import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);

  // отображать ли кнопку удаления карточки?
  const isOwn = props.card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = (
    `element__delete-button ${isOwn ? 'element__delete-button' : 'element__delete-button_disabled'}`
  );

  // отображать ли свой лайк на карточке?
  const isLiked = props.card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = (
    `element__like-button ${isLiked ? 'element__like-button_type_active' : 'element__like-button'}`
  );

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card)
  }

  return (
        <article className="element">
          <img className="element__image" src={props.card.link} alt={props.card.name}
            onClick={handleClick} />
          <button className={cardDeleteButtonClassName} type="button"
            onClick={handleDeleteClick}></button>
          <div className="element__description">
            <h2 className="element__name">{props.card.name}</h2>
            <div className="element__like-container">
              <button className={cardLikeButtonClassName} type="button"
                onClick={handleLikeClick}></button>
              <span className="element__like-value">{props.card.likes.length}</span>
            </div>
          </div>
        </article>
  )
}

export default Card;
