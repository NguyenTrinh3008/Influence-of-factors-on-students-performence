//    table pivot1
$.get("./main_data.csv", function (csvData) {
  var jsonData = $.csv.toObjects(csvData);

  $("#olon").pivotUI(jsonData, {
    rows: ["gender", "group",],
    vals: ["math score", "reading score", "writing score"],
    aggregatorName: "Average",
    renderers: $.pivotUtilities.renderers,
  });
});

// bieu do 1

var csvFilePath = "./main_data.csv";
// Kích thước của biểu đồ
var width = 500;
var height = 300;
var radius = Math.min(width, height) / 3;

// Màu sắc cho từng phần trong biểu đồ
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

// Đọc dữ liệu từ tệp CSV
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

  // Tạo biểu đồ Donut
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

  // Thêm phần hover
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  arc
    .append("path")
    .attr("d", path)
    .attr("fill", function (d) {
      return color(d.data.gender);
    })
    .on("mouseover", function (d) {
      // Hiển thị tooltip khi di chuột vào phần biểu đồ
      tooltip.transition().duration(150).style("opacity", 0.9);
      tooltip
        .html(d.data.gender + "<br/>" + d.data.count)
        .style("left", d3.event.pageX + 5 + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      // Ẩn tooltip khi di chuột ra khỏi phần biểu đồ
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // Thêm tiêu đề lớn và cách biểu đồ một khoảng
  // Thêm tiêu đề lớn và cách biểu đồ một khoảng
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 20) // Điều chỉnh khoảng cách từ biểu đồ
    .attr("text-anchor", "middle")
    .style("font-size", "18px") // Cỡ chữ lớn
    .style("font-weight", "bold") // In đậm
    .text("Proportion of student genders");
  // Thêm nhãn số và dấu gạch đi ra ngoài
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
      return path.centroid(d)[0] * 1.4;
    }) // Điều chỉnh độ dài của dấu gạch (tùy ý)
    .attr("y2", function (d) {
      return path.centroid(d)[1] * 1.4;
    }); // Điều chỉnh độ dài của dấu gạch (tùy ý)

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

  // Thêm chú thích (legend)
  var legend = svg
    .selectAll(".legend")
    .data(genderData)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + (i * 20 + 40) + ")";
    });

  legend
    .append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function (d) {
      return color(d.gender);
    });

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
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

    // Chuyển số liệu sang dạng mảng để sử dụng trong biểu đồ
    var pieData = Object.entries(counts).map(function ([
      customGroup,
      customCount,
    ]) {
      return { customGroup, customCount };
    });

    // Xác định chiều rộng và cao của biểu đồ
    var customWidth = 400;
    var customHeight = 400;

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

    // Tạo một biểu đồ tròn
    var pie = d3.pie().value(function (d) {
      return d.customCount;
    });

    var path = d3
      .arc()
      .outerRadius(customWidth / 3)
      .innerRadius(0);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

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

    // Thêm nhãn cho từng phần tử
    arc
      .append("text")
      .attr("transform", function (d) {
        return "translate(" + path.centroid(d) + ")";
      })
      .text(function (d) {
        return d.data.customGroup;
      });

    // Tạo legend
    var legend2 = svg
      .selectAll(".legend2")
      .data(pieData)
      .enter()
      .append("g")
      .attr("class", "legend2")
      .attr("transform", function (d, i) {
        return (
          "translate(" +
          (customWidth / 2 + 10) +
          "," +
          (i * 20 - customHeight / 2) +
          ")"
        );
      });

    legend2
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", function (d) {
        return color(d.group);
      });

    legend2
      .append("text")
      .attr("x", 25) // Điều chỉnh khoảng cách giữa hình vuông và nhãn
      .attr("y", 9) // Điều chỉnh vị trí dọc của nhãn
      .text(function (d) {
        return d.group;
      });

    // Thêm tiêu đề
    svg
      .append("text")
      .attr("x", width / 11.5)
      .attr("y", -150)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("Proportion of student genders");
  })
  .catch(function (error) {
    console.log(error);
  });

// ROW COUNT CSV
var rowCountContainer = document.getElementById("row-count");

// Đường dẫn đến tệp CSV
var csvFilePath = "./main_data.csv";

// Tạo đối tượng XMLHttpRequest để tải tệp CSV
var xhr = new XMLHttpRequest();
xhr.open("GET", csvFilePath, true);
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    // Lấy nội dung của tệp CSV
    var csvData = xhr.responseText;

    // Chia dòng thành mảng bằng dấu xuống dòng
    var rows = csvData.split("\n");

    // Đếm số hàng (loại bỏ hàng tiêu đề)
    var rowCount = rows.length - 2;
    // Hiển thị số hàng trong textbox
    rowCountContainer.innerText = rowCount;
  }
};


