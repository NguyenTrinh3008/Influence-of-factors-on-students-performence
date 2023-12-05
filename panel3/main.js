function rowConverter(d) {
  return {
    name: d.name,
    gender: d.gender,
    group: d.group,
    pdegrees: d["parent degrees"],
    luch: d.lunch,
    tpc: d["test prep"],
    math: parseFloat(d["math score"]),
    reading: parseFloat(d["reading score"]),
    writing: parseFloat(d["writing score"]),
    avg: parseFloat(d.avg),
    result: d.result,
    grade: d.grade,
  };
}

const df_url =
  "https://raw.githubusercontent.com/MicroGix/Influence-of-factors-on-students-performence/main/main_data.csv";
d3.csv(df_url, rowConverter, function (error, data) {
  if (error) {
    console.log(error);
  } else {
    initPanel_3(data);
  }
});

function initPanel_3(data) {
  const outer_w = 500;
  const outer_h = 300;
  const margin = { top: 50, right: 20, bottom: 50, left: 20 };
  const h = outer_h - margin.top - margin.bottom;
  const w = outer_w - margin.right - margin.left;
  const p = 20;

  const stack = d3
    .select("#stack-plot")
    .append("svg")
      .att("width", outer_w)
      .attr("height",outer_h)
    .append("g")
      .attr("transform", "translate("+margin.left+", "+margin.top+")");

  // groups data bases on result 
  const results = d3.map(data, (d) => d.result).keys()
  const x_stack = d3
    .scaleBand()
    .domain(results)
    .range([0,width - p])
    .padding([0.2])
  stack
    .append("g")
    .attr("transform", "translate(0,"+h+")") 
    .call(d3.axisBottom(x_stack).tickSizeOuter(0));

  // function to count number of male or female student
  data.forEach(countGender); 
  function countGender(i) {
    let n_male = 0;
    let n_female = 0;
    let total = 0
    if (i=="male") {
      n_male++;
    } else if(i=="female") {
      n_female++;
    } else{
      total++;
    }
    return n_male, n_female, total 
  }

  const y_stack = d3
    .scaleLinear()
    .domain([0, function(d){
      if (total<1000) {
        return 1000;
      } else{
        return total;
      }
    }])
    .range([h -p, 0]);
  stack
    .append("g")
    .call(d3.axisLeft(y_stack));

  const genders = d3.map(data, (d) => d.gender).keys()
  const color = d3
    .scaleOrdinal()
    .domain(genders)
    .range(['red','blue']);

  const stackedData = d3
    .stack()
    .keys(genders)
    (data)

  stack
    .append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
    .attr("fill", (d)=>color(d.key))
    .selectAll("rect")
    .data((d)=>d)
    .enter().append("rect")
    .attr("x", (d)=>x_stack(d.data.group))
    .attr("y", (d)=>y_stack(d[1]))
    .attr("heigt", function(d) {
      return
        y(d[0])-y(d[1]);
    })
    .attr("width", x_stack.bandwidth());
}
