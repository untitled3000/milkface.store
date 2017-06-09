function milkFaceScene () {

		var $this = this;
		var milkFaceObject;
		var loader;
		var camera, scene, renderer;
		var width, height;
		var controls;
		var mouseX, mouseY;
		var request;
		var defaultRotation = new THREE.Euler(degrees2Rad(-2), degrees2Rad(44), 0);

		this.dom = document.createElement( 'div' );
		this.dom.className = "milkFaceContainer"

		this.load = function ( json ) {
			var loader = new THREE.ObjectLoader();

			renderer = new THREE.WebGLRenderer( { antialias: true,  alpha: true  } );
			renderer.setClearColor( 0xffffff, 0);
			renderer.setPixelRatio( window.devicePixelRatio );

			this.dom.appendChild( renderer.domElement );

			setScene( loader.parse( json.scene ) );
			setCamera( loader.parse( json.camera ) );

			setMilkFace(scene.children[0].children[0]);
			addEnvMap( milkFaceObject);

			controls = new RotationWithQuaternion(milkFaceObject, camera);
		};

		function setCamera ( value ) {
			//camera = value;
			//camera.aspect = width / height;

			camera = new THREE.PerspectiveCamera(50, (window.innerWidth / window.innerHeight), 0.1, 10000 );
			camera.position.z = 9.5;
			camera.updateProjectionMatrix();
		};

		function setScene ( value ) {
			scene = value;
		};

		function setMilkFace ( value ) {
			milkFaceObject = value;
		}

		function setRotation (object, angle) {
			object.setRotationFromEuler (
				angle
			);
		}

		function degrees2Rad(degrees) {
			return degrees * (Math.PI/180);
		}

		function addEnvMap ( object ){
			var enviorment = new THREE.CubeTextureLoader()
				.setPath( 'textures/cube_map/' )
				.load( [ 'right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ] );

			object.material.envMap = enviorment;
		};

		function rotateObject2Mouse ( event, object, xMag, yMag ) {
			mouseX = event.clientX;
			mouseY = event.clientY;

			var xNorm = (mouseX-(width/2)) / (width/2);
			var yNorm = (mouseY-(height/2)) / (height/2);

			rotationY = xNorm * xMag;
			rotationX = yNorm * yMag;

			var newRotation = new THREE.Euler(
				defaultRotation.x + rotationX,
				defaultRotation.y + rotationY,
				defaultRotation.z
			);

			setRotation(milkFaceObject, newRotation);
		}

		function rotateMilkFace2Mouse ( event ) {
			rotateObject2Mouse (event, milkFaceObject, 0.05, 0.01);
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
			parallax(milkFaceObject);
			request = requestAnimationFrame( animate );
			renderer.render( scene, camera );
		}

		function parallax (object) {
			var node = document.getElementById("fullpage");
			var scroll_distance = node.getBoundingClientRect().top; //real offset top
			var page_height = -scroll_distance/window.innerHeight
			object.position.y = 10*(page_height);

			// fade effect
			if (page_height > 0.75){
				$this.dom.style.opacity = (4 * (1 - page_height));
			}
		}

		this.play = function () {
			setSizeToWindow ();
			$($this.dom).show();
			controls.play();
			setRotation(milkFaceObject, defaultRotation);

			request = requestAnimationFrame( animate );
			window.addEventListener( 'resize', setSizeToWindow);
			window.addEventListener( 'mousemove', rotateMilkFace2Mouse);
			window.addEventListener("mousedown", stopRotateMilkFace2Mouse);
		};

		this.stop = function () {
			$($this.dom).hide();
			controls.stop();

			cancelAnimationFrame( request );
			window.removeEventListener( 'resize', setSizeToWindow);
			window.removeEventListener( 'mousemove', rotateMilkFace2Mouse);
			window.removeEventListener('mousedown', stopRotateMilkFace2Mouse);
		}
}
