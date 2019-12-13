import React, { useContext } from 'react'
import { RouteProps, RouteComponentProps, Route, Redirect } from 'react-router'
import { RootStoreContext } from '../stores/routeStore'
import { observer } from 'mobx-react-lite';


interface IProps extends RouteProps{
    component:React.ComponentType<RouteComponentProps<any>>
}

const PrivateRoute:React.FC<IProps> = ({component:Component,...rest}) => {
    const rootstore = useContext(RootStoreContext);
    const {isLoggedIn} = rootstore.userStore;

    return (
        <Route {...rest} render={(props) => isLoggedIn ? <Component {...props} /> : <Redirect to={'/'}/>}/>
    )
}

export default observer(PrivateRoute);
