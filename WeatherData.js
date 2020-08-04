class WeatherData {
    //Constructor. Takes an array of data, returns an object with the dataset.
    constructor(dataset) {
        this.data = dataset.map(record => {
            let time = record.Time.substr(11, 16);
            let date = record.Time.substr(0, 10);
            let timeStamp = new Date(date + "T" + time);

            return {
                displayName: record.DisplayName,
                time: time.substr(0, 5),
                date: timeStamp,
                value: record.Value.replace(",", "."),
                unit: record.Unit,
                signalId: record.SignalId
            };
        });
    }

    //Method for getting data based on displayName, startdate and enddate
    getDataByRange(displayName, startDate, endDate) {
        return this.data.filter(record => {
            let start = new Date(startDate + "T" + "00:00:00");
            let end = new Date(endDate + "T" + "23:59:59");
            if (record.date >= start && record.date <= end && record.displayName == displayName) {
                return true;
            }
        });
    }
}