/* global vars */

var diffX, diffY, pressX, pressY, lastX, lastY, theElement, gridRects, gridOccupants, gridOffsetX, gridOffsetY;

function Point2D(x, y) {
    if(arguments.length > 0) {
        this.init(x, y);
    }
}

Point2D.prototype.init = function(x, y) {
    this.x = x;
    this.y = y;
};
Point2D.prototype.add = function(other) {
    return new Point2D(this.x + other.x, this.y + other.y);
};
Point2D.prototype.addTo = function(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
};
Point2D.prototype.addScalar = function(scalar) {
    return new Point2D(this.x + scalar, this.y + scalar);
};
Point2D.prototype.addScalarTo = function(scalar) {
    this.x += scalar;
    this.y += scalar;
    return this;
};
Point2D.prototype.sub = function(other) {
    return new Point2D(this.x - other.x, this.y - other.y);
};
Point2D.prototype.subTo = function(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
};
Point2D.prototype.subScalar = function(scalar) {
    return new Point2D(this.x - scalar, this.y - scalar);
};
Point2D.prototype.subScalarTo = function(scalar) {
    this.x -= scalar;
    this.y -= scalar;
    return this;
};
Point2D.prototype.mul = function(scalar) {
    return new Point2D(this.x * scalar, this.y * scalar);
};
Point2D.prototype.mulTo = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
};
Point2D.prototype.div = function(scalar) {
    return new Point2D(this.x / scalar, this.y / scalar);
};
Point2D.prototype.divTo = function(scalar) {
    this.x /=scalar;
    this.y /=scalar;
    return this;
};
Point2D.prototype.isEqual = function(other) {
    return(this.x == other.x && this.y == other.y);
};
Point2D.prototype.interp = function(other, t) {
    return new Point2D(this.x + (other.x - this.x) * t, this.y + (other.y - this.y) * t);
};
Point2D.prototype.dist = function(other) {
    var dx = this.x - other.x;
    var dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
};
Point2D.prototype.toString = function(){
    return this.x + "," + this.y;
};
Point2D.prototype.setXY = function(x, y) {
    this.x = x;
    this.y = y;
};
Point2D.prototype.setFromPoint = function(other) {
    this.x = other.x;
    this.y = other.y;
};
Point2D.prototype.isWithin = function(ptMin, ptMax) {
	if(this.x >= ptMin.x) {
		if(this.x < ptMax.x) {
			if(this.y >= ptMin.y) {
				if(this.y < ptMin.y) {
					return true;
				}
			}
		}
	}
	return false;
};

function Rect(minX, minY, maxX, maxY) {
	if(arguments.length > 0) {
		this.init(minX, minY, maxX, maxY);
	}
}
Rect.prototype.init = function(minX, minY, maxX, maxY) {
	if(minX == null || minY == null || maxX == null || maxY == null) {
		this.minX = null;
		this.minY = null;
		this.maxX = null;
		this.maxY = null;
		return;
	}
	if(minX < maxX) {
		this.minX = minX;
		this.maxX = maxX;
	} else {
		this.minX = maxX;
		this.maxX = minX;
	} 
	if(minY < maxY) {
		this.minY = minY;
		this.maxY = maxY;
	} else {
		this.minY = maxY;
		this.maxY = minY;
	}
};
Rect.prototype.isNull = function() {
	 if(this.minX == null || this.minY == null || this.maxX == null || this.maxY == null) {
    return true;
  }
	return false;
};
Rect.prototype.getArea = function() {
	if(this.isNull()) {
		return null;
	}
	var w = this.maxX - this.minX;
	var h = this.maxY - this.minY;
	return (w * h);
};
Rect.prototype.getIntersection = function(other) {
	if(this.isNull() || other.isNull()) {
		return new Rect(null, null, null, null);
	}
	var min_x = this.minX < other.minX ? other.minX : this.minX;  // get the max of the two mins
	var min_y = this.minY < other.minY ? other.minY : this.minY;
	var max_x = this.maxX < other.maxX ? this.maxX : other.maxX;  // now the min of the two maxes
	var max_y = this.maxY < other.maxY ? this.maxY : other.maxY;
	if(max_x < min_x) {
		min_x = null;		
		max_x = null;
	} 
	if(max_y < min_y) {
		min_y = null;
		max_y = null;
	}
	return new Rect(min_x, min_y, max_x, max_y);
};

