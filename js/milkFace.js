function milkFacePlayer () {

    var player;
    var manager;
    var obj;
    var texture;

    this.loadPlayer = function (parent, loadingGif, setScrolling) {
        parent.append( loadingGif );

        manager = new THREE.LoadingManager();
        loadTexture();
        loadObj();

        manager.onProgress = function ( item, loaded, total ) {
            console.log(loaded + "\/" + total + " files loaded \(" + item + "\)");
        };

        manager.onLoad = function ( ) {
            console.log( 'Loading complete!');
            player = new milkFaceScene(obj, texture);
            player.play();
            $(loadingGif).fadeOut(750, function(){
                parent.append( player.dom );
                player.dom.style.display = "none";
                $(player.dom).fadeIn(750);
                setScrolling.execute(true);
            })
        };
    }

    this.play = function (){
        player.play();
    }

    this.stop = function (){
        player.stop();
    }

    function loadObj () {
        var loader = new THREE.OBJLoader(manager);
        loader.load( 'objs/milkface_lo.obj', function ( object ) {
            obj = object.children[0];
        });
    }

    function loadTexture () {
        texture = new THREE.Texture();
        addBasicMaterial();
        addNormalMap ();
        addEnvMap();
        addDifMap ();

        function addEnvMap (){
            var environment = new THREE.CubeTextureLoader(manager)
                .setPath( 'textures/lo_res/cube_map/' )
                .load( [ 'right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ] );

            texture.envMap = environment;
        }

        function addDifMap (){
            var difMap = new THREE.TextureLoader(manager).load( "./textures/lo_res/ao.png" );

            texture.map = difMap;
        }

        function addNormalMap (){
            var normMap = new THREE.TextureLoader(manager).load( "./textures/lo_res/normal.png" );
            var normScale = new THREE.Vector3( 1.0, 1.0, 1.0 );

            texture.normalMap = normMap;
            texture.normalScale = normScale;
        }

        function addBasicMaterial () {
            var basicMaterial = new THREE.MeshStandardMaterial({
                "color": 15921906,
                "roughness": 0.25,
                "metalness": 0.05,
                "emissive": 0,
                "map": null,
                "normalMap": null,
                "normalScale": null,
                "envMap": null,
                "depthFunc": 3,
                "depthTest": true,
                "depthWrite": true,
                "skinning": false,
                "morphTargets": false
            });

            texture = basicMaterial;
        }
    }
}
