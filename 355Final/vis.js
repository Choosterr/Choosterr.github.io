
// Create and render the bar chart
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
  