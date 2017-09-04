function milkFaceScene (object, texture) {

		var $this = this;
		var milkFaceObject;
		var camera, scene, light, renderer;
		var width, height;
		var controls;
		var mouseX, mouseY;
		var animationRequest;
		var isMobile;

		var defaultMilkfaceRotation = new THREE.Euler(degrees2Rad(-2), degrees2Rad(44), 0);

		this.dom = document.createElement( 'div' );
		this.dom.className = "milkFaceContainer";

		init (object, texture);

		function init (object, texture) {

			renderer = new THREE.WebGLRenderer( { antialias: true,  alpha: true  } );
			renderer.setClearColor( 0xffffff, 0);
			renderer.setPixelRatio( window.devicePixelRatio );

			$this.dom.appendChild( renderer.domElement );

			setScene();
			setLight();
			setCamera();

			setMilkFace(object.milkface, texture.milkface);

			isMobile = isTouchDevice();
			if (isMobile) {
				controls = new THREE.DeviceOrientationControls( milkFaceObject );
			} else {
				controls = new RotationWithQuaternion(milkFaceObject, camera);
			}
		};

		function setCamera () {
			camera = new THREE.PerspectiveCamera(50, (window.innerWidth / window.innerHeight), 0.1, 10000 );
			camera.position.z = 9.5;
			camera.updateProjectionMatrix();
		};

		function setScene () {
			scene = new THREE.Scene();
		};

		function setLight () {
			light = new THREE.HemisphereLight();
			scene.add( light );
		}

		function setMilkFace ( object, texture ) {
			milkFaceObject = object;
			milkFaceObject.material = texture;
			scene.add( milkFaceObject );
		}

		function setRotation (object, angle) {
			object.setRotationFromEuler (
				angle
			);
		}

		function degrees2Rad(degrees) {
			return degrees * (Math.PI/180);
		}

		function rotateObject2Mouse ( event, object, xMag, yMag ) {
			mouseX = event.clientX;
			mouseY = event.clientY;

			var xNorm = (mouseX-(width/2)) / (width/2);
			var yNorm = (mouseY-(height/2)) / (height/2);

			rotationY = xNorm * xMag;
			rotationX = yNorm * yMag;

			var newRotation = new THREE.Euler(
				defaultMilkfaceRotation.x + rotationX,
				defaultMilkfaceRotation.y + rotationY,
				defaultMilkfaceRotation.z
			);

			setRotation(object, newRotation);
		}

		function rotateMilkFace2Mouse ( event ) {
			rotateObject2Mouse (event, milkFaceObject, 0.1, 0.01);
		}

		function stopRotate (rotateEvent, stopEvent) {
			window.removeEventListener( 'mousemove', rotateEvent);
			window.removeEventListener('mousedown', stopEvent);
		}

		function stopRotateMilkFace2Mouse () {
			if (controls.mouseOverObject) {
				stopRotate (rotateMilkFace2Mouse, stopRotateMilkFace2Mouse);
			}
		}

		function setSize ( newWidth, newHeight ) {
			width = newWidth;
			height = newHeight;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.setSize( width, height );
		};

		function setSizeToWindow () {
			setSize( window.innerWidth, window.innerHeight );
		}

		function animate() {
			parallax();
			renderer.render( scene, camera );

			//hacky. try to fix
			if (isMobile) {
				controls.update();
			}
			requestAnimationFrame( animate );
		}

		function parallax () {
			var node = document.getElementById("fullpage");
			var scroll_distance = node.getBoundingClientRect().top; //real offset top
			var page_height = scroll_distance/window.innerHeight
			camera.position.y = 10*(page_height);
		}

		function isTouchDevice(){
    		return typeof window.ontouchstart !== 'undefined';
		}

		this.play = function () {
			setSizeToWindow ();
			setRotation(milkFaceObject, defaultMilkfaceRotation);
			$($this.dom).show();
			controls.play();

			animationRequest = requestAnimationFrame( animate );

			window.addEventListener( 'resize', setSizeToWindow);

			if (!isMobile) {
				window.addEventListener( 'mousemove', rotateMilkFace2Mouse);
				window.addEventListener("mousedown", stopRotateMilkFace2Mouse);
			}
		};

		this.stop = function () {
			$($this.dom).hide();
			controls.stop();

			cancelAnimationFrame( animationRequest );

			window.removeEventListener( 'resize', setSizeToWindow);

			if (!isMobile){
				window.removeEventListener( 'mousemove', rotateMilkFace2Mouse);
				window.removeEventListener('mousedown', stopRotateMilkFace2Mouse);
			}
		}
}
