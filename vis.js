
// Create and render the bar chart
// async function to load data from datasets/videogames_long.csv using d3.csv and then make visualizations
async function render() {
    // load data
    const videogames = await d3.csv("./dataset/videogames_long.csv");
  
    // create a bar chart
    const vlSpec = vl
      .markBar()
      .data(videogames)
      .encode(
        vl.y().fieldN("platform"),
        vl.x().fieldQ("global_sales").aggregate("sum")
      )
      .width("container")
      .height(400)
      .toSpec();
  
    const view = await vegaEmbed("#view", vlSpec).view;
    view.run();
  }
  
  render();
  