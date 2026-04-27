import { Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import Foodlog from "./pages/Foodlog"
import Activitylog from "./pages/Activitylog"
import Profile from "./pages/Profile"
import { useAppContext } from "./context/AppContext"
import Login from "./pages/Login"
import Loading from "./components/Loading"
import Onboarding from "./pages/Onboarding"
import { Toaster } from "react-hot-toast"

const App = () => {
  const {user, isUserFetched, onboardingCompleted} = useAppContext();

  if(!user){
    return isUserFetched ? <Login/> : <Loading/>
  }
  if(!onboardingCompleted){
    return <Onboarding/>
  }
  return (
    <>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path="food" element={<Foodlog/>}/>
          <Route path="activity" element={<Activitylog/>}/>
          <Route path="profile" element={<Profile/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App