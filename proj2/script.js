/*********************************************
 * Created By Ryan O'Laughlin February 2019
 *
 **********************************************/

////GLOVAL VARIABLES UP HERE/////
let secInDay = 84600;
let time = {
  data: []
}
let close = {
  data: []
};
let open = {
  data: []
};
let high = {
  data: []
};
let low = {
  data: [],
};
let histLayout = {
  xaxis: {
    visible: false
  },
  title: 'Stock History',
  showlegend: true,
};
let regLayout = {
  xaxis: {
    visible: false
  },
  title: 'Stock Regression',
  showlegend: true,
}
let openGraph = {
  x: [],
  y: [],
  name: 'Open',
  type: 'scatter'
};
let closeGraph = {
  x: [],
  y: [],
  name: 'Close',
  type: 'scatter'
};
let highGraph = {
  x: [],
  y: [],
  name: 'High',
  type: 'scatter'
};
let lowGraph = {
  x: [],
  y: [],
  name: 'Low',
  type: 'scatter'
};
let regHighGraph = {
  x: [],
  y: [],
  name: 'High',
  type: 'scatter'
}
let regLowGraph = {
  x: [],
  y: [],
  name: 'Low',
  type: 'scatter'
};
let regOpenGraph = {
  x: [],
  y: [],
  name: 'Open',
  type: 'scatter'
};
let regCloseGraph = {
  x: [],
  y: [],
  name: 'Close',
  type: 'scatter'
};

let regValues;
let curLow, curOpen, lastPrice, curHigh;
let prediction = "";
let current = "";
let histData = [openGraph, closeGraph, lowGraph, highGraph];
let regData = [regOpenGraph, regCloseGraph, regLowGraph, regHighGraph]



// GET STOCK HISTORY
document.getElementById("stockSubmit").addEventListener("click", function(event) {
  event.preventDefault(); //prevents the default action of reloading the whole page after click
  const value = document.getElementById("stockInput").value; //gets the input from the form
  if (value === "")
    return; //if empty don't do anything
  console.log(value);
  //get date in YYYYMMDD
  let dates = getDates();
  today = dates.today;
  oldDate = dates.past;
  console.log("oldDate: ", oldDate);
  console.log("Today: ", today);

  const url2 = "https://marketdata.websol.barchart.com/getQuote.json?apikey=b2b09e870466caca9554fa0db5bb501f&symbols=" + value;
  console.log(url2);
  fetch(url2)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      console.log(json);
      return json.results;
    }).then(function(quote) {
      console.log(quote);
      quoteOpen = quote[0].open;
      quoteLow = quote[0].low;
      quoteHigh = quote[0].high;
      quoteLastPrice = quote[0].lastPrice;
      setCurrentValues(quoteOpen, quoteLow, quoteHigh, quoteLastPrice);
      let current = "<h2>" + quote[0].symbol + " quote (15 min. delay)</h2>";
      current += "<p><b>Open:</b> $" + quote[0].open.toFixed(4);
      current += "<br><b>Low:</b> $" + quote[0].low.toFixed(4);
      current += "<br><b>High:</b> $" + quote[0].high.toFixed(4);
      current += "<br><b>Last Price:</b> $" + quote[0].lastPrice.toFixed(4);
      return current;
    }).then(function(current) {
      document.getElementById("currentQuote").innerHTML = current;
    });


  const url = "https://marketdata.websol.barchart.com/getHistory.json?apikey=b2b09e870466caca9554fa0db5bb501f&symbol=" + value + "&type=daily&startDate=" + oldDate + "&endDate=" + today;
  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      let results = "<h2>" + json.results[0].symbol.toUpperCase();
      console.log(json);
      for (i in json.results) {
        let seconds = new Date(json.results[i].tradingDay).getTime() / 1000;
        time.data.push(
          seconds
        );
        close.data.push(
          json.results[i].close
        );
        open.data.push(
          json.results[i].open
        );
        high.data.push(
          json.results[i].high
        );
        low.data.push(
          json.results[i].low
        );
      }
      const dataArray = {
        time,
        open,
        close,
        high,
        low,
        results
      }
      return dataArray
    }).then(function(dataArray) {
      prediction = regression(dataArray.time, dataArray.open, dataArray.close, dataArray.high, dataArray.low);
      dataArray.results += prediction;
      document.getElementById("stockResults").innerHTML = dataArray.results;
    }).then(function() {
      let temp = getCurrentValues();
      let recommendation = "<p>" + analysis() + "</p>";
      sparseData();
      document.getElementById("recommendation").innerHTML = recommendation;
    }).then(function() {
      makeGraphs(document);
    });

  clearData();
});

