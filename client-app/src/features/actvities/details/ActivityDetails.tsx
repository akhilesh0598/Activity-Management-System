import { Button, Card, CardContent, CardDescription, CardHeader, CardMeta, Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";


export default observer( function ActivityDetails() {
    const {activityStore}=useStore();
    const{selectedActivity:activity,loadActivity,loadingInitial}=activityStore;
    const {id}=useParams();

    useEffect(()=>{
      if(id) loadActivity(id);
    },[id,loadActivity])

    if(loadingInitial||!activity)
        return <LoadingComponent content="Loading App"/>
  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
      <CardContent>
        <CardHeader>{activity.title}</CardHeader>
        <CardMeta>
          <span>{activity.date}</span>
        </CardMeta>
        <CardDescription>
          {activity.description}
        </CardDescription>
      </CardContent>
      <CardContent extra>
        <Button.Group widths='2'>
            <Button as={Link} to={`/manage/${activity.id}`}  basic content='Edit' color="blue"></Button>
            <Button as={Link} to={'/activities'} basic content='Cancel' color="grey"></Button>
        </Button.Group>
      </CardContent>
    </Card>
  );
})
