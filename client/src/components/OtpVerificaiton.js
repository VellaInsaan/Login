import axios from 'axios';
import classes from './styles/styles.module.css';
import { useState } from 'react';

const VerifyOTP = (props) => {
  const [error, setError] = useState({
    error: '',
    success: '',
  });
  const { value, changeHandler } = props;
  axios.defaults.withCredentials = true;
  const verify = (e) => {
    axios
      .post('http://localhost:5000/verifyOTP', {
        phoneNo: `${value.phone}`,
        hash: `${value.hash}`,
        otp: `${value.otp}`,
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        setError({ ...error, error: error.response.data.msg });
      });
    e.preventDefault();
    props.nextAction();
  };

  const back = (e) => {
    e.preventDefault();
    props.prevAction();
  };

  return (
    <div className={classes}>
      <div className={classes.cover}>
        <div className={classes.container}>
          <div className={classes.heading}>Login / SignUp</div>
          <div className={classes.error}>{error.error}</div>
          <div className={classes.success}>{error.success}</div>
          <div className={classes.input_label}>Enter OTP</div>
          <div className={classes.input_text}>
            <input
              type='tel'
              value={value.otp}
              onChange={changeHandler('otp')}
              placeholder='Enter your OTP'
              className={classes.tel}
            />
          </div>
          <button onClick={back} className={classes.back}>
            Back
          </button>
          <button onClick={verify} className={classes.submit}>
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
