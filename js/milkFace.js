function loadThreeJS() {
    var loader = new THREE.FileLoader();
    loader.load( 'app.json', function ( text ) {

        var player = new milkFacePlayer();
        player.load( JSON.parse( text ) );
        player.setSize( window.innerWidth, window.innerHeight );
        player.play();

        document.body.appendChild( player.dom );

        window.addEventListener( 'resize', function () {
            player.setSize( window.innerWidth, window.innerHeight );
        });
    });
}
