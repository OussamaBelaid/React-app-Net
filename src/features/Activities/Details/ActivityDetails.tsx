import React, { useContext, useEffect } from "react";
import {Grid } from "semantic-ui-react";
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { ActivityDetailedInfo } from "./ActivityDetailedInfo";
import { ActivityDetailedChat } from "./ActivityDetailedChat";
import { ActivityDetailedSidebar } from "./ActivityDetailedSidebar";
import ActivityDetailedHeader from "./ActivityDetailedHeader";

interface DetailParams {
  id:string
}

export const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({match,history}) => {
  const activityStore = useContext(ActivityStore)
  const {activity,loadActivity,loadingInitial} =activityStore;
 
 
  useEffect(()=> {
    const reloadAct = () => {
      return loadActivity(match.params.id)
    }
    reloadAct()
 
  },[loadActivity,match.params.id])
  if(loadingInitial || !activity) return <LoadingComponent content='loading activity'/>
  return (
   <Grid>
     <Grid.Column width={10}>
      <ActivityDetailedHeader activity={activity} />
       <ActivityDetailedInfo activity={activity}/>
       <ActivityDetailedChat/>
     </Grid.Column>
     <Grid.Column width={6}>
      <ActivityDetailedSidebar/>
     </Grid.Column>
   </Grid>
  );
};

export default observer(ActivityDetails)