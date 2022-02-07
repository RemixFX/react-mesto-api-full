class Api {
  constructor(options) {
      this._url = options.url;
      this._headers = options.headers;
  }

  _checkResponse(res) {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
  }

  getPageInfo() {
    return Promise.all([this.getUserData(), this.getInitialCards()]);
  }

  getUserData() {
    return fetch(`${this._url}users/me`, {
      headers: this._headers
    })
    .then(this._checkResponse);
  }

  getInitialCards() {
    return fetch(`${this._url}cards`, {
      headers: this._headers
    })
    .then(this._checkResponse);
  }

  patchUserData(userdata) {
    return fetch(`${this._url}users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: userdata.name,
        about: userdata.about
      })
    })
    .then(this._checkResponse);
  }

  uploadNewCard(data) {
    return fetch(`${this._url}cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    })
    .then(this._checkResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._url}cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers
    })
    .then(this._checkResponse);
  }

  changeLikeCardStatus(cardId, isLiked) {
    return fetch(`${this._url}cards/likes/${cardId}`, {
      method: !isLiked ? "PUT" : "DELETE",
      headers: this._headers
    })
    .then(this._checkResponse);
  }

  patchUserAvatar(data) {
    return fetch(`${this._url}users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar
      })
    })
    .then(this._checkResponse);
  }

}

const api = new Api({
  url: "https://api.insta-mesto.nomoredomains.work/",
  headers: {
    //authorization: "0fe39d88-814c-4d9c-a2d1-36a2026603cf",
    "Content-type": "application/json"
  }
});

export default api;
