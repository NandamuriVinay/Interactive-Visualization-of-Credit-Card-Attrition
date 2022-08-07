function drawPcp(data_sent){
   // label=data_sent[3];

    var height=440,
    width=1200,
    margin={top:60,right:60,left:60,bottom:120 };

var x = d3.scalePoint().range([0, width], 1),
    y = {},
    dragging = {};

var line = d3.line(),
    axis = d3.axisLeft(),
    background,
    foreground;

var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var set= new Set(["Customer_Age", "Gender", "Dependent_count", "Education_Level", "Marital_Status", "Income_Category",
                "Card_Category", "Total_Relationship_Count", "Months_Inactive", "Contacts_Count","State"]);

// category = ["Customer_Age", "Gender", "Dependent_count", "Education_Level", "Marital_Status", "Income_Category",
//                 "Card_Category", "Total_Relationship_Count", "Months_Inactive", "Contacts_Count","State"]


svg.append("text")
    .attr("x", 360)
    .attr("y",-30)
    .attr("fill", "#c1f6f7")
    .attr("stroke", "black")
    .attr("font-family", "sans-serif")
    .attr("font-size", "35px")
    .text("Parallel Coordinate Plot ");

svg.append("circle")
    .attr("cx", 1212)
    .transition()
    .delay(function(d,i) {
        return i*4
    })
    .duration(300)
    .attr("cy", 0)
    .attr("r", 6)
    .style("fill","green");

  svg.append("text")
    .attr("x", 1220)
    .attr("y", 3)
    .attr("fill", "#c1f6f7")
    .attr("stroke", "black")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .text("Cluster 1");

  svg.append("circle")
    .attr("cx", 1212)
    .transition()
    .delay(function(d,i) {
        return i*4
    })
    .duration(300)
    .attr("cy", 14)
    .attr("r", 6)
    .style("fill","#053fff");

  svg.append("text")
    .attr("x", 1220)
    .attr("y", 18)
    .attr("fill", "#c1f6f7")
    .attr("stroke", "black")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .text("Cluster 2");


  svg.append("circle")
    .attr("cx", 1212)
    .transition()
    .delay(function(d,i) {
        return i*4
    })
    .duration(300)
    .attr("cy", 28)
    .attr("r", 6)
    .style("fill","#8e04fa");

  svg.append("text")
    .attr("x", 1220)
    .attr("y", 31)
    .attr("fill", "#c1f6f7")
    .attr("stroke", "black")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .text("Cluster 3");


// console.log(set);

var cat={};



var Customer_Age=[];
var Gender = [];
var Dependent_count = [];
var Education_Level = [];
var Marital_Status = [];
var Income_Category = [];
var Card_Category = [];
var Total_Relationship_Count = [];
var Months_Inactive= [];
var Contacts_Count = [];
var State = [];



d3.csv("static/finalcsv.csv", function(error, card) {

card=card.filter(function (row){
    return row["State"]=='MO';
})

    card.map((d) => {
    Customer_Age.push(d.Customer_Age);
    cat["Customer_Age"]=Customer_Age;

    Gender.push(d.Gender);
    cat["Gender"]=Gender;

    Dependent_count.push(d.Dependent_count);
    cat["Dependent_count"]=Dependent_count;

    Education_Level.push(d.Education_Level);
    cat["Education_Level"]=Education_Level;

    Marital_Status.push(d.Marital_Status);
    cat["Marital_Status"]=Marital_Status;

    Income_Category.push(d.Income_Category);
    cat["Income_Category"]=Income_Category;

    Card_Category.push(d.Card_Category);
    cat["Card_Category"]=Card_Category;

    Total_Relationship_Count.push(d.Total_Relationship_Count);
    cat["Total_Relationship_Count"]=Total_Relationship_Count;

    Months_Inactive.push(d.Months_Inactive);
    cat["Months_Inactive"]=Months_Inactive;

    Contacts_Count.push(d.Contacts_Count);
    cat["Contacts_Count"]=Contacts_Count;

    State.push(d.State);
    cat["State"]=State;


  });
    console.log(cat);

  x.domain(dimensions = d3.keys(card[0]).filter(function(d) {


      if(set.has(d)) {
           // console.log(d);

          return d != "Attrition_Flag" &&  d != "City" && (y[d] = d3.scaleBand()
              .domain(cat[d])
              .range([height, 0])
              .padding(0.01));

      }
      else
        return d != "Attrition_Flag" && d != "City" &&  (y[d] = d3.scaleLinear()
            .domain(d3.extent(card, function(p) { return +p[d]; }))
            .range([height, 0]));
  }));

  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(card)
    .enter().append("path")
      .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(card)
    .enter().append("path")
      .attr("d", path)
      .style("fill", "none")
      .style("stroke", function(d,i){
          // if(label[i]==0) return "#f702ba";
          // else if(label[i]==1) return "#2500f7";
          return "#02f717";
      });

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.drag()
          .on("start", function(d) {
          dragging[d] = x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          x.domain(dimensions);
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("end", function(d) {
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(foreground).attr("d", path);
          background
              .attr("d", path)
            .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black");

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this).call(y[d].brush = d3.brushY().extent([[-10,0],[10,height]]).on("start", brushstart).on("brush", brush));
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
});

function position(d) {
  var v = dragging[d];

  return v == null ? x(d) : v;

}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) {
        if(set.has(p)) {

            return [position(p), y[p](d[p]) + y[p].bandwidth() / 2];
        }
        else
            return [position(p), y[p](d[p])];
  }));
}


