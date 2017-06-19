var photos = [
	"./images/photos/01.png",
    "./images/photos/02.png",
    "./images/photos/03.png",
    "./images/photos/04.png",
    "./images/photos/05.png"
];

function milkFacePhotos (parent) {

	var selectedSpan, selectedImage;
	var imageIcons = [];

	createImageZoom ();
	createImageIcons ();

	this.play = function () {
		resetZoom();

		window.addEventListener("resize", resetZoom);
		for (var i = 0; i < imageIcons.length; i++){
			imageIcons[i].addEventListener("click", updateSelectedImage);
		}
	}

	this.stop = function () {
		window.removeEventListener( 'resize', resetZoom);
		for (var i = 0; i < imageIcons.length; i++){
			imageIcons[i].removeEventListener("click", updateSelectedImage);
		}
	}

	function createImageZoom () {
		selectedSpan = document.createElement("SPAN");
		selectedSpan.className = "zoom";
		parent.append (selectedSpan);

		selectedImage = document.createElement("IMG");
		selectedImage.src = photos[0];
		selectedImage.className = "selectedImage";
	    selectedSpan.append( selectedImage );

		var selectedParagraph = document.createElement("P");
		selectedParagraph.innerHTML = "Hover";
		selectedSpan.append(selectedParagraph);

		var zoomIcon = document.createElement("IMG");
		zoomIcon.src = "./images/icon.png";
		zoomIcon.className = "zoomIcon";
		selectedSpan.append(zoomIcon);
	}

	function createImageIcons () {
		var previewImageContainer = document.createElement("DIV");
		parent.append( previewImageContainer);

		for (var i = 0; i < photos.length; i++){
			var previewImage = createImageIcon(photos[i]);
			imageIcons [i] = previewImage;
			previewImageContainer.append( previewImage );
		}
	}

	function createImageIcon (url){
		var previewImage = document.createElement("IMG");
		previewImage.src = url;
		previewImage.className = "previewImage";
		return previewImage;
	}

	function updateSelectedImage (event) {
		selectedImage.src = event.target.src;
		resetZoom();
	}

	function resetZoom () {
		removeZoom();
		setZoom();
	}

	function setZoom(){
		var magnification = (selectedImage.width / selectedImage.naturalWidth) * 2.5;
		$(selectedSpan).zoom({
			magnify : magnification
		});
	}

	function removeZoom (){
		$(selectedSpan).trigger('zoom.destroy'); // remove zoom
	}
}
