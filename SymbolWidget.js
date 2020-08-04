console.log(weatherIcons);
class SymbolWidget {
    constructor(symbolData) {
        this.symbols = this.includeIconObjectInSymbolData(symbolData);
    }

    includeIconObjectInSymbolData(symbolData) {

        for (let i = 0; i < symbolData.length; i++) {
            let symbol = symbolData[i];

            // konvertera symbol.value till en INT,
            const val = parseInt(symbol.value);

            symbol.icon = weatherIcons[val - 1];

        }

        return symbolData;
    }

    getValues() {

        let sum = 0;
        let allSymbolsArray = [];
        let firstRecord = this.symbols[0];
        let lastRecord = this.symbols[this.symbols.length - 1];
        let recordObject;

        if (this.symbols.length < 25) {

            for (let i = 0; i < this.symbols.length; i++) {

                let symbol = this.symbols[i];
                // konvertera symbol.value till en INT,
                const val = parseInt(symbol.value);

                sum = sum + val;

            }

            let avr = sum / this.symbols.length;
            let round = Math.ceil(avr);
            let png = weatherIcons[round - 1].Symbol;
            allSymbolsArray.push({
                date: String(firstRecord.date),
                url: png
            });

        } else {

            for (let i = new Date(firstRecord.date); i <= lastRecord.date; i.setDate(i.getDate() + 1)) {

                let recordsThisDay = this.symbols.filter(record => {
                    return record.date.getDate() === i.getDate();
                });

                for (let j = 0; j < recordsThisDay.length; j++) {
                    let symbol = recordsThisDay[j];
                    // konvertera symbol.value till en INT,
                    let val = parseInt(symbol.value);

                    sum = sum + val;

                }

                let avr = sum / this.symbols.length;

                let round = Math.ceil(avr);

                let png = weatherIcons[round - 1].Symbol;



                allSymbolsArray.push({
                    date: String(i),
                    url: png
                });

            }

            console.log("ALL SYMBOLS", allSymbolsArray);

            //Function to loop through all the symbols and print them

        }

        return allSymbolsArray;

    };
    displaySymbols(weatherObject) {
        let div = document.getElementById("showWeatherSymbol");

        let img = document.createElement('img');
        img.setAttribute("src", weatherObject.url);
        img.setAttribute("id", "symbolImg");

        //Create day text
        console.log(weatherObject);
        let textElement = document.createElement("p");
        let date = document.createTextNode(weatherObject.date.substring(0, 3));
        textElement.appendChild(date);

        div.appendChild(textElement);
        div.appendChild(img);


    }

    //Start the widget, initialize graph
    start() {
        let allSymbolsArray = this.getValues();

        for (let i = 0; i < allSymbolsArray.length; i++) {
            this.displaySymbols(allSymbolsArray[i]);
        }
        if (allSymbolsArray.length <= 1) {
            document.getElementById("symbolImg").style.height = "150px";
        }

    }

    //Update graph
    update(newDataset) {
        //Update the object with new data
        this.symbols = this.includeIconObjectInSymbolData(newDataset);
        console.log(this.symbols);
        let symbolsContainer = document.querySelector("#showWeatherSymbol");
        symbolsContainer.innerHTML = "";
        this.start();
    }
}
