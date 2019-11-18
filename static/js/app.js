function buildMetadata(sample) {
  var sample_url ="/metadata/"+sample
    // @TODO: Complete the following function that builds the metadata panel
  d3.json(sample_url).then((response) => {

    var WFREQ = response['WFREQ']
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
     var panel = d3.select('#sample-metadata').html("")
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(([key, value]) => panel.append('h6').text(`${key} :${value}`));
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    
     var trace = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: WFREQ,
        type: "indicator",
        mode: "gauge+number"
      }
    ];
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', trace, layout);
  })
}

  
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/"+sample).then((response)=> {
    // @TODO: Build a Bubble Chart using the sample data
    var otu_ids = response['otu_ids'];
    var sample_values = response['sample_values'];
    var otu_labels = response['otu_labels']

    var bubble = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values
      },
      color : otu_ids,
      text: otu_labels
      }

    var data = [bubble];
    
    var bubblelayout = {
      showlegend: false,
      height: 600,
      width: 1200
    };
  
    Plotly.newPlot('bubble', data, bubblelayout);


       // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pie= {
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      // hoverinfo: "hovertext",
      type:"pie"
    }

    var piedata= [pie];
    var pielayout = {
      height : 400,
      width : 500
    }
    Plotly.newPlot('pie',piedata, pielayout)
    });

    
  };
    

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
