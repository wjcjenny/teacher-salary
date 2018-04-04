
$(document).ready(function(){
	"use strict";
// buttons 
	$('.bttn').click(function() {
		$( ".bttn" ).removeClass( 'active');
		$( this ).addClass( 'active');
	});

// map

var legendpctchange = "<p class='legendpctchange1'>-20</p><p class='legendpctchange2'>-15</p><p class='legendpctchange3'>-10</p><p class='legendpctchange4'>-5</p><p class='legendpctchange5'>0</p><p class='legendpctchange6'>5</p><p class='legendpctchange7'>10</p><p class='legendpctchange8'>15</p><p class='legendpctchange9'>20%</p>"

var legendnumbernew = "<p class='legendnumbernew1'>$40</p><p class='legendnumbernew2'>45</p><p class='legendnumbernew3'>50</p><p class='legendnumbernew4'>55</p><p class='legendnumbernew5'>60</p><p class='legendnumbernew6'>65</p><p class='legendnumbernew7'>70</p><p class='legendnumbernew8'>75</p><p class='legendnumbernew9'>80 (thousand)</p>"

var legendsquarepctchange = "<div class='legendsquarepct1'></div><div class='legendsquarepct2'></div><div class='legendsquarepct3'></div><div class='legendsquarepct4'></div><div class='legendsquarepct5'></div><div class='legendsquarepct6'></div><div class='legendsquarepct7'></div><div class='legendsquarepct8'></div>"

var legendsquarenumbernew = "<div class='legendsquarenumbernew1'></div><div class='legendsquarenumbernew2'></div><div class='legendsquarenumbernew3'></div><div class='legendsquarenumbernew4'></div><div class='legendsquarenumbernew5'></div><div class='legendsquarenumbernew6'></div><div class='legendsquarenumbernew7'></div><div class='legendsquarenumbernew8'></div>"



var mappctchange = "<div id='superContainer-pctchange'></div>";
var mapnumbernew = "<div id='superContainer-numbernew'></div>";



$('#legendbox').html(legendpctchange);
$('#legendsquarebox').html(legendsquarepctchange);

$('#mapbox').html(mappctchange);

function percent(){

	d3.select(window)
	   .on("resize", sizeChange);

	// D3 Projection
	var projection = d3.geo.albersUsa()
					  .scale([1000]);          // scale things down so see entire US
	        
	// Define path generator
	var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
			  	 .projection(projection);  // tell path generator to use albersUsa projection

			
	// Define linear scale for output
	var color = d3.scale.threshold()
	// d3.scale.linear()
				  .range(["#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788"]);

	var svgpctchange = d3.select("#superContainer-pctchange")
				.append("svg")
				.attr("class","svgMap")
				.attr("width", "100%")
				.append("g");

	// Append Div for tooltip to SVG
	var divpctchange = d3.select("#superContainer-pctchange")
			    .append("div")   
	    		.attr("class", "tooltip")
	    		.style("opacity", 0);

		// Load in my states data!
	d3.csv("data/data.csv", function(data) {
		color.domain([-15,-10,-5,0,5,10,15]); 
		d3.json("data/us-states.json", function(json) {
		
			// Loop through each state data value in the .csv file
			for (var i = 0; i < data.length; i++) {

				// Grab State Name
				var dataState = data[i].state;


				// Grab data value 
				var numberoldValue = data[i].numberold;
				var numbernewValue = data[i].numbernew;
				var pctchangeValue = data[i].pctchange;

				// Find the corresponding state inside the GeoJSON
				for (var j = 0; j < json.features.length; j++)  {
					var jsonState = json.features[j].properties.name;

					if (dataState == jsonState) {

					// Copy the data value into the JSON
					json.features[j].properties.numberold = numberoldValue;
					json.features[j].properties.numbernew = numbernewValue; 
					json.features[j].properties.pctchange = pctchangeValue; 
					// Stop looking through the JSON
					break;
					}
				}
			}
			svgpctchange.selectAll("path")
				.data(json.features)
				.enter()
				.append("path")
				.attr("d", path)
				.style("stroke", "#FFFFFF")
				.style("stroke-width", 1)
				.style('fill', '#e1e1e1')
				.style("fill", function(d) {
					// Get data value
					var value = d.properties.pctchange;
					if (value) {
					//If value exists…
					return color(value);
					} else {
					//If value is undefined…
					return "#efefef";
					}
				})
				.on("mouseover", function(d) {  
			    	divpctchange.transition()
			    		.duration(500)
			    		.style("opacity", .9);

			        //parse data with comma
					var formatComma = d3.format(",")
					var positivesign = d3.format("+")

			        divpctchange.html("<p><span class='focusstate'>" + d.properties.name + "</span></br>1999-2000: " + "<span class='focusnumber'>$" + formatComma(d.properties.numberold) + "</span></br>2016-2017: " + "<span class='focusnumber'>$" + formatComma(d.properties.numbernew) + "</span></br>Percentage change: " + "<span class='focusnumber'>" + positivesign(d.properties.pctchange) + "</span>%</p>")
			           .style("left", (d3.event.pageX - 100) + "px")     
			           .style("top", (d3.event.pageY - 200) + "px");    
				})                 
			    .on("mouseout", function(d) {       
			        divpctchange.transition()        
			           .duration(500)
			           .style("opacity", 0);
			        // return tooltip    
			        //    .style("display", "none");   
			    });
		});

	});
	
	function sizeChange() {
	    d3.select("g")
	    	.attr("transform", "scale(" + $("#superContainer-pctchange")
	    	.width()/900 + ")");
	    $(".svgMap").height($("#superContainer-pctchange").width()*0.618);
	}
}

function numbernew(){

	d3.select(window)
	   .on("resize", sizeChange);

	// D3 Projection
	var projection = d3.geo.albersUsa()
					  .scale([1000]);          // scale things down so see entire US
	        
	// Define path generator
	var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
			  	 .projection(projection);  // tell path generator to use albersUsa projection

			
	// Define linear scale for output
	var color = d3.scale.threshold()
				  .range(["#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"]);

	var svgnumbernew = d3.select("#superContainer-numbernew")
				.append("svg")
				.attr("class","svgMap")
				.attr("width", "100%")
				.append("g");

	// var tooltip = d3.select("body").append("div") 
 //        .attr("class", "tooltip")       
 //        .style("opacity", 0);

	// Append Div for tooltip to SVG
	var divnumbernew = d3.select("#superContainer-numbernew")
			    .append("div")   
	    		.attr("class", "tooltip")
	    		.style("opacity", 0);

		// Load in my states data!
	d3.csv("data/data.csv", function(data) {
		
		color.domain([45000,50000,55000,60000,65000,70000,75000]);// setting the range of the input data
		d3.json("data/us-states.json", function(json) {
		
			// Loop through each state data value in the .csv file
			for (var i = 0; i < data.length; i++) {

				// Grab State Name
				var dataState = data[i].state;


				// Grab data value 

				var numberoldValue = data[i].numberold;
				var numbernewValue = data[i].numbernew;
				var pctchangeValue = data[i].pctchange;

				// Find the corresponding state inside the GeoJSON
				for (var j = 0; j < json.features.length; j++)  {
					var jsonState = json.features[j].properties.name;

					if (dataState == jsonState) {

					// Copy the data value into the JSON
					json.features[j].properties.numberold = numberoldValue;
					json.features[j].properties.numbernew = numbernewValue; 
					json.features[j].properties.pctchange = pctchangeValue; 
					// Stop looking through the JSON
					break;
					}
				}
			}
			svgnumbernew.selectAll("path")
				.data(json.features)
				.enter()
				.append("path")
				.attr("d", path)
				.style("stroke", "#FFFFFF")
				.style("stroke-width", 1)
				.style('fill', '#e1e1e1')
				.style("fill", function(d) {
					// Get data value
					var value = d.properties.numbernew;
					if (value) {
					//If value exists…
					return color(value);
					} else {
					//If value is undefined…
					return "#efefef";
					}
				})
				.on("mouseover", function(d) {  
			    	divnumbernew.transition()
			    		.duration(200)
			    		.style("opacity", .9);
			        //parse data with comma

					var formatComma = d3.format(",")
					var positivesign = d3.format("+")

			        divnumbernew.html("<p><span class='focusstate'>" + d.properties.name + ": </span>" + "<span class='focusnumber'>$" + formatComma(d.properties.numbernew) + "</span></p>")
			           .style("left", (d3.event.pageX - 100) + "px")     
			           .style("top", (d3.event.pageY - 200) + "px");    
				})                 
			    .on("mouseout", function(d) {       
			        divnumbernew.transition()        
			           .duration(500)
			           .style("opacity", 0);
			        // return tooltip    
			        //    .style("display", "none");   
			    });
		});

	});
	
	function sizeChange() {
	    d3.select("g")
	    	.attr("transform", "scale(" + $("#superContainer-numbernew")
	    	.width()/900 + ")");
	    $(".svgMap").height($("#superContainer-numbernew").width()*0.618);
	}
}

percent();

var sex = "#superContainer-pctchange";
function loading(){
	d3.select("g")
	.attr("transform", "scale(" + $(sex)
	.width()/900 + ")");
	$(".svgMap").height($(sex).width()*0.618);
}

loading();

$('#rect1').click(function(){
	sex = "#superContainer-numbernew";
	$('#mapbox').html();
	$('#legendbox').html(legendnumbernew);
	$('#legendsquarebox').html(legendsquarenumbernew);
	$('#mapbox').html(mapnumbernew);
	numbernew();
	loading(sex)
});

$('#rect0').click(function(){
	sex = "#superContainer-pctchange";
	$('#mapbox').html();
	$('#legendbox').html(legendpctchange);
	$('#legendsquarebox').html(legendsquarepctchange);
	$('#mapbox').html(mappctchange);
	percent();
	loading(sex)
});



// table
var listTemplate = _.template(
	"<tr>"+
		"<td class='state'><%= states %></td>"+
		"<td class='numberold'>$<%= numberolds %></td>"+
		"<td class='numbernew'>$<%= numbernews %></td>"+
		"<td class='pctchange'><%= pctchanges %>%</td>"+
	"</tr>"
);

var templateData = $.getJSON("data/table-data.json", function(data) {
		var formatComma = d3.format(",")
		var positivesign = d3.format("+")

		function doRender(type) {
			data.forEach(function(d) {
				$('#sotuInfo').append(
					listTemplate({
						states: d.state,
						numberolds:  formatComma(d.numberold),
						numbernews:  formatComma(d.numbernew),
						pctchanges:  positivesign(d.pctchange)
					})
			  	);
			});
			$('#example2').DataTable( {
				"columnDefs": [ 
					{
						"targets":  [0,1,2,3],
						"orderable": true
			 		}
			 	],
			 	responsive: true,
			 	// responsive: {
			  //      details: false
			  //   },
			 	searching: false,
			 	order: [[ 0, "asc" ]],
			 	bInfo : false,
			 	"bPaginate": false
		 	} );
		}
		
		doRender();
		 
	});


});

  