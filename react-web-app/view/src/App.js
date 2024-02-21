import React from 'react';
import logo from './logo.svg';
import '@coreui/coreui/dist/css/coreui.min.css'
import './App.css';
import "react-datetime/css/react-datetime.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import ProtectedRoute from './components/protected-route/ProtectedRoute'
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { PALETTE_MODE } from './Config';
import withClearCache from './ClearCache'


const Login = React.lazy(() => import('./pages/sign-in/signIn'));
const Register = React.lazy(() => import('./pages/sign-up/signUp'));
const ForgotPass = React.lazy(() => import('./pages/forgot-pass/forgotPass'));
const TheLayout = React.lazy(() => import('./containers/TheLayout'))

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
const ClearCacheComponent = withClearCache()
function App() {
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

export default App;
