import React, { Fragment } from "react";
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
import { HomePage } from "../../features/home/HomePage";
import { ActivityForm } from "../../features/Activities/form/ActivityForm";
import { ActivityDetails } from "../../features/Activities/Details/ActivityDetails";
import NotFound from "./NotFound";
const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
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
