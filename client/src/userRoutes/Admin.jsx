// src/pages/Admin.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import CreateCustomer from "../components/admin/Create Customer/CreateCustomer";
import EditCustomer from "../components/admin/EditCusotmer.jsx/EditCustomer";
import AllCustomers from "../components/admin/Customers/AllCustomers";
import Campaigns from "../components/admin/campaigns/Campaigns";
import ReportAdmin from "../components/admin/reportAdmin/ReportAdmin";
import AddUser from "../components/admin/newChanges/AddUser";
import AllUsers from "../components/admin/newChanges/AllUsers";
import EventApprove from "../components/admin/newChanges/EventApprove";
import EventCreationAdmin from "../components/admin/newChanges/EventCreationAdmin";
import EventPageSales from "../components/admin/newChanges/EventPageSales";
import EditApprovePage from "../components/admin/newChanges/EditApprovePage";

const Admin = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/CreateCustomer" element={<CreateCustomer />} />
        <Route path="/EditCreateCustomer/:id" element={<EditCustomer />} />
        <Route path="/allCustomers" element={<AllCustomers />} />
        <Route path="/campaigns/:id" element={<Campaigns />} />
        <Route path="/Report/:id" element={<ReportAdmin />} />
        <Route path="/AddUser" element={<AddUser />} />
        <Route path="/AllUsers" element={<AllUsers />} />
        <Route path="/AdminEventCreation" element={<EventCreationAdmin />} />
        <Route path="/EventApprove" element={<EventApprove />} />
        <Route path="/EventPageSales" element={<EventPageSales />} />
        <Route path="/ApproveEvent/:id" element={<EditApprovePage />} />
      </Routes>
    </Layout>
  );
};

export default Admin;