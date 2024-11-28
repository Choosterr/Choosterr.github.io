
// Create and render the bar chart
// async function to load data from datasets/videogames_long.csv using d3.csv and then make visualizations
async function render() {
    // load data
    const videogames = await d3.csv("./dataset/videogames_wide.csv");
    console.log(videogames);
  
    // Visual 1: Global sales by genre and platform
    const vlSpec1 = vl
      .markBar({tooltip: true})
      .data(videogames)
      .title({text:"Video Game Global Sales by Genre and Platform"})
      .encode(
        vl.x().fieldQ("Global_Sales").aggregate("sum").title("Global Sales (Millions)"),
        vl.y().fieldN("Platform"),
        vl.color().fieldN("Genre")
      )
      .width(800)
      .height(400)
      .toSpec();
  
      vegaEmbed("#view1", vlSpec1).then((result) => {
        result.view.run();
      });

    // Visual 2.1: Sales Over Time by Genre
    const vlSpec2 = vl
    .markLine({point:true}, {tooltip: true})
    .data(videogames)
    .title({text:"Video Game Sales Over Time by Genre"})
    .encode(
      vl.x().fieldT("Year").axis({title:"Year"}),
      vl.y().fieldQ("Global_Sales").aggregate("sum").title("Global Sales (Millions)"),
      vl.color().fieldN("Genre").title("Genre"),
    )
    .width(800)
    .height(400)
    .toSpec();

    vegaEmbed("#view2", vlSpec2).then((result) => {
      result.view.run();
    });

    // Visual 2.2: Sales Over Time by Platform
    const vlSpec3 = vl
    .markLine({point:true}, {tooltip: true})
    .data(videogames)
    .title({text:"Video Game Sales Over Time by Platform"})
    .encode(
      vl.x().fieldT("Year").axis({title:"Year"}),
      vl.y().fieldQ("Global_Sales").aggregate("sum").title("Global Sales (Millions)"),
      vl.color().fieldN("Platform").title("Platform"),
    )
    .width(800)
    .height(400)
    .toSpec();

    vegaEmbed("#view3", vlSpec3).then((result) => {
      result.view.run();
    });
    
    // Visual 3.1: Regional Sales by Platform in NA
    const vlSpec4 = vl
    .markBar({tooltip: true})
    .data(videogames)
    .title({text:"Video Game Sales by Platform in North America"})  
    .encode(
      vl.x().fieldQ("NA_Sales").aggregate("sum").title("NA Sales (Millions)"),  
      vl.y().fieldN("Platform")
    )
    .width(400)
    .height(400)
    .toSpec();

    vegaEmbed("#view4", vlSpec4).then((result) => {
      result.view.run();
    });

    // Visual 3.2: Regional Sales by Platform in EU
    const vlSpec5 = vl
    .markBar({tooltip: true})
    .data(videogames)
    .title({text:"Video Game Sales by Platform in Europe"})  
    .encode(
      vl.x().fieldQ("EU_Sales").aggregate("sum").title("EU Sales (Millions)"),  
      vl.y().fieldN("Platform")
    )
    .width(400)
    .height(400)
    .toSpec();

    vegaEmbed("#view5", vlSpec5).then((result) => {
      result.view.run();
    });

    // Visual 3.3: Regional Sales by Platform in JP
    const vlSpec6 = vl
    .markBar({tooltip: true})
    .data(videogames)
    .title({text:"Video Game Sales by Platform in Japan"})  
    .encode(
      vl.x().fieldQ("JP_Sales").aggregate("sum").title("JP Sales (Millions)"),  
      vl.y().fieldN("Platform")
    )
    .width(400)
    .height(400)
    .toSpec();

    vegaEmbed("#view6", vlSpec6).then((result) => {
      result.view.run();
    });

    // Visual 3.4: Regional Sales by Platform in other regions
    const vlSpec7 = vl
    .markBar({tooltip: true})
    .data(videogames)
    .title({text:"Video Game Sales by Platform in Other Regions"})  
    .encode(
      vl.x().fieldQ("Other_Sales").aggregate("sum").title("Other Sales (Millions)"),  
      vl.y().fieldN("Platform")
    )
    .width(400)
    .height(400)
    .toSpec();

    vegaEmbed("#view7", vlSpec7).then((result) => {
      result.view.run();
    });

    // Visual 4.1: Distribution of Game Genres in North America
    const vlSpec8 = vl
    .markArc({tooltip: true})
    .data(videogames)
    .title({text:"Distribution of Game Genres in North America"})  
    .encode(
      vl.theta().fieldQ("NA_Sales").aggregate("sum").stack("normalize").title("NA Sales"),
      vl.color().fieldN("Genre")
    )
    .width(400)
    .height(400)
    .toSpec();

    vegaEmbed("#view8", vlSpec8).then((result) => {
      result.view.run();
    });

    // Visual 4.2: Distribution of Game Genres in Europe
    const vlSpec9 = vl
    .markArc({tooltip: true})
    .data(videogames)
    .title({text:"Distribution of Game Genres in Europe"})  
    .encode(
      vl.theta().fieldQ("EU_Sales").aggregate("sum").stack("normalize").title("EU Sales"),
      vl.color().fieldN("Genre")
    )
    .width(400)
    .height(400)
    .toSpec();

    vegaEmbed("#view9", vlSpec9).then((result) => {
      result.view.run();
    });

    // Visual 4.3: Distribution of Game Genres in Japan
    const vlSpec10 = vl
    .markArc({tooltip: true})
    .data(videogames)
    .title({text:"Distribution of Game Genres in Japan"})  
    .encode(
      vl.theta().fieldQ("JP_Sales").aggregate("sum").stack("normalize").title("JP Sales"),
      vl.color().fieldN("Genre")
    )
    .width(400)
    .height(400)
    .toSpec();

    vegaEmbed("#view10", vlSpec10).then((result) => {
      result.view.run();
    });

    // Visual 4.4: Distribution of Game Genres in Other Regions
    const vlSpec11 = vl
    .markArc({tooltip: true})
    .data(videogames)
    .title({text:"Distribution of Game Genres in Other Regions"})  
    .encode(
      vl.theta().fieldQ("Other_Sales").aggregate("sum").stack("normalize").title("Other Sales"),
      vl.color().fieldN("Genre")
    )
    .width(400)
    .height(400)
    .toSpec();

    vegaEmbed("#view11", vlSpec11).then((result) => {
      result.view.run();
    });

  }
  
  render();
  