// src/MySketch.ts
import p5 from "p5";

export const MySketch = (p: p5) => {
  let y1Slider: p5.Element, y2Slider: p5.Element, x3Slider: p5.Element, x4Slider: p5.Element;
  const offset = 80;
  let x_intersect: number, y_intersect: number;
  const control_size = 10;
  let isDragging = false;
  let draggedControl: p5.Element | null = null;
  const noise = 3;

  let graphics: p5.Graphics; // Graphics buffer for drawing lines
  const circles: p5.Vector[] = []; // Array to store intersection points

  const plus = ['#F7EB81', '#009688', '#6ECF72', '#7BD8E4'];
  const minus = ['#B181F0', '#FF7065', '#8154D1', '#F26EF3'];

  let fill_plus: string, fill_minus: string;

  p.setup = () => {
    p.createCanvas(700, 700);
    p.background(0);
    graphics = p.createGraphics(p.height, p.height);

    y1Slider = p.createSlider(offset, p.height - offset, p.random(offset, p.height - offset));
    y1Slider.position(p.height + offset, -20);
    y1Slider.style("width", "2px");
    y1Slider.addClass("mySliders");

    y2Slider = p.createSlider(offset, p.height - offset, p.random(offset, p.height - offset));
    y2Slider.position(p.height + offset, -20);
    y2Slider.style("width", "2px");
    y2Slider.addClass("mySliders");

    x3Slider = p.createSlider(offset, p.height - offset, p.random(offset, p.height - offset));
    x3Slider.position(p.height + offset, -20);
    x3Slider.style("width", "2px");
    x3Slider.addClass("mySliders");

    x4Slider = p.createSlider(offset, p.height - offset, p.random(offset, p.height - offset));
    x4Slider.position(p.height + offset, -20);
    x4Slider.style("width", "2px");
    x4Slider.addClass("mySliders");

    fill_plus = p.random(plus);
    fill_minus = p.random(minus);
  };

  p.draw = () => {
    p.frameRate(10);
    graphics.clear();
    p.background(255);
    p.strokeWeight(0);

    const y1 = (y1Slider as p5.Element).value() as number + p.random(noise);
    const y2 = (y2Slider as p5.Element).value() as number + p.random(noise);
    const x3 = (x3Slider as p5.Element).value() as number + p.random(noise);
    const x4 = (x4Slider as p5.Element).value() as number + p.random(noise);

    const x1 = offset;
    const x2 = p.height - offset;
    p.fill(0);
    p.line(x1, y1, x2, y2);

    // background
    p.beginShape();
    p.fill(220, 220, 220, 20);
    p.vertex(offset, offset);
    p.vertex(offset, p.height - offset);
    p.vertex(p.height - offset, p.height - offset);
    p.vertex(p.height - offset, offset);
    p.endShape(p.CLOSE);

    // Overlap bottom-left
    p.beginShape();
    p.fill(fill_minus);
    p.vertex(offset, p.height - offset);
    p.vertex(offset, y1);
    p.vertex(x_intersect, y_intersect);
    p.vertex(x4, p.height - offset);
    p.endShape(p.CLOSE);

    const y3 = offset;
    const y4 = p.height - offset;

    p.fill(0);
    // p.line(x3, y3, x4, y4);

    // Overlap top
    p.beginShape();
    p.fill(fill_plus);
    p.vertex(x3, offset);
    p.vertex(p.height - offset, offset);
    p.vertex(p.height - offset, y2);
    p.vertex(x_intersect, y_intersect);
    p.endShape(p.CLOSE);

    p.image(graphics, 0, 0);

    // CONTROLS
    p.fill('#000000');
    p.square(x1 - control_size * 2, y1 - 10, control_size + 10);
    p.square(x4 - 10, y4, control_size + 10);

    p.fill('#000000');
    p.square(x2, y2 - 10, control_size + 10);
    p.square(x3 - 10, y3 - control_size * 2, control_size + 10);
    p.fill(255);
    p.strokeWeight(0.01);
    p.textStyle(p.NORMAL);
    p.textSize(10);

    p.text("y+", p.height - offset + 5, y2 + 3);
    p.text("x+", x3 - 5, offset - 7);
    p.text("x-", x4 - 4, p.height - offset + 13);
    p.text("y-", offset - 13, y1 + 3);

    p.fill(0);
    p.textSize(12);

    const intersection = getIntersection(x1, y1, x2, y2, x3, y3, x4, y4);

    if (intersection) {
      circles.push(intersection);
      x_intersect = intersection.x;
      y_intersect = intersection.y;
    }

    p.fill(255, 255, 255, 200);
    p.stroke(190);
    p.strokeWeight(1);
    p.noFill();

    // Draw connected line through all intersection points
    if (circles.length > 1) {
      p.stroke('#F6A545');
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      for (let i = 0; i < circles.length; i++) {
        p.vertex(circles[i].x, circles[i].y);
      }
      p.endShape();
    }

    if (isDragging && draggedControl !== null) {
      if (draggedControl === x3Slider || draggedControl === x4Slider) {
        draggedControl.value(p.constrain(p.mouseX, 0, 500));
      } else {
        draggedControl.value(p.constrain(p.mouseY, 0, 500));
      }
    }
  };

  p.mousePressed = () => {
    if (p.dist(p.mouseX, p.mouseY, offset, (y1Slider as p5.Element).value() as number) < control_size * 2) {
      isDragging = true;
      draggedControl = y1Slider;
    } else if (p.dist(p.mouseX, p.mouseY, p.height - offset, (y2Slider as p5.Element).value() as number) < control_size * 2) {
      isDragging = true;
      draggedControl = y2Slider;
    } else if (p.dist(p.mouseX, p.mouseY, (x3Slider as p5.Element).value() as number, offset) < control_size * 2) {
      isDragging = true;
      draggedControl = x3Slider;
    } else if (p.dist(p.mouseX, p.mouseY, (x4Slider as p5.Element).value() as number, p.height - offset) < control_size * 2) {
      isDragging = true;
      draggedControl = x4Slider;
    }
  };

  p.mouseDragged = () => {
    if (isDragging && draggedControl !== null) {
      if (draggedControl === x3Slider || draggedControl === x4Slider) {
        draggedControl.value(p.constrain(p.mouseX, offset, p.height - offset));
      } else {
        draggedControl.value(p.constrain(p.mouseY, offset, p.height - offset));
      }
    }
  };

  p.mouseReleased = () => {
    isDragging = false;
    draggedControl = null;
  };

  const getIntersection = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): p5.Vector | null => {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) {
      return null;
    }
    const xi = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;
    const yi = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;
    if (xi < Math.min(x1, x2) || xi > Math.max(x1, x2) || xi < Math.min(x3, x4) || xi > Math.max(x3, x4)) {
      return null;
    }
    if (yi < Math.min(y1, y2) || yi > Math.max(y1, y2) || yi < Math.min(y3, y4) || yi > Math.max(y3, y4)) {
      return null;
    }
    return p.createVector(xi, yi);
  };
};
