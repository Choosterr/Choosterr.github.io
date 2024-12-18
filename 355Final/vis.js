import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let data = [];
const quadrantColors = {
    "Under-picked & Weak": "#4c9ed9",
    "Under-picked & Strong": "#76c893",
    "Over-picked & Weak": "#e3b23c",
    "Over-picked & Strong": "#ee6c4d"
};

const xDomain = [0, 100];
const yDomain = [0, 100];
const quadrantPresenceLine = 50;
const quadrantWinrateLine = 50;

let highlightChampsVis1 = ["Hwei", "Smolder", "Aurora"];
let highlightChampsVis2 = ["Ahri", "Gnar", "Hwei", "Jarvan", "Jax", "Jayce", "Jinx", "Lulu", "Malphite", "Samira", "Shen", "Viego", "Xin Zhao"];
//let highlightChampsVis2Nerf = ["Aatrox", "Jax"];

function initTagInput(champions, inputID, containerID, suggestionBoxID, highlightList, updateFn) {
    const inputEl = document.getElementById(inputID);
    const containerEl = document.getElementById(containerID);
    const suggestionEl = document.getElementById(suggestionBoxID);

    function renderTags() {
        containerEl.innerHTML = "";
        highlightList.forEach(ch => {
            const tag = document.createElement("span");
            tag.className = "tag";
            tag.textContent = ch;

            const removeBtn = document.createElement("span");
            removeBtn.className = "remove-tag";
            removeBtn.textContent = "x";
            removeBtn.addEventListener("click", () => {
                const idx = highlightList.indexOf(ch);
                if (idx > -1) {
                    highlightList.splice(idx, 1);
                    renderTags();
                    updateFn();
                }
            });

            tag.appendChild(removeBtn);
            containerEl.appendChild(tag);
        });
    }

    renderTags();

    function showSuggestions() {
        const query = inputEl.value.toLowerCase();
        const filtered = champions.filter(c => c.toLowerCase().includes(query) && !highlightList.includes(c));
        if (filtered.length > 0 && query.length > 0) {
            suggestionEl.innerHTML = "";
            filtered.forEach(fc => {
                const item = document.createElement("div");
                item.className = "suggestion-item";
                item.textContent = fc;
                item.addEventListener("click", () => {
                    highlightList.push(fc);
                    renderTags();
                    suggestionEl.style.display = "none";
                    inputEl.value = "";
                    updateFn();
                });
                suggestionEl.appendChild(item);
            });
            suggestionEl.style.display = "block";
        } else {
            suggestionEl.style.display = "none";
        }
    }

    inputEl.addEventListener("input", showSuggestions);
    inputEl.addEventListener("blur", () => {
        setTimeout(() => {
            suggestionEl.style.display = "none";
        }, 200);
    });
}

function initChampionDatalist(champions, datalistID) {
    const datalist = document.getElementById(datalistID);
    datalist.innerHTML = "";
    champions.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        datalist.appendChild(opt);
    });
}

async function init() {
    data = await d3.csv("../dataset/worldsChampsCombined.csv", d3.autoType);

    const championSet = new Set(data.map(d => d.Champion));
    const champions = Array.from(championSet).sort();

    // VIS 1
    const updateVis1 = createScatterVis("vis_exploration1", "yearSlider1", "role1");
    initTagInput(champions, "championTagInput1", "championTagContainer1", "championSuggestionBox1", highlightChampsVis1, updateVis1);
    updateVis1();
    // VIS 2
    const updateVis2 = createScatterVis("vis_exploration2", "yearSlider2", "role2");
    initTagInput(champions, "championTagInput2", "championTagContainer2", "championSuggestionBox2", highlightChampsVis2, updateVis2);
    updateVis2();

    // VIS 3
    initChampionDatalist(champions, "championDatalist3");
    const updateVis3 = createScatterVis("vis_exploration3", "yearSlider3", "role3", "visualizeBtn3", {
        metricSelectorID: "metricSelector3",
        championInputID: "championInput3"
    });
    updateVis3();
}


