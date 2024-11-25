
// Create and render the bar chart
// async function to load data from datasets/videogames_long.csv using d3.csv and then make visualizations
async function render() {
    // load data
    const topchamps = await d3.csv("./dataset/worldsChampsTopQ");
  
    // Visual 1: 
    const vlSpec1 = vl
      .markCircle({tooltip: true})
      .data(topchamps)
      //.title({text:"Video Game Global Sales by Genre and Platform"})
      .encode(
        vl.x().fieldQ("Presence"),
        vl.y().fieldQ("Wins"),
        vl.tooltip([vl.fieldN("Champion"), vl.fieldN("Presence"), vl.fieldN("Winrate"), vl.fieldN("Year") ]),
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

  
  }
  
  render();
  