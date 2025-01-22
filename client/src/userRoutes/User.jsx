// src/pages/User.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout.jsx";
import ContactGroup from "../components/user/contactGroup/ContactGroup";
import AddWhatsapp from "../components/user/addWhatsapp/AddWhatsappp";
import ContactGroupCreate from "../components/user/createContactGroup/ContactGroupCreate";
import EditGroup from "../components/user/editContactGroup/EditGroup";
import UploadExcel from "../components/user/excelUpload/UploadExcel";
import BulkMessage from "../components/user/bulkMessage/BulkMessage";
import BulkMessagee from "../components/user/whatsappBulk/BulkMessagee";
import UploadAttachment from "../components/user/uploadAttachment/UploadAttachment";
import { WaProfile } from "../components/user/WAProfile/WaProfile";
import WhatsAppGroup from "../components/user/whatsappGroup/WhatsappGroup";
import CreateWhatsappGroup from "../components/user/createWhatsappGroup/CreateWhatsappGroup";
import EditWhatsappGroup from "../components/user/editWhatsappGroup/EditWhatsappGroup";
import WhatsappGroupMessage from "../components/user/whatsAppGroupMessage/WhatsappGroupMessage";
import GroupMessage from "../components/user/groupMessage/GroupMessage";
import Event from "../components/Event/Event";
import EInvoice from "../components/user/EInvoice/EInvoice";
import ReportUser from "../components/user/reportUser/ReportUser";
import BuyersDetailsNew from "../components/user/newEinvoice/BuyersDetailsNew";
import DispatchDetailsNew from "../components/user/newEinvoice/DispatchDetailsNew.jsx";
import ReferenceDetailsNew from "../components/user/newEinvoice/ReferenceDetailsNew.jsx";
import ShipDetailsNew from "../components/user/newEinvoice/ShipDetailsNew.jsx";
import SellerDetailsNew from "../components/user/newEinvoice/SellerDetailsNew.jsx";
import SellerDetailsTable from "../components/user/newEinvoice/SellerDetailsTable.jsx";
import DispatchDetailsTable from "../components/user/newEinvoice/DispatchDetailsTable.jsx";
import BuyersDetailsTable from "../components/user/newEinvoice/BuyersDetailsTabl.jsx";
import ShipDetailsTable from "../components/user/newEinvoice/ShipDetailsTable.jsx";
import MainEinvoice from "../components/user/newEinvoice/MainEinovice.jsx";
import BuyersDetailsNewUpdate from "../components/user/newEinvoice/BuyersDetailsNewUpdate.jsx";
import DispatchDetailsNewUpdate from "../components/user/newEinvoice/DispatchDetailsNewUpdate.jsx";
import ShipDetailsNewUpdate from "../components/user/newEinvoice/ShipDetailsNewUpdate.jsx";
import SellerDetailsNewUpdate from "../components/user/newEinvoice/SellerDetailsNewUpdate.jsx";
import EventDetails from "../components/Event/EventDetails.jsx";
import UserRegistrationDetails from "../components/Event/UserRegistrationDetails.jsx";
import AddUser from "../components/admin/newChanges/AddUser.jsx";
import AllUsers from "../components/admin/newChanges/AllUsers.jsx";
import EventApprove from "../components/admin/newChanges/EventApprove.jsx";
import EditApprovePage from "../components/admin/newChanges/EditApprovePage.jsx";
import EventAdminUser from "../components/admin/newChanges/EventAdminUser.jsx";
import EmailDetails from "../components/admin/newChanges/EmailDetails.jsx";
import WhatsaAppTemplate from "../components/admin/newChanges/WhatsAppTemplate.jsx";
import SendWhatsAppMessage from "../components/admin/newChanges/SendWhatsAppMessage.jsx";
import EmailProfile from "../components/admin/newChanges/EmailProfile.jsx";
import EmailProfiles from "../components/admin/newChanges/EmailProfiles.jsx";
import EditEventAdmin from "../components/admin/newChanges/EditEventAdmin.jsx";

const User = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/ContactGroup" element={<ContactGroup />} />
        <Route path="/AddWhatsapp" element={<AddWhatsapp />} />
        <Route path="/WAprofile" element={<WaProfile />} />
        <Route path="/createContactGroup" element={<ContactGroupCreate />} />
        <Route path="/editContactGroup/:id" element={<EditGroup />} />
        <Route path="/addContact/:id" element={<UploadExcel />} />
        <Route path="/bulkMessage" element={<BulkMessage />} />
        <Route path="/bulkWhatsapp" element={<BulkMessagee />} />
        <Route path="/uploadAttachment" element={<UploadAttachment />} />
        <Route path="/WhatsappGroup" element={<WhatsAppGroup />} />
        <Route path="/addWhatsappGroup" element={<CreateWhatsappGroup />} />
        <Route
          path="/whatsappGroupMessage"
          element={<WhatsappGroupMessage />}
        />
        <Route path="/groupMessage" element={<GroupMessage />} />
        <Route path="/editWhatsappGroup/:id" element={<EditWhatsappGroup />} />
        <Route path="/sendGroupMessage" element={<WhatsappGroupMessage />} />
        <Route path="/Event" element={<Event />} />
        <Route path="/Events" element={<EventAdminUser />} />
        <Route path="/Events/Edit/:eventId" element={<EditEventAdmin />} />
        <Route path="/ReportUser" element={<ReportUser />} />
        <Route path="/e-Invoice" element={<EInvoice />} />
        <Route path="/BuyersDetails" element={<BuyersDetailsNew />} />
        <Route
          path="/BuyersDetailsUpdate/:id"
          element={<BuyersDetailsNewUpdate />}
        />
        <Route path="/BuyersDetailsTable" element={<BuyersDetailsTable />} />
        <Route path="/DispatchDetails" element={<DispatchDetailsNew />} />
        <Route
          path="/DispatchDetailsUpdate/:id"
          element={<DispatchDetailsNewUpdate />}
        />
        <Route
          path="/DispatchDetailsTable"
          element={<DispatchDetailsTable />}
        />
        <Route path="/ReferenceDetails" element={<ReferenceDetailsNew />} />
        <Route path="/ShipDetails" element={<ShipDetailsNew />} />
        <Route
          path="/ShipDetailsUpdate/:id"
          element={<ShipDetailsNewUpdate />}
        />
        <Route path="/ShipDetailsTable" element={<ShipDetailsTable />} />
        <Route path="/SellerDetails" element={<SellerDetailsNew />} />
        <Route
          path="/SellerDetailsUpdate/:id"
          element={<SellerDetailsNewUpdate />}
        />
        <Route path="/SellerTable" element={<SellerDetailsTable />} />
        <Route path="/MainEInvoice" element={<MainEinvoice />} />
        <Route path="/EventDetails" element={<EventDetails />} />
        <Route
          path="/UserRegisteredDetails/:id"
          element={<UserRegistrationDetails />}
        />
        <Route path="/AddUser" element={<AddUser />} />
        <Route path="/AllUsers" element={<AllUsers />} />
        <Route path="/EventApprove" element={<EventApprove />} />
        <Route path="/ApproveEvent/:id" element={<EditApprovePage />} />
        <Route path="/EmailDetails/:id" element={<EmailDetails />} />
        <Route path="/WhatsappTemplate" element={<WhatsaAppTemplate />} />
        <Route path="/SendWhatsAppMessage" element={<SendWhatsAppMessage />} />
        <Route path="/EmailProfile" element={<EmailProfile />} />
        <Route path="/EmailProfiles" element={<EmailProfiles />} />
      </Routes>
    </Layout>
  );
};

export default User;
