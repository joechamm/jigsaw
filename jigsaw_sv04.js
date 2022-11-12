/* global vars */

var diffX, diffY, theElement, gridPoints;

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

var initCorner;

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

function initGridPoints(numRows, numCols, uRight, lLeft) {
	var puzz_area = document.getElementById("puzzle_area");
	gridPoints = new Array(numRows);
	for(var i = 0; i < numRows; ++i) {
		gridPoints[i] = new Array(numCols);
	}
	var dx = (uRight.x - lLeft.x) / (numCols);
	var dy = (uRight.y - lLeft.y) / (numRows);

	var x = lLeft.x;
	var y = lLeft.y;

	for(var row = 0; row < numRows; ++row) {
		x = lLeft.x;
		for(var col = 0; col < numCols; ++col) {
			gridPoints[row][col] = new Point2D(x, y);
			x += dx;
		}
		y += dy;
	}
}

function displayGridPoints() {
	document.getElementById("test_area").innerHTML += "num rows: " + gridPoints.length + " num cols: " + gridPoints[0].length + "<br>";
	for(var row = 0; row < gridPoints.length; ++row) {
		for(var col = 0; col < gridPoints[row].length; ++col) {
			document.getElementById("test_area").innerHTML += "gridPoint[" + row + "][" + col + "]: " + gridPoints[row][col] + "<br>";
		}
	}
}

function getGridPoint(pt) {
	if(pt.isWithin(gridPoints[0][0], gridPoints[1][1])) {
		return gridPoints[0][0];
	} else if(pt.isWithin(gridPoints[0][1], gridPoints[1][2])) {
		return gridPoints[0][1];
	} else if(pt.isWithin(gridPoints[0][2], gridPoints[1][3])) {
		return gridPoints[0][2];
	} else if(pt.isWithin(gridPoints[1][0], gridPoints[2][1])) {
		return gridPoints[1][0];
	} else if(pt.isWithin(gridPoints[1][1], gridPoints[2][2])) {
		return gridPoints[1][1];
	} else if(pt.isWithin(gridPoints[1][2], gridPoints[2][3])) {
		return gridPoints[1][2];
	}
	return pt;
}

function getEventPoint(event) {
	var evX = event.clientX;
	var evY = event.clientY;
	return new Point2D(evX, evY);
}

function getCurrentEventPoint() {
	var posX = parseInt(theElement.style.left);
	var posY = parseInt(theElement.style.top);
	return new Point2D(posX, posY);
}

// The event handler function for grabbing the word
function grabber(event) {

// Set the global variable for the element to be moved

  theElement = event.currentTarget;

// Determine the position of the word to be grabbed,
//  first removing the units from left and top

  var posX = parseInt(theElement.style.left);
  var posY = parseInt(theElement.style.top);

// Compute the difference between where it is and
// where the mouse click occurred

  diffX = event.clientX - posX;
  diffY = event.clientY - posY;

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

  theElement.style.left = (event.clientX - diffX) + "px";
  theElement.style.top = (event.clientY - diffY) + "px";

// Prevent propagation of the event

  event.stopPropagation();
}  //** end of mover

// *********************************************************
// The event handler function for dropping the word

function dropper(event) {

// Unregister the event handlers for mouseup and mousemove
	var currentX = event.clientX;
	var currentY = event.clientY;

//	var currPos = getCurrentEventPoint();

	var currPos = new Point2D(currentX, currentY);
	var snapPoint = getGridPoint(currPos);
	snapPoint.x -= 400;
	snapPoint.y -= 300;
	theElement.style.left = snapPoint.x + "px";
	theElement.style.top = snapPoint.y + "py";

  document.removeEventListener("mouseup", dropper, true);
  document.removeEventListener("mousemove", mover, true);

// Prevent propagation of the event

  event.stopPropagation();
}  //** end of dropper


