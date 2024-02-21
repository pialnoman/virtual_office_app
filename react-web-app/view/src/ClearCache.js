import React, { useState, useEffect } from "react";
import packageJson from "../package.json";
import moment from "moment";
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import ProtectedRoute from './components/protected-route/ProtectedRoute'
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { PALETTE_MODE } from './Config';
const buildDateGreaterThan = (latestDate, currentDate) => {
  const momLatestDateTime = moment(latestDate);
  const momCurrentDateTime = moment(currentDate);

  if (momLatestDateTime.isAfter(momCurrentDateTime)) {
    return true;
  } else {
    return false;
  }
};
const loading = (
  <div className="text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)
const theme = createTheme({
  palette: {
    mode: PALETTE_MODE,
    // primary:{
    //   main:"#BD9EFB"
    // }
  },
  typography: {
    "fontFamily": `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif`,

  },
});
//pages
const Login = React.lazy(() => import('./pages/sign-in/signIn'));
const Register = React.lazy(() => import('./pages/sign-up/signUp'));
const ForgotPass = React.lazy(() => import('./pages/forgot-pass/forgotPass'));
const TheLayout = React.lazy(() => import('./containers/TheLayout'))

function withClearCache(Component) {
  function ClearCacheComponent(props) {
    const [isLatestBuildDate, setIsLatestBuildDate] = useState(false);
    useEffect(() => {
      fetch("/meta.json")
        .then((response) => response.json())
        .then((meta) => {
          const latestVersionDate = meta.buildDate;
          const currentVersionDate = packageJson.buildDate;

          const shouldForceRefresh = buildDateGreaterThan(
            latestVersionDate,
            currentVersionDate
          );
          if (shouldForceRefresh) {
            setIsLatestBuildDate(false);
            refreshCacheAndReload();
          } else {
            setIsLatestBuildDate(true);
          }
        });
    }, []);

    const refreshCacheAndReload = () => {
      if (caches) {
        // Service worker cache should be cleared with caches.delete()
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
      // delete browser cache and hard reload
      window.location.reload(true);
    };

    return (
      <ThemeProvider theme={theme}>
        <HashRouter>
          <React.Suspense fallback={loading}>
            <Switch>

              <Route exact path="/"><Redirect to="/login"></Redirect></Route>
              <Route exact path="/login" name="Sign in" render={props => <Login {...props} />} />
              <Route exact path="/register" name="Sign up" render={props => <Register {...props} />} />
              <Route exact path="/forgot-password" name="Forgot Password" render={props => <ForgotPass {...props} />} />
              <ProtectedRoute path="/dashboard" name="Dashboard" component={TheLayout} />
            </Switch>
          </React.Suspense>
          {/* <AuthVerify logOut={logOut}/> */}
        </HashRouter>
      </ThemeProvider>
    );
  }

  return ClearCacheComponent;
}

export default withClearCache;