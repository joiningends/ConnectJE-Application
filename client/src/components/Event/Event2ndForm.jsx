import React, { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

function Event2ndForm() {
  const [noOfCounters, setNoOfCounters] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [sessionTime, setSessionTime] = useState(new Date());

  const handleNoOfCountersChange = e => {
    const value = e.target.value;
    if (
      value === "" ||
      (Number(value) >= 0 && Number.isInteger(Number(value)))
    ) {
      setNoOfCounters(value);
    }
  };

  const handleMaxParticipantsChange = e => {
    const value = e.target.value;
    if (
      value === "" ||
      (Number(value) >= 0 && Number.isInteger(Number(value)))
    ) {
      setMaxParticipants(value);
    }
  };

  const handleSessionTimeChange = value => {
    setSessionTime(value);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-center text-[#B197FC] mb-8">
            Event 2nd Form
          </h1>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="noOfCounters"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                No of Counters
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="noOfCounters"
                  id="noOfCounters"
                  className="focus:ring-[#B197FC] focus:border-[#B197FC] block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md h-12"
                  placeholder="Enter number of counters"
                  value={noOfCounters}
                  onChange={handleNoOfCountersChange}
                  min="0"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="maxParticipants"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Max Participants per Counter at a Given Time
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="maxParticipants"
                  id="maxParticipants"
                  className="focus:ring-[#B197FC] focus:border-[#B197FC] block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md h-12"
                  placeholder="Enter max participants"
                  value={maxParticipants}
                  onChange={handleMaxParticipantsChange}
                  min="0"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="sessionTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Session Time per Counter for a Customer
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <DateTimePicker
                  onChange={handleSessionTimeChange}
                  value={sessionTime}
                  className="focus:ring-[#B197FC] focus:border-[#B197FC] block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md h-12"
                  disableClock={true}
                  format="y-MM-dd h:mm a"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Please enter the time in the format: YYYY-MM-DD HH:MM AM/PM
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#B197FC] hover:bg-[#9f7efa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B197FC]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Event2ndForm;
