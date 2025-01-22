// src/pages/Scanner.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import ScannerNew from "../components/admin/newChanges/ScannerNew";

function Scanner() {
  return (
    <Layout>
      <Routes>
        <Route path="/EventScanner" element={<ScannerNew />} />
      </Routes>
    </Layout>
  );
}

export default Scanner;