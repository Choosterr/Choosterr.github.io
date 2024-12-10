
// D3 Test
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let year = 2024;
let svg;
let xAxis;
let yAxis;
let xScale;
let yScale;
let radiusScale;
let colorScale;
let yearDataset;
let dataset;
let yearLabel;
let champion;
let champPresence;
let champWinrate;
let populationExtent;
let duration = 500;


async function prepareVis() {
  dataset = await d3.csv("../dataset/worldsChampsCombined.csv", d3.autoType);
  //filter dataset to a specific year
  yearDataset = dataset.filter((d) => d.Year === Year);
  //champion = new Set(yearDataset.map((d) => d.Champion));
  champWinrate = d3.extent(dataset, (d) => d.Winrate);
  champPresence = d3.extent(dataset, (d) => d.Presence);

  const width = 800;
  const height = 600;

  const margin = { top: 10, right: 20, bottom: 100, left: 50 };

  svg = d3
    .select("#vis1")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid black");

  // xScale for
  xScale = d3.scaleLinear().range([margin.left, width - margin.right]);
  yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);
  //colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  xScale.domain(champPresence);
  yScale.domain(champWinrate);
  //colorScale.domain(continents);

  svg
    .selectAll("circle")
    .data(yearDataset)
    .join("circle")
    .attr("cx", (d) => {
      return xScale(d.Presence);
    })
    .attr("cy", (d) => {
      return yScale(d.Winrate);
    })
    // .attr("r", (d) => {
    //   return radiusScale(d.population);
    // })
    // .attr("fill", (d) => {
    //   return colorScale(d.continent);
    // });

  // add x axis
  xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`);
  xAxis.call(d3.axisBottom(xScale));
  // add x axis label
  // add y axis
  yAxis = svg.append("g").attr("transform", `translate(${margin.left}, 0)`);
  yAxis.call(d3.axisLeft(yScale));

  // add y axis label and rotate it 90% in place
  svg
    .append("text")
    .attr("class", "yLabel")
    .attr("x", -300)
    .attr("y", 20)
    .attr("transform", "rotate(-90)")
    .text("Life Expectancy");

  // add legend for continents at the bottom center of the chart and add text
  const legend = svg
    .append("g")
    .attr(
      "transform",
      `translate(${width / 2}, ${height - margin.bottom + 60})`
    );

  const legendSize = 20;
  const legendSpacing = 100;

  let i = 0;
  legend
    .selectAll("rect")
    .data(continents)
    .join("rect")
    .attr("x", (d, i) => i * legendSpacing)
    .attr("width", legendSize)
    .attr("height", legendSize)
    //.attr("fill", (d) => colorScale(d));
  legend
    .selectAll("text")
    .data(continents)
    .join("text")
    .attr("x", (d, i) => i * legendSpacing + legendSize + 5)
    .attr("y", legendSize)
    .text((d) => d)
    .attr("fill", "black")
    .attr("font-size", "12px");
}

async function runApp() {
  await prepareVis();
}

runApp();


/*
// async function to load data from datasets/videogames_long.csv using d3.csv and then make visualizations
async function render() {
    // load data
    const worldschamps = await d3.csv("../dataset/worldsChampsCombined.csv");
    //console.log(worldschamps);

    const year2024 = worldschamps.filter((item)=>{return item.Year === 2024});
    console.log(year2024);

    // Visual 1: Worlds Champ Data Tool
    const vlSpec1 = vl
    .markCircle({tooltip: true})
    .data(worldschamps)
    .autosize({type:"fit"})
    .encode(
      vl.x().fieldQ("Presence"),
      vl.y().fieldQ("Winrate"),
      vl.tooltip([vl.fieldN("Champion"), vl.fieldN("Presence"), vl.fieldN("Winrate"), vl.fieldN("Role") ]),
      vl.color().condition(
          { test: "datum['Year'] === 2024 ", value: "red" }
            ),
      )
      .width(500)
      .height(500)
      .toSpec();

    vegaEmbed("#view1", vlSpec1).then((result) => {
      result.view.run();
    });

    // Visual 2: New Champions
    const vlSpec2 = vl
    .markCircle({tooltip: true})
    .data(year2024)
    .autosize({type:"fit"})
    .encode(
      vl.x().fieldQ("Presence"),
      vl.y().fieldQ("Winrate"),
      vl.tooltip([vl.fieldN("Champion"), vl.fieldN("Presence"), vl.fieldN("Winrate"), vl.fieldN("Role") ]),
      vl.color().condition(
        { test: "datum['Champion'] === 'Aurora' || datum['Champion'] === 'Smolder' || datum['Champion'] === 'Hwei' ", value: "red" }
      ),
    )
    .width(500)
    .height(500)
    .toSpec();

    vegaEmbed("#view2", vlSpec2).then((result) => {
      result.view.run();
    });

    // Visual 3: Champion Balance
    const vlSpec3 = vl
    .markCircle({tooltip: true})
    .data(year2024)   
    .autosize({type:"fit"})
    .encode(
     vl.x().fieldQ("Presence"),
      vl.y().fieldQ("Winrate"),
      vl.tooltip([vl.fieldN("Champion"), vl.fieldN("Presence"), vl.fieldN("Winrate"), vl.fieldN("Role") ]),
      vl.color({value:"grey"}).condition(
        { test: "datum['Champion'] === 'Ahri' || datum['Champion'] === 'Gnar' || datum['Champion'] === 'Hwei' || datum['Champion'] === 'Jarvan' ||  datum['Champion'] === 'Jax' || datum['Champion'] === 'Jayce' || datum['Champion'] === 'Jinx' || datum['Champion'] === 'Lulu' || datum['Champion'] === 'Malphite' || datum['Champion'] === 'Samira' || datum['Champion'] === 'Shen' || datum['Champion'] === 'Viego' || datum['Champion'] === 'Xin Zhao'", value: "green" },
        { test: "datum['Champion'] === 'Aurora' || datum['Champion'] === 'Azir' || datum['Champion'] === 'Corki' || datum['Champion'] === 'Ivern' || datum['Champion'] === 'Leona' || datum['Champion'] === 'Lilia' || datum['Champion'] === 'Lissandra' || datum['Champion'] === 'Maokai' || datum['Champion'] === 'Miss Fortune' || datum['Champion'] === 'Nasus' || datum['Champion'] === 'Rell' || datum['Champion'] === 'Rumble' || datum['Champion'] === 'Smolder' || datum['Champion'] === 'Varus' || datum['Champion'] === 'Vi' || datum['Champion'] === 'Zeri' || datum['Champion'] === 'Ziggs'", value: "red" }
      ),
    )
    .width(500)
    .height(500)
    .toSpec();

    vegaEmbed("#view3", vlSpec3).then((result) => {
      result.view.run();
    });
  }
  
  render();
  */