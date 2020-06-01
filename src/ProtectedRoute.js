import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// eslint-disable-next-line
const PrivateRoute = ({ component: Component, user: user, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      user.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
                pathname: "/login",
                state: { from : props.location }
            }}
        />
      )
    }
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
