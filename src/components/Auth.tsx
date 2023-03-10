import React, { useState } from "react";
import styles from "./Auth.module.css";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/userSlice";
import { auth, provider, storage } from "../firebase";
import SendIcon from "@material-ui/icons/Send";
import EmailIcon from "@material-ui/icons/Email";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Feed from "./Feed";
import { IconButton, Modal } from "@material-ui/core";

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  modal: {
    outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
  },
}));

const Auth: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // ????????????????????????????????????
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ?????????????????????????????????????????????
  const [isLogin, setIsLogin] = useState(true);

  // ????????????????????????????????????????????????????????????
  const [username, setUsername] = useState("");
  // ????????????????????????????????????????????????????????????(File????????????????????????????????????)
  const [avatarImage, setAvatarImage] = useState<File | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // ???????????????????????????
  async function sendResetEmail(e: React.MouseEvent<HTMLElement>) {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setOpenModal(false);
        setResetEmail("");
      })
      .catch((error) => {
        alert(error.message);
        setResetEmail("");
      });
  }

  // ??????????????????????????????????????????????????????????????????
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ???????????????????????????(?????????????????????)????????????e.target.files![0]???null???undefined????????????????????????!
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      // html?????????????????????????????????????????????????????????????????????????????????????????????onChange??????????????????????????????????????????????????????????????????
      e.target.value = "";
    }
  };

  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const signUpEmail = async () => {
    // createUserWith...???????????????????????????????????????????????????????????????
    const authUser = await auth.createUserWithEmailAndPassword(email, password);
    // ???????????????????????????????????????????????????url
    let url = "";

    if (avatarImage) {
      // storebase???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
      const S = "qwertyuiopasdfghjklzxcvbnm";
      const N = 8;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + " " + avatarImage.name;

      // ??????????????????avatarImage?????????????????????FireStorage???????????????
      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      url = await storage.ref("avatars").child(fileName).getDownloadURL();
    }
    // ???????????????avatarImage???firestore????????????????????????????????????????????????
    // firebase?????????????????????????????????displayName???photoUrl???????????????
    await authUser.user?.updateProfile({
      displayName: username,
      photoURL: url,
    });
    dispatch(
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      })
    );
  };

  const signInGoogle = async () => {
    // firebase.ts???????????????provider?????????
    await auth.signInWithPopup(provider).catch((err) => alert(err.message));
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? "Login" : "Register"}
          </Typography>
          <form className={classes.form} noValidate>
            {!isLogin && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUsername(e.target.value);
                  }}
                />
                <Box textAlign="center" className={styles.Box}>
                  <IconButton>
                    <label>
                      <AccountCircleIcon
                        fontSize="large"
                        className={
                          avatarImage
                            ? styles.login_addIconLoaded
                            : styles.login_addIcon
                        }
                      />
                      <input
                        className={styles.login_hiddenIcon}
                        type="file"
                        onChange={onChangeImageHandler}
                      />
                    </label>
                  </IconButton>
                </Box>
              </>
            )}

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
            />
            <Button
              disabled={
                isLogin
                  ? // login??????
                    !email || password.length < 6
                  : // signUp??????
                    !email || password.length < 6 || !username || !avatarImage
              }
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              startIcon={<EmailIcon />}
              onClick={
                isLogin
                  ? async () => {
                      // login?????????
                      try {
                        await signInEmail();
                      } catch (error: any) {
                        alert(error.message);
                      }
                    }
                  : async () => {
                      // SignUp?????????
                      try {
                        await signUpEmail();
                      } catch (error: any) {
                        alert(error.message);
                      }
                    }
              }>
              {isLogin ? "Login" : "register"}
            </Button>
            <Button
              fullWidth
              className={styles.google_button}
              variant="contained"
              color="primary"
              onClick={signInGoogle}>
              {isLogin ? "SignIn With Google" : "SignUp with Google"}
            </Button>

            <Grid item xs>
              <span
                className={styles.login_reset}
                onClick={() => setOpenModal(true)}>
                Forgot Password?
              </span>
            </Grid>
            <Grid item xs>
              <span
                className={styles.login_toggleMode}
                onClick={() => {
                  if (isLogin) {
                    setIsLogin(false);
                  } else {
                    setIsLogin(true);
                  }
                }}>
                {isLogin ? "Create new account" : "Back to Login"}
              </span>
            </Grid>
          </form>

          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div style={getModalStyle()} className={classes.modal}>
              <div className={styles.login_modal}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="email"
                  name="email"
                  label="Reset E-mail"
                  value={resetEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setResetEmail(e.target.value);
                  }}
                />
                <IconButton onClick={sendResetEmail}>
                  <SendIcon />
                </IconButton>
              </div>
            </div>
          </Modal>
        </div>
      </Grid>
    </Grid>
  );
};
export default Auth;
