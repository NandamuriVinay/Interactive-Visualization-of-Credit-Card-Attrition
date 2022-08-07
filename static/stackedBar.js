function reformat(edus, incs){
    function onlyUnique(value, index, self) {
        console.log("h1", value, index)
    return self.indexOf(value) === index;
    }
    let edu_unq = [...new Set(edus)]
    let res = []
    for (let i = 0; i < incs.length; i++) {
        let ent =  res.filter((r) => r.category === incs[i])
        if(ent.length>0){
            ent = ent[0]
            ent[edus[i]] += 1
        } else {
            let ele = {category: incs[i]}
            for (const edu of edu_unq) {
                ele[edu] = ((edu === edus[i])? 1 : 0);
            }
            res.push(ele)
        }
    }
    //console.log(res);
    return res
}


function drawStackedBarChart2(data_sent) {
var Income_Category=[];
var Education_Level=[];


d3.csv("static/finalcsv.csv", function(error, card) {

card=card.filter(function (row){
    return row["State"]==='MO';
})
    for (const d of card) {
                Income_Category.push(d.Income_Category);

        Education_Level.push(d.Education_Level);
    }


// High School Graduate  Uneducated Post-Graduate College Doctorate
// Less than $40K $40K - $60K $60K - $80K $80K - $120K  $120K +

    data=reformat(Education_Level,Income_Category)
    data = Object.assign(data, { columns: Object.keys(data[0])})
    console.log(data);

    subgroups = data.columns.slice(1)
    groups = d3.map(data, d => d.group).keys()
    stackedData = d3.stack().keys(subgroups)(data)

    console.log(stackedData);

   const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#9CADCE','#7EC4CF','#52B2CF','#42f5b3','#cdf505','#f58d05'])

    dimensions = ({
  height:400,
  width:600,
  margin: {
      top: 10,
      right: 30,
      bottom: 20,
      left: 50,
    }
  })

    x = d3.scaleBand()
      .domain(groups)
      .range([0, dimensions.width])
      .padding([0.2])


    y = d3.scaleLinear()
    .domain([0, 30])
    .range([ dimensions.height, 0 ]);






  const svg = d3.select("svg")
      .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
      .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")")

  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .enter().append("rect")
        .attr("x", d => x(d.data.group))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())


  svg.append("g")
    .attr("transform", "translate(0," + dimensions.height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  svg.append("g")
    .call(d3.axisLeft(y));
   return svg.node();

        });




}