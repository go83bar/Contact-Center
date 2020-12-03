import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ExpiredTokenModal from "./ auth/ExpiredTokenModal";
import {CookiesProvider} from "react-cookie";

// eslint-disable-next-line
const PrivateRoute = ({ component: Component, user: user, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return user.isAuthenticated === true ? (
        <CookiesProvider>
            <Component {...props} />
            <ExpiredTokenModal />
        </CookiesProvider>
            ) : (
        <Redirect to={{
                pathname: "/login",
                state: { from : props.location }
            }}
        />
      )
    }}
  />
);

PrivateRoute.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return { user : state.user }
}

export default connect(mapStateToProps)(PrivateRoute);
//export default connect(mapStateToProps, null, null, { pure : false })(PrivateRoute);
