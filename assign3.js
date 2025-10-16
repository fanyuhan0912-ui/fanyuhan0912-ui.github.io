
const spec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Global Sales by Genre and Platform",
  data: { url: "dataset/videogames_wide.csv" }, 
  transform: [
    {
      aggregate: [{ op: "sum", field: "Global_Sales", as: "Total_Sales" }],
      groupby: ["Platform", "Genre"]
    }
  ],
  mark: { type: "bar", tooltip: true },
  encoding: {
    x: { field: "Platform", type: "nominal", title: "Platform", sort: "-y", axis: { labelAngle: -35 } },
    y: { field: "Total_Sales", type: "quantitative", title: "Global Sales (Millions)" },
    color: { field: "Genre", type: "nominal", title: "Genre" },
    tooltip: [
      { field: "Platform", type: "nominal", title: "Platform" },
      { field: "Genre", type: "nominal", title: "Genre" },
      { field: "Total_Sales", type: "quantitative", title: "sales (Millions)", format: ".2f" }
    ]
  },
  width: "container",
  height: 400
};


vegaEmbed("#delayChart", spec, { actions: false })
  .then(() => console.log("✅"))
  .catch(err => console.error("❌", err));


const specOverTimeGenre = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Sales Over Time by Genre",
  data: { url: "dataset/videogames_wide.csv" },
  transform: [
    { filter: "isValid(datum.Year) && isValid(datum.Global_Sales)" },
    {
      aggregate: [{ op: "sum", field: "Global_Sales", as: "Total_Sales" }],
      groupby: ["Year", "Genre"]
    }
  ],
  mark: { type: "bar", tooltip: true },
  encoding: {
    x: { field: "Year", type: "ordinal", title: "Year", sort: "ascending" },
    y: { field: "Total_Sales", type: "quantitative", title: "Global Sales (Millions)" },
    color: { field: "Genre", type: "nominal", title: "Genre" },
    tooltip: [
      { field: "Year", type: "ordinal", title: "Year" },
      { field: "Genre", type: "nominal", title: "Genre" },
      { field: "Total_Sales", type: "quantitative", title: "Sales (Millions)", format: ".2f" }
    ]
  },
  width: "container",
  height: 420
};

vegaEmbed("#trendChart", specOverTimeGenre, { actions: false })
  .then(() => console.log("✅"))
  .catch(err => console.error(" ❌", err));



const specHeatmap = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Regional Sales Heatmap by Platform",
  data: { url: "dataset/videogames_wide.csv" },
  transform: [
 
    { fold: ["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"], as: ["Region", "Sales"] },
   
    {
      aggregate: [{ op: "sum", field: "Sales", as: "Total_Sales" }],
      groupby: ["Platform", "Region"]
    }
  ],
  mark: "rect", 
  encoding: {
    x: {
      field: "Platform",
      type: "nominal",
      title: "Platform",
      axis: { labelAngle: -35 }
    },
    y: {
      field: "Region",
      type: "nominal",
      title: "Region",
      sort: ["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"]
    },
    color: {
      field: "Total_Sales",
      type: "quantitative",
      title: "Sales (Millions)",
      scale: { scheme: "blues", reverse: true } 
    },
    tooltip: [
      { field: "Platform", type: "nominal", title: "Platform" },
      { field: "Region", type: "nominal", title: "Region" },
      { field: "Total_Sales", type: "quantitative", title: "Sales (Millions)", format: ".2f" }
    ]
  },
  width: "container",
  height: 400,
  config: {
    view: { stroke: null } 
  }
};

vegaEmbed("#heatmapChart", specHeatmap, { actions: false })
  .then(() => console.log("✅"))
  .catch(err => console.error("❌", err));









const specMapRegional = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Global video game sales distribution by region (NA, EU, JP, Other)",
  width: "container",
  height: 420,
  projection: { type: "equalEarth" },
  layer: [
 
    {
      data: {
        url: "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/world-110m.json",
        format: { type: "topojson", feature: "countries" }
      },
      mark: { type: "geoshape", fill: "#f3f4f6", stroke: "#bbb", strokeWidth: 0.5 }
    },

    {
      data: { url: "dataset/videogames_wide.csv" },
      transform: [

        {
          aggregate: [
            { op: "sum", field: "NA_Sales", as: "NA" },
            { op: "sum", field: "EU_Sales", as: "EU" },
            { op: "sum", field: "JP_Sales", as: "JP" },
            { op: "sum", field: "Other_Sales", as: "Other" }
          ]
        },
 
        { fold: ["NA", "EU", "JP", "Other"], as: ["Region", "Sales"] },

        {
          lookup: "Region",
          from: {
            data: {
              values: [
                { Region: "NA", lon: -100, lat: 45, label: "North America" },
                { Region: "EU", lon: 10,   lat: 50, label: "Europe" },
                { Region: "JP", lon: 138,  lat: 36, label: "Japan" },
                { Region: "Other", lon: 60, lat: -10, label: "Other Regions" }
              ]
            },
            key: "Region",
            fields: ["lon", "lat", "label"]
          }
        }
      ],
      mark: { type: "circle", stroke: "white", strokeWidth: 0.7 },
      encoding: {
        longitude: { field: "lon", type: "quantitative" },
        latitude: { field: "lat", type: "quantitative" },
    
        color: {
          field: "Sales",
          type: "quantitative",
          title: "Sales (Millions)",
          scale: { scheme: "blues", reverse: true }
        },
   
        size: {
          field: "Sales",
          type: "quantitative",
          title: null,
          scale: { range: [100, 2500] } 
        },
        tooltip: [
          { field: "label", type: "nominal", title: "Region" },
          { field: "Sales", type: "quantitative", title: "Sales (Millions)", format: ".2f" }
        ]
      }
    },

    {
      data: {
        values: [
          { Region: "NA", lon: -100, lat: 52, label: "North America" },
          { Region: "EU", lon: 10,   lat: 56, label: "Europe" },
          { Region: "JP", lon: 138,  lat: 42, label: "Japan" },
          { Region: "Other", lon: 60, lat: -4, label: "Other Regions" }
        ]
      },
      mark: { type: "text", fontSize: 11, fontWeight: "600", fill: "#333", dy: -6, opacity: 0.85 },
      encoding: {
        longitude: { field: "lon", type: "quantitative" },
        latitude: { field: "lat", type: "quantitative" },
        text: { field: "label", type: "nominal" }
      }
    }
  ],
  config: { view: { stroke: null } }
};


vegaEmbed("#salesMap", specMapRegional, { actions: false })
  .then(() => console.log("Map loaded ✅"))
  .catch(err => console.error("Map error ❌", err));
