var socket = io();

// for debugging
socket.on('connect', function() {
    console.log('socket is open');
});
socket.on('disconnect', function() {
    console.log('socket is closed');
});

var width = 500;
var height = 500;
var margin = {top:10, right:30, bottom: 30, left: 40};

svg = d3.select("#dataviz")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform",
			  "translate(" + margin.left + "," + margin.top + ")");
svg.append("g")
	.attr("id", "axis_left");
svg.append("g")
	.attr("id", "axis_bottom")
	.attr("transform", "translate(0," + height + ")");

		
data = []
socket.on('json', function(data_new) {
    console.log('json sums raw: ' + data_new.sums);
	new_sums = JSON.parse(data_new.sums);
	p = JSON.parse(data_new.p);
	ngets = JSON.parse(data_new.ngets);
	ndist = JSON.parse(data_new.ndist);
	
	data.push(...new_sums);
	var x = d3.scaleLinear()
		.domain([d3.min(data, function(d) { return d; }), d3.max(data, function(d) { return d; })])
		.range([0, width]);
	svg.select("#axis_bottom")
		.call(d3.axisBottom(x));
	
	var histogram = d3.histogram()
		.value(function(d) { return d; })
		.domain(x.domain())
		.thresholds(x.ticks(70));

	var bins = histogram(data);
	console.log(bins);

	var y = d3.scaleLinear()
		.range([height, 0]);
		y.domain([0, d3.max(bins, function(d) { return d.length; })]);
	svg.select("#axis_left")
		.call(d3.axisLeft(y));
	
	selection = svg.selectAll("rect")
		.data(bins);
	selection.attr("x", 1)
		.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
		.attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
		.attr("height", function(d) { return height - y(d.length); })
		.style("fill", "#69b3a2")
	selection.enter()
		.append("rect")
			.attr("x", 1)
			.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
			.attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
			.attr("height", function(d) { return height - y(d.length); })
			.style("fill", "#69b3a2")
	selection.exit().remove();
			
	delay(500).then(() => get(1-p, ndist, ngets));
});

svg2 = d3.select("#dataviz")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform",
			  "translate(" + margin.left + "," + margin.top + ")");
svg2.append("g")
	.attr("id", "axis_left");
svg2.append("g")
	.attr("id", "axis_bottom")
	.attr("transform", "translate(0," + height + ")");

data2 = []
socket.on('json2', function(data_new) {
    console.log('json2 sums raw: ' + data_new.sums);
	new_sums = JSON.parse(data_new.sums);
	p = JSON.parse(data_new.p);
	ngets = JSON.parse(data_new.ngets);
	ndist = JSON.parse(data_new.ndist);
	
	data2.push(...new_sums);
	var x = d3.scaleLinear()
		.domain([d3.min(data2, function(d) { return d; }), d3.max(data2, function(d) { return d; })])
		.range([0, width]);
	svg2.select("#axis_bottom")
		.call(d3.axisBottom(x));
	
	var histogram = d3.histogram()
		.value(function(d) { return d; })
		.domain(x.domain())
		.thresholds(x.ticks(70));

	var bins = histogram(data2);

	var y = d3.scaleLinear()
		.range([height, 0]);
		y.domain([0, d3.max(bins, function(d) { return d.length; })]);
	svg2.select("#axis_left")
		.call(d3.axisLeft(y));
	
	selection = svg2.selectAll("rect")
		.data(bins);
	selection.attr("x", 1)
		.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
		.attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
		.attr("height", function(d) { return height - y(d.length); })
		.style("fill", "#69b3a2")
	selection.enter()
		.append("rect")
			.attr("x", 1)
			.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
			.attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
			.attr("height", function(d) { return height - y(d.length); })
			.style("fill", "#69b3a2")
	selection.exit().remove();
			
	delay(1000).then(() => get2(p, ndist, ngets));
});

function delay(time) {
	return new Promise(resolve => setTimeout(resolve,time));
}

function get(p, ndist, ngets) {
    socket.emit('get', p, ndist, ngets);
}
get(0.9, 1000, 100);

function get2(p, ndist, ngets) {
    socket.emit('get2', p, ndist, ngets);
}
get2(0.9, 1000, 100);
