import React, { useState } from "react";

import SellerDetails from "./SellerDetails";
import BuyerDetails from "./BuyersDetails";
import DispatchDetails from "./DispatchDetails";
import ShipDetails from "./ShipDetails";
import ReferenceDetails from "./ReferenceDetails";
import ValueDetails from "./ValueDetails";
import ItemList from "./ItemList";
import DocumentDetailsNew from "./DocumentDetailsNew";

function EInvoice() {
  const [invoiceData, setInvoiceData] = useState({
    access_token: "0c56d92e88ba114f7aeb00acfc4e32f635e1af6e",
    user_gstin: "09AAAPG7885R002",
    transaction_details: {
      supply_type: "B2B",
    },
    document_details: {
      document_type: "INV",
      document_number: "INV2024/24",
      document_date: "22/03/2024",
    },
    seller_details: {
      gstin: "09AAAPG7885R002",
      legal_name: "MastersIndia UP",
      address1: "Vila",
      location: "Noida",
      pincode: 201301,
      state_code: "09",
    },
    buyer_details: {
      gstin: "05AAAPG7885R002",
      legal_name: "MastersIndia UT",
      address1: "Kila",
      location: "Nainital",
      place_of_supply: "5",
    },
    dispatch_details: {
      company_name: "MastersIndia UP",
      address1: "Vila",
      location: "Noida",
      pincode: 201301,
      state_code: "09",
    },
    ship_details: {
      legal_name: "MastersIndia UT",
      address1: "Kila",
      location: "Nainital",
      pincode: 263001,
      state_code: "05",
    },
    reference_details: {
      document_period_details: {
        invoice_period_start_date: "22/03/2024",
        invoice_period_end_date: "22/03/2024",
      },
      preceding_document_details: [
        {
          reference_of_original_invoice: "CFRT/0006",
          preceding_invoice_date: "14/03/2024",
        },
      ],
    },
    value_details: {
      total_assessable_value: 4,
      total_invoice_value: 4.2,
    },
    item_list: [
      {
        item_serial_number: "501",
        is_service: "N",
        hsn_code: "1001",
        unit_price: 4,
        total_amount: 4,
        assessable_value: 4,
        gst_rate: 5,
        total_item_value: 4.2,
        batch_details: {
          name: "aaa",
        },
      },
    ],
  });

  const updateData = (updatedSection, newData) => {
    setInvoiceData(prevData => ({
      ...prevData,
      [updatedSection]: newData,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">e-Invoice</h1>
        <DocumentDetailsNew
          data={invoiceData.document_details}
          onUpdate={data => updateData("document_details", data)}
        />
        <SellerDetails
          data={invoiceData.seller_details}
          onUpdate={data => updateData("seller_details", data)}
        />
        <BuyerDetails
          data={invoiceData.buyer_details}
          onUpdate={data => updateData("buyer_details", data)}
        />
        <DispatchDetails
          data={invoiceData.dispatch_details}
          onUpdate={data => updateData("dispatch_details", data)}
        />
        <ShipDetails
          data={invoiceData.ship_details}
          onUpdate={data => updateData("ship_details", data)}
        />
        <ReferenceDetails
          data={invoiceData.reference_details}
          onUpdate={data => updateData("reference_details", data)}
        />
        <ValueDetails
          data={invoiceData.value_details}
          onUpdate={data => updateData("value_details", data)}
        />
        <ItemList
          data={invoiceData.item_list}
          onUpdate={data => updateData("item_list", data)}
        />
      </div>
    </div>
  );
}

export default EInvoice;
