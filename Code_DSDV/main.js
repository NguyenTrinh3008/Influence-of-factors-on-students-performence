function displayRowCount(data) {
  var rowCount = data.length;
  $("#o1").text("Total Students: " + rowCount);
}
//    table pivot1
$.get("./main_data.csv", function (csvData) {
  var jsonData = $.csv.toObjects(csvData);
  // display the total number of rows in the #o1 div
  displayRowCount(jsonData);
  //update  the pivot table
  $("#olon").pivotUI(jsonData, {
    rows: ["gender", "group"],
    vals: ["math score", "reading score", "writing score"],
    aggregatorName: "Average",
    renderers: $.pivotUtilities.renderers,
  });
});

// bieu do 1

var csvFilePath = "./main_data.csv";
// Size of the chart
var width = 500;
var height = 300;
var radius = Math.min(width, height) / 3;

// Color for each partition
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Tạo SVG element
var svg = d3
  .select("#o3")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var g = svg
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Read csv file
d3.csv(csvFilePath).then(function (data) {
  // Tạo một đối tượng để đếm số lần xuất hiện của từng giới tính
  var genderCounts = {};

  data.forEach(function (d) {
    var gender = d.gender;
    if (genderCounts[gender]) {
      genderCounts[gender]++;
    } else {
      genderCounts[gender] = 1;
    }
  });

  // Chuyển đổi dữ liệu thành mảng để sử dụng cho biểu đồ Donut
  var genderData = [];
  for (var gender in genderCounts) {
    genderData.push({ gender: gender, count: genderCounts[gender] });
  }

  // Create a tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Create donut chart
  var pie = d3.pie().value(function (d) {
    return d.count;
  });
  var path = d3
    .arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius);

  var arc = g
    .selectAll(".arc")
    .data(pie(genderData))
    .enter()
    .append("g")
    .attr("class", "arc");

  // Add tooltips to each arc
  arc
    .append("path")
    .attr("d", path)
    .attr("fill", function (d) {
      return color(d.data.gender);
    })
    .on("mouseover", function (d) {
      // Display tooltip with gender and proportion information
      tooltip.transition().duration(700).style("opacity", 1);
      tooltip
        .html(d.data.gender + "<br/>" + getPercentage(d, genderData) + "%")
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 28 + "px");

      // Highlight the segment on hover
      d3.select(this).attr("stroke", "white").attr("stroke-width", 2);

      // Scale the path
      d3.select(this)
        .transition()
        .duration(700)
        .attr("transform", "scale(1.1)");
    })
    .on("mouseout", function (d) {
      // Hide tooltip on mouseout
      tooltip.transition().duration(500).style("opacity", 0);

      // Remove the highlight on mouseout
      d3.select(this).attr("stroke", null);

      // Reset the scale
      d3.select(this).transition().duration(500).attr("transform", "scale(1)");
    });

  // Add text labels to each arc
  arc
    .append("text")
    .attr("transform", function (d) {
      var x = path.centroid(d)[0] * 1.5;
      var y = path.centroid(d)[1] * 1.5;
      return "translate(" + x + "," + y + ")";
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function (d) {
      return (d.endAngle + d.startAngle) / 2 > Math.PI ? "end" : "start";
    })
    .text(function (d) {
      return d.data.count;
    });

  // Function to calculate the percentage for the Donut chart
  function getPercentage(d, data) {
    var totalCount = data.reduce(function (acc, curr) {
      return acc + curr.count;
    }, 0);
    return ((d.data.count / totalCount) * 100).toFixed(2);
  }

  // Thêm tiêu đề lớn và cách biểu đồ một khoảng
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 20) // Điều chỉnh khoảng cách từ biểu đồ
    .attr("text-anchor", "middle")
    .style("font-size", "25px") // font size
    .style("font-weight", "bold")
    .text("Proportion of student genders");
  // add number label
  arc
    .append("line")
    .attr("stroke", "black")
    .attr("x1", function (d) {
      return path.centroid(d)[0];
    })
    .attr("y1", function (d) {
      return path.centroid(d)[1];
    })
    .attr("x2", function (d) {
      return path.centroid(d)[0] * 1.5;
    })
    .attr("y2", function (d) {
      return path.centroid(d)[1] * 2;
    });

  arc
    .append("text")
    .attr("transform", function (d) {
      var x = path.centroid(d)[0] * 1.5; // Điều chỉnh vị trí x của nhãn (tùy ý)
      var y = path.centroid(d)[1] * 1.5; // Điều chỉnh vị trí y của nhãn (tùy ý)
      return "translate(" + x + "," + y + ")";
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function (d) {
      return (d.endAngle + d.startAngle) / 2 > Math.PI ? "end" : "start";
    })
    .text(function (d) {
      return d.data.count;
    });
  var legendWidth = genderData.length * 100; // 100 is the space allocated for each legend item
  // Create a legend
  var legend = svg
    .selectAll(".legend")
    .data(genderData)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return (
        "translate(" +
        ((width - legendWidth) / 1.65 + i * 100) +
        "," +
        (height - 30) +
        ")"
      );
    });

  // Add colored squares to the legend
  legend
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", function (d) {
      return color(d.gender);
    });

  // Add text labels to the legend
  legend
    .append("text")
    .attr("x", 30) // Adjust this value as needed
    .attr("y", 15)
    .text(function (d) {
      return d.gender;
    });
});

