import { useState } from 'react';
import InputPhone from './InputPhone';
import VerifyOTP from './OtpVerificaiton';

const FormAction = (props) => {
  const [state, setState] = useState({
    phone: '',
    hash: '',
    otp: '',
  });

  const [action, setAction] = useState(1);

  const changeHandler = (input) => (e) => {
    setState({ ...state, [input]: e.target.value });
  };

  const hashHandler = (hash) => {
    setState({ ...state, hash: hash });
  };

  const nextAction = () => {
    setAction((prevStep) => prevStep + 1);
  };

  const prevAction = () => {
    setAction((prevStep) => prevStep - 1);
  };

  const { phone, hash, otp } = state;
  const value = { phone, hash, otp };

  switch (action) {
    case 1:
      return (
        <InputPhone
          nextAction={nextAction}
          hashHandler={hashHandler}
          changeHandler={changeHandler}
          value={value}
        />
      );
    case 2:
      return (
        <VerifyOTP
          nextAction={nextAction}
          hashHandler={hashHandler}
          changeHandler={changeHandler}
          prevAction={prevAction}
          value={value}
        />
      );
    default:
      return (
        <InputPhone
          nextAction={nextAction}
          hashHandler={hashHandler}
          changeHandler={changeHandler}
          value={value}
        />
      );
  }
};

export default FormAction;
