import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  MessageCircle,
  LogOut,
  Database,
  Calendar,
  User,
  FileText,
  Send,
  Mail,
  Menu,
  X,
  BarChart,
  CheckCircle,
  ShoppingBag,
  Truck,
  Ship,
  ShoppingCart,
} from "lucide-react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "axios";
import joiningEndsLogo from "../../assets/JoiningEndsLogo.png";

export default function Sidebar() {
  const [userType, setUserType] = useState("");
  const [wa, setWa] = useState(false);
  const [wag, setWag] = useState(false);
  const [event, setEvent] = useState(false);
  const [wfb, setWfb] = useState(false);
  const [ei, setEi] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const type = localStorage.getItem("whatsappusertype");
    setUserType(type);

    const fetchData = async () => {
      const id = localStorage.getItem("whatsappuserId");
      try {
        const response = await axios.get(
          `http://localhost:5001/api/v1/clients/clients/${id}`
        );
        const data = response.data;
        console.log(data);
        setWa(data.wa);
        setEi(data.ei);
        setWag(data.Wag);
        setEvent(data.event);
        setWfb(data.wfb);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    confirmAlert({
      title: "Confirm Logout",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            localStorage.removeItem("whatsappusertype");
            localStorage.removeItem("whatsappusertoken");
            localStorage.removeItem("whatsappuserId");
            localStorage.removeItem("facebookToken");
            localStorage.setItem("isLoggedIn", "false");
            delete axios.defaults.headers.common["Authorization"];
            window.location.href = "/SignIn";
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const userLinks = [
    {
      label: "Add WA Profile",
      icon: <UserPlus className="h-5 w-5" aria-hidden="true" />, // Represents adding a new user/profile.
      href: "/WAprofile",
      showWhen: ["wa", "wag"],
    },
    {
      label: "Contact Group",
      icon: <Users className="h-5 w-5" aria-hidden="true" />, // Indicates a group of people.
      href: "/ContactGroup",
      showWhen: ["wa"],
    },
    {
      label: "Send Single Message",
      icon: <Send className="h-5 w-5" aria-hidden="true" />, // Represents sending a message.
      href: "/bulkWhatsapp",
      showWhen: ["wa"],
    },
    {
      label: "Send WhatsApp Message",
      icon: <Send className="h-5 w-5" aria-hidden="true" />, // Represents messaging action.
      href: "/SendWhatsAppMessage",
      showWhen: ["wfb"],
    },
    {
      label: "Send Group Message",
      icon: <MessageCircle className="h-5 w-5" aria-hidden="true" />, // Indicates group communication.
      href: "/groupMessage",
      showWhen: ["wag"],
    },
    {
      label: "Whatsapp Group",
      icon: <Users className="h-5 w-5" aria-hidden="true" />, // Group-oriented.
      href: "/WhatsappGroup",
      showWhen: ["wag"],
    },

    {
      label: "Event",
      icon: <Calendar className="h-5 w-5" aria-hidden="true" />, // Clearly represents events and schedules.
      href: "/Events",
      showWhen: ["event"],
    },
    {
      label: "Report",
      icon: <BarChart className="h-5 w-5" aria-hidden="true" />, // Represents analytics or reporting.
      href: "/ReportUser",
      showWhen: ["wa"],
    },
    {
      label: "Storage",
      icon: <Database className="h-5 w-5" aria-hidden="true" />, // Signifies storage or database.
      href: "/uploadAttachment",
      showWhen: ["always"],
    },
    {
      label: "User",
      icon: <User className="h-5 w-5" aria-hidden="true" />, // Represents individual users.
      href: "/AllUsers",
      showWhen: ["event"],
    },
    {
      label: "Email Profiles",
      icon: <Mail className="h-5 w-5" aria-hidden="true" />, // Represents email communication.
      href: "/EmailProfiles",
      showWhen: ["event"],
    },
    {
      label: "Event Approval",
      icon: <CheckCircle className="h-5 w-5" aria-hidden="true" />, // Indicates approval or verification.
      href: "/EventApprove",
      showWhen: ["event"],
    },
    // {
    //   label: "Whatsapp Templates",
    //   icon: <FileText className="h-5 w-5" aria-hidden="true" />, // Indicates document templates.
    //   href: "/WhatsappTemplate",
    //   showWhen: ["always"],
    // },
    {
      label: "Buyers Details",
      icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" />, // Indicates buyer-related data.
      href: "/BuyersDetailsTable",
      showWhen: ["ei"],
    },
    {
      label: "Dispatch Details",
      icon: <Truck className="h-5 w-5" aria-hidden="true" />, // Represents dispatch or delivery.
      href: "/DispatchDetailsTable",
      showWhen: ["ei"],
    },
    {
      label: "Ship Details",
      icon: <Ship className="h-5 w-5" aria-hidden="true" />, // Represents shipping/logistics.
      href: "/ShipDetailsTable",
      showWhen: ["ei"],
    },
    {
      label: "Seller Details",
      icon: <ShoppingCart className="h-5 w-5" aria-hidden="true" />, // Represents seller-related data.
      href: "/SellerTable",
      showWhen: ["ei"],
    },
    {
      label: "E Invoice",
      icon: <FileText className="h-5 w-5" aria-hidden="true" />, // Represents seller-related data.
      href: "/MainEInvoice",
      showWhen: ["ei"],
    },
  ];

  const adminLinks = [
    {
      label: "Customer",
      icon: <Users className="h-5 w-5" aria-hidden="true" />,
      href: "/allCustomers",
    },
  ];

  const salesMarketingLinks = [
    {
      label: "Event",
      icon: <Calendar className="h-5 w-5" aria-hidden="true" />,
      href: "/Event",
    },
  ];

  const scannerLinks = [
    {
      label: "Event Scanner",
      icon: <Database className="h-5 w-5" aria-hidden="true" />,
      href: "/EventScanner",
    },
  ];

  const optometristLinks = [
    {
      label: "Scan",
      icon: <Database className="h-5 w-5" aria-hidden="true" />,
      href: "/Scanner",
    },
  ];

  const partnerLinks = [
    {
      label: "Event Details",
      icon: <Calendar className="h-5 w-5" aria-hidden="true" />,
      href: "/EventDetails",
    },
  ];

  const filteredUserLinks = userLinks.filter(
    link =>
      link.showWhen.includes("always") ||
      (wa && link.showWhen.includes("wa")) ||
      (wag && link.showWhen.includes("wag")) ||
      (event && link.showWhen.includes("event")) ||
      (wfb && link.showWhen.includes("wfb")) ||
      (ei && link.showWhen.includes("ei"))
  );

  const renderLinks = links => (
    <div className="space-y-1">
      {links.map(link => (
        <Link
          key={link.label}
          to={link.href}
          className="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 hover:bg-purple-100 hover:text-purple-600"
          style={{ color: "#B197FC" }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="mr-3 flex-shrink-0">{link.icon}</span>
          <span className="flex-grow truncate">{link.label}</span>
        </Link>
      ))}
    </div>
  );

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <nav className="-mx-3 space-y-6 overflow-y-auto px-3">
        {userType === "admin" && (
          <div className="space-y-3">
            <label className="px-3 text-xs font-semibold uppercase text-gray-900">
              Customer Management
            </label>
            {renderLinks(adminLinks)}
          </div>
        )}
        {userType === "Sales Marketing" && (
          <div className="space-y-3">
            <label className="px-3 text-xs font-semibold uppercase text-gray-900">
              Sales & Marketing
            </label>
            {renderLinks(salesMarketingLinks)}
          </div>
        )}
        {userType === "Scanner" && (
          <div className="space-y-3">
            <label className="px-3 text-xs font-semibold uppercase text-gray-900">
              Scanner
            </label>
            {renderLinks(scannerLinks)}
          </div>
        )}
        {userType === "Optometrist" && (
          <div className="space-y-3">
            <label className="px-3 text-xs font-semibold uppercase text-gray-900">
              Optometrist
            </label>
            {renderLinks(optometristLinks)}
          </div>
        )}
        {userType === "Partner" && (
          <div className="space-y-3">
            <label className="px-3 text-xs font-semibold uppercase text-gray-900">
              Partner
            </label>
            {renderLinks(partnerLinks)}
          </div>
        )}
        {userType !== "admin" &&
          userType !== "Sales Marketing" &&
          userType !== "Scanner" &&
          userType !== "Optometrist" &&
          userType !== "Partner" && (
            <div className="space-y-3">
              <label className="px-3 text-xs font-semibold uppercase text-gray-900">
                Whatsapp
              </label>
              {renderLinks(filteredUserLinks)}
            </div>
          )}
      </nav>
      <div className="mt-6 px-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button - Only visible when sidebar is closed */}
      {!isMobileMenuOpen && (
        <button
          className="fixed left-4 top-4 z-50 rounded-md bg-white p-2 text-gray-400 shadow-md transition-colors duration-200 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white pb-4 pt-5 shadow-xl">
          <div className="flex items-center justify-between px-4 pb-2">
            <div className="flex items-center">
              <img
                src={joiningEndsLogo}
                alt="Joining Ends Logo"
                className="h-24 w-auto" // Increased size for better visibility on small screens
              />
            </div>
            {/* Close button - Only visible when sidebar is open */}
            <button
              className="rounded-md bg-white p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-5 flex-1 px-2">{sidebarContent}</div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col overflow-y-auto border-r bg-white px-5 py-8 md:flex">
        <div className="mb-6 flex items-center justify-center">
          <img
            src={joiningEndsLogo}
            alt="Joining Ends Logo"
            className="h-20 w-auto" // Kept the same size as before for desktop
          />
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}
