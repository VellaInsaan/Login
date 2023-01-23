import classes from './styles/home.module.css';

const Home = (props) => {
  return (
    <div className={classes}>
      <div className={classes.head}>
        <p>Welcome to our website !!</p>
      </div>
      <div className={classes.hero}>
        <button className={classes.logout}>Logout</button>
        <div className={classes.text}>This is our homepage</div>
      </div>
    </div>
  );
};

export default Home;
