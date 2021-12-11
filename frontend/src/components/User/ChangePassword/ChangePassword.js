import { Grid, Typography, makeStyles, Button, CircularProgress, TextField, Card } from '@material-ui/core';
import React, {useContext, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SecurityIcon from '@material-ui/icons/Security';
import { resetPassword } from '../../../actions/userActions';
import { AppContext } from '../../../context/AppContext';
import MetaData from '../../Layout/MetaData/MetaData';
import './styles/ChangePassword.css';

const useStyles = makeStyles((theme) => ({
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15)
    },
    imageInput: {
        display: 'none'
    },
}));

const ChangePassword = ({history, match}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const {alertState} = useContext(AppContext);
    const [,setAlert] = alertState;
    const { isAuthenticated } = useSelector(state => state.auth);
    const { error, success, loading } = useSelector(state => state.forgotPassword);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if(error) {
            setAlert({type: "error", message: error});
        }
        if (success) {
            setAlert({type: "success", message: "Password Updated Successfully"});
            history.push('/signin');
        }
    }, [error, dispatch, history, setAlert, success]);
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);

        dispatch(resetPassword(match.params.token, formData));
      }

    return (
        <div>
            <MetaData title={"Reset Password"} />
            <Grid container className="changePassword" direction="row" justifyContent="center">
                <Grid component={Card} elevation={5} className="changePassword__main" item xs={12} md={6}>
                    <Grid container direction="column" align="center" spacing={2}>
                        <Grid item >
                            <Typography variant="h5">
                                <SecurityIcon /> Change Password 
                            </Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                name="password"
                                variant="outlined"
                                type="password"
                                required
                                fullWidth
                                id="password"
                                label="Password"
                                autoFocus
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
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
                        <Grid item>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress /> : "Change Password"}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default ChangePassword;