function clearData() {
  time.data = [];
  open.data = [];
  close.data = [];
  high.data = [];
  low.data = [];
  openGraph.x = [];
  openGraph.y = [];
  closeGraph.x = [];
  closeGraph.y = [];
  highGraph.x = [];
  highGraph.y = [];
  lowGraph.x = [];
  lowGraph.y = [];
  regOpenGraph.x = [];
  regOpenGraph.y = [];
  regCloseGraph.x = [];
  regCloseGraph.y = [];
  regHighGraph.x = [];
  regHighGraph.y = [];
  regLowGraph.x = [];
  regLowGraph.y = [];
}

function sparseData() {
  let j = 0;

  for (let i in time.data) {
    if (j % 10 === 0) {
      openGraph.x.push(time.data[i] / secInDay);
      openGraph.y.push(open.data[i]);
      closeGraph.x.push(time.data[i] / secInDay);
      closeGraph.y.push(close.data[i]);
      highGraph.x.push(time.data[i] / secInDay);
      highGraph.y.push(high.data[i]);
      lowGraph.x.push(time.data[i] / secInDay);
      lowGraph.y.push(low.data[i]);
      regOpenGraph.x.push(time.data[i] / secInDay);
      regOpenGraph.y.push(regValues.openInt + (regValues.openSlope * (time.data[i] / secInDay)));
      regCloseGraph.x.push(time.data[i] / secInDay);
      regCloseGraph.y.push(regValues.closeInt + (regValues.closeSlope * (time.data[i] / secInDay)));
      regHighGraph.x.push(time.data[i] / secInDay);
      regHighGraph.y.push(regValues.highInt + (regValues.highSlope * (time.data[i] / secInDay)));
      regLowGraph.x.push(time.data[i] / secInDay);
      regLowGraph.y.push(regValues.lowInt + (regValues.lowSlope * (time.data[i] / secInDay)));
    }
    j++;
  }
  console.log("openHist:", openGraph);
  console.log("closeHist:", closeGraph);
  console.log("highHist:", highGraph);
  console.log("lowHist:", lowGraph);
  console.log("open", regOpenGraph);
  console.log("close", regCloseGraph);
  console.log("high", regHighGraph);
  console.log("low", regLowGraph);
}

function makeGraphs(document) {
  Plotly.newPlot(document.getElementById('histGraph'), histData, histLayout, {
    responsive: true
  });
  Plotly.newPlot(document.getElementById('regGraph'), regData, regLayout, {
    responsive: true
  });
}

function analysis() {
  let openDiff = curOpen - regValues.openPred;
  let closeDiff = lastPrice - regValues.closePred;
  let lowDiff = curLow - regValues.lowPred;
  let highDiff = curHigh - regValues.highPred;
  let averageDiff = (openDiff + closeDiff + lowDiff + highDiff) / 4;
  let averageSlope = (regValues.openSlope + regValues.closeSlope + regValues.highSlope + regValues.lowSlope) / 4;
  console.log("averageslope:", averageSlope);
  let attitude = "";
  let description = "";
  let analysis = "";
  if (averageDiff >= 0) {
    description = "above";
  } else {
    description = "below";
  }
  if (averageSlope < 0.0001 && averageSlope > 0) {
    averageSlope = 0.0001;
  } else if (averageSlope > -0.0001 && averageSlope < 0) {
    averageSlope = -0.0001;
  }

  attitude = "the average slope of the regression lines is "
  if (averageSlope >= 0) {
    attitude += averageSlope.toFixed(4) + ". This stock is bullish.";
  } else {
    attitude += averageSlope.toFixed(4) + ". This stock is bearish.";
  }
  analysis = "This stock's current indicators are $" + averageDiff.toFixed(4) + " " + description + " the predicted values on average and ";
  analysis += attitude;
  return analysis;
}

function getCurrentValues() {
  const values = {
    curOpen,
    curLow,
    curHigh,
    lastPrice
  }

  return values;
}

function setCurrentValues(open, low, high, last) {
  curOpen = open;
  curLow = low;
  curHigh = high;
  lastPrice = last;
}

