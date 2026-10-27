import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Entrance from "../pages/Entrance";
import Manager from "../pages/Manager";
import MyMedicines from "../pages/MyMedicines";
import PatientDetails from "../pages/PatientDetails";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import HomeRedirect from "./HomeRedirect";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
              { index: true, element: <HomeRedirect /> },
            { path: 'login', element: <Entrance /> },
            {
                element: <ProtectedRoute role="patient" />,
                children:[
                     { path: 'my-medicines', element: <MyMedicines /> },
                      { path: 'my-medicines/:date', element: <MyMedicines /> },
                ],
            },
            {
                element: <ProtectedRoute role="caregiver" />,
                children:[
                    { path: 'manager', element: <Manager /> },
                    { path: 'manager/patients/:id', element: <PatientDetails /> },

                ]
            },
            { path: '*', element: <NotFound /> },
        ],
    },
])
