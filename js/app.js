
function milkFacePlayer () {

		var loader;
		var camera, scene, renderer;
		var width, height;
		var milkFaceObject;
		var controls;

		this.dom = document.createElement( 'div' );

		this.load = function ( json ) {
			console.log (json);

			var loader = new THREE.ObjectLoader();

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setClearColor( 0x000000 );
			renderer.setPixelRatio( window.devicePixelRatio );

			if ( json.project.shadows ) {
				renderer.shadowMap.enabled = true;
			}

			this.dom.appendChild( renderer.domElement );

			this.setScene( loader.parse( json.scene ) );
			this.setCamera( loader.parse( json.camera ) );

			this.setMilkFace(scene.children[0].children[0]);
			this.addEnvMap(milkFaceObject);

    		controls = new THREE.OrbitControls(camera, renderer.domElement);
		};

		this.setCamera = function ( value ) {
			camera = value;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		};

		this.setScene = function ( value ) {
			scene = value;
		};

		this.setMilkFace = function ( value ) {
			milkFaceObject = value;
		}

		this.addEnvMap = function ( object ){
			var enviorment = new THREE.CubeTextureLoader()
				.setPath( 'textures/cube_map/' )
				.load( [ 'right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ] );

			object.material.envMap = enviorment;
		};

		this.setSize = function ( newWidth, newHeight ) {
			width = newWidth;
			height = newHeight;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.setSize( width, height );
		};

		function animate() {
			requestAnimationFrame( animate );
			renderer.render( scene, camera );
		}

		this.play = function () {
			requestAnimationFrame( animate );
		};
}
