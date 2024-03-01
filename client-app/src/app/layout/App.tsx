import { Container } from "semantic-ui-react";
import Navbar from "./NavBar";
import { Outlet, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import HomePage from "../../features/home/HomePage";

function App() {
  const location =useLocation();
  return (
    <>
    {location.pathname==='/'?<HomePage/>:(
      <>
      <Navbar />
      <Container style={{marginTop:'7em'}}>
        <Outlet/>
      </Container>

      </>
    )}
    </>
  );
}

export default observer(App);