Rect.prototype.Translate = function(dx, dy) {
	this.minX = this.minX + dx;
	this.maxX = this.maxX + dx;
	this.minY = this.minY + dy;
	this.maxY = this.maxY + dy;
};
Rect.prototype.xyWithin = function(x, y) {
	if(this.isNull()) {
		return false;
	}
	if(x >= this.minX) {
  	if(x < this.maxX) {
      if(y >= this.minY) {
        if(y < this.maxY) {
          return true;
        }
      }
    }
  }
  return false;
};
Rect.prototype.areaIntersect = function(other) {
	var rectInter = this.getIntersection(other);
	if(rectInter.isNull()) {
		return 0;
	}
	return rectInter.getArea();
};
Rect.prototype.getString = function() {
	var st = new String();
	st = "MinX: " + this.minX + " MinY: " + this.minY + " MaxX: " + this.maxX + " MaxY: " + this.maxY;
	return st;
};
function getRowByIdx(idx) {
	var i = parseInt(idx, 10);
	var row = i / 4;
	return Math.floor(row);
}
function getColByIdx(idx) {
	var i = parseInt(idx, 10);
	var col = i % 4;
	return Math.floor(col);
}
function initGridRects() {
	gridRects = new Array(12);
	gridRects[0] = new Rect(0, 0, 100, 100);
	gridRects[1] = new Rect(100, 0, 200, 100);
	gridRects[2] = new Rect(200, 0, 300, 100);
	gridRects[3] = new Rect(300, 0, 400, 100);

	gridRects[4] = new Rect(0, 100, 100, 200);
	gridRects[5] = new Rect(100, 100, 200, 200);
	gridRects[6] = new Rect(200, 100, 300, 200);
	gridRects[7] = new Rect(300, 100, 400, 200);

	gridRects[8] = new Rect(0, 200, 100, 300);
	gridRects[9] = new Rect(100, 200, 200, 300);
	gridRects[10] = new Rect(200, 200, 300, 300);
	gridRects[11] = new Rect(300, 200, 400, 300);
}
function offsetGridRects(offsetX, offsetY) {
	for(var i = 0; i < 12; ++i) {
		gridRects[i].Translate(offsetX, offsetY);
	}
}
function initGridOccupants() {	
	gridOccupants = new Array(12);
	for(var i = 0; i < 12; ++i) {
		gridOccupants[i] = new Array();
	}
	for(var i = 1; i <= 12; ++i) {
		var idSt = new String(i);
		var elem = document.getElementById(idSt);
		var x = parseInt(elem.style.left, 10);
		var y = parseInt(elem.style.top, 10);
		var w = parseInt(elem.width, 10);
		var h = parseInt(elem.height, 10);
		var x0 = x + w;
		var y0 = y + h;
		elem.rect = new Rect(x, y, x0, y0);
		elem.rect.Translate(gridOffsetX, gridOffsetY);
		for(var j = 0; j < 12; ++j) {
				var areaInt = gridRects[j].areaIntersect(elem.rect);
				if(areaInt > 0) {
					gridOccupants[j].push(i);
				}
		}		
	}
}

function setGridOccupants() {
	for(var i = 0; i < 12; ++i) {
		gridOccupants[i] = [];
	}
	for(var i = 1; i <= 12; ++i) {
		var idSt = new String(i);
		var elem = document.getElementById(idSt);
		var elemRect = elem.rect;
		for(var j = 0; j < 12; ++j) {
				var areaInt = gridRects[j].areaIntersect(elemRect);
				if(areaInt > 0) {
					gridOccupants[j].push(i);
				}
		}
	}
}

function getGridIndex(x, y) {
	for(var i = 0; i < 12; ++i) {
		if(gridRects[i].xyWithin(x, y)) {
			return i;
		}
	}
	return - 1;
}

function getGridAreaIndex(rect) {
	var idx = - 1;
	var maxArea = 0;
	for(var i = 0; i < 12; ++i) {
		var area = gridRects[i].areaIntersect(rect);
		if(area > maxArea) {
			idx = i;
			maxArea = area;
		}
	}
	return idx;
}

function rectWithinGrid(rect, gridMin, gridMax) {
	if(rect.minX < gridMax.x) {
		if(rect.maxX > gridMin.x) {
			if(rect.minY < gridMax.y) {
				if(rect.maxY > gridMin.y) {
					return true;
				}
			}
		}
	}
	return false;
}

function displayGridOccupants() {
	setGridOccupants();
	var elem = document.getElementById("test_area");
	elem.innerHTML += "Grid Occupants<br>";
	for(var i = 0; i < 12; ++i) {
		elem.innerHTML += "cell " + i + ": " + gridOccupants[i] + "<br>";
	}	
}

