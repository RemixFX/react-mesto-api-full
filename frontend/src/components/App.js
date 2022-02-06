import React from 'react';
import Header from './Header';
import Main from './Main';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import applied from '../images/applied.svg';
import badRequest from '../images/badrequest.svg';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import ImagePopup from './ImagePopup';
import EditAvatarPopups from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import auth from '../utils/auth';



function App() {
  const [cards, setCards] = React.useState([]);
  const [isOpenInfoTooltipError, setIsOpenInfoTooltipError] = React.useState(false);
  const [isOpenInfoTooltipSuccess, setIsOpenInfoTooltipSuccess] = React.useState(false)
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({ name: '', link: '' });
  const [forDeleteCard, setForDeleteCard] = React.useState(null)
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState('')
  const navigate = useNavigate()

  // Получение контекста текущего профиля
  const [currentUser, setCurrentUser] = React.useState({
    avatar: '',
    name: '',
    about: '',
    _id: ''
  })

  // Получение данных профиля с сервера
  React.useEffect(() => {
    api.getUserData().then(res => setCurrentUser(res))
      .catch((err) => console.log(err))
  }, []);

  // Получение карточек с сервера
  React.useEffect(() => {
    api.getInitialCards().then((res) => {
      setCards(res)
    })
      .catch(err => console.log(err))
  }, []);

  // Регистрация

  function handleRegister(password, email) {
    auth.register(password, email)
      .then(res => {
        console.log(res)
        setIsOpenInfoTooltipSuccess(true)
        navigate('/signin')
      })
      .catch((err) => {
        setIsOpenInfoTooltipError(true)
        console.log(err)
      })
  }

  // Сохранение токена и авторизация

  function handleLogin(password, email) {
    auth.authorize(password, email)
      .then(data => {
        if (data.token) {
          localStorage.setItem('jwt', data.token)
        }
        setLoggedIn(true)
        navigate('main')
      })
      .catch((err) => {
        setIsOpenInfoTooltipError(true)
        console.log(err)
      })
  }

  // Проверка токена

  React.useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      auth.checkToken(token).then((res) => {
        setLoggedIn(true)
        setEmail(res.data.email)
        navigate('main')
      })
        .catch(err => console.log(err));
    }
  }, [navigate])

  // Удаление токена

  function handleSignOut() {
    localStorage.removeItem('jwt')
    navigate('signin')
    setEmail('')
  }

  // Постановка лайка
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
      .catch(err => console.log(err));
  }

  // Добавление удаляемой карточки в стейт и открытие попапа подтверждения удаления
  function handleConfirmDeleteCardPopupOpen(card) {
    setForDeleteCard(card);
    setIsConfirmDeletePopupOpen(true)
  }

  // Удаление карточки
  function handleCardDelete(evt) {
    evt.preventDefault();

    api.deleteCard(forDeleteCard._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== forDeleteCard._id))
      closeAllPopups();
    })
      .catch(err => console.log(err))
  }

  // Единая функция закрытия попапов
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({ name: '', link: '' });
    setIsConfirmDeletePopupOpen(false);
    setIsOpenInfoTooltipError(false);
    setIsOpenInfoTooltipSuccess(false);
  }

  // Закрытие попапов по клавише Escape
  React.useEffect(() => {
    if (isEditProfilePopupOpen || isAddPlacePopupOpen || isEditAvatarPopupOpen
      || isConfirmDeletePopupOpen || isOpenInfoTooltipError || isOpenInfoTooltipError
      || isOpenInfoTooltipSuccess === true || selectedCard.link) {
      function handleEsc(evt) {
        if (evt.key === 'Escape') {
          closeAllPopups()
        }
      }

      document.addEventListener("keydown", handleEsc)

      return () => {
        document.removeEventListener("keydown", handleEsc)
      }
    }
  }, [isEditProfilePopupOpen, isAddPlacePopupOpen, isEditAvatarPopupOpen,
    isConfirmDeletePopupOpen, isOpenInfoTooltipError, isOpenInfoTooltipSuccess,
    selectedCard.link])

  // Закрытие попапа по клике на область
  function handlePopupClick(evt) {
    if (evt.target.classList.contains("popup")) {
      closeAllPopups()
    }
  }

  // Открытие попапа с картинкой
  function handleCardClick(card) {
    setSelectedCard(card)
  }

  // Обновление текстовых полей профиля
  function handleUpdateUser(userInfo) {
    api.patchUserData(userInfo).then(res => {
      setCurrentUser(res)
      closeAllPopups()
    })
      .catch((err) => console.log(err));
  }

  // Обновление аватара профиля
  function handleUpdateAvatar(avatar) {
    api.patchUserAvatar(avatar).then(res => {
      setCurrentUser(res)
      closeAllPopups()
    })
      .catch((err) => console.log(err));
  }

  // Добавление новой карточки
  function handleAddPlaceSubmit(cardData) {
    api.uploadNewCard(cardData).then(newCard => {
      setCards([newCard, ...cards])
      closeAllPopups()
    })
      .catch((err) => console.log(err));
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header email={email}
          onSignOut={handleSignOut}
        />
        <Routes>
          <Route path="/main" element={<ProtectedRoute
            component={Main}
            loggedIn={loggedIn}
            onEditProfile={() => setIsEditProfilePopupOpen(!isEditProfilePopupOpen)}
            onAddPlace={() => setIsAddPlacePopupOpen(!isAddPlacePopupOpen)}
            onEditAvatar={() => setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen)}
            cards={cards}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleConfirmDeleteCardPopupOpen} />
          } />

          <Route path="/signup" element={<Register onRegister={handleRegister} />} />

          <Route path="/signin" element={<Login onLogin={handleLogin} />} />

          <Route path="*" element={loggedIn ? <Navigate replace to="/main" /> : <Navigate replace to="/signin" />} />
        </Routes>
        <InfoTooltip title="Вы успешно зарегистрировались!" image={applied}
          isOpen={isOpenInfoTooltipSuccess} onClose={closeAllPopups} onPopupClick={handlePopupClick} />

        <InfoTooltip title="Что-то пошло не так! Попробуйте ещё раз." image={badRequest}
          isOpen={isOpenInfoTooltipError} onClose={closeAllPopups} onPopupClick={handlePopupClick} />

        <EditProfilePopup name="profileEdit" isOpen={isEditProfilePopupOpen} onClose={closeAllPopups}
          onPopupClick={handlePopupClick} onUpdateUser={handleUpdateUser} />

        <AddPlacePopup name="cardAdd" isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}
          onPopupClick={handlePopupClick} onAddPlace={handleAddPlaceSubmit} />

        <EditAvatarPopups name="avatarEdit" isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
          onPopupClick={handlePopupClick} onUpdateAvatar={handleUpdateAvatar} />

        <PopupWithForm title="Вы уверены?" name="confirmation" buttonText='Да'
          class={'form__confirmation-button'} onPopupClick={handlePopupClick}
          isOpen={isConfirmDeletePopupOpen ? 'popup_opened' : ''}
          onClose={closeAllPopups} onSubmitForm={handleCardDelete} />

        <ImagePopup
          isOpen={selectedCard.link ? 'popup_opened' : ''}
          onClose={closeAllPopups}
          card={selectedCard}
          onPopupClick={handlePopupClick}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
