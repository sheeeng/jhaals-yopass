import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  makeStyles,
  Link,
} from '@material-ui/core';
import { useAuth } from 'oidc-react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
//import { oidcConfig } from '../oidc-config';

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginBottom: theme.spacing(4),
  },
  logo: {
    verticalAlign: 'middle',
    paddingLeft: '5px',
  },
}));

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isOnUploadPage = location.pathname.includes('upload');
  const isOnCreatePage = location.pathname.includes('create');
  const base = process.env.PUBLIC_URL || '';
  const home = base + '/';
  const upload = base + '/upload';
  const create = base + '/create';
  const classes = useStyles();

    // TODO: Figure out how to sign in from outside of the AuthProvider
  // const auth = useAuth();

  var WebFont = require('webfontloader');

  WebFont.load({
    google: {
      families: [
        'Red Hat Display',
        'Red Hat Text',
        'Ubuntu'
      ]
    }
  });

  var auth = useAuth();

  var isUserLoggedOut = !auth?.userData

  var username = auth?.userData?.profile?.username;
  console.log(username)

  var login = () =>
  {
      if (!auth)
      {
          console.error("Unknown error.");
          return;
      }

      var login = isUserLoggedOut ? auth.signIn : auth.signOut;

      login().then(console.log).catch(console.error);
  }

  var logout= () =>
  {
      if (!auth)
      {
          console.error("Unknown error.");
          return;
      }

      var logout = isUserLoggedOut ? auth.signIn : auth.signOut;

      logout().then(console.log).catch(console.error);
  }

  return (
    <AppBar position="static" color="transparent" className={classes.appBar}>
      <Toolbar>
        <Link href={home} color="inherit" underline="none">
          <Typography variant="h6" component="div">
            Yopass
            <img
              className={classes.logo}
              width="40"
              height="40"
              alt=""
              src="yopass.svg"
            />
          </Typography>
        </Link>
        <Box
          sx={{
            marginLeft: 'auto',
          }}
        >
         {/* <h4>Hello!</h4> */}
          {/* <h4>Hello {auth.userManager.getUser.name}!</h4> */}

          {<Button
            component={RouterLink}
            to={home}
            onClick={isUserLoggedOut ? login : logout}
            variant="contained"
            color="primary"
            style={{ fontFamily: "Red Hat Display, sans-serif", marginLeft: '1rem' }}
          >
            {isUserLoggedOut ? t('Log-In') : t('Log-Out')}
          </Button>}

          {!isUserLoggedOut && <Button
            disabled={isOnCreatePage ? true : false}
            component={RouterLink}
            to={isOnCreatePage ? home : create}
            variant="contained"
            color="primary"
            style={{ fontFamily: "Red Hat Display, sans-serif", marginLeft: '1rem' }}
          >
            {isOnCreatePage ? t('Create') : t('Create')}
          </Button>}

          {!isUserLoggedOut && <Button
            disabled={isOnUploadPage ? true : false}
            component={RouterLink}
            to={isOnUploadPage ? home : upload}
            variant="contained"
            color="primary"
            style={{ fontFamily: "Red Hat Display, sans-serif", marginLeft: '1rem' }}
          >
            {isOnUploadPage ? t('Upload') : t('Upload')}
          </Button>}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
