import {  Grid, Loader } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceHolder";

export default observer(function ActivityDashboard() {
  const { activityStore } = useStore();
  const { loadActivities, activityResgistry,setPagingParams,pagination } = activityStore;
  const [loadingNext,setLoadingNext]=useState(false);

  function handleGetNext()
  {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage+1));
    loadActivities().then(()=>setLoadingNext(false));
  }

  useEffect(() => {
    if (activityResgistry.size <= 1) 
    {
      loadActivities();
    }
  }, [loadActivities,activityResgistry]);


  return (
      <Grid>
        <Grid.Column width="10">
          {
            activityStore.loadingInitial && activityResgistry.size===0 && !loadingNext ?
            (
              <>
                <ActivityListItemPlaceholder />
                <ActivityListItemPlaceholder />

              </>
            ) :
            (
              <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && !!pagination && pagination.currentPage<pagination.totalPages}
            initialLoad={false}

          >
            <ActivityList />
          </InfiniteScroll>
            )
          }
          
          
        </Grid.Column>
        <Grid.Column width="6">
          <ActivityFilters/>
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loadingNext} />

        </Grid.Column>
      </Grid>
  );
});