d3.csv("main_data.csv")
  .then(function (data) {
    // Tính số lượng cho từng giá trị "group"
    var counts = {};
    data.forEach(function (d) {
      var customGroup = d.group;
      counts[customGroup] = (counts[customGroup] || 0) + 1;
    });
    //--------------------------------------------------------------------
    // Chuyển số liệu sang dạng mảng để sử dụng trong biểu đồ
    var pieData = Object.entries(counts).map(function ([
      customGroup,
      customCount,
    ]) {
      return { customGroup, customCount };
    });

    // Xác định chiều rộng và cao của biểu đồ
    var customWidth = 500;
    var customHeight = 500;

    // Chọn vị trí để vẽ biểu đồ
    var svg = d3
      .select("#o4")
      .append("svg")
      .attr("width", customWidth)
      .attr("height", customHeight)
      .append("g")
      .attr(
        "transform",
        "translate(" + customWidth / 2 + "," + customHeight / 2 + ")"
      );

    // Create a circle chart
    var pie = d3.pie().value(function (d) {
      return d.customCount;
    });

    var path = d3
      .arc()
      .outerRadius(customWidth / 3)
      .innerRadius(0);

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    // add tooltip
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
    var arc = svg
      .selectAll(".arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Vẽ các phần tử của biểu đồ tròn
    arc
      .append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        return color(d.data.customGroup);
      });
    // Add tooltips to each arc
    arc
      .append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        return color(d.data.customGroup);
      })
      .on("mouseover", function (d) {
        // Display tooltip with group and proportion information
        tooltip.transition().duration(350).style("opacity", 0.9);
        tooltip
          .html(d.data.customGroup + "<br/>" + getPercentage(d, pieData) + "%")
          .style("left", d3.event.pageX + 10 + "px")
          .style("top", d3.event.pageY - 28 + "px");

        // Scale the path
        d3.select(this)
          .transition()
          .duration(350)
          .attr("transform", "scale(1.1)");
      })
      .on("mouseout", function (d) {
        // Hide tooltip on mouseout
        tooltip.transition().duration(500).style("opacity", 0);

        // Reset the scale
        d3.select(this)
          .transition()
          .duration(350)
          .attr("transform", "scale(1)");
      });
    function getPercentage(d, data) {
      var totalCount = data.reduce(function (acc, curr) {
        return acc + curr.customCount;
      }, 0);
      return ((d.data.customCount / totalCount) * 100).toFixed(2);
    }

    // Create legend
    // Create legend
    var legend2 = d3
      .select("#o4") // Change the selection to the desired element
      .append("svg")
      .attr("width", customWidth)
      .attr("height", 100) // Adjust the height as needed
      .selectAll(".legend2")
      .data(pieData)
      .enter()
      .append("g")
      .attr("class", "legend2")
      .attr("transform", function (d, i) {
        return "translate(" + i * 85 + "," + 10 + ")"; // Adjust the translation as needed
      });

    // Add colored squares to the legend
    legend2
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", function (d) {
        return color(d.customGroup);
      });

    // Add text labels to the legend
    legend2
      .append("text")
      .attr("x", 25)
      .attr("y", 9)
      .text(function (d) {
        return d.customGroup;
      });
    // Add colored squares to the legend
    legend2
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", function (d) {
        return color(d.customGroup);
      });

    // Add text labels to the legend
    legend2
      .append("text")
      .attr("x", 25)
      .attr("y", 9)
      .text(function (d) {
        return d.customGroup;
      });

    // Thêm tiêu đề
    svg
      .append("text")
      .attr("x", width - 490) // Center the text
      .attr("y", -200) // Position the text at the top
      .attr("text-anchor", "middle")
      .style("font-size", "25px")
      .style("font-weight", "bold")
      .text("Proportion of student groups");
    // -----------------------------------------------------------------
    // bar chart
    // Create a scale for the y-axis (average scores)
    var yScale = d3.scaleLinear().range([chartHeight, 0]);

    // Load the data
    d3.csv("data.csv").then(function (data) {
      // Parse the data and set the domains for the scales
      data.forEach(function (d) {
        d.lunch = d.lunch;
        d.avg = +d.avg;
      });

      xScale.domain(
        data.map(function (d) {
          return d.lunch;
        })
      );
      yScale.domain([
        0,
        d3.max(data, function (d) {
          return d.avg;
        }),
      ]);

      // Bind the data to the SVG and create the bars
      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
          return xScale(d.lunch);
        })
        .attr("width", xScale.bandwidth())
        .attr("y", function (d) {
          return yScale(d.avg);
        })
        .attr("height", function (d) {
          return chartHeight - yScale(d.avg);
        });
    });

    // Dimensions of the chart
    var chartWidth = 300;
    var chartHeight = 200;
    var margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Create an SVG element
    var svg = d3
      .select("#on2")
      .append("svg")
      .attr("width", chartWidth + margin.left + margin.right)
      .attr("height", chartHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create a scale for the x-axis (lunch types)
    var xScale = d3.scaleBand().range([0, chartWidth]).padding(0.1);
    var xAxis = d3.axisBottom(xScale);

    // Create a scale for the y-axis (total marks)
    var yScale = d3.scaleLinear().range([chartHeight, 0]);
    var yAxis = d3.axisLeft(yScale);

    // Set the domains of the scales based on the data
    xScale.domain(
      data.map(function (d) {
        return d.lunch;
      })
    );
    yScale.domain([
      0,
      d3.max(data, function (d) {
        return d.total_marks;
      }),
    ]);

    // Draw bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return xScale(d.lunch);
      })
      .attr("width", xScale.bandwidth())
      .attr("y", function (d) {
        return yScale(d.total_marks);
      })
      .attr("height", function (d) {
        return chartHeight - yScale(d.total_marks);
      })
      .attr("fill", "steelblue");

    // Draw x-axis
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + chartHeight + ")")
      .call(xAxis);

    // Draw y-axis
    svg.append("g").attr("class", "y axis").call(yAxis);

    // Add labels
    svg
      .append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + margin.bottom)
      .style("text-anchor", "middle")
      .text("Lunch Type");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - chartHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Average Total Marks");
  })

  .catch(function (error) {
    console.log(error);
  });
