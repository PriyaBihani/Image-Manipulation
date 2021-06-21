var crop = tinycrop.create({
	parent: '#mount',
	image: 'images/portrait.jpg',
	bounds: {
		width: '100%',
		height: '50%',
	},
	// backgroundColors: ['#fff', '#f0f0f0'],
	selection: {
		// color: 'red',
		// activeColor: 'blue',
		// aspectRatio: 4 / 3,
		// minWidth: 200,
		// minHeight: 300
		// width: 400,
		// height: 500,
		// x: 100,
		// y: 500
	},
});

function getId(id) {
	return document.getElementById(id);
}

var inputX = getId('input-x');
var inputY = getId('input-y');
var inputWidth = getId('input-width');
var inputHeight = getId('input-height');

var buttonSwapImage = getId('swap-image');

buttonSwapImage.addEventListener('click', function (e) {
	e.preventDefault();
	crop.setImage(
		crop.getImage().src !== 'images/landscape2.jpg'
			? 'images/landscape2.jpg'
			: 'images/portrait.jpg'
	);
});

var buttonAspect16By9 = getId('aspect-16-by-9');
buttonAspect16By9.addEventListener('click', function (e) {
	e.preventDefault();
	crop.setAspectRatio(16 / 9);
});

var buttonAspect1By1 = getId('aspect-square');
buttonAspect1By1.addEventListener('click', function (e) {
	e.preventDefault();
	crop.setAspectRatio(1);
});

var buttonAspectFree = getId('aspect-free');
buttonAspectFree.addEventListener('click', function (e) {
	e.preventDefault();
	crop.setAspectRatio(null);
});

var buttonContainerFitImage = getId('container-fit-to-image');
buttonContainerFitImage.addEventListener('click', function (e) {
	e.preventDefault();
	crop.setBounds({ width: '100%', height: 'auto' });
});

var buttonContainerSquare = getId('container-square');
buttonContainerSquare.addEventListener('click', function (e) {
	e.preventDefault();
	crop.setBounds({ width: '100%', height: '100%' });
});

var buttonContainer2By1 = getId('container-2-by-1');
buttonContainer2By1.addEventListener('click', function (e) {
	e.preventDefault();
	crop.setBounds({ width: '100%', height: '50%' });
});

var backgroundColorPreset = 0;

var buttonChangeBackgroundColors = getId('change-background-colors');
buttonChangeBackgroundColors.addEventListener('click', function (e) {
	e.preventDefault();
	console.log('change background color');
	backgroundColorPreset = (backgroundColorPreset + 1) % 4;
	switch (backgroundColorPreset) {
		case 0:
			crop.setBackgroundColors(['#ffffff', '#f0f0f0']);
			break;
		case 1:
			crop.setBackgroundColors(['#000000', '#202020']);
			break;
		case 2:
			crop.setBackgroundColors(['#38f']);
			break;
		case 3:
			crop.setBackgroundColors(null);
			break;
	}
});

function setInputsFromRegion(region) {
	inputX.value = region.x;
	inputY.value = region.y;
	inputWidth.value = region.width;
	inputHeight.value = region.height;
}

crop
	.on('start', function (region) {
		setInputsFromRegion(region);
	})
	.on('move', function (region) {
		setInputsFromRegion(region);
	})
	.on('resize', function (region) {
		setInputsFromRegion(region);
	})
	.on('change', function (region) {
		setInputsFromRegion(region);
	})
	.on('end', function (region) {
		setInputsFromRegion(region);
	});
