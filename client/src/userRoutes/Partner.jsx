// src/pages/Partner.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import EventPartner from "../components/admin/newChanges/EventPartner";

function Partner() {
  return (
    <Layout>
      <Routes>
        <Route path="/EventDetails" element={<EventPartner />} />
      </Routes>
    </Layout>
  );
}

export default Partner;
