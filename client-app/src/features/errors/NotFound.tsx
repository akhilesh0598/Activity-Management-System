import { Link } from "react-router-dom";
import { Header, Icon, Segment } from "semantic-ui-react";

export default function NotFound()
{
    return(
    <Segment placeholder>
        <Header icon>
            <Icon name="search" />
            Oops -we looked everywhere but could not find what you are looking for!
        </Header>
        <Segment.Inline as={Link} to='/activities'>
            Return to activities page
        </Segment.Inline>
    </Segment>
    );
}