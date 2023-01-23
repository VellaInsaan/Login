import Cookies from 'universal-cookie';
import axios from 'axios';
import { useState } from 'react';

const cookies = new Cookies();

axios.defaults.withCredentials = true;

const Auth = () => {
  const [auth, setAuth] = useState(false);
  const accessToken = cookies.get('authSession');
  const refreshToken = cookies.get('refreshTokenID');

  if (!accessToken && !refreshToken) {
    setAuth(false);
  }
  if (accessToken && refreshToken) {
    setAuth(true);
  }

  console.log(auth);
  return auth;
};

export default Auth;
