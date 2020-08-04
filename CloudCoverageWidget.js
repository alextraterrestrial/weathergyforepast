class CloudCoverageWidget {
    constructor(dataset) {
        this.dataset = dataset
    }
    displayClouds(octa) {
        let div = document.getElementById("cloud_div");

        if (octa == 0)
            div.style.backgroundImage = "url('images/clouds0.png')";
        else if (octa == 1)
            div.style.backgroundImage = "url('images/clouds1.png')";
        else if (octa == 2)
            div.style.backgroundImage = "url('images/clouds2.png')";
        else if (octa == 3)
            div.style.backgroundImage = "url('images/clouds3.png')";
        else if (octa == 4)
            div.style.backgroundImage = "url('images/clouds4.png')";
        else if (octa == 5)
            div.style.backgroundImage = "url('images/clouds5.png')";
        else if (octa == 6)
            div.style.backgroundImage = "url('images/clouds6.png')";
        else if (octa == 7)
            div.style.backgroundImage = "url('images/clouds7.png')";
        else if (octa == 8)
            div.style.backgroundImage = "url('images/clouds8.png')";
    }

    start() {
        // const abc = parseInt("3,00") // 3
        let sum = 0;

        for (let i = 0; i < this.dataset.length; i++) {
            sum = sum + parseInt(this.dataset[i].value)
        }

        let average = Math.round(sum / this.dataset.length)
        this.displayClouds(average);

    }

    update(newDataset) {
        let sum = 0;

        for (let i = 0; i < newDataset.length; i++) {
            sum = sum + parseInt(newDataset[i].value)
        }

        let average = Math.round(sum / newDataset.length)
        this.displayClouds(average);
    }
}