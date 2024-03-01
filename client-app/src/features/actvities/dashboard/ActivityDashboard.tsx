import { Grid, GridColumn } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default observer(function ActivityDashboard() {
  const { activityStore } = useStore();
  const {loadActivities,activityResgistry}=activityStore;

  useEffect(() => {
    if(activityResgistry.size<=1) loadActivities();
  }, [loadActivities]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading App" />;

  return (
    <>
      <Grid>
        <Grid.Column width="10">
          <ActivityList />
        </Grid.Column>
        <GridColumn width="6">
          <h2>Activities filter</h2>
        </GridColumn>
      </Grid>
    </>
  );
});