function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = [];
svg.selectAll(".brush")
    .filter(function (d) {
        return d3.brushSelection(this);
    })
    .each(function (key) {
        actives.push({
            dimension: key,
            extent: d3.brushSelection(this)
        });
    });

if (actives.length === 0) {
    foreground.style("display", null);
} else {
    foreground.style("display", function (d) {
        return actives.every(function (brushObj) {
            if(set.has(brushObj.dimension)){
               return brushObj.extent[0] <= y[brushObj.dimension](d[brushObj.dimension])+y[brushObj.dimension].bandwidth()/2 &&
                   (y[brushObj.dimension](d[brushObj.dimension])+y[brushObj.dimension].bandwidth()/2) <= brushObj.extent[1];
            }
            else
            return brushObj.extent[0] <= y[brushObj.dimension](d[brushObj.dimension]) &&
                y[brushObj.dimension](d[brushObj.dimension]) <= brushObj.extent[1];
        }) ? null : "none";
    });
}
}

}



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





function drawStackedBarChart(data_sent){
var Income_Category=[];
var Education_Level=[];



var height = 440,
    width = 900,
    margin = { top: 30, right: 60, left: 60, bottom: 120 };

  const svg = d3
    .select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const gSvg = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("static/finalcsv.csv", function(error, card) {

card=card.filter(function (row){
    return row["State"]==='NY';
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
    series = d3.stack().keys(data.columns.slice(1))(data)
    console.log(series)





  const xScale = d3.scaleBand()
    .domain(data.map(function(d){return d.category;}))
    .range([0, width])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0,d3.max(series, d => d3.max(d, d=> d[1]))])
    .range([height,0]);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // const color = d3.scaleOrdinal()
  //   .domain(subgroups)
  //   .range(['#9CADCE','#7EC4CF','#52B2CF','#42f5b3','#cdf505','#f58d05'])

  const rects = gSvg.selectAll("g").data(series).enter()
    .append("g")
    .attr("fill", d => color(d.key)); //Color is assigned here because you want everyone for the series to be the same color

  rects.selectAll("rect")
    .data(d => d).enter()
    .append("rect")
    .attr("x", (d, i) => xScale(d.data.category))
    .attr("y", d=> yScale(d[1]))
    .attr("height", d=> yScale(d[0]) - yScale(d[1]))
    .attr("width", xScale.bandwidth())
    /*.on("mouseover", function(){d3.select(this).attr("fill", "purple")})
    .on("mouseout", function(){d3.select(this).attr("fill", color(series.key))})*/;

  const xAxis = gSvg.append("g")
    .attr("id", "xAxis")
    .attr("transform", "translate(0,"+height+")")
    .call(d3.axisBottom(xScale));

  const yAxis = gSvg.append("g")
    .attr("id", "yAxis")
    .call(d3.axisLeft(yScale));


        });

return svg.node();
}












