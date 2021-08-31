// Set base url

const baseURL = "http://ergast.com/api/f1/";


// **********DROP DOWN YEAR SELECT BOX**********

const dropDownYearHTML = document.querySelector("#year-selector");

// axios request for drop down year
// Had to change this to simple for loop because there was a query limit of 1000 results, which only pulled up to 2019.
// Array needed for years

let yearsArr = [];


for (let i = 1950; i <= 2021; i++) {
    yearsArr.push(i);
}
// console.log(yearsArr);


function dropDownYear(years) {
    years.forEach((year) => {
        const option = document.createElement("option");
        option.value = year;
        option.innerText = year;
        dropDownYearHTML.append(option);
    })
}


dropDownYear(yearsArr);


// **********DROP DOWN CIRCUIT SELECT BOX**********

const dropDownCircuitsHTML = document.querySelector("#circuit-selector");

// Axios request for drop down circuit depending on year
// Will need to set url "year" to select box value


async function dropDownCircuitsAPI() {
    try {
        const response = await axios.get(`${baseURL}${dropDownYearHTML.value}.json`);
        // console.log(response.data);


        const racesArr = response.data.MRData.RaceTable.Races;
        // console.log(racesArr)


        // The data is returning an array of races w/ objects, so will need to loop through to assign circuit name to each option and round to the value
  
        dropDownCircuits(racesArr);
        


    } catch(error) {
        console.log(error);
    }
}

dropDownCircuitsAPI();


// Need function to append circuit name to drop down box

function dropDownCircuits(circuits) {
    dropDownCircuitsHTML.innerText = "";


    circuits.forEach((circuit) => {
        const option = document.createElement("option");
        option.innerText = circuit.raceName;
        option.value = circuit.round;
        dropDownCircuitsHTML.append(option);
    })
}


// Need event listener for year drop down on change, to re-populate circuit drop down

dropDownYearHTML.addEventListener("change", dropDownCircuitsAPI);


// **********RACE BUTTON**********

const raceButtonHTML = document.querySelector("#button");

// Need axios request based on year and circuit drop-down selection

async function raceButtonAPI(event) {
    try {
        event.preventDefault();


        const response = await axios.get(`${baseURL}${dropDownYearHTML.value}/${dropDownCircuitsHTML.value}/results.json`);
        // console.log(response.data);

        let resultArr = response.data.MRData.RaceTable.Races[0].Results;
        // console.log(resultInfo);


        displayResults(`${resultArr[0].Constructor.name} --- ${resultArr[0].Driver.givenName} ${resultArr[0].Driver.familyName}`, `${resultArr[1].Constructor.name} --- ${resultArr[1].Driver.givenName} ${resultArr[1].Driver.familyName}`, `${resultArr[2].Constructor.name} --- ${resultArr[2].Driver.givenName} ${resultArr[2].Driver.familyName}`)


    } catch(error) {
        console.log(error);
    }
}


raceButtonHTML.addEventListener("click", raceButtonAPI);


// **********DISPLAY RESULTS**********

const firstPlaceResultsHTML = document.querySelector("#first-results");
const secondPlaceResultsHTML = document.querySelector("#second-results");
const thirdPlaceResultsHTML = document.querySelector("#third-results");
let allResultsHTML = document.querySelectorAll(".results");

// Need function to create and append results
// Need function to remove old results
// Need to add a forEach loop to remove old results
// Need to create 3 separate h5 to append to first, second, and third place divs respectively

function removeInfo() {
    allResultsHTML.forEach((oldResult) => {
        oldResult.innerHTML = "";
    })
}


function displayResults(result1, result2, result3) {
    removeInfo();    

    let firstPlace = document.createElement("h5");
    let secondPlace = document.createElement("h5");
    let thirdPlace = document.createElement("h5");
    

    firstPlace.innerText = result1;
    secondPlace.innerText = result2;
    thirdPlace.innerText = result3;


    firstPlaceResultsHTML.append(firstPlace);
    secondPlaceResultsHTML.append(secondPlace);
    thirdPlaceResultsHTML.append(thirdPlace);

    addButtons();
    // allResultsHTML.forEach(() => {
    //     let detailsButton = document.createElement("button");
    //     detailsButton.innerText = "Details";
    // })
}




function addButtons() {
    let firstPlaceButton = document.createElement("button");
    let secondPlaceButton = document.createElement("button");
    let thirdPlaceButton = document.createElement("button");

    firstPlaceButton.innerText = "Details";
    secondPlaceButton.innerText = "Details";
    thirdPlaceButton.innerText = "Details";


    firstPlaceResultsHTML.append(firstPlaceButton);
    secondPlaceResultsHTML.append(secondPlaceButton);
    thirdPlaceResultsHTML.append(thirdPlaceButton);

    let buttonsAll = document.querySelectorAll("button");
    console.log(buttonsAll);

    firstPlaceButton.setAttribute("id", 0);
    secondPlaceButton.setAttribute("id", 1);
    thirdPlaceButton.setAttribute("id", 2);

   buttonsAll.forEach((button) => {
       button.addEventListener("click", (e) => {
           displayDetailsAPI(e.target.id);
        })
    });
}

    // allResultsHTML.forEach((newResult) => {
    //     let detailsButton = document.createElement("button");
    //     detailsButton.innerText = "Details";
    //     newResult.append(detailsButton);
        
    // })



// **********DISPLAY DETAILS**********

// Added event listener in the display results to each details button
// Need async function to re-pull results info
// Need display
async function displayDetailsAPI(id) {
    console.log(id);
    
    try {
        let response = await axios.get(`${baseURL}${dropDownYearHTML.value}/${dropDownCircuitsHTML.value}/results.json`)
        let detailsArr = response.data.MRData.RaceTable.Races[0].Results;
        console.log(detailsArr);
        console.log(detailsArr[id].Time.time);
        
        if (detailsArr[id].FastestLap.Time.time) {
            displayDetails(`Overall time --- ${detailsArr[id]?.Time.time}`, `Fastest Lap --- ${detailsArr[id]?.FastestLap.Time.time}`, `Average Speed --- ${detailsArr[id]?.FastestLap.AverageSpeed.speed}`, id)
        
        }    else {
            displayDetails(`fastest lap unknown`)
        }


        console.log(detailsArr);

    } catch(error) {
        console.log(error)
    }
}

// Need function to append details in replace of race results

function displayDetails (detail1, detail2, detail3, id) {
    if (id === 0) {
        firstPlaceResultsHTML.innerText = "";
    
    
        let newDetails = document.createElement("h5");
        newDetails.innerText = detail1;
        firstPlaceResultsHTML.append(newDetails);
    

    } else if (id === 1) {
        secondPlaceResultsHTML.innerText = "";
        
        
        let newDetails = document.createElement("h5");
        newDetails.innerText = detail2;
        secondPlaceResultsHTML.append(newDetails);
    

    } else if (id === 2) {
        thirdPlaceResultsHTML.innerText = "";
        
        
        let newDetails = document.createElement("h5");
        newDetails.innerText = detail3;
        thirdPlaceResultsHTML.append(newDetails);
    }
}