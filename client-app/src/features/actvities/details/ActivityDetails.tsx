import { Button, Card, CardContent, CardDescription, CardHeader, CardMeta, Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";


export default observer( function ActivityDetails() {
    const {activityStore}=useStore();
    const{selectedActivity:activity,openForm,cancelSelectedActivity}=activityStore;
    if(!activity)
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
            <Button onClick={()=>openForm(activity.id)} basic content='Edit' color="blue"></Button>
            <Button onClick={cancelSelectedActivity} basic content='Cancel' color="grey"></Button>
        </Button.Group>
      </CardContent>
    </Card>
  );
})
