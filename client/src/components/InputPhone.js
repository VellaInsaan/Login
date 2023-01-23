import classes from './styles/styles.module.css';
import axios from 'axios';
const InputPhone = (props) => {
  const { value, changeHandler, hashHandler } = props;

  const proceed = (e) => {
    axios
      .post('http://localhost:5000/sendOTP', {
        phoneNo: `${value.phone}`,
      })
      .then((res) => {
        console.log(res.data.otp);
        console.log(res);
        const hash = res.data.hash;
        hashHandler(hash);
      });

    e.preventDefault();
    props.nextAction();
  };
  return (
    <div className={classes}>
      <div className={classes.cover}>
        <div className={classes.container}>
          <div className={classes.heading}>Login / SignUp</div>
          <div className={classes.input_label}>Mobile Number:</div>
          <div className={classes.input_text}>
            <input
              type='tel'
              value={value.phone}
              onChange={changeHandler('phone')}
              placeholder='Enter your phone no.'
              className={classes.tel}
            />
          </div>
          <button onClick={proceed} className={classes.submit}>
            Send OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputPhone;
