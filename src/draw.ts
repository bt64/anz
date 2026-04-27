import type { Data } from "./data";

const svg = document.querySelector("svg")!;
const container = document.querySelector("div.container")!;
let baseW = 0;

export const draw = (data: Data) => {
  svg.replaceChildren();

  const { interpolated, absMax } = data;
  svg.viewBox.baseVal.x = 0;
  svg.viewBox.baseVal.y = -absMax;
  svg.viewBox.baseVal.width = interpolated.length;
  svg.viewBox.baseVal.height = absMax * 2;

  baseW = interpolated.length;

  // 0 line
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

  line.setAttribute("x1", "0");
  line.setAttribute("y1", "0");
  line.setAttribute("x2", String(interpolated.length));
  line.setAttribute("y2", "0");
  line.setAttribute("stroke", "#bbb");
  line.setAttribute("stroke-width", "1.2");
  line.setAttribute("vector-effect", "non-scaling-stroke");

  svg.appendChild(line);

  // signal graph
  const polyline = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline",
  );
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", "red");
  polyline.setAttribute("stroke-width", "1.2");
  polyline.setAttribute("vector-effect", "non-scaling-stroke");

  for (let i = 0; i < interpolated.length; i++) {
    const point = svg.createSVGPoint();
    point.x = i;
    point.y = -interpolated[i];
    polyline.points.appendItem(point);
  }

  svg.appendChild(polyline);
};

export const setScale = (width: number, x: number) => {
  svg.style.width = container.clientWidth + "px";
  svg.style.height = container.clientHeight + "px";

  const viewBox = svg.viewBox.baseVal;

  viewBox.width = baseW * width;
  viewBox.x = baseW * x;
};
