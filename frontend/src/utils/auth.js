class Auth {
  constructor(url) {
    this._url = url;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  register(password, email) {
    return fetch(`${this._url}/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password,
        email
      })
    })
      .then(this._checkResponse);
  }

  authorize(password, email) {
    return fetch(`${this._url}/signin`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        email
      })
    })
      .then(this._checkResponse);
  }

  checkToken(token) {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(this._checkResponse);
  }

  logout = () => {
    return fetch(`${this._url}/signout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(this._checkResponse);
  }

}

const auth = new Auth('https://api.insta-mesto.nomoredomains.work')
export default auth;
