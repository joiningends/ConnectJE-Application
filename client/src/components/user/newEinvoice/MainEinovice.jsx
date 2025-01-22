import React, { useState, useEffect, useCallback } from "react";
import axios from "../../../axiosSetup";
import {
  FaFileInvoice,
  FaUser,
  FaTruck,
  FaShip,
  FaStore,
  FaBox,
  FaFileAlt,
  FaCalendarAlt,
  FaUpload,
  FaFileExcel,
  FaFileCsv,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { parse } from "papaparse";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Component() {
  const [buyerOptions, setBuyerOptions] = useState([]);
  const [dispatchOptions, setDispatchOptions] = useState([]);
  const [shipOptions, setShipOptions] = useState([]);
  const [sellerOptions, setSellerOptions] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [selectedDispatch, setSelectedDispatch] = useState("");
  const [selectedShip, setSelectedShip] = useState("");
  const [selectedSeller, setSelectedSeller] = useState("");
  const [supplyType, setSupplyType] = useState("B2B");
  const [documentType, setDocumentType] = useState("CRN");
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentDate, setDocumentDate] = useState(null);
  const [invoicePeriodStartDate, setInvoicePeriodStartDate] = useState(null);
  const [invoicePeriodEndDate, setInvoicePeriodEndDate] = useState(null);
  const [referenceOfOriginalInvoice, setReferenceOfOriginalInvoice] =
    useState("");
  const [precedingInvoiceDate, setPrecedingInvoiceDate] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [valueDetails, setValueDetails] = useState({
    total_assessable_value: 0,
    total_invoice_value: 0,
  });
  const [userGstin, setUserGstin] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const Toast = ({ message, type }) => {
    return (
      <div
        className={`fixed top-4 right-4 p-4 rounded-md shadow-md text-white ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {message}
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const whatsappUserId = localStorage.getItem("whatsappuserId");
      try {
        const buyerResponse = await axios.get(
          `http://localhost:5001/api/v1/eibuyer/by/${whatsappUserId}`
        );
        const dispatchResponse = await axios.get(
          `http://localhost:5001/api/v1/eidispatch/by/${whatsappUserId}`
        );
        const shipResponse = await axios.get(
          `http://localhost:5001/api/v1/eiship/by/${whatsappUserId}`
        );
        const sellerResponse = await axios.get(
          `http://localhost:5001/api/v1/eiseller/by/${whatsappUserId}`
        );

        setBuyerOptions(buyerResponse.data);
        setDispatchOptions(dispatchResponse.data);
        setShipOptions(shipResponse.data);
        setSellerOptions(sellerResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setToast({
          message: "Error fetching data. Please try again.",
          type: "error",
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.message]);

  const handleFileUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async e => {
      let jsonData;
      if (file.name.endsWith(".csv")) {
        const csv = e.target.result;
        const results = parse(csv, { header: true });
        jsonData = results.data;
      } else {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        jsonData = XLSX.utils.sheet_to_json(worksheet);
      }

      const processedItemList = jsonData.map(item => ({
        item_serial_number: parseInt(item["item_serial_number"]) || 0,
        is_service: item["is_service"] || "N",
        hsn_code: parseInt(item["hsn_code"]) || 0,
        unit: item["unit"] || "KGS",
        unit_price: parseFloat(item["unit_price"]) || 0,
        total_amount: parseFloat(item["total_amount"]) || 0,
        assessable_value: parseFloat(item["assessable_value"]) || 0,
        gst_rate: parseFloat(item["gst_rate"]) || 0,
        igst_amount: parseFloat(item["igst_amount"]) || 0,
        cgst_amount: parseFloat(item["cgst_amount"]) || 0,
        sgst_amount: parseFloat(item["sgst_amount"]) || 0,
        total_item_value: parseFloat(item["total_item_value"]) || 0,
      }));

      const total_assessable_value = processedItemList.reduce(
        (acc, item) => acc + (item.assessable_value || 0),
        0
      );
      const total_invoice_value = processedItemList.reduce(
        (acc, item) => acc + (item.total_item_value || 0),
        0
      );

      setItemList(processedItemList);
      setValueDetails({ total_assessable_value, total_invoice_value });
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const formatDate = date => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async () => {
    const postData = {
      user_gstin: userGstin,
      sellerId: selectedSeller,
      buyerId: selectedBuyer,
      dispatchId: selectedDispatch,
      shipId: selectedShip,
      data: {
        transaction_details: {
          supply_type: supplyType,
        },
        document_details: {
          document_type: documentType,
          document_number: documentNumber,
          document_date: formatDate(documentDate),
        },
        reference_details: {
          document_period_details: {
            invoice_period_start_date: formatDate(invoicePeriodStartDate),
            invoice_period_end_date: formatDate(invoicePeriodEndDate),
          },
        },
        preceding_document_details: [
          {
            reference_of_original_invoice: referenceOfOriginalInvoice,
            preceding_invoice_date: formatDate(precedingInvoiceDate),
          },
        ],
        value_details: {
          total_assessable_value: valueDetails?.total_assessable_value,
          total_invoice_value: valueDetails?.total_invoice_value,
        },
        item_list: itemList,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:5001/api/v1/einvoiceui/create/66728d33d67f22c83c7f8a3d",
        postData
      );
      setToast({
        message: response.data.message || "E-Invoice created successfully",
        type: "success",
      });
      clearForm();
    } catch (error) {
      console.error("Error submitting data:", error);
      setToast({
        message:
          error.response?.data?.message ||
          "An error occurred while creating the E-Invoice",
        type: "error",
      });
    }
  };

  const clearForm = () => {
    setSelectedBuyer("");
    setSelectedDispatch("");
    setSelectedShip("");
    setSelectedSeller("");
    setSupplyType("B2B");
    setDocumentType("CRN");
    setDocumentNumber("");
    setDocumentDate(null);
    setInvoicePeriodStartDate(null);
    setInvoicePeriodEndDate(null);
    setReferenceOfOriginalInvoice("");
    setPrecedingInvoiceDate(null);
    setItemList([]);
    setValueDetails({
      total_assessable_value: 0,
      total_invoice_value: 0,
    });
    setUserGstin("");
  };

  const downloadExcelDemo = () => {
    const filePath = "/itemlist.xlsx";
    window.open(filePath, "_blank");
  };

  const downloadCsvDemo = () => {
    const filePath = "/itemlist.csv";
    window.open(filePath, "_blank");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {toast.message && <Toast message={toast.message} type={toast.type} />}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-4xl border border-gray-200">
        <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
          <FaFileInvoice className="text-xl sm:text-2xl md:text-3xl text-[#B197FC] mr-3" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            E-Invoice Page
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="userGstin"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              User GSTIN
            </label>
            <div className="relative">
              <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="userGstin"
                value={userGstin}
                onChange={e => setUserGstin(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="buyer"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Buyer
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  id="buyer"
                  value={selectedBuyer}
                  onChange={e => setSelectedBuyer(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
                >
                  <option value="">Select Buyer</option>
                  {buyerOptions.map(buyer => (
                    <option key={buyer._id} value={buyer._id}>
                      {buyer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="dispatch"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dispatch
              </label>
              <div className="relative">
                <FaTruck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  id="dispatch"
                  value={selectedDispatch}
                  onChange={e => setSelectedDispatch(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
                >
                  <option value="">Select Dispatch</option>
                  {dispatchOptions.map(dispatch => (
                    <option key={dispatch._id} value={dispatch._id}>
                      {dispatch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="ship"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ship
              </label>
              <div className="relative">
                <FaShip className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  id="ship"
                  value={selectedShip}
                  onChange={e => setSelectedShip(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
                >
                  <option value="">Select Ship</option>
                  {shipOptions.map(ship => (
                    <option key={ship._id} value={ship._id}>
                      {ship.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="seller"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Seller
              </label>
              <div className="relative">
                <FaStore className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  id="seller"
                  value={selectedSeller}
                  onChange={e => setSelectedSeller(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
                >
                  <option value="">Select Seller</option>
                  {sellerOptions.map(seller => (
                    <option key={seller._id} value={seller._id}>
                      {seller.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="supplyType"
                className="block text-sm font-medium text-gray-700 
mb-1"
              >
                Supply Type
              </label>
              <div className="relative">
                <FaBox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  id="supplyType"
                  value={supplyType}
                  onChange={e => setSupplyType(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
                >
                  <option value="B2B">B2B</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="documentType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Document Type
              </label>
              <div className="relative">
                <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  id="documentType"
                  value={documentType}
                  onChange={e => setDocumentType(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
                >
                  <option value="CRN">CRN</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="documentNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Document Number
              </label>
              <div className="relative">
                <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="documentNumber"
                  value={documentNumber}
                  onChange={e => setDocumentNumber(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="referenceOfOriginalInvoice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reference of Original Invoice
              </label>
              <div className="relative">
                <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="referenceOfOriginalInvoice"
                  value={referenceOfOriginalInvoice}
                  onChange={e => setReferenceOfOriginalInvoice(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Date Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="documentDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Document Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <DatePicker
                    id="documentDate"
                    selected={documentDate}
                    onChange={date => setDocumentDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="precedingInvoiceDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preceding Invoice Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <DatePicker
                    id="precedingInvoiceDate"
                    selected={precedingInvoiceDate}
                    onChange={date => setPrecedingInvoiceDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="invoicePeriodStartDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Invoice Period Start Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <DatePicker
                    id="invoicePeriodStartDate"
                    selected={invoicePeriodStartDate}
                    onChange={date => setInvoicePeriodStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="invoicePeriodEndDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Invoice Period End Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <DatePicker
                    id="invoicePeriodEndDate"
                    selected={invoicePeriodEndDate}
                    onChange={date => setInvoicePeriodEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="upload"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Excel or CSV of Item Lists
            </label>
            <div className="relative">
              <FaUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="file"
                id="upload"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#B197FC] focus:border-transparent"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Please ensure your file follows the standard format for item
              lists. You can download sample files below for reference.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={downloadExcelDemo}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#B197FC] hover:bg-[#9f7ff7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B197FC]"
              >
                <FaFileExcel className="mr-2" />
                Download Excel Demo
              </button>
              <button
                onClick={downloadCsvDemo}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#B197FC] hover:bg-[#9f7ff7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B197FC]"
              >
                <FaFileCsv className="mr-2" />
                Download CSV Demo
              </button>
            </div>
          </div>

          {itemList.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Item List:</h3>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <pre className="text-xs sm:text-sm md:text-base">
                  {JSON.stringify(itemList, null, 2)}
                </pre>
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">
                Value Details:
              </h3>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <pre className="text-xs sm:text-sm md:text-base">
                  {JSON.stringify(valueDetails, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={clearForm}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#B197FC] focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md bg-[#B197FC] text-white hover:bg-[#9f7ff7] focus:outline-none focus:ring-2 focus:ring-[#B197FC] focus:ring-offset-2"
              disabled={
                !selectedBuyer ||
                !selectedDispatch ||
                !selectedShip ||
                !selectedSeller
              }
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
