function milkFaceScene (object, texture) {

		var $this = this;
		var milkFaceObject;
		var camera, scene, light, renderer;
		var width, height;
		var startControls, spinControls;
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

			spinControls = new RotationWithQuaternion(milkFaceObject, camera);
			isMobile = isTouchDevice();
			startControls = isMobile ?
				new DeviceOrientationControls( milkFaceObject ) :
				new RotateToMouse(milkFaceObject, defaultMilkfaceRotation, 0.1, 0.01);
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

		function stopIntroAnimation () {
			if (spinControls.mouseOverObject) {
				startControls.stop();

				window.removeEventListener('mousedown', stopIntroAnimation);
				window.removeEventListener('touchstart', stopIntroAnimation);
			}
		}

		function setSize ( newWidth, newHeight ) {
			width = startControls.width = spinControls.width = newWidth;
			height = startControls.height = spinControls.height = newHeight;

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
			startControls.play();
			spinControls.play();

			animationRequest = requestAnimationFrame( animate );

			window.addEventListener( 'resize', setSizeToWindow);

			window.addEventListener("mousedown", stopIntroAnimation);
			window.addEventListener("touchstart", stopIntroAnimation);
		};

		this.stop = function () {
			$($this.dom).hide();
			startControls.stop();
			spinControls.stop();

			cancelAnimationFrame( animationRequest );

			window.removeEventListener( 'resize', setSizeToWindow);

			window.removeEventListener('mousedown', stopIntroAnimation);
			window.removeEventListener('touchstart', stopIntroAnimation);
		}
}
