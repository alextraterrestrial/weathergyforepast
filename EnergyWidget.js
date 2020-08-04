class EnergyWidget {

    constructor(energyRequired, consumedEnergy) {
        this.energyRequired = energyRequired.filter(record => {
            return record.signalId == "bf9a675f-4bcc-4114-92b3-502c6c78c7c9";
        });
        this.consumedEnergy = consumedEnergy.filter(record => {
            return record.signalId == "45699c32-a30a-4787-bdc7-459b688e9383";
        });
        this.canvas = null;
    }

    getEnergyRequired() {
        let returnData = [];
        let energyRequired = this.energyRequired;
        let firstRecord = energyRequired[0];
        let lastRecord = energyRequired[energyRequired.length - 1];
        let sum = 0;
        console.log(energyRequired);
        if (firstRecord.date.getDate() != lastRecord.date.getDate()) {
            console.log("Multiple days");
            for (let i = new Date(firstRecord.date); i <= lastRecord.date; i.setDate(i.getDate() + 1)) {
                // console.log(i.getDate());

                let recordsThisDay = energyRequired.filter(record => {
                    return record.date.getDate() == i.getDate();
                });
                // console.log(recordsThisDay);

                recordsThisDay.forEach(record => {
                    let data = record.value.replace("−", "-");
                    // console.log(parseFloat(temp));
                    data = parseFloat(data);
                    sum += data;
                });
                sum = sum / recordsThisDay.length;
                sum = Math.round(sum * 100) / 100;
                returnData.push(sum);
            }
        } else {
            console.log("ONe day");
            //Get each record on given day
            energyRequired.forEach(record => {
                returnData.push(record.value);
            });
            console.log(returnData);
        }
        // console.log() 
        return returnData;
    }

    getConsumedEnergy() {
        let returnData = [];
        let consumedEnergy = this.consumedEnergy;
        let firstRecord = consumedEnergy[0];
        let lastRecord = consumedEnergy[consumedEnergy.length - 1];
        console.log(firstRecord);
        let sum = 0;
        if (firstRecord != undefined) {
            if (firstRecord.date.getDate() != lastRecord.date.getDate()) {
                for (let i = new Date(firstRecord.date); i <= lastRecord.date; i.setDate(i.getDate() + 1)) {
                    console.log(i.getDate());

                    let recordsThisDay = consumedEnergy.filter(record => {
                        return record.date.getDate() == i.getDate();
                    });
                    // console.log(recordsThisDay);

                    recordsThisDay.forEach(record => {
                        let data = record.value.replace("−", "-");
                        // console.log(parseFloat(temp));
                        data = parseFloat(data);
                        sum += data;
                    });
                    sum = sum / recordsThisDay.length;
                    sum = Math.round(sum * 100) / 100;
                    returnData.push(sum);
                }
            } else {
                // Get each record and push int returnData
                consumedEnergy.forEach(record => {
                    returnData.push(record.value);
                });
            }
        }
        return returnData;
    }

    getLabels() {
        let labelsArray = [];
        let allRecords = this.energyRequired;
        let firstRecord = allRecords[0];
        let lastRecord = allRecords[allRecords.length - 1];
        let label;
        let nextDay;
        //If multiple days are selected
        if (firstRecord.date.getDate() != lastRecord.date.getDate()) {
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
                labelsArray.push(label.date.toDateString());

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
        this.canvas = document.querySelector("#energy_widget").getContext("2d");
        let energyRequired = this.getEnergyRequired();
        let consumedEnergy = this.getConsumedEnergy();

        //Register plugin to change background color
        Chart.pluginService.register({
            beforeDraw: function(chart, easing) {
                if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
                    var ctx = chart.chart.ctx;
                    var chartArea = chart.chartArea;

                    ctx.save();
                    ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
                    ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
                    ctx.restore();
                }
            }
        });
        //Change point size
        Chart.defaults.global.elements.point.radius = 7;
        Chart.defaults.global.elements.point.hoverBorderWidth = 12;

        console.log(energyRequired);

        this.chart = new Chart(this.canvas, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: this.getLabels(),
                datasets: [{
                        label: 'Energy required',
                        fill: true,
                        backgroundColor: 'rgba(254,164,91, 0.4)',
                        borderColor: 'rgb(254,164,91)',
                        data: energyRequired,
                        yAxisId: "temps"
                },
                    {
                        label: 'Energy consumed',
                        fill: true,
                        backgroundColor: 'rgba(248,68,78,0.6)',
                        borderColor: 'rgb(248,68,78)',
                        data: consumedEnergy,
                        yAxisId: "temps"
                }
            ]
            },
            // Configuration options go here
            options: {
                scales: {
                    yAxes: [{
                        id: 'temps',
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            min: 0,
                            max: 200,
                            // Add units to the y-axis
                            callback: function(value, index, values) {
                                return value + " KW";
                            }
                        }
                    }]
                },
                //Set background color
                chartArea: {
                    backgroundColor: '#223c44'
                }
            }
        });
    }

    //Update
    update(newEnergyRequired, newConsumedEnergy) {
        //Update the objects properties

        this.energyRequired = newEnergyRequired.filter(record => {
            return record.signalId == "bf9a675f-4bcc-4114-92b3-502c6c78c7c9";
        });
        this.consumedEnergy = newConsumedEnergy.filter(record => {
            return record.signalId == "45699c32-a30a-4787-bdc7-459b688e9383";
        });
        console.log(newEnergyRequired);

        //Update the chart
        console.log(this.getLabels());
        this.chart.data.labels = this.getLabels();
        this.chart.data.datasets[0].data = this.getEnergyRequired();
        this.chart.data.datasets[1].data = this.getConsumedEnergy();

        this.chart.update();
    }
}