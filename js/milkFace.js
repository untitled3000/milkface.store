function milkFacePlayer () {

    var player, manager;
    var objs = {};
    var textures = {};

    var objURLs = [
        {
            "name" : "milkface",
            "url" : "objs/milkface.obj",
            "map" : "textures/milkface/ao.png",
            "normalMap" : "textures/milkface/normal.png"
        },
        {
            "name" : "arrow",
            "url" : "objs/arrow.obj",
            "map" : "textures/arrow/normal.png"
        }
    ];

    this.loadPlayer = function (parent, loadingGif, setScrolling) {
        parent.append( loadingGif );

        manager = new THREE.LoadingManager();
        loadTexture();
        loadObjs();
        manager.onProgress = function ( item, loaded, total ) {
            console.log(loaded + "\/" + total + " files loaded \(" + item + "\)");
        };

        manager.onLoad = function ( ) {
            console.log( 'Loading complete!');
            player = new milkFaceScene(objs, textures);
            $(loadingGif).fadeOut(750, function(){
                player.play();
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

    function loadObjs () {
        var loader = new THREE.OBJLoader(manager);
        for (var i = 0; i < objURLs.length; i++) {
            loadObj(loader, objURLs[i])
        }

        function loadObj(loader, objectInfo){
            loader.load( objectInfo.url, function ( object ) {
                objs[objectInfo.name] = object.children[0];
            });
        }
    }

    function loadTexture () {
        for (var i = 0; i < objURLs.length; i++) {
            textures[objURLs[i].name] = newBasicMaterial();

            if (objURLs[i].normalMap) {
                addNormalMap (objURLs[i].normalMap, objURLs[i].name);
            }

            if (objURLs[i].map) {
                addDifMap (objURLs[i].map, objURLs[i].name);
            }
        }

        addEnvMap();

        function newBasicMaterial () {
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

            return basicMaterial;
        }

        function addEnvMap (){
            var environment = new THREE.CubeTextureLoader(manager)
                .setPath( 'textures/cube_map/' )
                .load( [ 'right.png', 'left.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ] );

            for (var i = 0; i < objURLs.length; i++) {
                textures[objURLs[i].name].envMap = environment;
            }
        }

        function addDifMap (url, name){
            var difMap = new THREE.TextureLoader(manager).load( url );

            textures[name].map = difMap;
        }

        function addNormalMap (url, name){
            var normMap = new THREE.TextureLoader(manager).load( url );
            var normScale = new THREE.Vector3( 1.0, 1.0, 1.0 );

            textures[name].normalMap = normMap;
            textures[name].normalScale = normScale;
        }
    }
}
