const DEFAULT_IMAGE_TYPE = 'image/png';

class SignatureTool {

  constructor(canvas, options) {
    this.width = 600;
    this.height = 300;
    this.scale = window.devicePixelRatio || 1;
    this.color = '#000';
    this.bgColor = 'transparent';
    this.openStroke = true;
    this.canDraw = false;
    this.minLineWidth = 4;
    this.maxLineWidth = 6;
    this.minSpeed = 1.5; // the minimum speed which the minimum line width required(ranges: 1.0 - 10.0)
    this.maxWidthDiffRate = 20; // the maximum percentage of the increase(decrease) of the width of two adjacent lines(ranges: 1 - 100)
    this.points = [];
    this.init(canvas, options);
  }

  init(canvas, options) {
    if (!canvas) return;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.width = options.width || canvas.clientWidth || this.width;
    this.height = options.height || canvas.clientHeight || this.height;
    this.scale = options.scale || this.scale;
    this.color = options.color || this.color;
    this.bgColor = options.bgColor || this.bgColor;
    this.openStroke = options.openStroke === undefined ? this.openStroke : !!options.openStroke;
    this.minLineWidth = options.minLineWidth || this.minLineWidth;
    this.maxLineWidth = options.maxLineWidth || this.maxLineWidth;
    this.minSpeed = options.minSpeed || this.minSpeed;
    this.maxWidthDiffRate = options.maxWidthDiffRate || this.maxWidthDiffRate;
    this.onStart = options.onStart;
    this.onEnd = options.onEnd;
    this.initOffsets();

    this.ctx.lineCap = 'round'; // use rounded corners on both ends of the line
    this.ctx.lineJoin = 'round'; // use rounded corners where lines meet
    this.initBgColor();
    this.addEvents();
  }

  initOffsets() {
    if (this.scale > 0) {
      this.canvas.height = this.height * this.scale;
      this.canvas.width = this.width * this.scale;
      if (this.scale !== 1) {
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.ctx.scale(this.scale, this.scale);
      }
    }
  }

  initBgColor() {
    if (!this.bgColor) return;
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  addEvents() {
    this.removeEvents();
    this.canvas.style.touchAction = 'none';

    // mobile
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      this.canvas.addEventListener('touchstart', this.startDraw);
      this.canvas.addEventListener('touchmove', this.drawing);
      document.addEventListener('touchcancel', this.endDraw);
      document.addEventListener('touchend', this.endDraw);
      return;
    }

    // pc
    this.canvas.addEventListener('mousedown', this.startDraw);
    this.canvas.addEventListener('mousemove', this.drawing);
    document.addEventListener('mouseup', this.endDraw);
  }

  removeEvents() {
    this.canvas.style.touchAction = 'auto';

    // mobile
    this.canvas.removeEventListener('touchstart', this.startDraw);
    this.canvas.removeEventListener('touchmove', this.drawing);
    document.removeEventListener('touchend', this.endDraw);
    document.removeEventListener('touchcancel', this.endDraw);

    // pc
    this.canvas.removeEventListener('mousedown', this.startDraw);
    this.canvas.removeEventListener('mousemove', this.drawing);
    document.removeEventListener('mouseup', this.endDraw);
  }

  startDraw = (event) => {
    event.preventDefault();
    this.canDraw = true;
    this.ctx.strokeStyle = this.color;
    this.initPoint(event);
    this.onStart && this.onStart(event);
  };

