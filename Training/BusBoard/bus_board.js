import fetch from "node-fetch";
import promptSync from "prompt-sync";
const prompt = promptSync();

async function tflAPIFetch(url) {
  const response = await fetch(url);
  const apiData = await response.json();
  return apiData;
}

async function bustStop(stopCode) {
  // const stopCode = '490008660N';
  // const stopCode = prompt("Please enter the stopCode for the bus station needed: ");
  console.log(`StopCode:${stopCode}`);
  const tflURL = `https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals`;
  const apiData = await tflAPIFetch(tflURL);

  //const requiredFields = ["lineId","destinationName","timestamp","expectedArrival"];
  const requiredFields = [
    "lineId",
    "destinationName",
    "expectedArrival",
    "stationName",
    "direction",
  ];
  const filterFields = (busData) =>
    Object.keys(busData)
      .filter((key) => requiredFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = busData[key];
        return obj;
      }, {});
  const requiredData = apiData.map((entry) => filterFields(entry));
  //console.log(requiredData);

  const dataWithArrivalMins = requiredData.map((entry) => {
    const diff_milliseconds = new Date(entry.expectedArrival) - new Date();
    entry["arrivalInMinutes"] = Math.floor(
      (diff_milliseconds / 1000 / 60) % 60
    );
    return entry;
  });
  // console.log(dataWithArrivalMins);
  const nextBusList = dataWithArrivalMins.sort(
    (x, y) => x["arrivalInMinutes"] - y["arrivalInMinutes"]
  );
  //console.log(nextBusList);
  console.log("Next 5 Busses:");
  for (let i = 0; i <= 4; i++) {
    console.log(`${i + 1} : ${JSON.stringify(nextBusList[i])}`);
  }
}

//bustStop();

async function getPostCode() {
  //const postCode = "NW51TL";
  const postCode = prompt("Enter the postcode: ");
  const postCodeUrl = `https://api.postcodes.io/postcodes/${postCode}`;
  const postCodeData = await tflAPIFetch(postCodeUrl);
  return postCodeData;
}
async function getLatLong() {
  const postCodeData = await getPostCode();
  //console.log(postCodeData);
  const latidude = postCodeData.result.latitude;
  const longitude = postCodeData.result.longitude;
  return { lat: latidude, lon: longitude };
}
async function getStopCodeId() {
  const coOrds = await getLatLong();
  const stopCodeUrl = `https://api.tfl.gov.uk/StopPoint/?lat=${coOrds.lat}&lon=${coOrds.lon}&stopTypes=NaptanOnstreetBusCoachStopPair`;
  const stopCodeData = await tflAPIFetch(stopCodeUrl);
  //console.log(stopCodeData);
  const stopPoints = stopCodeData.stopPoints;

  const requiredFields = ["commonName", "lineGroup"];
  const filterFields = (sp) =>
    Object.keys(sp)
      .filter((key) => requiredFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = sp[key];
        return obj;
      }, {});
  const nearestStopsData = stopPoints.map((sp) => filterFields(sp));
  nearestStopsData.forEach(async (ns) => {
    console.log(ns.commonName);
    const lineGroup = ns.lineGroup.map((lg) => lg.naptanIdReference);
    //  console.log(lineGroup);
    const result = await Promise.all(
      lineGroup.map(async (stopId) => await bustStop(stopId))
    );
  });
  //console is printing both the bus
  //console.log(stopIdsArr)
}

getStopCodeId();

// const expectedArraival = '2024-01-18T15:50:10Z'
// console.log("Current Timestamp:",new Date()) // current date and time in ISO format
// const diff_milliseconds = new Date(expectedArraival)- new Date(); // this will give difference in milliseconds
// console.log(diff_milliseconds);
// const minutes = Math.floor((diff_milliseconds / 1000 / 60) % 60);
// console.log(minutes)
