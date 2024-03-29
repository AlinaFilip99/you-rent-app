import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AppContext from '../../contexts/AppContext';

const PrivateRoute = ({ component: Component, ...rest }: any) => {
    const appState = useContext(AppContext);
    return (
        // Show the component only when the user is logged in, otherwise, redirect the user to /login page
        <Route
            {...rest}
            render={(props: any) => (appState?.state.isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />)}
        />
    );
};
export default PrivateRoute;