  drawing = (event) => {
    event.preventDefault();
    if (!this.canDraw) return;
    this.initPoint(event);
    if (this.points.length < 2) return;
    const point = this.points.slice(-1)[0];
    const prePoint = this.points.slice(-2, -1)[0];
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => this.onDraw(prePoint, point));
    } else {
      this.onDraw(prePoint, point);
    }
  };

  endDraw = (event) => {
    if (!this.canDraw) return;
    if (this.points.length < 2) {
      this.drawPoint(this.points[0]);
    }
    this.canDraw = false;
    this.canAddHistory = true;
    this.points = [];
    this.onEnd && this.onEnd(event);
  };

  getLineWidth = (speed) => {
    // thinner if moving faster, thicker if moving slower
    const minSpeed = this.minSpeed > 10 ? 10 : this.minSpeed < 1 ? 1 : this.minSpeed;
    const addWidth = (this.maxLineWidth - this.minLineWidth) * speed / minSpeed;
    const lineWidth = Math.max(this.maxLineWidth - addWidth, this.minLineWidth);
    return Math.min(lineWidth, this.maxLineWidth);
  };

  getRadianData = (x1, y1, x2, y2) => {
    const dis_x = x2 - x1;
    const dis_y = y2 - y1;

    // 1 has no radian
    if (dis_x === 0) {
      return { val: 0, pos: -1 }; // 1.1 vertical movement only
    }
    if (dis_y === 0) {
      return { val: 0, pos: 1 }; // 1.2 horizontal movement only
    }

    // 2 has radian
    const val = Math.abs(Math.atan(dis_y / dis_x));
    // eslint-disable-next-line no-mixed-operators
    if (x2 > x1 && y2 < y1 || (x2 < x1 && y2 > y1)) {
      return { val, pos: 1 }; // 2.1 down-right or up-left movement
    }
    return { val, pos: -1 }; // 2.2 down-left or up-right movement
  };

  getRadianPoints = (radianData, x, y, halfLineWidth) => {
    // 1 has no radian
    if (radianData.val === 0) {
      // 1.1 horizontal movement only
      if (radianData.pos === 1) {
        return [
          { x, y: y + halfLineWidth }, // a trapezoidal point at half the line width above the current point
          { x, y: y - halfLineWidth } // a trapezoidal point at half the line width below the current point
        ];
      }

      // 1.2 vertical movement only
      return [
        { y, x: x + halfLineWidth }, // a trapezoidal point at half the line width to the right of the current point
        { y, x: x - halfLineWidth } // a trapezoidal point at half the line width to the left of the current point
      ];
    }

    // 2 has radian
    // the distance between the trapezoidal point and the current point according to the radian
    const dis_x = Math.sin(radianData.val) * halfLineWidth; // horizontal distance
    const dis_y = Math.cos(radianData.val) * halfLineWidth; // vertical distance

    // 2.1 down-right or up-left movement
    if (radianData.pos === 1) {
      return [
        { x: x + dis_x, y: y + dis_y }, // a trapezoidal point at the up-right of the current point
        { x: x - dis_x, y: y - dis_y } // a trapezoidal point at the down-left of the current point
      ];
    }

    // 2.2 down-left or up-right movement
    return [
      { x: x + dis_x, y: y - dis_y }, // a trapezoidal point at the down-right of the current point
      { x: x - dis_x, y: y + dis_y } // a trapezoidal point at the up-left of the current point
    ];
  };

  initPoint = (event) => {
    const time = Date.now();
    const prePoint = this.points.slice(-1)[0];

    if (prePoint && prePoint.time === time) {
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    // eslint-disable-next-line no-mixed-operators
    const e = event.touches && event.touches[0] || event;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // moved but current position not changed
    if (prePoint && prePoint.x === x && prePoint.y === y) {
      return;
    }

    const point = { x, y, time };
    if (this.openStroke && prePoint) {
      const prePoint2 = this.points.slice(-2, -1)[0];
      point.distance = Math.sqrt(Math.pow(point.x - prePoint.x, 2) + Math.pow(point.y - prePoint.y, 2));
      point.speed = point.distance / ((point.time - prePoint.time) || 0.1);
      point.lineWidth = this.getLineWidth(point.speed);
      if (prePoint2 && prePoint2.lineWidth && prePoint.lineWidth) {
        // "maxWidthDiffRate" protection: prevent too large width difference between two adjacent lines
        const rate = (point.lineWidth - prePoint.lineWidth) / prePoint.lineWidth;
        let maxRate = this.maxWidthDiffRate / 100;
        maxRate = maxRate > 1 ? 1 : maxRate < 0.01 ? 0.01 : maxRate;
        if (Math.abs(rate) > maxRate) {
          const per = rate > 0 ? maxRate : -maxRate;
          point.lineWidth = prePoint.lineWidth * (1 + per);
        }
      }
    }
    this.points.push(point);
    this.points = this.points.slice(-3);
  };

  onDraw = (prePoint, point) => {
    if (this.openStroke) {
      this.drawLineWithStrokes(prePoint, point);
      return;
    }
    this.drawLine(prePoint, point);
  };

  drawArcLine = (startPointX, startPointY, controlPointX, controlPointY, endPointX, endPointY, lineWidth) => {
    this.ctx.lineWidth = Number(lineWidth.toFixed(1));
    this.ctx.beginPath();
    this.ctx.moveTo(Number(startPointX.toFixed(1)), Number(startPointY.toFixed(1)));
    this.ctx.quadraticCurveTo(
      Number(controlPointX.toFixed(1)), Number(controlPointY.toFixed(1)),
      Number(endPointX.toFixed(1)), Number(endPointY.toFixed(1))
    );
    this.ctx.stroke();
  };

  drawTrapezoid = (point1, point2, point3, point4) => {
    this.ctx.beginPath();
    this.ctx.moveTo(Number(point1.x.toFixed(1)), Number(point1.y.toFixed(1)));
    this.ctx.lineTo(Number(point2.x.toFixed(1)), Number(point2.y.toFixed(1)));
    this.ctx.lineTo(Number(point3.x.toFixed(1)), Number(point3.y.toFixed(1)));
    this.ctx.lineTo(Number(point4.x.toFixed(1)), Number(point4.y.toFixed(1)));
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  };

  drawLine = (prePoint, point) => {
    point.lastX = prePoint.x + (point.x - prePoint.x) * 0.5;
    point.lastY = prePoint.y + (point.y - prePoint.y) * 0.5;
    if (typeof prePoint.lastX === 'number') {
      this.drawArcLine(
        prePoint.lastX, prePoint.lastY,
        prePoint.x, prePoint.y,
        point.lastX, point.lastY,
        this.minLineWidth
      );
    }
  };

  drawLineWithStrokes = (prePoint, point) => {
    const dis_x = point.x - prePoint.x;
    const dis_y = point.y - prePoint.y;
    if (Math.abs(dis_x) + Math.abs(dis_y) <= this.scale) {
      point.lastX1 = point.lastX2 = prePoint.x + (dis_x * 0.5);
      point.lastY1 = point.lastY2 = prePoint.y + (dis_y * 0.5);
    } else {
      // draw smoother line with three parts
      // part1(30%): arc line
      // part2(40%): trapezoid
      // part3(30%): arc line
      point.lastX1 = prePoint.x + (dis_x * 0.3);
      point.lastY1 = prePoint.y + (dis_y * 0.3);
      point.lastX2 = prePoint.x + (dis_x * 0.7);
      point.lastY2 = prePoint.y + (dis_y * 0.7);
    }
    point.perLineWidth = (prePoint.lineWidth + point.lineWidth) / 2;
    if (typeof prePoint.lastX1 !== 'number') {
      point.isFirstPoint = true;
      return;
    }

    // draw arc line: part1 or part3 of the line
    this.drawArcLine(prePoint.lastX2, prePoint.lastY2, prePoint.x, prePoint.y, point.lastX1, point.lastY1, point.perLineWidth);
    if (prePoint.isFirstPoint) return;
    if (prePoint.lastX1 === prePoint.lastX2 && prePoint.lastY1 === prePoint.lastY2) return;

    // draw trapezoid: between par1 and part3
    const data = this.getRadianData(prePoint.lastX1, prePoint.lastY1, prePoint.lastX2, prePoint.lastY2);
    const points1 = this.getRadianPoints(data, prePoint.lastX1, prePoint.lastY1, prePoint.perLineWidth / 2);
    const points2 = this.getRadianPoints(data, prePoint.lastX2, prePoint.lastY2, point.perLineWidth / 2);
    this.drawTrapezoid(points1[0], points2[0], points2[1], points1[1]);
  };

  drawPoint = (point) => {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.minLineWidth, 0, 2 * Math.PI);
    this.ctx.fill();
  };

  toDataURL = (type = DEFAULT_IMAGE_TYPE, quality = 1) => {
    if (this.canvas.width === this.width) {
      return this.canvas.toDataURL(type, quality);
    }
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.canvas, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL(type, quality);
  };

  toBlob = (callback, type = DEFAULT_IMAGE_TYPE, quality = 1) => {
    if (this.canvas.width === this.width) {
      return this.canvas.toBlob((blob) => {
        callback && callback(blob);
      }, type, quality);
    }
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.canvas, 0, 0, canvas.width, canvas.height);
    return canvas.toBlob((blob) => {
      callback && callback(blob);
    }, type, quality);
  };

  clear = () => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.initBgColor();
  };

  isEmpty = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;
    if (this.bgColor) {
      ctx.fillStyle = this.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (this.scale !== 1) {
      ctx.scale(this.scale, this.scale);
    }
    return canvas.toDataURL() === this.canvas.toDataURL();
  };

  getBase64PNG = () => {
    return this.toDataURL();
  };

  getBase64JPG = (quality = 0.8) => {
    return this.toDataURL('image/jpeg', quality);
  };

  convert2BlobPNG = (callback) => {
    this.toBlob(callback);
  };

  convert2BlobJPG = (callback, quality = 0.8) => {
    this.toBlob(callback, 'image/jpeg', quality);
  };
}

export default SignatureTool;
