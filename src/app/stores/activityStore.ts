import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activitiesRegister = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return Array.from(this.activitiesRegister.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.activities.list();
      runInAction("loading activities", () => {
        activities.forEach(activity => {
          activity.date = activity.date.split(".")[0];
          this.activitiesRegister.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("load activities error", () => {
        this.loadingInitial = false;
        console.log(error);
      });
    }
  };


@action loadActivity = async (id:string) => 
{
  let activity = this.getActivity(id);
  if(activity){
    console.log("fully")
    this.activity=activity;
    console.log(this.activity)
  } else {
    console.log("without")
    this.loadingInitial=true;
    try{
     activity = await agent.activities.details(id);
     runInAction('getting Activity',() => {
      this.activity = activity;
      this.loadingInitial=false;
     })
   
    }catch (error)
    {
      runInAction('getting activity error',() => {
        
        this.loadingInitial=false
      })
      console.log(error)
     
    }
  }
}


getActivity= (id:string) =>
{
  return this.activitiesRegister.get(id);
}

@action clearActivity = () => {
  this.activity=null;
}

  @action createActivity = async (Activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.activities.create(Activity);
      runInAction("create activity", () => {
        this.activitiesRegister.set(Activity.id, Activity);
        this.submitting = false;
      });
    } catch (error) {
      runInAction("create activity error", () => {
        this.submitting = false;
        console.log(error);
      });
    }
  };
  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.activities.update(activity);
      runInAction("update activity", () => {
        this.activitiesRegister.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
    } catch (error) {
      runInAction("update activity error", () => {
        this.submitting = false;
        console.log(error);
      });
    }
  };
  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;

    try {
      await agent.activities.delete(id);
      runInAction("delete activity", () => {
        this.activitiesRegister.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction("delete activity error", () => {
        this.submitting = false;
        this.target = "";
        console.log(error);
      });
    }
  };

}

export default createContext(new ActivityStore());
