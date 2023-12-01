import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AppContext from '../../contexts/AppContext';

const PrivateRoute = ({ component: Component, ...rest }: any) => {
    const appState = useContext(AppContext);
    const authenticated = true; // temporary to bypass login
    return (
        // Show the component only when the user is logged in, otherwise, redirect the user to /login page
        <Route
            {...rest}
            render={(props: any) =>
                appState?.state.isAuthenticated || authenticated ? <Component {...props} /> : <Redirect to="/login" />
            }
        />
    );
};
export default PrivateRoute;
