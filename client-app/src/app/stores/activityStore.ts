import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import {v4 as uuid} from 'uuid';
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {
  activityResgistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  pagination:Pagination|null=null;
  pagingParams=new PagingParams();
  predicate=new Map().set('all',true);

  constructor() {
    makeAutoObservable(this);
    reaction(
      ()=>this.predicate.keys(),
      ()=>{
        this.pagingParams=new PagingParams();
        this.activityResgistry.clear();
        this.loadActivities();
      }
    )
  }

  setPagingParams=(pagingParams:PagingParams)=>{
    this.pagingParams=pagingParams;
  }
  setPredicate=(predicate:string,value:string|Date)=>{

    const resetPredicate=()=>{
      this.predicate.forEach((_,key)=>{
        if(key!=='startDate')
        {
          this.predicate.delete(key);
        }
      })
    }

    switch(predicate)
    {
      case 'all':
        resetPredicate();
        this.predicate.set('all',true);
        break;
      case 'isGoing':
        resetPredicate();
        this.predicate.set('isGoing',true);
        break;
      case 'isHost':
        resetPredicate();
        this.predicate.set('isHost',true);
        break;
      case 'startDate':
        this.predicate.delete('startDate');
        this.predicate.set('startDate',value);
        break;
    }
  }
  get axiosParams()
  {
    const params=new URLSearchParams();
    params.append('pageNumber',this.pagingParams.pageNumber.toString());
    params.append('pageSize',this.pagingParams.pageSize.toString());
    this.predicate.forEach((value,key)=>{
      if(key==='startDate')
      {
        params.append(key,(value as Date).toString());
      }
      else
      {
        params.append(key,value);
      }
    })
    return params;
  }

  get groupedActivities()
  {
    return Object.entries(
      this.activitiesByDate.reduce((activities,activity)=>{
        const date=activity.date!.toISOString().split('T')[0];
        activities[date]=activities[date] ? [...activities[date],activity]:[activity];
        return activities;
    },{} as {[key:string]: Activity[]}))
  }

  get activitiesByDate() {
    return Array.from(this.activityResgistry.values()).sort((a, b) => 
       a.date!.getTime() - b.date!.getTime());
  }

  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {
      const result = await agent.Activities.list(this.axiosParams);
        result.data.forEach(activity => {
          this.setActivity(activity);
      })
      this.setPagination(result.pagination);
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  }
  setPagination=(pagination:Pagination)=>{
    this.pagination=pagination;
  }

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.loadingInitial=true;
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        runInAction(() => this.selectedActivity = activity);
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };

  private setActivity=(activity: Activity)=>
  {
      const user=store.userStore.user;
      if(user)
      {
        activity.isGoing=activity.attendees!.some(a=>a.username===user.username);
        activity.isHost=activity.hostUsername===user.username;
        activity.host=activity.attendees?.find(x=>x.username===activity.hostUsername);

      }
      activity.date = new Date(activity.date!);
      this.activityResgistry.set(activity.id, activity);
  }

  private getActivity=(id: string)=> {
    return this.activityResgistry.get(id);
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  createActivity = async (activity: ActivityFormValues) => {
    const user=store.userStore.user;
    const attendee=new Profile(user!);
    this.loading = true;
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      const newActivity=new Activity(activity);
      newActivity.hostUsername=user!.username;
      newActivity.attendees=[attendee];
      this.setActivity(newActivity);
      runInAction(()=> this.selectedActivity = newActivity);
    } catch (error) {
      console.log(error);
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if(activity.id)
          {
            const updateActivity={...this.getActivity(activity.id),...activity}
            this.activityResgistry.set(activity.id, updateActivity as Activity);
            this.selectedActivity = updateActivity as Activity;
          }
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityResgistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
  updateAttendance= async ()=>{
    const user=store.userStore.user;
    this.loading=true;
    try{
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(()=>{
        if(this.selectedActivity?.isGoing)
          {
            this.selectedActivity.attendees=
              this.selectedActivity.attendees?.filter(a=>a.username!=user?.username);
            this.selectedActivity.isGoing=false;
          }
          else
          {
            const attendee=new Profile(user!);
            this.selectedActivity?.attendees?.push(attendee);
            this.selectedActivity!.isGoing=true;
          }
          this.activityResgistry.set(this.selectedActivity!.id,this.selectedActivity!);
      })
    }
    catch(error)
    {
      console.log(error);
    }
    finally{
      runInAction(()=>{
        this.loading=false;
      })
    }
  }
  cancleActivityToToggle=async ()=>
  {
    this.loading=true;
    try{
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(()=>{
        this.selectedActivity!.isCancelled=!this.selectedActivity?.isCancelled;
        this.activityResgistry.set(this.selectedActivity!.id,this.selectedActivity!);
      })
    }
    catch(error)
    {
      console.log(error);
    }
    finally
    {
      runInAction(()=>this.loading=false);
    }

  }

  clearSelectedActivity=()=>{
    this.selectedActivity=undefined;
  }

  updateAttendeeFollowing=(username:string)=>{
    this.activityResgistry.forEach(activity=>{
      activity.attendees.forEach(attendee=>{
        if(attendee.username===username)
        {
          attendee.following ?attendee.followersCount--:attendee.followersCount++;
          attendee.following=!attendee.following;
        }
      })
    })
  }
}
