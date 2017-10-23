function DeviceOrientationControls ( object ) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( "YXZ" );
	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

	var alphaOffsetAngle = THREE.Math.degToRad(-44);
	var gyroRequest;

	this.width = window.innerWidth;
	this.height = window.innerHeight;

	var myQuat = new THREE.Quaternion();

	var onDeviceOrientationChangeEvent = function( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function() {

		scope.screenOrientation = window.orientation || 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function() {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function( quaternion, alpha, beta, gamma, orient ) {

			// euler.set(0,scope.deviceOrientation.gamma ,0, 'XYZ' ); // 'ZXY' for the device, but 'YXZ' for us

			euler.set( beta, -gamma, alpha, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler ); // orient the device

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

		}

	}();

	this.play = function() {
		gyroRequest = requestAnimationFrame( animate );

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );
	};

	this.stop = function() {
		cancelAnimationFrame( gyroRequest );

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );
	};

	var animate = function() {

		var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) + alphaOffsetAngle : 0; // Z
		var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad(scope.deviceOrientation.beta) : 0; // X'
		var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad(scope.deviceOrientation.gamma) : 0; // Y'';
		var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O

		setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

		myQuat = scope.object.quaternion;
		var array = [];

		myQuat.toArray(array);

		var quatX = THREE.Math.clamp(array[0],-0.15,0.15);;
		var quatY = array[1];
		var quatZ = 0;
		var quatW = array[3];

		scope.object.quaternion.set (quatX,quatY,quatZ,quatW);
		scope.object.quaternion.normalize();

		gyroRequest = requestAnimationFrame( animate );
	};
};
