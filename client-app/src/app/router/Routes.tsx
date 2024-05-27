import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../features/actvities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/actvities/form/ActivityForm";
import ActivityDetails from "../../features/actvities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import ProfilePage from "../../features/profiles/ProfilePage";
import RequireAuth from "./RequireAuth";
import LoginForm from "../../features/users/LoginForm";
import RegisterForm from "../../features/users/RegisterForm";

export const routes: RouteObject[]=[
    {
        path:'/',
        element:<App/>,
        children:[
            {element:<RequireAuth />,children:[
                {path:'login',element:<LoginForm />},
                {path:'register',element:<RegisterForm />},
                {path:'activities',element:<ActivityDashboard/>},
                {path:'activities/:id',element:<ActivityDetails/>},
                {path:'createActivity',element:<ActivityForm key="create"/>},
                {path:'manage/:id',element:<ActivityForm key="manage"/>},
                {path:'profiles/:username',element:<ProfilePage />},
                {path:'errors',element:<TestErrors />}
            ]},
            
            {path:'not-found',element:<NotFound />},
            {path:'server-error',element:<ServerError />},
            {path:'*',element:<Navigate replace to='/not-found' />},
        ]
    }
]
export const router=createBrowserRouter(routes);