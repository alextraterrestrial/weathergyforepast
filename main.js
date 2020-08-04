// Declaration of variables 

// Initialize a default start and end date
const defaultDates = {
    start: "2019-03-23",
    end: "2019-03-29"
};

// The object containing the whole dataset
const dataObject = new WeatherData(dataSet);

let allData = {
    tempData: dataObject.getDataByRange("GT-UTE", defaultDates.start, defaultDates.end),
    consumedEnergy: dataObject.getDataByRange("Consumed Energy Historical", defaultDates.start, defaultDates.end),
    energyRequired: dataObject.getDataByRange("Energy required", defaultDates.start, defaultDates.end),
    cloudCoverageData: dataObject.getDataByRange("Mean value of total cloud cover", defaultDates.start, defaultDates.end),
    symbolData: dataObject.getDataByRange("Weather symbol", defaultDates.start, defaultDates.end),
    windData: dataObject.getDataByRange("Wind speed", defaultDates.start, defaultDates.end),
    humidData: dataObject.getDataByRange("Relative humidity", defaultDates.start, defaultDates.end),
    thunderData: dataObject.getDataByRange("Thunder probability", defaultDates.start, defaultDates.end)
};
let energy = allData.energyRequired;
console.log(energy);

// Create instances of each widget and place in allWidgets array
let allWidgets = [];


// The energy widget
const energyWidget = new EnergyWidget(allData.energyRequired, allData.consumedEnergy);
allWidgets.push(energyWidget);

// The temp widget
const tempWidget = new TempWidget(allData.tempData);
allWidgets.push(tempWidget);

// Wind widget
const windWidget = new WindWidget(allData.windData);
allWidgets.push(windWidget);

// Cloud Coverage widget
const cloudCoverageWidget = new CloudCoverageWidget(allData.cloudCoverageData);
allWidgets.push(cloudCoverageWidget);

// Symbol Widget
const symbolWidget = new SymbolWidget(allData.symbolData);
allWidgets.push(symbolWidget);

//Humid widget
const humidWidget = new HumidWidget(allData.humidData);
allWidgets.push(humidWidget);

//Thunder widget
const thunderWidget = new ThunderWidget(allData.thunderData);
allWidgets.push(thunderWidget);

// Start each widget and initialize the data
allWidgets.forEach(widget => {
    widget.start();
});

// Back to week view btn
let showWeekBtn = document.querySelector("#show_week");

//Event listener for the datepicker. Call the updateWidgets function on click
//Set date in date picker to current default date
const datePicker = document.getElementById("myDate");
datePicker.value = defaultDates.start;

// Show selected date range
document.getElementById('selectedDate').innerHTML = 'Showing time period ' + defaultDates.start + " - " + defaultDates.end;

//Keep track of latest shown week
let latestWeek = defaultDates.start;

// Get date from datepicker
function dateFunction() {
    let x = document.getElementById("myDate").value;
    return x;
}

// Function loads the charts with data for the selected time period
function loadWeek(startDate) {
    console.log(datePicker.value);
    showWeekBtn.style.display = "none";
    if (datePicker.value != "") {
        // Get dates 
        let start = dateFunction();
        let date = new Date(start);

        date.setDate(date.getDate() + 6);

        let dd = String(date.getDate());
        let mm = String(date.getMonth() + 1);
        let yy = date.getFullYear();
        if (dd.length < 2) {
            dd = "0" + dd;
        }
        if (mm.length < 2) {
            mm = "0" + mm;
        }

        let end = yy + "-" + mm + "-" + dd;

        // Call the updateWidgets function with the selected date range
        newDateRange = {
            start: start,
            end: end
        };
        console.log(newDateRange);
        // Show selected date range
        document.getElementById('selectedDate').innerHTML = 'Showing time period ' + newDateRange.start + " - " + newDateRange.end;

        updateWidgets(newDateRange);
    }

}
showWeekBtn.addEventListener('click', () => {
    loadWeek(latestWeek);

    //Hide showWeekBtn
    showWeekBtn.style.display = "none";
});

// Add eventlistener for the energy data widget
datePicker.addEventListener("change", () => {
    loadWeek();

    //Set last week to new date
    latestWeek = datePicker.value;
    console.log(datePicker.value);
});
//function that loads the data for one day

//Event listener for the EnergyWidget. Listen for clicks and call the updateWidgets function with the date clicked

document.querySelector("#energy_widget").addEventListener('click', event => {
    let clickedPoint = energyWidget.chart.getElementAtEvent(event);
    // console.log()
    // Check if the click was on a point
    if (clickedPoint.length > 0) {
        // var clickedDatasetIndex = activePoints[0]._datasetIndex;
        let clickedElementIndex = clickedPoint[0]._index;
        let label = energyWidget.chart.data.labels[clickedElementIndex];
        //   var value = tempObject.chart.data.datasets[clickedDatasetIndex].data[clickedElementindex];   
        let date = new Date(label);

        let year = date.getFullYear();
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());

        console.log(month);

        if (month.length == 1) {
            month = "0" + String(month);
        }
        if (day.length == 1) {
            day = "0" + day;
        }

        let dateString = year + "-" + month + "-" + day;
        console.log(dateString);

        let newDateRange = {
            start: dateString,
            end: dateString
        };
        console.log(newDateRange);
        //Update all widgets
        updateWidgets(newDateRange);

        // Show selected date range
        document.getElementById('selectedDate').innerHTML = newDateRange.start;

        //Show button to go back to week view
        showWeekBtn.style.display = "block";
    }
});

// Update method for all widgets. Takes an object with a new start date and a new end date
function updateWidgets(newDateRange) {
    //Get new dataset for each widget
    let displayName;
    console.log(allData);
    for (let key in allData) {
        displayName = allData[key][0].displayName;
        allData[key] = dataObject.getDataByRange(displayName, newDateRange.start, newDateRange.end);
    }


    //Call each widgets update method with the new dataset
    console.log(allData.tempData);
    console.log(allData.energyRequired);
    console.log(allData.consumedEnergy);
    tempWidget.update(allData.tempData);
    energyWidget.update(allData.energyRequired, allData.consumedEnergy);
    windWidget.update(allData.windData);
    cloudCoverageWidget.update(allData.cloudCoverageData);
    symbolWidget.update(allData.symbolData);
    humidWidget.update(allData.humidData);
    thunderWidget.update(allData.thunderData);

}