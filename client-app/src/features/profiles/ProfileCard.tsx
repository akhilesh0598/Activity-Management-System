import { observer } from "mobx-react-lite";
import { Profile } from "../../app/models/profile";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

interface Props
{
    profile:Profile;
}
export default observer( function ProfileCard({profile}:Props)
{
    return (
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image||'/assets/user.png'} />
            <Card.Content>
                <Card.Header>
                    {profile.displayName}
                </Card.Header>
                <Card.Description>
                    Bio goes here
                </Card.Description>
                <Card.Content>
                    <Icon name="user"/>
                    {profile.followersCount} followers
                </Card.Content>
            </Card.Content>
            <FollowButton profile={profile} />
        </Card>

    )

})