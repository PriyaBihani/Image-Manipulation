var containerElement = null,
	originalImageElement = null,
	canvas = null,
	image = null,
	sourceCanvas = null,
	sourceImage = null,
	options = {
		minWidth: 100,
		minHeight: 100,
		maxWidth: 600,
		maxHeight: 600,
		ratio: 1,
	};

function computeImageViewPort(image) {
	return {
		height:
			Math.abs(image.width * Math.sin((image.angle * Math.PI) / 180)) +
			Math.abs(image.height * Math.cos((image.angle * Math.PI) / 180)),
		width:
			Math.abs(image.height * Math.sin((image.angle * Math.PI) / 180)) +
			Math.abs(image.width * Math.cos((image.angle * Math.PI) / 180)),
	};
}

const initializeDom = (imageElement) => {
	// Container
	var mainContainerElement = document.createElement('div');
	mainContainerElement.className = 'darkroom-container';

	// Toolbar
	var toolbarElement = document.createElement('div');
	toolbarElement.className = 'darkroom-toolbar';
	mainContainerElement.appendChild(toolbarElement);

	// Viewport canvas
	var canvasContainerElement = document.createElement('div');
	canvasContainerElement.className = 'darkroom-image-container';
	var canvasElement = document.createElement('canvas');
	canvasContainerElement.appendChild(canvasElement);
	mainContainerElement.appendChild(canvasContainerElement);

	// Source canvas
	var sourceCanvasContainerElement = document.createElement('div');
	sourceCanvasContainerElement.className = 'darkroom-source-container';
	sourceCanvasContainerElement.style.display = 'none';
	var sourceCanvasElement = document.createElement('canvas');
	sourceCanvasContainerElement.appendChild(sourceCanvasElement);
	mainContainerElement.appendChild(sourceCanvasContainerElement);

	// Original image
	imageElement.parentNode.replaceChild(mainContainerElement, imageElement);
	imageElement.style.display = 'none';
	mainContainerElement.appendChild(imageElement);

	// Instanciate object from elements
	containerElement = mainContainerElement;
	originalImageElement = imageElement;

	// toolbar = new Darkroom.UI.Toolbar(toolbarElement);

	canvas = new fabric.Canvas(canvasElement, {
		selection: false,
		backgroundColor: '#ffff',
	});

	sourceCanvas = new fabric.Canvas(sourceCanvasElement, {
		selection: false,
		backgroundColor: '#ffff',
	});
};

const initializeImage = () => {
	sourceImage = new fabric.Image(originalImageElement, {
		// Some options to make the image static
		selectable: false,
		evented: false,
		lockMovementX: true,
		lockMovementY: true,
		lockRotation: true,
		lockScalingX: true,
		lockScalingY: true,
		lockUniScaling: true,
		hasControls: false,
		hasBorders: false,
	});

	sourceCanvas.add(sourceImage);

	// Adjust width or height according to specified ratio
	var viewport = computeImageViewPort(sourceImage);
	var canvasWidth = viewport.width;
	var canvasHeight = viewport.height;

	sourceCanvas.setWidth(canvasWidth);
	sourceCanvas.setHeight(canvasHeight);
	sourceCanvas.centerObject(sourceImage);
	sourceImage.setCoords();
	console.log(sourceImage);
};

const adjustImage = () => {
	var clone = new Image();
	clone.onload = function () {
		replaceCurrentImage(new fabric.Image(clone));
	};
	clone.src = sourceImage.toDataURL();
};

const replaceCurrentImage = (newImage) => {
	if (image) {
		image.remove();
	}

	image = newImage;
	image.selectable = false;

	// Adjust width or height according to specified ratio
	var viewport = computeImageViewPort(image);
	console.log(viewport);
	var canvasWidth = viewport.width;
	var canvasHeight = viewport.height;

	if (null !== options.ratio) {
		var canvasRatio = options.ratio;
		var currentRatio = canvasWidth / canvasHeight;

		if (currentRatio > canvasRatio) {
			canvasHeight = canvasWidth / canvasRatio;
		} else if (currentRatio < canvasRatio) {
			canvasWidth = canvasHeight * canvasRatio;
		}
	}

	console.log('working');
	// Then scale the image to fit into dimension limits
	var scaleMin = 1;
	var scaleMax = 1;
	var scaleX = 1;
	var scaleY = 1;

	if (null !== options.maxWidth && options.maxWidth < canvasWidth) {
		console.log('scaleX max');
		scaleX = options.maxWidth / canvasWidth;
	}
	if (null !== options.maxHeight && options.maxHeight < canvasHeight) {
		console.log('scaleY max');
		scaleY = options.maxHeight / canvasHeight;
	}
	scaleMin = Math.min(scaleX, scaleY);

	scaleX = 1;
	scaleY = 1;
	if (null !== options.minWidth && options.minWidth > canvasWidth) {
		console.log('scaleX');
		scaleX = options.minWidth / canvasWidth;
	}
	if (null !== options.minHeight && options.minHeight > canvasHeight) {
		console.log('scaleY');
		scaleY = options.minHeight / canvasHeight;
	}
	scaleMax = Math.max(scaleX, scaleY);

	var scale = scaleMax * scaleMin; // one should be equals to 1

	canvasWidth *= scale;
	canvasHeight *= scale;

	// Finally place the image in the center of the canvas
	console.log(canvas, image, scale);
	image.scaleX = 1 * scale;
	image.scaleY = 1 * scale;
	canvas.add(image);
	canvas.setWidth(canvasWidth);
	canvas.setHeight(canvasHeight);
	canvas.centerObject(image);
	image.setCoords();
};

