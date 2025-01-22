function generateTimeSlots(startTime, endTime, sessionDuration, eventDate, endDate) {
    const timeslots = [];

    // Parse the event and end dates in DD-MM-YYYY format
    const [startDay, startMonth, startYear] = eventDate.split('-');
    const [endDay, endMonth, endYear] = endDate.split('-');

    const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
    const finalDate = new Date(`${endYear}-${endMonth}-${endDay}`);

    // Loop through each day
    for (let currentDate = new Date(startDate); currentDate <= finalDate; currentDate.setDate(currentDate.getDate() + 1)) {
        // Set the daily start and end times
        let currentStart = new Date(
            `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}T${startTime}:00`
        );
        const dailyEnd = new Date(
            `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}T${endTime}:00`
        );

        // Generate timeslots for the current day
        while (currentStart < dailyEnd) {
            const currentEnd = new Date(currentStart.getTime() + sessionDuration * 60 * 1000);
            if (currentEnd > dailyEnd) break;

            timeslots.push({
                startTime: currentStart.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
                endTime: currentEnd.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
            });

            currentStart = currentEnd;
        }
    }

    return timeslots;
}

// Testing the function
//console.log(generateTimeSlots("11:00", "14:00", 60, "21-11-2024", "22-11-2024"));


module.exports = {generateTimeSlots};
