import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { RootStoreContext } from "../../app/stores/routeStore";
import { RouteComponentProps } from "react-router";
import { LoadingComponent } from "../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";

interface RouteParams {
  username: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ProfilePage: React.FC<IProps> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadingProfile,
    profile,
    loadProfile,
    follow,
    unfollow,
    isCurrentUser,
    loading,
    setActiveTab
  } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(match.params.username);
  }, [loadProfile, match.params.username]);

  if (loadingProfile) return <LoadingComponent content='Loading Profile...' />;

  return (
    <div>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile!} isCurrentUser={isCurrentUser} loading={loading} follow={follow} unfollow={unfollow}/>
        <ProfileContent setActiveTab={setActiveTab} />
      </Grid.Column>
    </div>
  );
};

export default observer(ProfilePage);
