import {
  Avatar,
  Grid,
  Typography,
  makeStyles,
  Button,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PhotoIcon from "@material-ui/icons/Photo";
import EditIcon from "@material-ui/icons/Edit";
import SecurityIcon from "@material-ui/icons/Security";
import {
  updateProfile,
  loadUser,
  clearErrors,
  updatePassword,
} from "../../../actions/userActions";
import { AppContext } from "../../../context/AppContext";
import "./styles/UpdateProfile.css";
import {
  UPDATE_PROFILE_RESET,
  UPDATE_PASSWORD_RESET,
} from "../../../constants/userConstants";
import MetaData from "../../Layout/MetaData/MetaData";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  imageInput: {
    display: "none",
  },
}));

const UpdateProfile = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { alertState } = useContext(AppContext);
  const [, setAlert] = alertState;
  const { user } = useSelector((state) => state.auth);
  const { error, isUpdated, loading } = useSelector((state) => state.user);
  const [full_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.full_name);
      setEmail(user.email);
      setAvatar(user.avatar_url);
    }
    if (error) {
      setAlert({ type: "error", message: error });
      dispatch(clearErrors());
    }
    if (isUpdated) {
      setAlert({ type: "success", message: message });
      dispatch(loadUser());
      history.push("/myprofile");
      dispatch({ type: UPDATE_PROFILE_RESET });
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  }, [user, error, message, dispatch, history, isUpdated, setAlert]);

  const handleChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        console.log(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("full_name", full_name);
    formData.set("email", email);
    formData.set("avatar", avatar);

    dispatch(updateProfile(formData));
    setMessage("User updated successfully");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("oldPassword", oldPassword);
    formData.set("password", newPassword);
    formData.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(formData));
    setMessage("Password Updated Successfully");
  };

  return (
    <div className="updateProfile">
      <MetaData title={"User Settings"} />
      <Grid
        className="updateProfile__editProfile"
        container
        direction="column"
        alignItems="center"
      >
        <Grid container xs={8} spacing={2}>
          <Grid item>
            <Typography
              className="updateProfile__editProfile__heading"
              variant="h5"
            >
              <EditIcon /> Edit Profile
            </Typography>
          </Grid>
          <Grid
            xs={12}
            style={{ padding: "10px 0" }}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Avatar
                src={avatar}
                alt={full_name}
                className={classes.large}
              ></Avatar>
            </Grid>
            <Grid item>
              <input
                onChange={handleChange}
                accept="image/*"
                name="avatar"
                className={classes.imageInput}
                id="icon-button-file"
                type="file"
              />
            </Grid>
            <label htmlFor="icon-button-file">
              <Button
                aria-label="upload picture"
                component="span"
                startIcon={<PhotoIcon />}
                className={classes.changePicture}
              >
                Change
              </Button>
            </label>
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="name"
              name="full_name"
              variant="outlined"
              required
              fullWidth
              id="full_name"
              label="Full Name"
              value={full_name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress /> : "Save"}
            </Button>
          </Grid>
        </Grid>
        <Grid container xs={8} spacing={2}>
          <Grid item>
            <Typography
              className="updateProfile__editProfile__heading"
              variant="h5"
            >
              <SecurityIcon /> Change Password
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="oldPassword"
              variant="outlined"
              type="password"
              required
              fullWidth
              id="oldPassword"
              label="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              type="password"
              fullWidth
              id="newPassword"
              label="New Password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              type="password"
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleUpdatePassword}
              disabled={loading}
            >
              {loading ? <CircularProgress /> : "Update Password"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default UpdateProfile;
