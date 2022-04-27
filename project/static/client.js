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
var margin = {top:10, right:30, bottom: 30, left: 30};

svg = d3.select("#dataviz")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform",
			  "translate(" + margin.left + "," + margin.top + ")");
		
data = []
socket.on('json', function(data_new) {
    console.log('sums raw: ' + data_new.sums);
	console.log('p raw:' + data_new.p);
	console.log('ngets raw:' + data_new.ngets);
	console.log('ndist raw:' + data_new.ndist);
	new_sums = JSON.parse(data_new.sums);
	p = JSON.parse(data_new.p);
	ngets = JSON.parse(data_new.ngets);
	ndist = JSON.parse(data_new.ndist);
	
	data.push(...new_sums);
	var x = d3.scaleLinear()
		.domain([d3.min(data, function(d) { return d; }), d3.max(data, function(d) { return d; })])
		.range([0, width]);
	svg.append("g")
		.attr("id", "axis_bottom")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));
	
	var histogram = d3.histogram()
		.value(function(d) { console.log(d); return d; })
		.domain(x.domain())
		.thresholds(x.ticks(70));

	var bins = histogram(data);
	console.log(bins);

	var y = d3.scaleLinear()
		.range([height, 0]);
		y.domain([0, d3.max(bins, function(d) { console.log(d.length); return d.length; })]);
	svg.append("g")
		.attr("id", "axis_left")
		.call(d3.axisLeft(y));
	
	svg.selectAll("rect")
		.data(bins)
		.enter()
		.append("rect")
			.attr("x", 1)
			.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
			.attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
			.attr("height", function(d) { return height - y(d.length); })
			.style("fill", "#69b3a2");
	// delay(1000).then(() => get(p, ndist, ngets));
});

function delay(time) {
	return new Promise(resolve => setTimeout(resolve,time));
}

function get(p, ndist, ngets) {
    socket.emit('get', p, ndist, ngets);
}
get(0.6, 1000, 100);