function regression(time, open, close, high, low) {
  const openReg = new ML.SimpleLinearRegression(time.data, open.data);
  const closeReg = new ML.SimpleLinearRegression(time.data, close.data);
  const highReg = new ML.SimpleLinearRegression(time.data, high.data);
  const lowReg = new ML.SimpleLinearRegression(time.data, low.data);
  tomorrow = (new Date().getTime() / 1000) + (86400);
  let openPred = openReg.predict(tomorrow).toFixed(4);
  let closePred = closeReg.predict(tomorrow).toFixed(4);
  let highPred = highReg.predict(tomorrow).toFixed(4);
  let lowPred = lowReg.predict(tomorrow).toFixed(4);
  let openSlope = openReg.slope * secInDay;
  let closeSlope = closeReg.slope * secInDay;
  let highSlope = highReg.slope * secInDay;
  let lowSlope = lowReg.slope * secInDay;
  let openInt = openReg.intercept;
  let closeInt = openReg.intercept;
  let lowInt = openReg.intercept;
  let highInt = openReg.intercept;
  console.log("openSlope:", openSlope);
  console.log("openInt:", openInt);
  console.log("closeSlope:", closeSlope);
  console.log("closeInt:", closeInt);
  console.log("highSlope:", highSlope);
  console.log("highInt:", highInt);
  console.log("lowSlope:", lowSlope);
  console.log("lowInt:", lowInt);
  const predictionResults = {
    tomorrow,
    openPred,
    closePred,
    highPred,
    lowPred,
    openSlope,
    closeSlope,
    highSlope,
    lowSlope,
    openInt,
    closeInt,
    lowInt,
    highInt
  }
  regValues = predictionResults;
  let prediction = "&nbsppredicted values for next trading day:</h2>";
  prediction += "<p><b>Open: </b>$" + predictionResults.openPred;
  prediction += "<br><b>Low: </b>$" + predictionResults.lowPred;
  prediction += "<br><b>High: </b>$" + predictionResults.highPred;
  prediction += "<br><b>Close: </b>$" + predictionResults.closePred;
  return prediction;
}


/*
//Neural network
  const {
    Layer,
    Network
  } = window.synaptic;
  var inputLayer = new Layer(2);
  var hiddenLayer = new Layer(3);
  var outputLayer = new Layer(1);

  inputLayer.project(hiddenLayer);
  hiddenLayer.project(outputLayer);
  var myNetwork = new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
  });

  // train the network - learn XOR
  var learningRate = .3;
  for (var i = 0; i < 20000; i++) {
    // 0,0 => 0
    myNetwork.activate([0, 10]);
    myNetwork.propagate(learningRate, [0]);
    // 0,1 => 1
    myNetwork.activate([0, 1]);
    myNetwork.propagate(learningRate, [1]);
    // 1,0 => 1
    myNetwork.activate([1, 0]);
    myNetwork.propagate(learningRate, [1]);
    // 1,1 => 0
    myNetwork.activate([1, 1]);
    myNetwork.propagate(learningRate, [0]);
  }
  console.log(myNetwork.activate([0, 0]));
  console.log(myNetwork.activate([0, 1]));
  console.log(myNetwork.activate([1, 0]));
  console.log(myNetwork.activate([1, 1]));


  console.log("history data: ", history.data);*/
//const url2 = "https://api.unplu.gg/forecast"




function getDates() {
  let date = new Date();
  let today = date.getFullYear();
  if (date.getMonth() + 1 < 10) {
    today += '0';
  }
  today += date.getMonth() + 1;
  if (date.getDate() < 10) {
    today += '0';
  }
  today += date.getDate();
  //get date 6 months ago
  let oldDate = "";
  //if 6 months ago is in previous year change year and month
  if (date.getMonth() < 6) {
    oldDate += date.getFullYear() - 1;
    let monthsBack = 6 - (date.getMonth() + 1);
    let oldMonth = 12 - monthsBack;
    if (oldMonth < 10) {
      oldDate += '0';
    }
    oldDate += oldMonth;
    oldDate += '28';
  } else {
    oldDate += date.getFullYear();
    let oldMonth = 12 - (date.getMonth() + 1);
    if (oldMont < 10) {
      oldDate += '0';
    }
    oldDate += oldMonth;
    oldDate += '28';
  }

  const dates = {
    today: today,
    past: oldDate
  }
  return dates;
}