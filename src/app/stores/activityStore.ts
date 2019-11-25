import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./routeStore";
import { setActivityProps, createAttendee } from "../common/util/util";

export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activitiesRegister = new Map();
  @observable activitie: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";
  @observable loading = false;

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activitiesRegister.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.activities.list();
      runInAction("loading activities", () => {
        activities.forEach(activity => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activitiesRegister.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("load activities error", () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action loadActivity = async (id: string) => {
    console.log(id);
    let activitys = this.getActivity(id);
    console.log(activitys);
    if (activitys) {
      console.log("fully");
      this.activitie = activitys;
      console.log(this.activitie);
      return activitys;
    } else {
      console.log("without");
      this.loadingInitial = true;
      try {
        activitys = await agent.activities.details(id);
        console.log(activitys);
        runInAction("getting Activity", () => {
          setActivityProps(activitys, this.rootStore.userStore.user!);
          this.activitie = activitys;
          this.activitiesRegister.set(activitys.id, activitys);
          console.log(this.activitie);
          this.loadingInitial = false;
        });
        return activitys;
      } catch (error) {
        runInAction("getting activity error", () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  getActivity = (id: string) => {
    return this.activitiesRegister.get(id);
  };

  @action clearActivity = () => {
    this.activitie = null;
  };

  @action createActivity = async (Activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.activities.create(Activity);
      const attendee = createAttendee(this.rootStore.userStore.user!);

        attendee.isHost = true;
        let attendees = [];
        attendees.push(attendee);
        Activity.attendees = attendees;
        Activity.isHost=true;
      
     
      runInAction("create activity", () => {
        this.activitiesRegister.set(Activity.id, Activity);
        this.submitting = false;
      });
      history.push(`/activities/${Activity.id}`);
    } catch (error) {
      runInAction("create activity error", () => {
        this.submitting = false;
        console.log(error);
      });
      toast.error("Problem submitting data");
    }
  };
  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.activities.update(activity);
      runInAction("update activity", () => {
        this.activitiesRegister.set(activity.id, activity);
        this.activitie = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("update activity error", () => {
        this.submitting = false;
        console.log(error);
      });
      toast.error("Problem submitting data");
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
      });
      console.log(error);
    }
  };
  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.activities.attend(this.activitie!.id);
      runInAction(() => {
        if (this.activitie) {
          this.activitie.attendees.push(attendee);
          this.activitie.isGoing = true;
          this.activitiesRegister.set(this.activitie.id, this.activitie);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem signing up to activity");
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;

    try {
      await agent.activities.unattend(this.activitie!.id);
      runInAction(() => {
        if (this.activitie) {
          this.activitie.attendees = this.activitie.attendees.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.activitie.isGoing = false;
          this.activitiesRegister.set(this.activitie.id, this.activitie);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      })
      toast.error('Probleme canceling attendance')
    }
  };
}
