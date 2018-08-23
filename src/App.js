import API from './api'

const getUrl = 'https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=eb9801649a7216ded0e802111eac';
const postUrl = 'https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=eb9801649a7216ded0e802111eac';

API.get(getUrl)
.then(function(json) {
	const mapStructure = getMap(json.partners, 'country');
	const uniqueKeys = Array.from(mapStructure.keys());
	const nestData = nestMap(mapStructure, uniqueKeys);
	mapCustomer(uniqueKeys, nestData);
});

const mapCustomer = (uniqueKeys, nestData) => {
	const countries = [];

	uniqueKeys.forEach((key, index) => {
		const customerByCountry = nestData[index].values.map(item => item);
		customerByCountry.map(function(customer) {
			customer.secondDayAvailability = getValidDates(customer.availableDates);
		});
		const mode = mapByMode(customerByCountry, 'secondDayAvailability');

		const results = customerByCountry.filter(item => {
			if(item.secondDayAvailability.indexOf(mode) > -1) {
				return item
			}
		});

		const obj = {};
		obj.attendees = [];
		results.forEach(result => {
			obj.attendees.push(result.email);
		});
		obj.attendeeCount = obj.attendees.length;
		obj.name = key;
		obj.startDate = mode;
		countries.push(obj);
	});

	const postData = {
		countries: countries
	};

	API.post(postUrl, postData )
	.then(function(json) {
		console.log(json);
	});

}

function mapByMode (nestData, property) {
	const items = nestData.map(item => item[property]);
	const mode = getMostFrequent(items.reduce((acc, val) => acc.concat(val), []));
	return mode;
}


const getValidDates = (availableDates) => {
	const arr = [];

	availableDates.map((date, index) => {
		var isoToDate = new Date(date);
		isoToDate.setDate(isoToDate.getDate() + 2);

		var year = isoToDate.getFullYear(),
		month = isoToDate.getMonth() + 1,
		dt = isoToDate.getDate();

		if (dt < 10) {
			dt = '0' + dt;
		  }
		  if (month < 10) {
			month = '0' + month;
		}

		const datePlusOne = year+'-' + month + '-'+dt;

		if(availableDates.indexOf(datePlusOne) > -1){
			arr.push(availableDates[index]);
		}
	})

	return arr;
}

const getMap = (data, key) => {
	const map = mapByKey(data, item => {
		return item[key];
  	});
  	return map;
}

// Map by key
const mapByKey = (data, getKey) => {
    const map = new Map();
    data.forEach((item) => {
        const key = getKey(item);
        const collection = map.get(key);
        !collection ? map.set(key, [item]) : collection.push(item);
    });
    return map;
}

const nestMap = (map, uniqueKeys) => {
	const nestByKey = [];
	uniqueKeys.map(key => {
		const tempObj = {key: key};
		tempObj.values = map.get(key);
		tempObj.length = tempObj.values.length;
		nestByKey.push(tempObj);
	  });
	return nestByKey;
}

const getMostFrequent = (array) => {
	let counts = {};
	let compare = 0;
	let mostFrequent;

	for(var i = 0, len = array.length; i < len; i++){
		 let word = array[i];

		 if(counts[word] === undefined){
			 counts[word] = 1;
		 } else {
			 counts[word] = counts[word] + 1;
		 }
		 if(counts[word] > compare){
			   compare = counts[word];
			   mostFrequent = array[i];
		 }
	  }
	return mostFrequent;
}
