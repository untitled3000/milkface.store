function RotateToMouse (object, defaultRotation, xMag, yMag) {

	this.width = window.innerWidth;
	this.height = window.innerHeight;
	var $this = this;

	this.play = function () {
		window.addEventListener( 'mousemove', animate);
	}

	this.stop = function () {
		window.removeEventListener( 'mousemove', animate);
	}

	function animate (event) {
		mouseX = event.clientX;
		mouseY = event.clientY;

		var xNorm = (mouseX-($this.width/2)) / ($this.width/2);
		var yNorm = (mouseY-($this.height/2)) / ($this.height/2);

		rotationY = xNorm * xMag;
		rotationX = yNorm * yMag;

		var newRotation = new THREE.Euler(
			defaultRotation.x + rotationX,
			defaultRotation.y + rotationY,
			defaultRotation.z
		);

		setRotation(object, newRotation);
	}

	function setRotation (object, angle) {
		object.setRotationFromEuler (
			angle
		);
	}
}
