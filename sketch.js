let names = [];
let img;         // 밝기 기반용 (흘러가는 텍스트 밝기 조절용)
let maskImg;     // 실루엣 이미지 (흑백/투명 마스크로 쓸 것)
let textLayer;
let cellSize = 18;
let scrollX = 0;


function preload() {
  img = loadImage("por2.png");
  maskImg = loadImage("por.png");

  // 이름 500개 생성
  let first = ["Kim", "Lee", "Park", "Choi", "Jung"];
  let last = ["Jimin", "Jisoo", "Donghyun", "Minji", "Jihoon"];
  for (let i = 0; i < 500; i++) {
    names.push(random(first) + " " + random(last));
  }
}

function setup() {
  createCanvas(img.width, img.height);
  textLayer = createGraphics(width, height);
  textLayer.textFont("Arial");
  textLayer.textSize(cellSize * 0.5);
  textLayer.textAlign(LEFT, TOP);
}

function draw() {
  background(0);
  textLayer.clear();

  scrollX -= 0.5;
  if (scrollX <= -width) scrollX = 0;

  for (let y = 0; y < height; y += cellSize) {
    let xOffset = scrollX;
    let lineIndex = floor(y / cellSize) * 100;

    while (xOffset < width) {
      let name = names[lineIndex % names.length];

      let px = int((xOffset + cellSize / 2) % width);
      let py = int((y + cellSize / 2) % height);
      let c = img.get(px, py);
      let b = brightness(c);

      let alpha = map(b, 0, 100, 255, 90);
      let col = map(b, 0, 100, 220, 90);
      textLayer.fill(col, col, col, alpha);

      textLayer.text(name, xOffset, y);
      xOffset += textLayer.textWidth(name) + 8;
      lineIndex++;
    }
  }

  // 클리핑된 텍스트 출력
  let masked = textLayer.get();
  masked.mask(maskImg);
  image(masked, 0, 0);
}


function enhanceMaskContrast(m) {
  m.loadPixels();
  for (let i = 0; i < m.pixels.length; i += 4) {
    let bright = (m.pixels[i] + m.pixels[i+1] + m.pixels[i+2]) / 3;
    let scaled = map(bright, 150, 200, 0, 255); // 중간 회색 강조
    scaled = constrain(scaled, 50, 255);

    m.pixels[i] = m.pixels[i+1] = m.pixels[i+2] = scaled;
    m.pixels[i+3] = scaled;
  }
  m.updatePixels();
}
