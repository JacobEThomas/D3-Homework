// SVG size of 
let width = 960;
let height = 500;

// set chart margins
let margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// set active SVG size 
let intActiveWid = width - margin.left - margin.right;
let intActiveHgt = height - margin.top - margin.bottom;

// scatter div
let svg = d3.select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// append a group ("g" tag) 
let g = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// open csv
d3.csv("assets/data/data.csv")
  .then(arrState=>{

    //  pull data
    arrState.forEach(obj=>{
      obj.income = +obj.income;
      obj.obesity = +obj.obesity;
    });

    // scale functions
    let fnXScale = d3.scaleLinear()
      .domain([d3.min(arrState, d => d.income), d3.max(arrState, d => d.income)])
      .range([0, intActiveWid]);

    let fnYScale = d3.scaleLinear()
      .domain([d3.min(arrState, d => d.obesity), d3.max(arrState, d => d.obesity)])
      .range([intActiveHgt, 0]);

    // axis functions
    let fnXAxis = d3.axisBottom(fnXScale);
    let fnYAxis = d3.axisLeft(fnYScale);

    // append axis functions to G tag
    g.append("g")
      .attr("transform", `translate(0, ${intActiveHgt})`)
      .call(fnXAxis);
    g.append("g")
      .call(fnYAxis);

    // create circles
    let objCir = g.selectAll("circle")
			.data(arrState)
			.enter()
			.append("circle")
			.attr("cx", obj=>fnXScale(obj.income))
			.attr("cy", obj=>fnYScale(obj.obesity))
			.attr("r", "10")
			.attr("fill", "lightblue")
			.attr("opacity", "1")
		
		// create text labels
    let objTxt = g.selectAll(".circlelabel")
			.data(arrState)
			.enter()
			.append("text")
			.attr("class", "circlelabel")
			.attr("dx", obj=>fnXScale(obj.income) - 7)
			.attr("dy", obj=>fnYScale(obj.obesity) + 4)
			.text(obj=>obj.abbr)
      .attr("fill", "white")
      .attr("font-size", 10);

			
    // tooltip function
    let fnToolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(obj=>{
        return (`<strong>${obj.state}</strong><br>Income: $${obj.income.toLocaleString()}<br>Obesity: ${obj.obesity}%`);
      });

    // bind tooltip function to chart
    g.call(fnToolTip);

    // interactive 
    objCir.on("click", function(obj) {				// circle: on click
      fnToolTip.style("display", "block");
      fnToolTip.show(obj, this);
    })
      .on("mouseout", function(obj, index) {	// circle: on mouseout
        fnToolTip.hide(obj);
      });

    objTxt.on("click", function(obj) {				// text: on click
      fnToolTip.style("display", "block");
			fnToolTip.show(obj, this);
    })
      .on("mouseout", function(obj, index) {  // text: on mouseout
        fnToolTip.hide(obj);
      });

    // label axes
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (intActiveHgt / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity");

    g.append("text")
      .attr("transform", `translate(${intActiveWid / 2}, ${intActiveHgt + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Income");
  });
