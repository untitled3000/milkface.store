function RotationWithQuaternion (object, camera) {

	var mouseDown = false;
	var rotateStartPoint = new THREE.Vector3(0, 0, 1);
	var rotateEndPoint = new THREE.Vector3(0, 0, 1);

	var curQuaternion;
	var rotationSpeed = 2;

	var deltaX = deltaY = 0;
	var drag = 0.975;
	var minDelta = 0.05;

	var request;
	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2(-10,-10); // have cursor default on load
	var startPoint = new THREE.Vector2(0, 0);

	var $this = this;
	this.mouseOverObject = false;
	this.width = window.innerWidth;
	this.height = window.innerHeight;

	this.play = function () {
		request = requestAnimationFrame(animate);

		document.addEventListener('mousedown', onDocumentMouseDown, false);
		document.addEventListener('touchstart', onDocumentTouchStart, false);

		document.addEventListener('mousemove', onDocumentMouseMove, false);
	}

	this.stop = function () {
		deltaX = deltaY = 0;
		rotateStartPoint = new THREE.Vector3(0, 0, 1);
		cancelAnimationFrame( request );

		document.removeEventListener('mousedown', onDocumentMouseDown, false);
		document.removeEventListener('touchstart', onDocumentTouchStart, false);

		document.removeEventListener('mousemove', onDocumentMouseMove, false);
	}

	function getCurrentPosition(event){
		if (event.touches && event.touches.length > 0){
			return new THREE.Vector2(
				event.touches[ 0 ].pageX,
				event.touches[ 0 ].pageY
			);
		}

		return new THREE.Vector2(
			event.clientX,
			event.clientY
		);
	}

	function onDocumentMouseDown(event){
		event.preventDefault();

		if ($this.mouseOverObject){
			document.addEventListener('mousemove', onDocumentMouseMoveIfMouseDown, false);
			document.addEventListener('touchmove', onDocumentMouseMoveIfMouseDown, false);
			document.addEventListener('mouseup', onDocumentMouseUp, false);
			document.addEventListener('touchend', onDocumentMouseUp, false);

			mouseDown = true;
			deltaX /= 15;
			deltaY /= 15;
			startPoint = getCurrentPosition(event);
			rotateStartPoint = rotateEndPoint = projectOnTrackball(0, 0);
		}
	}

	function onDocumentTouchStart (event) {
		onDocumentMouseMove (event);
		$this.mouseOverObject = getRaycast();
		onDocumentMouseDown(event);
	}

	function onDocumentMouseMove (event) {
		var currentPosition = getCurrentPosition(event);
		mouse.x =   (( currentPosition.x / $this.width ) * 2 - 1);
		mouse.y = - (( currentPosition.y / $this.height ) * 2 - 1);
	}

	function onDocumentMouseMoveIfMouseDown(event){
		var currentPosition = getCurrentPosition(event);

		deltaX = currentPosition.x - startPoint.x;
		deltaY = currentPosition.y - startPoint.y;

		handleRotation();

		startPoint = currentPosition;
	}

	function onDocumentMouseUp(event){
		mouseDown = false;

		document.removeEventListener('mousemove', onDocumentMouseMoveIfMouseDown, false);
		document.removeEventListener('touchmove', onDocumentMouseMoveIfMouseDown, false);
		document.removeEventListener('mouseup', onDocumentMouseUp, false);
		document.removeEventListener('touchend', onDocumentMouseUp, false);
	}

	function projectOnTrackball(touchX, touchY){
		var mouseOnBall = new THREE.Vector3();

		mouseOnBall.set(
			clamp(touchX / ($this.width/2), -1, 1), clamp(-touchY / ($this.height/2), -1, 1),
			0.0
		);

		var length = mouseOnBall.length();

		if (length > 1.0){
			mouseOnBall.normalize();
		} else {
			mouseOnBall.z = Math.sqrt(1.0 - length * length);
		}

		return mouseOnBall;
	}

	function rotateMatrix(rotateStart, rotateEnd){
		var axis = new THREE.Vector3();
		var quaternion = new THREE.Quaternion();
		var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

		if (angle){
			axis.crossVectors(rotateStart, rotateEnd).normalize();
			angle *= rotationSpeed;
			quaternion.setFromAxisAngle(axis, angle);
		}

		return quaternion;
	}

	function clamp(value, min, max){
		return Math.min(Math.max(value, min), max);
	}

	function animate(){
		slowRotation();
		$this.mouseOverObject = getRaycast();
		updateCursor();

		request = requestAnimationFrame(animate);
	}

	function slowRotation(){
		if (!mouseDown){
			if (Math.abs(deltaX) > minDelta){
				deltaX *= drag;
			} else {
				deltaX = 0;
			}

			if (Math.abs(deltaY) > minDelta){
				deltaY *= drag;
			} else {
				deltaY = 0;
			}

			handleRotation();
		}
	}

	function handleRotation(){
		rotateEndPoint = projectOnTrackball(deltaX, deltaY);

		var rotateQuaternion = rotateMatrix(rotateStartPoint, rotateEndPoint);
		curQuaternion = object.quaternion;
		curQuaternion.multiplyQuaternions(rotateQuaternion, curQuaternion);
		curQuaternion.normalize();
		object.setRotationFromQuaternion(curQuaternion);

		rotateEndPoint = rotateStartPoint;
	}

	function getRaycast (){
		raycaster.setFromCamera( mouse, camera );
		return (raycaster.intersectObject(object).length > 0);
	}

	function updateCursor () {
		if ($this.mouseOverObject) {
			document.body.style.cursor = 'pointer';
		} else {
			document.body.style.cursor = 'default';
		}
	}
}
