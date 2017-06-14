function milkFacePlayer () {

    this.loadPlayer = function (parent, loadingGif, setScrolling) {
        parent.append( loadingGif );
        var loader = new THREE.FileLoader();
        loader.load( 'app.json', function ( text ) {
            player = new milkFaceScene();
            player.load( JSON.parse( text ) );
            player.play();
            $(loadingGif).fadeOut(750, function(){
                parent.append( player.dom );
                player.dom.style.display = "none";
                $(player.dom).fadeIn(750);
                setScrolling.execute(true);
            })
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
