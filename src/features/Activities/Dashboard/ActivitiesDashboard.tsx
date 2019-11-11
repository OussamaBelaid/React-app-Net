import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";



const ActivitiesDashboard: React.FC = () => {
  const activityStore = useContext(ActivityStore);

  //== didMount
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content={"Loading Activities"} />;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList/>
      </Grid.Column>
      <Grid.Column width={6}>
     <h2>Activity filters</h2>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivitiesDashboard);
