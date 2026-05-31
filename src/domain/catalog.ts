import type { CalculatorModule, MetricDefinition } from "./types";

export const ICE_CREAM_MODULE: CalculatorModule = {
  code: "ice_cream",
  title: "Ice cream",
  requiredProfileTypes: ["ice_cream"],
  metricCodes: [
    "sugarsPct",
    "fatPct",
    "solidsPct",
    "waterPct",
    "proteinPct",
    "lactosePct",
    "podPct",
    "pac",
    "tempServeC",
  ],
};

export const ICE_CREAM_METRICS: MetricDefinition[] = [
  {
    code: "sugarsPct",
    label: "Сахара",
    unit: "%",
    valueType: "percent",
    calculatorModuleCode: "ice_cream",
  },
  {
    code: "fatPct",
    label: "Жиры",
    unit: "%",
    valueType: "percent",
    calculatorModuleCode: "ice_cream",
  },
  {
    code: "solidsPct",
    label: "Сухие вещества",
    unit: "%",
    valueType: "percent",
    calculatorModuleCode: "ice_cream",
  },
  {
    code: "waterPct",
    label: "Вода",
    unit: "%",
    valueType: "percent",
    calculatorModuleCode: "ice_cream",
  },
  {
    code: "proteinPct",
    label: "Белок",
    unit: "%",
    valueType: "percent",
    calculatorModuleCode: "ice_cream",
  },
  {
    code: "lactosePct",
    label: "Лактоза",
    unit: "%",
    valueType: "percent",
    calculatorModuleCode: "ice_cream",
  },
  {
    code: "podPct",
    label: "POD",
    unit: "%",
    valueType: "percent",
    calculatorModuleCode: "ice_cream",
  },
  {
    code: "pac",
    label: "PAC",
    valueType: "number",
    calculatorModuleCode: "ice_cream",
  },
  {
    code: "tempServeC",
    label: "Температура подачи",
    unit: "°C",
    valueType: "number",
    calculatorModuleCode: "ice_cream",
  },
];

