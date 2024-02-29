import { Button, Card, CardContent, CardDescription, CardHeader, CardMeta, Image } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props{
    activity:Activity;
    cancelSelectActivity:()=>void;
    openForm:(id:string)=>void;
}

export default function ActivityDetails({activity,
    cancelSelectActivity,openForm}:Props) {
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
            <Button onClick={cancelSelectActivity} basic content='Cancel' color="grey"></Button>
        </Button.Group>
      </CardContent>
    </Card>
  );
}
