// Create the object WindWidget with the chosen dataset and methods
// to get values for the graph (in this case speedomoter), initialize and update
class WindWidget {
   constructor(dataset) {
      this.winds = dataset;
      this.canvas = null;
      this.chart = null;
   }

   // Get the relevant values from the dataset
   getValues() {

      let array = [];
      this.winds.forEach(wind => {
         let numberArray = wind.value;
         let newArray = numberArray.replace(",", ".");
         let valuesNumber = parseFloat(newArray);
         array.push(valuesNumber);
      });
      var sum = 0;
      for (let i = 0; i < array.length; i++) {
         sum += array[i];
      }
      console.log(sum);
      let averageOfSum = sum / array.length;
      let averageInteger = Math.round(averageOfSum);
      console.log(averageInteger);
      return averageInteger;

   }

   // Start the widget, initialize chart
   start() {

      this.canvas = document.querySelector("#wind_widget").getContext("2d");

      this.chart = new Chart(this.canvas, {
         type: "tsgauge",
         data: {
            datasets: [{
               backgroundColor: ["#FFEBBD", "#FFEBBD"],
               borderWidth: 0,
               gaugeData: {
                  value: this.getValues(),
                  valueColor: "#FEA45B"
               },
               gaugeLimits: [0, this.getValues(), 20]
            }]
         },
         options: {
            events: [],
            showMarkers: true,
            defaultFontSize: 17
         }
      });
   }

   // Update graph
   update(newDataset) {

      this.winds = newDataset;

      this.chart.data.datasets[0].gaugeData.value = this.getValues();
      this.chart.data.datasets[0].gaugeLimits[1] = this.getValues();

      this.chart.update();

   }
}