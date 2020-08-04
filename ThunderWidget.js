class ThunderWidget {
    constructor(dataset) {
        this.thunder = dataset;
        this.canvas = null;
        this.chart = null;
    }

    //function to get labels depedning on how many days to get
    getLabels() {
        let last = this.thunder.length - 1;
        let startDay = this.thunder[0].date.getDate();
        let endDay = this.thunder[last].date.getDate();
        if (startDay != endDay) {

            let array = [];
            //weekday array to visualise the day of the week instead of index value from Date object .getDay()
            let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            this.thunder.forEach(data => {
                //if statement to check if that day already has been included, if so move on to the next day
                if (array.indexOf(weekday[data.date.getDay()]) == -1) {
                    let data2 = weekday[data.date.getDay()];
                    //values pushes in an array to use later
                    array.push(data2);
                }
            })
            return array;
        } else {
            let array = [];
            this.thunder.forEach(data => {
                //substring to only show, the time in formar "00:00"
                let data2 = data.time.substring(0, 5);
                array.push(data2);
            });

            return array;
        }
    }

    //function to get values depedning on how many days to get
    getValues() {
        let last = this.thunder.length - 1;
        let startDay = this.thunder[0].date.getDate();
        let endDay = this.thunder[last].date.getDate();
        if (startDay != endDay) {
            let array = [];
            let presentWeekdays = [];
            let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            this.thunder.forEach(data => {

                if (presentWeekdays.indexOf(weekday[data.date.getDay()]) == -1) {
                    presentWeekdays.push(weekday[data.date.getDay()]);

                    let oneArray = [];

                    this.thunder
                        .filter(d => {
                            // Inner loop - filter by the current date of the outer loop
                            return data.date.getDay() == d.date.getDay();
                        })
                        .forEach(d => {
                            let data2 = d.value.replace(",", ".");
                            let data3 = parseFloat(data2);
                            oneArray.push(data3);
                        });

                    //get the highest value from the array that contains the array of one day
                    let max = Math.max(...oneArray);
                    array.push(max);
                }
            });
            console.log(array);
            return array;

        } else {
            let array = [];
            this.thunder.forEach(data => {
                let data2 = data.value.replace(",", ".");
                let data3 = parseFloat(data2);
                array.push(data3);
            });
            return array;
        }
    }

    start() {
        Chart.defaults.global.legend.display = false;
        console.log(this.getValues());
        console.log(this.getLabels());
        this.canvas = document.querySelector("#thunder_widget").getContext("2d");
        this.chart = new Chart(this.canvas, {
            type: 'radar',

            data: {
                //get values from getLabels function
                labels: this.getLabels(),
                datasets: [{
                    backgroundColor: '#FEA45B',
                    borderColor: '#FEA45B',
                    //get data fron getValues function
                    data: this.getValues()
                }]
            },
            options: {}
        });
    }

    //update thunder widget
    update(newThunder) {
        this.thunder = newThunder;

        this.chart.data.labels = this.getLabels();
        this.chart.data.datasets[0].data = this.getValues();

        this.chart.update();
    }
}
