import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/nav";
import Home from "./pages/Home";
import ListingPage from "./pages/ListingPage";
import LandingPage from "./pages/landingPage";
import PartnersPage from "./pages/PartnersPage";
import CategoriesPage from "./pages/CategoriesPage";
import AccountPage from "./pages/AccountPage";
import SignUp from './pages/SignUp';
import Login from "./pages/LogIn";

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing/:id" element={<ListingPage />} />
        <Route path="/" element={<LandingPage />} />
          <Route path="/partners" element={<PartnersPage />} />
           <Route path="/categories" element={<CategoriesPage />} />
             <Route path="/account" element={<AccountPage />} />
             <Route path ="/signup" element= {<SignUp/>}/>
             <Route path="/login" element={<Login
              />
             }/>
      </Routes>
    </div>
  );
}
