// src/pages/SalesMarketing.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import SalesMarketEvent from "../components/admin/newChanges/SalesMarketEvent";
import EventPageSales from "../components/admin/newChanges/EventPageSales";

function SalesMarketing() {
  return (
    <Layout>
      <Routes>
        <Route path="/Event" element={<SalesMarketEvent />} />
        <Route path="/AddEvent" element={<EventPageSales />} />
      </Routes>
    </Layout>
  );
}

export default SalesMarketing;