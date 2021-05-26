import "./App.css";
import AppBar from "./components/AppBar";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import Notes from "./pages/Notes";
import Categories from "./pages/Categories";
import Login from "./pages/login";
import Logout from "./pages/logout";
import SignUp from "./pages/SignUp";
import NoteView from "./pages/NoteView";
import NoteEdit from "./pages/NoteEdit";
import CatagoryView from "./pages/CatagoryView";
import CatagoryEdit from "./pages/CatagoryEdit";
import GetPermission from "./pages/getPermission";
import NoteScreen from "./pages/NoteScreen";

function App() {
  return (
    <BrowserRouter>
      <AppBar />
      <Switch>
        <Route path="/profile" component={Profile} />
        <Route path="/account" component={Account} />
        <Route path="/notes" component={Notes} />
        <Route path="/note/getpermission/:uuid" component={GetPermission} />
        <Route path="/note/:note" component={NoteView} />
        <Route path="/edit/note/:note" component={NoteEdit} />
        <Route path="/categories" component={Categories} />
        <Route path="/catagory/:parent" component={CatagoryView} />
        <Route path="/edit/catagory/:parent" component={CatagoryEdit} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/signup" component={SignUp} />
        <Route path="/notescreen" component={NoteScreen} />
        <Route path="/" component={HomePage} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
