import React from 'react';
import Card from './Card.js';
import Footer from './Footer';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);
  return (
    <main className="content">
      <section className="profile">
        <div className="profile__info">
          <img className="profile__avatar" src={currentUser.avatar} alt="" />
          <button className="profile__avatar-button" type="button"
            onClick={props.onEditAvatar}></button>
          <div className="profile__info-block">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button className="profile__edit-button" type="button"
              onClick={props.onEditProfile}></button>
            <p className="profile__job">{currentUser.about}</p>
          </div>
        </div>
        <button className="profile__add-button" type="button"
          onClick={props.onAddPlace}></button>
      </section>
      <section className="elements">
        <TransitionGroup component={null}>
          {props.cards.map((card) => (
            <CSSTransition classNames="element-animated" timeout={700} key={card._id} >
              <Card card={card} onCardClick={props.onCardClick}
                onCardLike={props.onCardLike} onCardDelete={props.onCardDelete} />
            </CSSTransition >
          )
          )}
        </TransitionGroup>
      </section>
      <Footer />
    </main>
  )
}

export default Main;
