// @ts-ignore
import "@fontsource-variable/roboto-mono";
import "./style.css";
import { Data } from "./data";
import { draw } from "./draw";
import "./scroll";

const fileInput = document.querySelector(
  "input[type=file]",
) as HTMLInputElement;

const container = document.querySelector("div.container") as HTMLDivElement;

fileInput.addEventListener("change", async (event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  draw(await Data.fromFile(file));

  container.classList.remove("hide");
});
