class TempWidget {
    //Constructor takes an array of temperatures, returns an object containing the temperatures.
    constructor(temps) {
        this.temps = temps;
        this.canvas = null;
        this.chart = null;
    }

    //Get all the temperatures by day, or 
    getValues(data) {
        // Declaration of variables
        let highsArray = [];
        let lowsArray = [];
        let allTemps = [];
        let allData = data;
        let firstRecord = data[0];
        let lastRecord = data[data.length - 1];
        if (firstRecord.date.getDate() != lastRecord.date.getDate()) {
            for (let i = new Date(firstRecord.date); i <= lastRecord.date; i.setDate(i.getDate() + 1)) {
                // console.log(i.getDate());

                let recordsThisDay = allData.filter(record => {
                    return record.date.getDate() == i.getDate();
                })
                // console.log(recordsThisDay);

                if (data[0].displayName == "GT-UTE") {
                    let low = 100;
                    let high = -100;

                    recordsThisDay.forEach(record => {

                        let temp = record.value.replace("−", "-");
                        // console.log(parseFloat(temp));
                        temp = parseFloat(temp);

                        if (temp < low) {
                            // console.log("New low")
                            low = temp;
                        }
                        if (temp > high) {
                            // console.log("New high")
                            high = temp;
                        }
                    });
                    highsArray.push(high);
                    lowsArray.push(low);
                }
            }
            return {
                highsArray,
                lowsArray
            };
        } else {
            allData.forEach(record => {
                allTemps.push(record.value);
            });
            return {
                allTemps
            };
        }

    }

    getLabels() {
        let labelsArray = [];
        let allRecords = this.temps;
        let label;
        let nextDay;

        //Check if multiple days or not
        if (allRecords[0].date.getDate() != allRecords[allRecords.length - 1].date.getDate()) {
            for (let i = 0; i < allRecords.length; i++) {
                // console.log(label);

                if (label === undefined) {
                    label = allRecords[i];
                    // console.log(label.date.getDate())

                } else if (allRecords[i].date.getDate() == nextDay.getDate()) {
                    label = allRecords[i];
                    // console.log(label.date.getDate())
                } else {
                    continue;
                }
                labelsArray.push(label.date.toDateString().substr(0, 10));

                nextDay = new Date(label.date);
                nextDay.setDate(label.date.getDate() + 1);
                // console.log(nextDay);
            }
        } else {
            allRecords.forEach(record => {
                labelsArray.push(record.time);
            });
        }

        // console.log(labelsArray);
        return labelsArray;
    }

    //Start the widget, initialize graph
    start() {
        this.canvas = document.querySelector("#temp_widget").getContext("2d");
        let highs = this.getValues(this.temps).highsArray;
        let lows = this.getValues(this.temps).lowsArray;
        // console.log(this.getLabels());

        this.chart = new Chart(this.canvas, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: this.getLabels(),
                datasets: [{
                        label: 'Highs',
                        fill: false,
                        backgroundColor: '#F8444E',
                        borderColor: '#F8444E',
                        data: highs,
                        yAxisId: "temps"
                    },
                    {
                        label: 'Lows',
                        fill: false,
                        backgroundColor: '#FFEBDB',
                        borderColor: '#FFEBDB',
                        data: lows,
                        yAxisId: "temps"
                    }
                ]
            },
            // Configuration options go here
            options: {
                tooltips: {
                    enabled: true,
                    mode: 'single',
                },
                scales: {
                    yAxes: [{
                        id: 'temps',
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            // Include a '°C' before the ticks
                            callback: function(value, index, values) {
                                return value + "°C";
                            }
                        }
                    }]
                }
            }
        });
    }

    //Update chart
    update(newTempData) {
        //Update object
        this.temps = newTempData;
        let multipleDays = false;
        console.log(this.getValues(this.temps));
        //Check whether one or multiple days selected have been selected
        if (Object.keys(this.getValues(this.temps)).length > 1) {
            console.log("multiple days!");
            multipleDays = true;
            this.chart.data.labels = this.getLabels();
            this.chart.data.datasets[0].data = this.getValues(this.temps).highsArray;
            //Check if a new second dataset needs to be created
            if (this.chart.data.datasets[1] == undefined) {
                this.chart.data.datasets[1] = {
                    label: 'Lows',
                    fill: false,
                    backgroundColor: '#FFEBDB',
                    borderColor: '#FFEBDB',
                    data: this.getValues(this.temps).lowsArray,
                    yAxisId: "temps"
                };
            } else {
                this.chart.data.datasets[1].data = this.getValues(this.temps).lowsArray;
            }
        } else {
            //Replace labels
            this.chart.data.labels = this.getLabels();
            // console.log(this.getLabels())

            //Remove th 2nd dataset and replace 1st one
            this.chart.data.datasets.pop();
            console.log(this.getLabels());
            console.log(this.getValues(this.temps).allTemps);
            this.chart.data.datasets[0].data = this.getValues(this.temps).allTemps;
        }
        // Update the chart data
        console.log(this.getLabels());

        this.chart.update();
    }
}