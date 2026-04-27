import { clamp } from "./clamp";
import { setScale } from "./draw";

const scrollh = document.querySelector("div.scroll.h") as HTMLDivElement;

const border = {
  left: 64,
  right: 64,
};

const minWidth = 5;

let width = window.innerWidth - border.left - border.right;

let mouseDown = false;
let scrollResize: "left" | "right" | null = null;
let scrollDrag = false;
let scrollDragStart = 0;
let scrollDragStartLeft = 0;
let scrollDragStartRight = 0;
let scrollLeft = border.left;
let scrollRight = border.right;

window.addEventListener("resize", () => {
  width = window.innerWidth - border.left - border.right;
  scrollLeft = border.left;
  scrollRight = border.right;
  scrollh.style.left = scrollLeft + "px";
  scrollh.style.right = scrollRight + "px";

  setScale(
    (width + border.left + border.right - scrollLeft - scrollRight) / width,
    (scrollLeft - border.left) / width,
  );
});

scrollh.addEventListener("pointermove", (e) => {
  if (e.offsetX < 12 || e.offsetX > scrollh.clientWidth - 12) {
    scrollh.style.cursor = "ew-resize";
  } else {
    scrollh.style.cursor = "default";
  }
});

window.addEventListener("pointermove", (e) => {
  if (!mouseDown) return;
  document.body.style.cursor = "ew-resize";

  if (scrollResize === "left") {
    scrollLeft = clamp(
      e.x,
      border.left,
      width + border.left - scrollRight - minWidth,
    );
    scrollh.style.left = scrollLeft + "px";
  }

  if (scrollResize === "right") {
    scrollRight = clamp(
      width + border.right + border.left - e.x,
      border.right,
      width + border.right - scrollLeft - minWidth,
    );
    scrollh.style.right = scrollRight + "px";
  }

  if (scrollDrag) {
    const delta = e.x - scrollDragStart;

    let newLeft = clamp(
      scrollDragStartLeft + delta,
      border.left,
      width + border.left - scrollRight - minWidth,
    );

    let newRight = clamp(
      scrollDragStartRight - delta,
      border.right,
      width + border.right - scrollLeft - minWidth,
    );

    if (
      (delta < 0 && newLeft !== border.left) ||
      (delta > 0 && newRight !== border.right)
    ) {
      scrollLeft = newLeft;
      scrollRight = newRight;
    }

    scrollh.style.left = scrollLeft + "px";
    scrollh.style.right = scrollRight + "px";
  }

  setScale(
    (width + border.left + border.right - scrollLeft - scrollRight) / width,
    (scrollLeft - border.left) / width,
  );
});

scrollh.addEventListener("pointerdown", (e) => {
  mouseDown = true;
  if (e.offsetX < 16 || e.offsetX > scrollh.clientWidth - 16) {
    const l = e.offsetX;
    const r = scrollh.clientWidth - e.offsetX;
    scrollResize = l < r ? "left" : "right";
    return;
  }

  scrollDrag = true;
  scrollDragStart = e.x;
  scrollDragStartLeft = scrollLeft;
  scrollDragStartRight = scrollRight;
});

window.addEventListener("pointerup", () => {
  mouseDown = false;
  scrollResize = null;
  scrollDrag = false;
  document.body.style.cursor = "default";
});
