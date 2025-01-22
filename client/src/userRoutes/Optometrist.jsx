// src/pages/Optometrist.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import ScannerOptometrist from "../components/admin/newChanges/ScannerOptometrist";
import OptometristEyePowerPage from "../components/admin/newChanges/OptometristEyePowerPage";

function Optometrist() {
  return (
    <Layout>
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/Scanner" element={<ScannerOptometrist />} />
          <Route
            path="/TestResult/:id/:eventId"
            element={<OptometristEyePowerPage />}
          />
          <Route
            path="/EventScannerTest"
            element={<OptometristEyePowerPage />}
          />
        </Routes>
      </div>
    </Layout>
  );
}

export default Optometrist;
