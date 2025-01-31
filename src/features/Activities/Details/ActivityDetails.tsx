import React, { useContext, useEffect } from "react";
import {Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { ActivityDetailedInfo } from "./ActivityDetailedInfo";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import { RootStoreContext } from "../../../app/stores/routeStore";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";
import ActivityDetailedChat from "./ActivityDetailedChat";

interface DetailParams {
  id:string
}

  const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({match,history}) => {
  const rootStore = useContext(RootStoreContext);
  const {activitie,loadActivity,loadingInitial} = rootStore.activityStore;
 
 
 
  useEffect(()=> {
   loadActivity(match.params.id);
 
  },[loadActivity,match.params.id])
  
  if(loadingInitial) return <LoadingComponent content='loading activity'/>
 
  if(!activitie)
  {
    console.log("aaa",activitie)
    return <h2>Activity not found</h2>
  }
  return (
   <Grid>
     <Grid.Column width={10}>
      <ActivityDetailedHeader activity={activitie} />
       <ActivityDetailedInfo activity={activitie}/>
       <ActivityDetailedChat/>
     </Grid.Column>
     <Grid.Column width={6}>
      <ActivityDetailedSidebar attendees={activitie.attendees}/>
     </Grid.Column>
   </Grid>
  );
};

export default observer(ActivityDetails)