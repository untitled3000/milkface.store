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
		resizeFont();

		window.addEventListener("resize", resetZoom);
		window.addEventListener("resize", resizeFont);
		for (var i = 0; i < imageIcons.length; i++){
			imageIcons[i].addEventListener("click", updateSelectedImage);
		}
	}

	this.stop = function () {
		window.removeEventListener( 'resize', resetZoom);
		window.removeEventListener( 'resize', resizeFont);
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

	function resizeFont (){
		var text = $(".photoText");
		var area = text.width() * text.height();
		var fontSize = Math.sqrt(area)/20;
		text.css({
			fontSize: fontSize
		});

		var buyBox2 = $("#buy2");
		var buyBox2width = Math.sqrt(area) / 3.4;
		var buyBox2FontSize = Math.sqrt(area) / 15;
		var buyBox2LineHeight = Math.sqrt(area) / 11.7 + 'px';
		var buyBox2Padding = buyBox2BorderRadius = Math.sqrt(area) / 31;
		buyBox2.css({
			width: buyBox2width,
			fontSize: buyBox2FontSize,
			lineHeight: buyBox2LineHeight,
			padding: buyBox2Padding,
			borderRadius: buyBox2BorderRadius
		});

		var footer = $(".footer");
		if ((window.innerHeight * 1280/1525) > window.innerWidth - 130) {
			footerFontSize = 2.2 * (window.innerWidth - 130) / 100;
		} else {
			footerFontSize = 2.2 * (window.innerHeight * 1280/1525) / 100;
		}

		footer.css({
			fontSize: footerFontSize
		});
	}
}
