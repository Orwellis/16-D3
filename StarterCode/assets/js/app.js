var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from
d3.csv("./assets/data/data.csv").then(function(StateData) {
  console.log(StateData);

  var states = StateData.map(data => data.state);
  var abbr = StateData.map(data => data.abbr)
  var poverty = StateData.map(data => data.poverty);
  // var povertyMoe = StateData.map(data => data.povertyMoe);
  // var age = StateData.map(data => data.age);
  // var ageMoe = StateData.map(data => data.ageMoe);
  var healthcare = StateData.map(data => data.healthcare);
  // var healthcareLow = StateData.map(data => data.healthcareLow);
  // var healthcareHigh = StateData.map(data => data.healthcareHigh);
  // var obesity = StateData.map(data => data.obesity);
  // var obesityLow = StateData.map(data => data.obesityLow);
  // var obesityHigh = StateData.map(data => data.obesityHigh);
  // var smokes = StateData.map(data => data.smokes);
  // var smokesLow = StateData.map(data => data.smokesLow);
  // var smokesHigh = StateData.map(data => data.smokesHigh);


  // Create scale functions
  var xLinearScale = d3.scaleLinear()
  .domain([5, 25])
  .range([0, width]);

var yLinearScale = d3.scaleLinear()
  .domain([0, 30])
  .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(StateData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "15")
  .attr("fill", "red")
  .attr("opacity", ".5");

  // Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });

  // Create tooltip in the chart
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  circlesGroup.on("click", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Heathcare %");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("% in Poverty");

  });