const initialize = (element) => {
	var image = new Image();
	image.onload = function () {
		initializeDom(element);
		initializeImage();
		adjustImage();
	};
	image.src = element.src;
};

initialize(document.getElementById('img'));

var CropZone = fabric.util.createClass(fabric.Rect, {
	_render: function (ctx) {
		this.callSuper('_render', ctx);

		var canvas = ctx.canvas;
		var dashWidth = 7;

		// Set original scale
		var flipX = this.flipX ? -1 : 1;
		var flipY = this.flipY ? -1 : 1;
		var scaleX = flipX / this.scaleX;
		var scaleY = flipY / this.scaleY;

		ctx.scale(scaleX, scaleY);

		// Overlay rendering
		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		this._renderOverlay(ctx);

		// Set dashed borders
		if (ctx.setLineDash !== undefined) ctx.setLineDash([dashWidth, dashWidth]);
		else if (ctx.mozDash !== undefined) ctx.mozDash = [dashWidth, dashWidth];

		// First lines rendering with black
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
		this._renderBorders(ctx);
		this._renderGrid(ctx);

		// Re render lines in white
		ctx.lineDashOffset = dashWidth;
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
		this._renderBorders(ctx);
		this._renderGrid(ctx);

		// Reset scale
		ctx.scale(1 / scaleX, 1 / scaleY);
	},

	_renderOverlay: function (ctx) {
		var canvas = ctx.canvas;

		//
		//    x0    x1        x2      x3
		// y0 +------------------------+
		//    |\\\\\\\\\\\\\\\\\\\\\\\\|
		//    |\\\\\\\\\\\\\\\\\\\\\\\\|
		// y1 +------+---------+-------+
		//    |\\\\\\|         |\\\\\\\|
		//    |\\\\\\|    0    |\\\\\\\|
		//    |\\\\\\|         |\\\\\\\|
		// y2 +------+---------+-------+
		//    |\\\\\\\\\\\\\\\\\\\\\\\\|
		//    |\\\\\\\\\\\\\\\\\\\\\\\\|
		// y3 +------------------------+
		//

		var x0 = Math.ceil(-this.getWidth() / 2 - this.getLeft());
		var x1 = Math.ceil(-this.getWidth() / 2);
		var x2 = Math.ceil(this.getWidth() / 2);
		var x3 = Math.ceil(
			this.getWidth() / 2 + (canvas.width - this.getWidth() - this.getLeft())
		);

		var y0 = Math.ceil(-this.getHeight() / 2 - this.getTop());
		var y1 = Math.ceil(-this.getHeight() / 2);
		var y2 = Math.ceil(this.getHeight() / 2);
		var y3 = Math.ceil(
			this.getHeight() / 2 + (canvas.height - this.getHeight() - this.getTop())
		);

		ctx.beginPath();

		// Draw outer rectangle.
		// Numbers are +/-1 so that overlay edges don't get blurry.
		ctx.moveTo(x0 - 1, y0 - 1);
		ctx.lineTo(x3 + 1, y0 - 1);
		ctx.lineTo(x3 + 1, y3 + 1);
		ctx.lineTo(x0 - 1, y3 - 1);
		ctx.lineTo(x0 - 1, y0 - 1);
		ctx.closePath();

		// Draw inner rectangle.
		ctx.moveTo(x1, y1);
		ctx.lineTo(x1, y2);
		ctx.lineTo(x2, y2);
		ctx.lineTo(x2, y1);
		ctx.lineTo(x1, y1);

		ctx.closePath();
		ctx.fill();
	},

	_renderBorders: function (ctx) {
		ctx.beginPath();
		ctx.moveTo(-this.getWidth() / 2, -this.getHeight() / 2); // upper left
		ctx.lineTo(this.getWidth() / 2, -this.getHeight() / 2); // upper right
		ctx.lineTo(this.getWidth() / 2, this.getHeight() / 2); // down right
		ctx.lineTo(-this.getWidth() / 2, this.getHeight() / 2); // down left
		ctx.lineTo(-this.getWidth() / 2, -this.getHeight() / 2); // upper left
		ctx.stroke();
	},

	_renderGrid: function (ctx) {
		// Vertical lines
		ctx.beginPath();
		ctx.moveTo(
			-this.getWidth() / 2 + (1 / 3) * this.getWidth(),
			-this.getHeight() / 2
		);
		ctx.lineTo(
			-this.getWidth() / 2 + (1 / 3) * this.getWidth(),
			this.getHeight() / 2
		);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(
			-this.getWidth() / 2 + (2 / 3) * this.getWidth(),
			-this.getHeight() / 2
		);
		ctx.lineTo(
			-this.getWidth() / 2 + (2 / 3) * this.getWidth(),
			this.getHeight() / 2
		);
		ctx.stroke();
		// Horizontal lines
		ctx.beginPath();
		ctx.moveTo(
			-this.getWidth() / 2,
			-this.getHeight() / 2 + (1 / 3) * this.getHeight()
		);
		ctx.lineTo(
			this.getWidth() / 2,
			-this.getHeight() / 2 + (1 / 3) * this.getHeight()
		);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(
			-this.getWidth() / 2,
			-this.getHeight() / 2 + (2 / 3) * this.getHeight()
		);
		ctx.lineTo(
			this.getWidth() / 2,
			-this.getHeight() / 2 + (2 / 3) * this.getHeight()
		);
		ctx.stroke();
	},
});

