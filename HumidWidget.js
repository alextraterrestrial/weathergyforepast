class HumidWidget {
    constructor(dataset) {
        this.humid = dataset;
        this.canvas = null;
        this.chart = null;
    }

    getLabels() {
        let array = ["Day", "Night"];
        //return the array with the labels
        return array;
    }

    getValues() {
        //empty arrays
        let day = [];
        let night = [];
        let whole = [];
        //checks if the data is in the night or day and push it into the correct array
        this.humid.forEach(data => {
            if (data.time == "12:00") {
                let data2 = data.value.replace(",", ".");
                let data3 = parseFloat(data2);
                day.push(data3);

            }
            if (data.time == "23:00") {
                let data2 = data.value.replace(",", ".");
                let data3 = parseFloat(data2);
                night.push(data3);

            }
        });

        //calculate the average
        let reducer = (accumulator, currentValue) => accumulator + currentValue;
        let natt = Math.round(night.reduce(reducer) / night.length);
        let dag = Math.round(day.reduce(reducer) / day.length);
        console.log(dag);
        console.log(natt);

        whole = [dag, natt];
        //return the array with day-values and night-values
        return whole;
    }


    //Start the widget, initialize graph
    start() {

        this.canvas = document.querySelector("#humid_widget").getContext("2d");
        this.chart = new Chart(this.canvas, {
            // The type of chart we want to create
            type: 'doughnut',

            // The data for our dataset
            data: {
                labels: this.getLabels(),
                datasets: [{
                    label: 'Relative humidity',
                    backgroundColor: [
                        '#FEA45B', // color for data at index 0
                        '#F8444E', // color for data at index 1
                    ],
                    data: this.getValues()
                }]
            },
            //removes the empy space in the middle of the chart
            //changes the rotation so that the night and day are on the right side
            options: {
                cutoutPercentage: 0,
                rotation: -1.5 * Math.PI

            }
        });
    }

    //Update graph
    update(newDataset) {
        this.humid = newDataset;
        this.chart.data.labels = this.getLabels();
        this.chart.data.datasets[0].data = this.getValues();
        this.chart.update();
    }
}