function createScatterVis(containerID, yearSliderID, roleRadioName, visualizeBtnID = null, options = {}) {
    const container = d3.select(`#${containerID}`);
    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    const margin = {
        top: 50,
        right: 20,
        bottom: 60,
        left: 60
    };
    const width = 700;
    const height = 500;

    const xScale = d3.scaleLinear().range([margin.left, width - margin.right]).domain(xDomain);
    const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]).domain(yDomain);

    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const xAxisGroup = svg.append("g").attr("transform", `translate(0, ${height - margin.bottom})`);
    const yAxisGroup = svg.append("g").attr("transform", `translate(${margin.left}, 0)`);

    const xLabel = svg.append("text")
        .attr("class", "xLabel")
        .attr("x", width / 2)
        .attr("y", height - 15)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "#0E2E6A")
        .text("Presence");

    const yLabel = svg.append("text")
        .attr("class", "yLabel")
        .attr("x", -height / 2)
        .attr("y", margin.left - 40)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "#0E2E6A")
        .text("Winrate");

    const title = svg.append("text")
        .attr("class", "chartTitle")
        .attr("x", width / 2)
        .attr("y", margin.top - 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .attr("fill", "#0E2E6A");

    const noDataText = svg.append("text")
        .attr("class", "noDataText")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "#0E2E6A")
        .text("")
        .style("display", "none");

    let championFilter = "";
    let metricFilter = "Presence";
    let metricThreshold = 0;

    function getSelectedOptions() {
        const selectedYear = +document.getElementById(yearSliderID).value;
        const selectedRole = document.querySelector(`input[name='${roleRadioName}']:checked`).value;

        let highlightChamps = [];
        if (options.highlightSelectID) {
            const sel = document.getElementById(options.highlightSelectID);
            highlightChamps = Array.from(sel.selectedOptions).map(o => o.value);
        }

        if (options.metricSelectorID) {
            metricFilter = document.getElementById(options.metricSelectorID).value;
            metricThreshold = +document.getElementById("metricThreshold3").value;
        }

        return {
            selectedYear,
            selectedRole,
            highlightChamps
        };
    }

    function applyFilters(d, selectedYear, selectedRole, highlightChamps) {
        const matchYear = d.Year === selectedYear;
        const matchRole = (selectedRole === "All") ? true : (d.Role === selectedRole);

        if (options.metricSelectorID) {
            const val = (metricFilter === "Presence") ? d.Presence : d.Winrate;
            if (val < metricThreshold) return false;
        }

        // Apply championFilter (Vis 3) if visualize button has been clicked
        if (options.championInputID && visualizeBtnID && championFilter) {
            const cName = d.Champion.toLowerCase();
            if (!cName.includes(championFilter.toLowerCase())) return false;
        }

        return matchYear && matchRole;
    }

    function updateVis() {
        const {
            selectedYear,
            selectedRole,
            highlightChamps
        } = getSelectedOptions();
        console.log(selectedYear)

        highlightChampsVis1 = []; //highlight new champions
        if (selectedYear === 2024){
            highlightChampsVis1 = ["Hwei", "Smolder", "Aurora"];
        }else if(selectedYear === 2023){
            highlightChampsVis1 = ["KSante", "Milio", "Naafiri", "Briar"];     
        }else if(selectedYear === 2022){
            highlightChampsVis1 = ["Zeri", "Renata Glasc", "Belveth", "Nilah"];
        }else if(selectedYear === 2021){
            highlightChampsVis1 = ["Serphine", "Rell", "Viego", "Gwen", "Akshan", "Vex"];
        }else if(selectedYear === 2020){
            highlightChampsVis1 = ["Samira", "Yone", "Lilia", "Sett", "Aphelios", "Senna"];
        }else if(selectedYear === 2019){
            highlightChampsVis1 = ["Neeko", "Sylas", "Yuumi", "Qiyana"];
        }else if(selectedYear === 2018){
            highlightChampsVis1 = ["Zoe", "Kaisa", "Pyke"];
        }else if(selectedYear === 2017){
            highlightChampsVis1 = ["Ivern", "Camille", "Xayah", "Rakan", "Kayn", "Ornn"];
        }else if(selectedYear === 2016){
            highlightChampsVis1 = ["Kindred", "Illaoi", "Jhin", "Aurelion Sol", "Taliyah", "Kled"];
        }

        highlightChampsVis2 = []; //highlight buffed champions
        if (selectedYear === 2024){
            highlightChampsVis2 = ["Ahri", "Gnar", "Hwei", "Jarvan", "Jax", "Jayce", "Jinx", "Lulu", "Malphite", "Samira", "Shen", "Viego", "Xin Zhao"];
        }else if(selectedYear === 2023){
            highlightChampsVis2 = ["Galio", "Gangplank", "Jhin", "Lee Sin", "Lissandra", "Nunu", "Pyke", "Syndra", "Twitch"];     
        }else if(selectedYear === 2022){
            highlightChampsVis2 = ["Ashe", "Lee Sin", "Thesh"];
        }else if(selectedYear === 2021){
            highlightChampsVis2 = ["Aatrox", "Akali", "Chogath", "Fizz", "Galio", "Gragas", "Gwen", "Mordekaiser", "Poppy", "Qiyana", "Renekton", "Sejuani", "Seraphine", "Sion", "Sylas"];
        }else if(selectedYear === 2020){
            highlightChampsVis2 = ["Ahri", "Aphelios", "Irelia", "Ivern", "Sivir", "Sylas", "Udyr", "Vayne"];
        }else if(selectedYear === 2019){
            highlightChampsVis2 = ["Aatrox", "Akali", "Annie", "Ashe", "Blitzcrank", "Fiora", "Graves", "Heimerdinger", "Karma", "Mordekaiser", "Oriana", "Ornn", "RekSai", "Riven", "Sion", "Twisted Fate", "Vayne", "Veigar", "Xin Zhao", "Zac"];
        }else if(selectedYear === 2018){
            highlightChampsVis2 = ["Darius", "Fiora", "KhaZix", "Elise", "Jarvan", "Nunu", "Janna", "Thresh", "Pyke", "Tahm Kench", "KogMaw"];
        }else if(selectedYear === 2017){
            highlightChampsVis2 = ["Azir", "Cassiopeia", "Fiora", "Ivern", "Lee Sin", "Nautilus", "Nidalee", "Ornn", "Rengar", "Ryze", "Rumble"];
        }else if(selectedYear === 2016){
            highlightChampsVis2 = ["Lulu", "Lux", "Miss Fortune", "Nocturne", "Ryze"];
        }
        

        const filteredData = data.filter(d => applyFilters(d, selectedYear, selectedRole, highlightChamps));

        if (filteredData.length === 0) {
            noDataText.text("No data available for the selected criteria.")
                .style("display", null);
            svg.selectAll("circle.dataPoint").remove();
            svg.selectAll(".hLine, .vLine, .quadrant-label").remove();
            title.text(`No Results`);
            xAxisGroup.call(d3.axisBottom(xScale).tickValues([]));
            yAxisGroup.call(d3.axisLeft(yScale).tickValues([]));
            return;
        } else {
            noDataText.style("display", "none");
        }

        xAxisGroup.call(d3.axisBottom(xScale));
        yAxisGroup.call(d3.axisLeft(yScale));

        title.text(`Worlds Champions in ${selectedYear} (${selectedRole})`);

        filteredData.forEach(d => {
            const presenceVal = d.Presence;
            const winrateVal = d.Winrate;
            if (presenceVal <= 50 && winrateVal <= 50) {
                d.quadrant = "Under-picked & Weak";
            } else if (presenceVal <= 50 && winrateVal > 50) {
                d.quadrant = "Under-picked & Strong";
            } else if (presenceVal > 50 && winrateVal <= 50) {
                d.quadrant = "Over-picked & Weak";
            } else {
                d.quadrant = "Over-picked & Strong";
            }
        });

        const points = svg.selectAll("circle.dataPoint").data(filteredData, d => d.Champion);

        points.exit().remove();

        points.enter()
            .append("circle")
            .attr("class", "dataPoint")
            .merge(points)
            .transition().duration(500)
            .attr("cx", d => xScale(d.Presence))
            .attr("cy", d => yScale(d.Winrate))
            .attr("r", 6)
            .attr("fill", d => {
                if ((containerID === "vis_exploration1") && highlightChampsVis1.includes(d.Champion) || (containerID === "vis_exploration3" )) {
                    return quadrantColors[d.quadrant];
                    
                }else if (containerID === "vis_exploration2" && highlightChampsVis2.includes(d.Champion)){
                    return "green";
                }else if (containerID === "vis_exploration2" && highlightChampsVis2.includes(d.Champion)){
                    return "red";

                }else
                    return "grey";
                })
            .attr("stroke", d => {
                if ((containerID === "vis_exploration1" && highlightChampsVis1.includes(d.Champion)) || (containerID === "vis_exploration2" && highlightChampsVis2.includes(d.Champion))){
                    return "black";
                }
                return null;
            })
            .attr("stroke-width", d => ((containerID === "vis_exploration1" || containerID === "vis_exploration2") && highlightChamps.includes(d.Champion)) ? 2 : null)
            .attr("opacity", 0.8);

        svg.selectAll("circle.dataPoint")
            .on("mouseover", function (event, d) {

                if ((containerID === "vis_exploration1" || containerID === "vis_exploration2") && highlightChamps.includes(d.Champion)) {
                    d3.select(this).attr("stroke-width", 3);
                } else if (d3.select(this).attr("stroke")) {
                    d3.select(this).attr("stroke-width", 2);
                }

                tooltip.style("opacity", 1);
                tooltip.html(
                    `<strong>${d.Champion}</strong><br>` +
                    `Role: ${d.Role}<br>` +
                    `Presence: ${d.Presence}%<br>` +
                    `Winrate: ${d.Winrate}%<br>` +
                    `KDA: ${d.KDA}<br>` +
                    `Quadrant: ${d.quadrant}`
                );
            })
            .on("mousemove", function (event) {
                tooltip
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 30) + "px");
            })
            .on("mouseout", function (event, d) {

                if ((containerID === "vis_exploration1" || containerID === "vis_exploration2") && highlightChamps.includes(d.Champion)) {
                    d3.select(this).attr("stroke-width", 2);
                } else {
                    d3.select(this).attr("stroke-width", d3.select(this).attr("stroke") ? 2 : null);
                }
                tooltip.style("opacity", 0);
            });


        const horizLine = svg.selectAll(".hLine").data([quadrantWinrateLine]);
        horizLine.enter().append("line").attr("class", "hLine")
            .merge(horizLine)
            .transition().duration(500)
            .attr("x1", xScale.range()[0])
            .attr("x2", xScale.range()[1])
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d))
            .attr("stroke", "#DEE8FE")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "3,3");
        horizLine.exit().remove();

        const vertLine = svg.selectAll(".vLine").data([quadrantPresenceLine]);
        vertLine.enter().append("line").attr("class", "vLine")
            .merge(vertLine)
            .transition().duration(500)
            .attr("y1", yScale.range()[0])
            .attr("y2", yScale.range()[1])
            .attr("x1", d => xScale(d))
            .attr("x2", d => xScale(d))
            .attr("stroke", "#DEE8FE")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "3,3");
        vertLine.exit().remove();

        const quadrantLabels = [{
                text: "Under-picked & Weak",
                xVal: xScale(25),
                yVal: yScale(25),
                color: quadrantColors["Under-picked & Weak"]
            },
            {
                text: "Under-picked & Strong",
                xVal: xScale(25),
                yVal: yScale(75),
                color: quadrantColors["Under-picked & Strong"]
            },
            {
                text: "Over-picked & Weak",
                xVal: xScale(75),
                yVal: yScale(25),
                color: quadrantColors["Over-picked & Weak"]
            },
            {
                text: "Over-picked & Strong",
                xVal: xScale(75),
                yVal: yScale(75),
                color: quadrantColors["Over-picked & Strong"]
            }
        ];

        const qLabels = svg.selectAll(".quadrant-label").data(quadrantLabels);
        qLabels.enter()
            .append("text")
            .attr("class", "quadrant-label")
            .merge(qLabels)
            .transition().duration(500)
            .attr("x", d => d.xVal)
            .attr("y", d => d.yVal)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", d => d.color)
            .text(d => d.text);
        qLabels.exit().remove();
    }

    if (!visualizeBtnID) {
        document.getElementById(yearSliderID).addEventListener("input", updateVis);
        const roleRadios = document.querySelectorAll(`input[name='${roleRadioName}']`);
        roleRadios.forEach(r => r.addEventListener("change", updateVis));
        if (options.highlightSelectID) {
            document.getElementById(options.highlightSelectID).addEventListener("change", updateVis);
            if (options.highlightSearchID) {
                document.getElementById(options.highlightSearchID).addEventListener("input", updateVis);
            }
        }
    } else {
        document.getElementById(yearSliderID).addEventListener("input", updateVis);
        const roleRadios = document.querySelectorAll(`input[name='${roleRadioName}']`);
        roleRadios.forEach(r => r.addEventListener("change", updateVis));

        if (options.metricSelectorID) {
            document.getElementById(options.metricSelectorID).addEventListener("change", updateVis);
        }
        if (document.getElementById("metricThreshold3")) {
            document.getElementById("metricThreshold3").addEventListener("input", () => {
                document.getElementById("metricThresholdValue3").textContent = document.getElementById("metricThreshold3").value;
                updateVis();
            });
        }


        document.getElementById(visualizeBtnID).addEventListener("click", () => {
            if (options.championInputID) {
                championFilter = document.getElementById(options.championInputID).value.trim();
            }
            updateVis();
        });


        if (document.getElementById("resetBtn3")) {
            document.getElementById("resetBtn3").addEventListener("click", () => {
                if (options.championInputID) {
                    document.getElementById(options.championInputID).value = "";
                }
                championFilter = "";
                updateVis();
            });
        }
    }

    return updateVis;
}

init();