const cropButton = document.getElementById('crop');
const okButton = document.getElementById('ok');
const cancelButton = document.getElementById('cancel');

var cropZone;

const hasFocus = () => {
	return cropZone !== undefined;
};

const toggleCrop = () => {
	if (!hasFocus()) requireFocus();
	else releaseFocus();
};

// Create the crop zone
const requireFocus = () => {
	console.log('toggleCrop');

	cropZone = new CropZone({
		fill: 'transparent',
		hasBorders: false,
		originX: 'left',
		originY: 'top',
		//stroke: '#444',
		//strokeDashArray: [5, 5],
		//borderColor: '#444',
		cornerColor: '#444',
		cornerSize: 8,
		transparentCorners: false,
		lockRotation: true,
		hasRotatingPoint: false,
	});

	if (null !== options.ratio) {
		cropZone.set('lockUniScaling', true);
	}

	canvas.add(cropZone);
	canvas.defaultCursor = 'crosshair';

	cropButton.active(true);
	okButton.hide(false);
	cancelButton.hide(false);
};

// Remove the crop zone
const releaseFocus = () => {
	if (undefined === cropZone) return;

	cropZone.remove();
	cropZone = undefined;

	cropButton.active(false);
	okButton.hide(true);
	cancelButton.hide(true);

	canvas.defaultCursor = 'default';

	// dispatchEvent('crop:update');
};

// const cropCurrentZone = () {
//     if (!hasFocus())
//       return;

//     // Avoid croping empty zone
//     if (cropZone.width < 1 && cropZone.height < 1)
//       return;

//     var image = image;

//     // Compute crop zone dimensions
//     var top = cropZone.getTop() - image.getTop();
//     var left = cropZone.getLeft() - image.getLeft();
//     var width = cropZone.getWidth();
//     var height = cropZone.getHeight();

//     // Adjust dimensions to image only
//     if (top < 0) {
//       height += top;
//       top = 0;
//     }

//     if (left < 0) {
//       width += left;
//       left = 0;
//     }

// // Apply crop transformation.
// // Make sure to use relative dimension since the crop will be applied
// // on the source image.
// // applyTransformation(new Crop({
// //   top: top / image.getHeight(),
// //   left: left / image.getWidth(),
// //   width: width / image.getWidth(),
// //   height: height / image.getHeight(),
// // }));
//   }

// Avoid crop zone to go beyond the canvas edges
const onObjectMoving = (event) => {
	if (!this.hasFocus()) {
		return;
	}

	var currentObject = event.target;
	if (currentObject !== this.cropZone) return;

	var x = currentObject.getLeft(),
		y = currentObject.getTop();
	var w = currentObject.getWidth(),
		h = currentObject.getHeight();
	var maxX = canvas.getWidth() - w;
	var maxY = canvas.getHeight() - h;

	if (x < 0) currentObject.set('left', 0);
	if (y < 0) currentObject.set('top', 0);
	if (x > maxX) currentObject.set('left', maxX);
	if (y > maxY) currentObject.set('top', maxY);

	// this.darkroom.dispatchEvent('crop:update');
};

// Buttons click
cropButton.addEventListener('click', toggleCrop);
okButton.addEventListener('click', cropCurrentZone);
cancelButton.addEventListener('click', releaseFocus);

// Canvas events
canvas.on('mouse:down', onMouseDown);
canvas.on('mouse:move', onMouseMove);
canvas.on('mouse:up', onMouseUp);
canvas.on('object:moving', onObjectMoving);
canvas.on('object:scaling', onObjectScaling);

fabric.util.addListener(fabric.document, 'keydown', onKeyDown);
fabric.util.addListener(fabric.document, 'keyup', onKeyUp);
