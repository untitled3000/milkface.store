function milkFacePlayer () {

    this.loadPlayer = function () {
        var loader = new THREE.FileLoader();
        loader.load( 'app.json', function ( text ) {

            player = new milkFaceScene();
            player.load( JSON.parse( text ) );
            player.play();

            document.body.appendChild( player.dom );
        });
    }

    this.play = function (){
        player.play();
    }

    this.stop = function (){
        player.stop();
    }

    var player;
    this.loadPlayer();

}
