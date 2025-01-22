import React, { useState, useRef } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  ArrowLeft,
  CalendarIcon,
  Smile,
  Bold,
  Italic,
  Strikethrough,
  Code,
  ExternalLink,
  Phone,
  Copy,
  Ban,
  ChevronDown,
  Type,
  Image,
  Video,
  FileText,
  MapPin,
} from "lucide-react";

const buttonTypes = {
  "marketing-optout": "Marketing Opt-out",
  website: "Visit Website",
  phone: "Call Phone Number",
  "offer-code": "Copy Offer Code",
};

const buttonTypeMaximums = {
  "marketing-optout": 1,
  website: 2,
  phone: 1,
  "offer-code": 1,
};

const buttonTypeIcons = {
  "marketing-optout": Ban,
  website: ExternalLink,
  phone: Phone,
  "offer-code": Copy,
};

const headerTypes = [
  { value: "none", label: "None", icon: Ban },
  { value: "text", label: "Text", icon: Type },
  { value: "image", label: "Image", icon: Image },
  { value: "video", label: "Video", icon: Video },
  { value: "document", label: "Document", icon: FileText },
  { value: "location", label: "Location", icon: MapPin },
];

export default function WhatsappTemplate() {
  const [activeTab, setActiveTab] = useState("manage");
  const [isCreating, setIsCreating] = useState(false);
  const [createStep, setCreateStep] = useState("setup");
  const [date, setDate] = useState(new Date());
  const [templateName, setTemplateName] = useState("");
  const [templateLanguage, setTemplateLanguage] = useState("English");
  const [templateCategory, setTemplateCategory] = useState("Marketing");
  const [headerType, setHeaderType] = useState("none");
  const [headerContent, setHeaderContent] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [templateFooter, setTemplateFooter] = useState("");
  const [buttons, setButtons] = useState([]);
  const [newButtonType, setNewButtonType] = useState("marketing-optout");
  const [newButtonLabel, setNewButtonLabel] = useState("");
  const [newButtonValue, setNewButtonValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedField, setSelectedField] = useState("all");
  const textareaRef = useRef(null);

  const templates = [
    {
      id: 1,
      name: "hello_world",
      category: "UTILITY",
      status: "Active – Quality pending",
      language: "English (US)",
      messagesSent: "Fewer than 1,000 sends",
      messagesOpened: "0",
      topBlockReason: "––",
      lastEdited: "4 Sep 2024",
    },
  ];

  const buttonTypeCounts = buttons.reduce((acc, button) => {
    acc[button.type] = (acc[button.type] || 0) + 1;
    return acc;
  }, {});

  const canAddButtonType = type => {
    const currentCount = buttonTypeCounts[type] || 0;
    return currentCount < buttonTypeMaximums[type];
  };

  const addButton = () => {
    if (canAddButtonType(newButtonType)) {
      setButtons([
        ...buttons,
        {
          type: newButtonType,
          label: newButtonLabel,
          value: newButtonValue,
        },
      ]);
      setNewButtonLabel("");
      setNewButtonValue("");
    }
  };

  const removeButton = index => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const formatText = format => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = templateBody.substring(start, end);
    let formattedText = templateBody;

    let wrapper = "";
    switch (format) {
      case "bold":
        wrapper = "*";
        break;
      case "italic":
        wrapper = "_";
        break;
      case "strikethrough":
        wrapper = "~";
        break;
      case "monospace":
        wrapper = "```";
        break;
    }

    formattedText =
      formattedText.substring(0, start) +
      `${wrapper}${selectedText}${wrapper}` +
      formattedText.substring(end);
    setTemplateBody(formattedText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + wrapper.length, end + wrapper.length);
    }, 0);
  };

  const addEmoji = emoji => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newBody =
      templateBody.substring(0, start) + emoji + templateBody.substring(end);
    setTemplateBody(newBody);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);

    setShowEmojiPicker(false);
  };

  const addVariable = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newBody =
      templateBody.substring(0, start) +
      "{{variable}}" +
      templateBody.substring(end);
    setTemplateBody(newBody);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 11, start + 11);
    }, 0);
  };

  const renderManageTemplates = () => (
    <div className="border border-gray-200 rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-2">Message Templates</h2>
      <p className="text-gray-600 mb-4">
        Create and manage message templates for your WhatsApp Business account
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-2 py-2 border border-gray-300 rounded-md"
          />
          <Search
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <select className="px-2 py-2 border border-gray-300 rounded-md">
          <option value="">Category</option>
          <option value="utility">Utility</option>
          <option value="marketing">Marketing</option>
          <option value="authentication">Authentication</option>
        </select>
        <select className="px-2 py-2 border border-gray-300 rounded-md">
          <option value="">Language</option>
          <option value="en">English (US)</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
        <select className="px-2 py-2 border border-gray-300 rounded-md">
          <option value="">Filter</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
        <button className="px-2 py-2 border border-gray-300 rounded-md flex items-center">
          <CalendarIcon size={18} className="mr-2" />
          Last 30 days
        </button>
        <select
          className="px-2 py-2 border border-gray-300 rounded-md"
          value={selectedField}
          onChange={e => setSelectedField(e.target.value)}
        >
          <option value="all">All Fields</option>
          <option value="name">Template Name</option>
          <option value="category">Category</option>
          <option value="language">Language</option>
          <option value="status">Status</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2 text-xs">Template name</th>
              <th className="text-left p-2 text-xs">Category</th>
              <th className="text-left p-2 text-xs">Language</th>
              <th className="text-left p-2 text-xs">Status</th>
              <th className="text-left p-2 text-xs">Messages sent</th>
              <th className="text-left p-2 text-xs">Messages opened</th>
              <th className="text-left p-2 text-xs">Top block reason</th>
              <th className="text-left p-2 text-xs">Last edited</th>
            </tr>
          </thead>
          <tbody>
            {templates.map(template => (
              <tr key={template.id} className="border-b border-gray-200">
                <td className="p-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                  {template.name}
                </td>
                <td className="p-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                  {template.category}
                </td>
                <td className="p-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                  {template.language}
                </td>
                <td className="p-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    {template.status}
                  </span>
                </td>
                <td className="p-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                  {template.messagesSent}
                </td>
                <td className="p-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                  {template.messagesOpened}
                </td>
                <td className="p-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                  {template.topBlockReason}
                </td>
                <td className="p-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                  {template.lastEdited}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          1 message template shown (total active templates: 1 of 250)
        </p>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-purple-400 text-white rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create Template
        </button>
      </div>
    </div>
  );

  const renderTemplatePreview = () => (
    <div className="border border-gray-200 rounded-lg p-4 bg-green-100">
      <div className="bg-white rounded-lg shadow-sm p-4 max-w-sm mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-green-600">
            WhatsApp Business
          </span>
          <span className="text-sm text-gray-500">12:00 PM</span>
        </div>
        {headerType !== "none" && (
          <div className="mb-2">
            {headerType === "text" && (
              <div className="font-semibold">{headerContent}</div>
            )}
            {headerType === "image" && (
              <img
                src={headerContent}
                alt="Header"
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
            {headerType === "video" && (
              <video
                src={headerContent}
                controls
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
            {headerType === "document" && (
              <div className="flex items-center">
                <FileText className="mr-2" />
                <span>{headerContent}</span>
              </div>
            )}
            {headerType === "location" && (
              <div className="flex items-center">
                <MapPin className="mr-2" />
                <span>{headerContent}</span>
              </div>
            )}
          </div>
        )}
        <div className="mb-2 whitespace-pre-wrap">
          {templateBody || "Your message body here"}
        </div>
        {templateFooter && (
          <div className="text-sm text-gray-500">{templateFooter}</div>
        )}
        {buttons.length > 0 && (
          <div className="mt-4 space-y-2">
            {buttons.map((button, index) => {
              const ButtonIcon = buttonTypeIcons[button.type];
              return (
                <button
                  key={index}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md flex items-center justify-center"
                >
                  {ButtonIcon && <ButtonIcon size={18} className="mr-2" />}
                  {button.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderEditTemplate = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="template-name" className="block mb-1">
            Template name
          </label>
          <input
            id="template-name"
            type="text"
            placeholder="Enter template name"
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="language" className="block mb-1">
            Language
          </label>
          <select
            id="language"
            value={templateLanguage}
            onChange={e => setTemplateLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>
        <div>
          <label htmlFor="header-type" className="block mb-1">
            Header Type
          </label>
          <select
            id="header-type"
            value={headerType}
            onChange={e => setHeaderType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {headerTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        {headerType !== "none" && (
          <div>
            <label htmlFor="header-content" className="block mb-1">
              Header Content
            </label>
            {headerType === "text" && (
              <input
                id="header-content"
                type="text"
                placeholder="Enter header text"
                value={headerContent}
                onChange={e => setHeaderContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            )}
            {headerType === "image" && (
              <input
                id="header-content"
                type="url"
                placeholder="Enter image URL"
                value={headerContent}
                onChange={e => setHeaderContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            )}
            {headerType === "video" && (
              <input
                id="header-content"
                type="url"
                placeholder="Enter video URL"
                value={headerContent}
                onChange={e => setHeaderContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            )}
            {headerType === "document" && (
              <input
                id="header-content"
                type="text"
                placeholder="Enter document name"
                value={headerContent}
                onChange={e => setHeaderContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            )}
            {headerType === "location" && (
              <input
                id="header-content"
                type="text"
                placeholder="Enter location name"
                value={headerContent}
                onChange={e => setHeaderContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            )}
          </div>
        )}
        <div>
          <label htmlFor="body" className="block mb-1">
            Body
          </label>
          <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md mb-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Smile size={18} />
            </button>
            <button
              onClick={() => formatText("bold")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Bold size={18} />
            </button>
            <button
              onClick={() => formatText("italic")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Italic size={18} />
            </button>
            <button
              onClick={() => formatText("strikethrough")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Strikethrough size={18} />
            </button>
            <button
              onClick={() => formatText("monospace")}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Code size={18} />
            </button>
            <button
              onClick={addVariable}
              className="p-1 hover:bg-gray-100 rounded"
            >
              + Add variable
            </button>
          </div>
          {showEmojiPicker && (
            <div className="mb-2 flex flex-wrap gap-2">
              {["😊", "😂", "❤️", "👍", "🎉", "✨", "🌟", "💯"].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <textarea
            id="body"
            placeholder="Enter your message here"
            value={templateBody}
            onChange={e => setTemplateBody(e.target.value)}
            ref={textareaRef}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="footer" className="block mb-1">
            Footer (Optional)
          </label>
          <input
            id="footer"
            type="text"
            placeholder="Add a short footer"
            value={templateFooter}
            onChange={e => setTemplateFooter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-1">Buttons</label>
          <div className="space-y-2">
            <select
              value={newButtonType}
              onChange={e => setNewButtonType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {Object.entries(buttonTypes).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Button Label"
              value={newButtonLabel}
              onChange={e => setNewButtonLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Button Value (URL/Phone/Code)"
              value={newButtonValue}
              onChange={e => setNewButtonValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={addButton}
              disabled={
                !canAddButtonType(newButtonType) ||
                !newButtonLabel ||
                !newButtonValue
              }
              className="w-full px-4 py-2 bg-purple-400 text-white rounded-md disabled:opacity-50"
            >
              Add Button
            </button>
          </div>
          {buttons.length > 0 && (
            <div className="mt-4 space-y-2">
              {buttons.map((button, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border border-gray-300 rounded-md"
                >
                  <div>
                    <div className="font-medium">{button.label}</div>
                    <div className="text-sm text-gray-600">{button.type}</div>
                  </div>
                  <button
                    onClick={() => removeButton(index)}
                    className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Template Preview</h3>
        {renderTemplatePreview()}
      </div>
    </div>
  );

  const renderCreateTemplate = () => (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={() => setIsCreating(false)}
            className="mr-2 p-1 hover:bg-gray-100 rounded"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold">Create Message Template</h2>
            <p className="text-gray-600">
              Design a new template for your WhatsApp messages
            </p>
          </div>
        </div>
        <div className="flex border border-gray-300 rounded-md">
          <button
            onClick={() => setCreateStep("setup")}
            className={`px-4 py-2 ${
              createStep === "setup"
                ? "bg-purple-400 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Set up
          </button>
          <button
            onClick={() => setCreateStep("edit")}
            className={`px-4 py-2 ${
              createStep === "edit"
                ? "bg-purple-400 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setCreateStep("review")}
            className={`px-4 py-2 ${
              createStep === "review"
                ? "bg-purple-400 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Review
          </button>
        </div>
      </div>
      {createStep === "setup" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Set up your template</h3>
          <p className="text-gray-600 mb-4">
            Choose the category that best describes your message template.
          </p>
          <div className="mb-4">
            <label htmlFor="category" className="block mb-1">
              Category
            </label>
            <select
              id="category"
              value={templateCategory}
              onChange={e => setTemplateCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Marketing">Marketing</option>
              <option value="Utility">Utility</option>
              <option value="Authentication">Authentication</option>
            </select>
          </div>
          <p className="text-sm text-gray-600">
            Send promotions or announcements to increase awareness and
            engagement.
          </p>
        </div>
      )}
      {createStep === "edit" && renderEditTemplate()}
      {createStep === "review" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Review your template</h3>
          <p className="text-gray-600 mb-4">
            Please review your template before submitting.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Template Details</h4>
              <p>
                <strong>Name:</strong> {templateName}
              </p>
              <p>
                <strong>Language:</strong> {templateLanguage}
              </p>
              <p>
                <strong>Category:</strong> {templateCategory}
              </p>
              <p>
                <strong>Header Type:</strong> {headerType}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Template Preview</h4>
              {renderTemplatePreview()}
            </div>
          </div>
        </div>
      )}
      <div className="mt-4">
        <button
          className="w-full px-4 py-2 bg-purple-400 text-white rounded-md"
          onClick={() => {
            if (createStep === "setup") setCreateStep("edit");
            else if (createStep === "edit") setCreateStep("review");
            else setIsCreating(false);
          }}
        >
          {createStep === "review" ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">
        WhatsApp Manager
      </h1>
      {isCreating ? renderCreateTemplate() : renderManageTemplates()}
    </div>
  );
}
