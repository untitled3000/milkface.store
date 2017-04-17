
function milkFaceScene () {

		var loader;
		var camera, scene, renderer;
		var width, height;
		var controls;
		var mouseX, mouseY;
		var milkFaceObject;

		this.dom = document.createElement( 'div' );

		this.load = function ( json ) {
			console.log (json);

			var loader = new THREE.ObjectLoader();

			renderer = new THREE.WebGLRenderer( { antialias: true,  alpha: true  } );
			renderer.setClearColor( 0xffffff, 0);
			renderer.setPixelRatio( window.devicePixelRatio );

			if ( json.project.shadows ) {
				renderer.shadowMap.enabled = true;
			}

			this.dom.appendChild( renderer.domElement );

			setScene( loader.parse( json.scene ) );
			setCamera( loader.parse( json.camera ) );

			setMilkFace(scene.children[0].children[0]);
			addEnvMap( milkFaceObject);

    		controls = new THREE.OrbitControls(camera, renderer.domElement);
			controls.enableZoom = false;
			controls.enablePan = false;
		};

		function setCamera ( value ) {
			camera = value;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		};

		function setScene ( value ) {
			scene = value;
		};

		function setMilkFace ( value ) {
			milkFaceObject = value;
		}

		function addEnvMap ( object ){
			var enviorment = new THREE.CubeTextureLoader()
				.setPath( 'textures/cube_map/' )
				.load( [ 'right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ] );

			object.material.envMap = enviorment;
		};

		function rotateObject ( event, object, xMag, yMag ) {
			mouseX = event.clientX;
			mouseY = event.clientY;

			var xNorm = (mouseX-(width/2)) / (width/2);
			var yNorm = (mouseY-(height/2)) / (height/2);

			object.rotation.y = xNorm * xMag;
			object.rotation.x = yNorm * yMag;
		}

		function rotateMilkFace ( event ) {
			rotateObject (event, milkFaceObject, 0.05, 0.01);
		}

		function stopRotate (rotateEvent, stopEvent) {
			window.removeEventListener( 'mousemove', rotateEvent);
			window.removeEventListener('mousedown', stopEvent);
		}

		function stopRotateMilkFace () {
			stopRotate (rotateMilkFace, stopRotateMilkFace);
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

		var request;
		function animate() {
			request = requestAnimationFrame( animate );
			renderer.render( scene, camera );
		}

		this.play = function () {
			setSizeToWindow ();

			request = requestAnimationFrame( animate );
			window.addEventListener( 'resize', setSizeToWindow);
			window.addEventListener( 'mousemove', rotateMilkFace);
			window.addEventListener("mousedown", stopRotateMilkFace);
		};

		this.stop = function () {
			cancelAnimationFrame( request );
			window.removeEventListener( 'resize', setSizeToWindow);
			window.removeEventListener( 'mousemove', rotateMilkFace);
			window.removeEventListener('mousedown', stopRotateMilkFace);
		}
}
