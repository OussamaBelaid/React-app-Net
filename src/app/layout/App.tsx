import React, { Fragment, useContext, useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivitiesDashboard from "../../features/Activities/Dashboard/ActivitiesDashboard";
import { observer } from "mobx-react-lite";
import {ToastContainer} from 'react-toastify'
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch
} from "react-router-dom";
import { ActivityForm } from "../../features/Activities/form/ActivityForm";
import NotFound from "./NotFound";
import loginForm from "../../features/user/LoginForm";
import HomePage from "../../features/home/HomePage";
import { RootStoreContext } from "../stores/routeStore";
import { LoadingComponent } from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import ActivityDetails from "../../features/Activities/Details/ActivityDetails";
const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const {setAppLoaded , token , appLoaded} = rootStore.commonStore;
  const {getUser} = rootStore.userStore;

  useEffect(() => {
     if(token) 
     {
       getUser().finally(() => setAppLoaded())
     } else 
     {
       setAppLoaded()
     }
  }, [getUser,setAppLoaded,token])

   if(!appLoaded) return <LoadingComponent content='Loading app...'/>
  
  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position='bottom-right' />
      <Route exact path='/' component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route
                  exact
                  path='/activities'
                  component={ActivitiesDashboard}
                />
                <Route
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route path='/login' component={loginForm} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
