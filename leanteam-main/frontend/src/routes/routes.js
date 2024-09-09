import { Page403 } from "../components/Page403.jsx";
import { Page404 } from "../components/Page404.jsx";
import { Page500 } from "../components/Page500.jsx";
import { Login } from "../components/Authentication/Login.jsx";
import { ForgotPassword } from "../components/Authentication/ForgotPassword.jsx";
import { Dashboard } from "../components/Dashboard.jsx";
import { Profile } from "../components/Profile.jsx";
import { Accessess } from "../components/Administrator/Accessess.jsx";
import { Teams } from "../components/Administrator/Teams.jsx";
import { Users } from "../components/Administrator/Users.jsx";
import { Factories } from "../components/Administrator/Factories.jsx";

export const routes = {
    Page403: Page403,
    Page404: Page404,
    Page500: Page500,
    Login: Login,
    ForgotPassword: ForgotPassword,
    Dashboard: Dashboard,
    Profile: Profile,
    Users: Users,
    Teams: Teams,
    Accessess: Accessess,
    Factories: Factories,
};
