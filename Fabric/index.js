// var containerElement = null,
// 	originalImageElement = null,
// 	canvas = null,
// 	image = null,
// 	sourceCanvas = null,
// 	sourceImage = null,
// 	options = {
// 		minWidth: 100,
// 		minHeight: 100,
// 		maxWidth: 600,
// 		maxHeight: 600,
// 		ratio: 1.5,
// 	};

// function computeImageViewPort(image) {
// 	return {
// 		height:
// 			Math.abs(image.width * Math.sin((image.angle * Math.PI) / 180)) +
// 			Math.abs(image.height * Math.cos((image.angle * Math.PI) / 180)),
// 		width:
// 			Math.abs(image.height * Math.sin((image.angle * Math.PI) / 180)) +
// 			Math.abs(image.width * Math.cos((image.angle * Math.PI) / 180)),
// 	};
// }

// const initializeDom = (imageElement) => {
// 	// Container
// 	var mainContainerElement = document.createElement('div');
// 	mainContainerElement.className = 'darkroom-container';

// 	// Toolbar
// 	var toolbarElement = document.createElement('div');
// 	toolbarElement.className = 'darkroom-toolbar';
// 	mainContainerElement.appendChild(toolbarElement);

// 	// Viewport canvas
// 	var canvasContainerElement = document.createElement('div');
// 	canvasContainerElement.className = 'darkroom-image-container';
// 	var canvasElement = document.createElement('canvas');
// 	canvasContainerElement.appendChild(canvasElement);
// 	mainContainerElement.appendChild(canvasContainerElement);

// 	// Source canvas
// 	var sourceCanvasContainerElement = document.createElement('div');
// 	sourceCanvasContainerElement.className = 'darkroom-source-container';
// 	sourceCanvasContainerElement.style.display = 'none';
// 	var sourceCanvasElement = document.createElement('canvas');
// 	sourceCanvasContainerElement.appendChild(sourceCanvasElement);
// 	mainContainerElement.appendChild(sourceCanvasContainerElement);

// 	// Original image
// 	imageElement.parentNode.replaceChild(mainContainerElement, imageElement);
// 	imageElement.style.display = 'none';
// 	mainContainerElement.appendChild(imageElement);

// 	// Instanciate object from elements
// 	containerElement = mainContainerElement;
// 	originalImageElement = imageElement;

// 	// toolbar = new Darkroom.UI.Toolbar(toolbarElement);

// 	canvas = new fabric.Canvas(canvasElement, {
// 		selection: false,
// 		backgroundColor: '#ffff',
// 	});

// 	sourceCanvas = new fabric.Canvas(sourceCanvasElement, {
// 		selection: false,
// 		backgroundColor: '#ffff',
// 	});

// 	// Canvas events
// 	// canvas.on('mouse:down', onMouseDown);
// 	// canvas.on('mouse:move', onMouseMove);
// 	// canvas.on('mouse:up', onMouseUp);
// 	// canvas.on('object:moving', onObjectMoving);
// 	// canvas.on('object:scaling', onObjectScaling);
// };

// const initializeImage = () => {
// 	sourceImage = new fabric.Image(originalImageElement, {
// 		// Some options to make the image static
// 		selectable: false,
// 		evented: false,
// 		lockMovementX: true,
// 		lockMovementY: true,
// 		lockRotation: true,
// 		lockScalingX: true,
// 		lockScalingY: true,
// 		lockUniScaling: true,
// 		hasControls: false,
// 		hasBorders: false,
// 	});

// 	sourceCanvas.add(sourceImage);

// 	// Adjust width or height according to specified ratio
// 	var viewport = computeImageViewPort(sourceImage);
// 	var canvasWidth = viewport.width;
// 	var canvasHeight = viewport.height;

// 	sourceCanvas.setWidth(canvasWidth);
// 	sourceCanvas.setHeight(canvasHeight);
// 	sourceCanvas.centerObject(sourceImage);
// 	sourceImage.setCoords();
// };