function displayGridCoords() {
	var elem = document.getElementById("test_area");
	elem.innerHTML += "Grid Coords<br>";
	for(var i = 0; i < 12; ++i) {
		var gridSt = new String();
		var rect = gridRects[i];
		var minx = rect.minX;
		var miny = rect.minY;
		var maxx = rect.maxX;
		var maxy = rect.maxY;
		gridSt = "cell ";
		gridSt += i;
		gridSt += " minX: " + minx;
		gridSt += " minY: " + miny;
		gridSt += " maxX: " + maxx;
		gridSt += " maxY: " + maxy;
		gridSt += "<br>";
		elem.innerHTML += gridSt;
	}
}

function findPos(obj) {
	var curLeft = curTop = 0;
	if(obj.offsetParent) {
		do {
			curLeft += obj.offsetLeft;
			curTop += obj.offsetTop;
		} while(obj = obj.offsetParent);
	}

	return new Point2D(curLeft, curTop);
}

// The event handler function for grabbing the word
function grabber(event) {

// Set the global variable for the element to be moved

  theElement = event.currentTarget;

// Determine the position of the word to be grabbed,
//  first removing the units from left and top

//  var posX = parseInt(theElement.style.left);
//  var posY = parseInt(theElement.style.top);

//	var currentRect = theElement.rect;
//	document.getElementById("coords").innerHTML = currentRect.getString();
// Compute the difference between where it is and
// where the mouse click occurred

//  diffX = event.clientX - posX;
//  diffY = event.clientY - posY;

//	pressX = event.clientX;
//	pressY = event.clientY;

	lastX = event.clientX;
	lastY = event.clientY;

// Now register the event handlers for moving and
// dropping the word

  document.addEventListener("mousemove", mover, true);
  document.addEventListener("mouseup", dropper, true);

// Stop propagation of the event and stop any default
// browser action

  event.stopPropagation();
  event.preventDefault();

}  //** end of grabber

// *******************************************************

// The event handler function for moving the word

function mover(event) {
// Compute the new position, add the units, and move the word
//	var currentRect = theElement.rect;
//	document.getElementById("coords").innerHTML = currentRect.getString(); 

//	var transX = event.clientX - lastX;
//	var transY = event.clientY - lastY;

//  theElement.style.left = (event.clientX - diffX) + "px";
//  theElement.style.top = (event.clientY - diffY) + "px";

//	lastX = event.clientX;
//	lastY = event.clientY;

//	theElement.rect.Translate(transX, transY);

// Prevent propagation of the event

	diffX = event.clientX - lastX;
	diffY = event.clientY - lastY;
	lastX = event.clientX;
	lastY = event.clientY;
	theElement.rect.Translate(diffX, diffY);

	var elemLeft = theElement.rect.minX - gridOffsetX;
	var elemTop = theElement.rect.minY - gridOffsetY;

	theElement.style.left = elemLeft + "px";
	theElement.style.top = elemTop + "px";

  event.stopPropagation();
}  //** end of mover

// *********************************************************
// The event handler function for dropping the word

function dropper(event) {

// Unregister the event handlers for mouseup and mousemove

//	var dx = event.clientX - lastX;
//	var dy = event.clientY - lastY;

//	theElement.rect.Translate(-dx, -dy);	

	var areaIntersects = new Array(12);
	for(var i = 0; i < 12; ++i) {
		areaIntersects[i] = gridRects[i].areaIntersect(theElement.rect);
	}

	var arSt = new String();

	for(var i = 0; i < 12; ++i) {
		arSt += "cell " + i + " " + areaIntersects[i] + " ";
		if(i % 4 == 3) {
			arSt += "<br>";
		}
	}

	document.getElementById("areaInts").innerHTML = arSt;

	var gridIdx = getGridAreaIndex(theElement.rect);
	
	if(gridIdx > 0) {
		theElement.rect = gridRects[gridIdx];
		var elemLeft = theElement.rect.minX - gridOffsetX;
		var elemTop = theElement.rect.minY - gridOffsetY;
		theElement.style.left = elemLeft + "px";
		theElement.style.top = elemTop + "px";
//		theElement.style.top = (theElement.rect.minY - gridOffsetY) + "py";
//		var tempRect = gridRects[gridIdx];
//		tempRect.Translate(- gridOffsetX, -gridOffsetY);
//		theElement.style.left = tempRect.minX + "px";
//		theElement.style.top = tempRect.minY + "px";
	}
	
	document.getElementById("coords").innerHTML = theElement.rect.getString();

  document.removeEventListener("mouseup", dropper, true);
  document.removeEventListener("mousemove", mover, true);

// Prevent propagation of the event

  event.stopPropagation();
}  //** end of dropper


