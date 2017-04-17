function milkFacePlayer () {

    this.loadPlayer = function (parent) {
        var loader = new THREE.FileLoader();
        loader.load( 'app.json', function ( text ) {

            player = new milkFaceScene();
            player.load( JSON.parse( text ) );
            player.play();

            parent.append( player.dom );
        });
    }

    this.play = function (){
        player.play();
    }

    this.stop = function (){
        player.stop();
    }

    var player;
}