// const adjustImage = () => {
// 	var clone = new Image();
// 	clone.onload = function () {
// 		replaceCurrentImage(new fabric.Image(clone));
// 	};
// 	clone.src = sourceImage.toDataURL();
// };

// const replaceCurrentImage = (newImage) => {
// 	if (image) {
// 		image.remove();
// 	}

// 	image = newImage;
// 	image.selectable = false;

// 	// Adjust width or height according to specified ratio
// 	var viewport = computeImageViewPort(image);
// 	console.log(viewport);
// 	var canvasWidth = viewport.width;
// 	var canvasHeight = viewport.height;

// 	if (null !== options.ratio) {
// 		var canvasRatio = options.ratio;
// 		var currentRatio = canvasWidth / canvasHeight;

// 		if (currentRatio > canvasRatio) {
// 			canvasHeight = canvasWidth / canvasRatio;
// 		} else if (currentRatio < canvasRatio) {
// 			canvasWidth = canvasHeight * canvasRatio;
// 		}
// 	}

// 	console.log('working');
// 	// Then scale the image to fit into dimension limits
// 	var scaleMin = 1;
// 	var scaleMax = 1;
// 	var scaleX = 1;
// 	var scaleY = 1;

// 	if (null !== options.maxWidth && options.maxWidth < canvasWidth) {
// 		console.log('scaleX max');
// 		scaleX = options.maxWidth / canvasWidth;
// 	}
// 	if (null !== options.maxHeight && options.maxHeight < canvasHeight) {
// 		console.log('scaleY max');
// 		scaleY = options.maxHeight / canvasHeight;
// 	}
// 	scaleMin = Math.min(scaleX, scaleY);

// 	scaleX = 1;
// 	scaleY = 1;
// 	if (null !== options.minWidth && options.minWidth > canvasWidth) {
// 		console.log('scaleX');
// 		scaleX = options.minWidth / canvasWidth;
// 	}
// 	if (null !== options.minHeight && options.minHeight > canvasHeight) {
// 		console.log('scaleY');
// 		scaleY = options.minHeight / canvasHeight;
// 	}
// 	scaleMax = Math.max(scaleX, scaleY);

// 	var scale = scaleMax * scaleMin; // one should be equals to 1

// 	canvasWidth *= scale;
// 	canvasHeight *= scale;

// 	// Finally place the image in the center of the canvas
// 	console.log(canvas, image, scale);
// 	image.scaleX = 1 * scale;
// 	image.scaleY = 1 * scale;
// 	canvas.add(image);
// 	canvas.setWidth(canvasWidth);
// 	canvas.setHeight(canvasHeight);
// 	canvas.centerObject(image);
// 	image.setCoords();
// };

// const initialize = (element) => {
// 	var image = new Image();
// 	image.onload = function () {
// 		initializeDom(element);
// 		initializeImage();
// 		adjustImage();
// 	};
// 	image.src = element.src;
// };

// initialize(document.getElementById('img'));

const img = document.getElementById('img');
const cropButton = document.getElementById('crop');
const okButton = document.getElementById('ok');
const cancelButton = document.getElementById('cancel');

const toggleCrop = () => {
	img.style.display = 'none';
	var crop = tinycrop.create({
		parent: '#mount',
		image: 'domokun-big.jpg',
		bounds: {
			width: '100%',
		},
		// backgroundColors: ['#fff', '#f0f0f0'],
		selection: {
			// color: 'red',
			// activeColor: 'blue',
			// aspectRatio: 4 / 3,
			minWidth: 200,
			minHeight: 300,
			// width: 400,
			// height: 500,
			// x: 100,
			// y: 500
		},
	});
	console.log(crop);
};

// Buttons click
cropButton.addEventListener('click', toggleCrop);
// okButton.addEventListener('click', cropCurrentZone);
// cancelButton.addEventListener('click', releaseFocus);

// fabric.util.addListener(fabric.document, 'keydown', onKeyDown);
// fabric.util.addListener(fabric.document, 'keyup', onKeyUp);
