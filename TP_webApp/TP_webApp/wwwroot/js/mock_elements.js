//SETUP
const CAMERA_SPEED = 3.5;

var loader = new THREE.FontLoader();
new Promise((resolve, reject) => {
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font){
        resolve(font);
    }, function() {},
    function(error) {
        reject(error);
    });
}).then((font) => {

    var renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myCanvas'), antialias: true});
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);
    var scene = new THREE.Scene();

    function xhrSend() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var diagram = JSON.parse(xhr.responseText);
                    diagram.elements.map(json2elm.bind(null, font)).forEach((x) => { x.draw(scene); });
                } else {
                    alert(`XHR returned ${xhr.status}`);
                }
            }
        }
        xhr.open('GET','/api/data/diagram/1');
        xhr.send();
    }

    xhrSend();



    //ON CLICK
    var has_clicked =0;
    function onMouseDown( event ){
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        has_clicked=1;
    }
    window.addEventListener( 'mousedown', onMouseDown, false );

    //raycast
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    ///RENDER
    renderer.render(scene,camera);
    requestAnimationFrame(render);

    function render(){

        if(has_clicked==1){
            raycaster.setFromCamera( mouse, camera );
            var intersects = raycaster.intersectObjects( scene.children );
            has_clicked=0

            for ( var i = 0; i < intersects.length; i++ ) {
                //console.log(intersects[i]);
                //console.log(Object.keys(intersects[i].point));
                //console.log(Object.keys(intersects[i].object));
                if(intersects[i].object.metadata.parent.type == 1){
                    new lifeline(intersects[i].point.x,intersects[i].point.y,intersects[i].point.z,300).draw(scene); 
                    break;
                }             
            }
        }

        renderer.render(scene,camera)
        requestAnimationFrame(render)
    }



    document.getElementById("reloadBtn").addEventListener("click", function() {
        while(scene.children.length > 0){
            scene.remove(scene.children[0]);
        }
        xhrSend();
    });

    var poorManControls = function ( camera ) {

        var scope = this;

        camera.rotation.set( 0, 0, 0 );

        var pitchObject = new THREE.Object3D();
        pitchObject.add( camera );

        var yawObject = new THREE.Object3D();
        yawObject.position.y = 10;
        yawObject.add( pitchObject );

        var PI_2 = Math.PI / 2;

        var onMouseMove = function ( event ) {

            if ( scope.enabled === false ) {
                return;
            }

            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            yawObject.rotation.y -= movementX * 0.002;
            pitchObject.rotation.x -= movementY * 0.002;

            pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
            camera.updateProjectionMatrix();
        };

        this.dispose = function() {

            document.removeEventListener( 'mousemove', onMouseMove, false );

        };

        document.addEventListener( 'mousemove', onMouseMove, false );

        this.enabled = false;

        this.getObject = function () {

            return yawObject;

        };

        this.getPitchObject = function() {

            return pitchObject;
        };

        this.getDirection = function() {

            // assumes the camera itself is not rotated

            var direction = new THREE.Vector3( 0, 0, - 1 );
            var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

            return function( v ) {

                rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

                v.copy( direction ).applyEuler( rotation );

                return v;

            };

        }();

    };
    var controls = new poorManControls(camera);
    scene.add( controls.getObject() );

    var cameraSpeedVector = new THREE.Vector3( 0, 0, 0 );
    var cameraSpeedVectorW = new THREE.Vector3( 0, 0, 0 );
    var cameraSpeedVectorA = new THREE.Vector3( 0, 0, 0 );
    var cameraSpeedVectorS = new THREE.Vector3( 0, 0, 0 );
    var cameraSpeedVectorD = new THREE.Vector3( 0, 0, 0 );
    var cameraSpeedVectorQ = new THREE.Vector3( 0, 0, 0 );
    var cameraSpeedVectorE = new THREE.Vector3( 0, 0, 0 );

    document.addEventListener('keydown', function(e){
        //87 - W, 65 - A, 83 - S, 68 -D, 81 - Q, 69 - E
        switch(e.keyCode) {
            case 87:
                // console.log('pressed w key');
                cameraSpeedVectorW.x = -CAMERA_SPEED*Math.sin(controls.getObject().rotation.y);
                cameraSpeedVectorW.y = CAMERA_SPEED*Math.sin(controls.getPitchObject().rotation.x);
                cameraSpeedVectorW.z = -CAMERA_SPEED*Math.cos(controls.getObject().rotation.y);

                break;
            case 83:
                // console.log('pressed s key');
                cameraSpeedVectorS.x = CAMERA_SPEED*Math.sin(controls.getObject().rotation.y);
                cameraSpeedVectorW.y = -CAMERA_SPEED*Math.sin(controls.getPitchObject().rotation.x);
                cameraSpeedVectorS.z = CAMERA_SPEED*Math.cos(controls.getObject().rotation.y);
                break;
            case 65:
                // console.log('pressed a key');
                cameraSpeedVectorA.x = -CAMERA_SPEED*Math.cos(controls.getObject().rotation.y);
                cameraSpeedVectorA.z = CAMERA_SPEED*Math.sin(controls.getObject().rotation.y);
                break;
            case 68:
                // console.log('pressed d key');
                cameraSpeedVectorD.x = CAMERA_SPEED*Math.cos(controls.getObject().rotation.y);
                cameraSpeedVectorD.z = -CAMERA_SPEED*Math.sin(controls.getObject().rotation.y);
                break;
            case 81:
                // console.log('pressed q key');
                cameraSpeedVectorQ.y = CAMERA_SPEED;
                break;
            case 69:
                // console.log('pressed e key');
                cameraSpeedVectorE.y = -CAMERA_SPEED;
                break;
        }
        cameraSpeedVector = new THREE.Vector3( 0, 0, 0 );
        cameraSpeedVector = cameraSpeedVector.add(cameraSpeedVectorW);
        cameraSpeedVector = cameraSpeedVector.add(cameraSpeedVectorA);
        cameraSpeedVector = cameraSpeedVector.add(cameraSpeedVectorS);
        cameraSpeedVector = cameraSpeedVector.add(cameraSpeedVectorD);
        cameraSpeedVector = cameraSpeedVector.add(cameraSpeedVectorQ);
        cameraSpeedVector = cameraSpeedVector.add(cameraSpeedVectorE);

        console.log(cameraSpeedVector);
        controls.getObject().position.add(cameraSpeedVector);
        camera.updateProjectionMatrix();
    }, false);

    document.addEventListener('keyup', function(e){
        //87 - W, 65 - A, 83 - S, 68 -D, 81 - Q, 69 - E
        switch(e.keyCode) {
            case 87:
                // console.log('pressed w key');
                cameraSpeedVectorW = new THREE.Vector3( 0, 0, 0 );
                break;
            case 83:
                // console.log('pressed s key');
                cameraSpeedVectorS = new THREE.Vector3( 0, 0, 0 );
                break;
            case 65:
                // console.log('pressed a key');
                cameraSpeedVectorA = new THREE.Vector3( 0, 0, 0 );
                break;
            case 68:
                // console.log('pressed d key');
                cameraSpeedVectorD = new THREE.Vector3( 0, 0, 0 );
                break;
            case 81:
                // console.log('pressed q key');
                cameraSpeedVectorQ = new THREE.Vector3( 0, 0, 0 );
                break;
            case 69:
                // console.log('pressed e key');
                cameraSpeedVectorE = new THREE.Vector3( 0, 0, 0 );
                break;
        }
    }, false);

    document.addEventListener('mousedown', function(e){
        controls.enabled = true;
    }, false)

    document.addEventListener('mouseup', function(e){
        controls.enabled = false;
    }, false)

}).catch((error) => {
    console.log(error);
});


//*********************************************************************************
//************************************FUNCTIONS************************************
//*********************************************************************************

// JSON to elements
function json2elm(font, obj) {
    switch(obj.type) {
        case 'LAYER':
        return new layer(obj.x, obj.y, obj.z, obj.width, obj.height);
        case 'LIFELINE':
        return new lifeline(obj.source_x, obj.source_y, obj.source_z, obj.length);
        case 'MESSAGE':
        return new message(obj.source_x, obj.source_y, obj.source_z, obj.destination_x, obj.destination_y, obj.destination_z);
        case 'TEXT':
        return new text(obj.source_x, obj.source_y, obj.source_z, obj.text_string, font, obj.text_size);
    }

}

//LAYER
function layer(x, y, z, width, height) {
    this.geometry = new THREE.PlaneGeometry(width,height);
    this.material = new THREE.MeshLambertMaterial({color:0xffffff, transparent:true, opacity:0.1});
    this.mesh = new THREE.Mesh(this.geometry,this.material);
    this.mesh.position.set(x,y,z)
    this.mesh.metadata = {}
    this.mesh.metadata.parent=this
    this.type = 1

    this.draw = function(target_scene){
        target_scene.add(this.mesh)
    }
}

function layer_simple(layer_number){
    return new layer(0,0,-1000*layer_number,500,600)
}


//Lifeline
function lifeline(source_x, source_y, source_z, length) {
    this.length = length
    this.center_x = source_x
    this.center_y = source_y - length/2
    this.center_z = source_z

    this.geometry = new THREE.CylinderGeometry( 3, 3, this.length, 8 );
    this.material = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.position.set(this.center_x, this.center_y, this.center_z)

    this.mesh.metadata = {}
    this.mesh.metadata.parent=this
    this.type = 2

    this.draw = function(target_scene){
        target_scene.add(this.mesh)
    }
}



//MSG
function message(source_x, source_y, source_z, destination_x, destination_y, destination_z) {
    this.length = Math.sqrt(Math.pow(source_x-destination_x,2)+Math.pow(source_y-destination_y,2)+Math.pow(source_z-destination_z,2))
    this.center_x = (source_x + destination_x)/2
    this.center_y = (source_y + destination_y)/2
    this.center_z = (source_z + destination_z)/2

    this.geometry = new THREE.CylinderGeometry( 0.5, 2.5, this.length, 8 );
    this.material = new THREE.MeshBasicMaterial( {color: 0x00FF00} );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.position.set(this.center_x, this.center_y, this.center_z)
    this.mesh.rotateZ(Math.atan2(destination_y-source_y, destination_x-source_x)-Math.PI/2)
    this.mesh.rotateX(Math.atan2(destination_z-source_z, destination_y-source_y))

    this.mesh.metadata = {}
    this.mesh.metadata.parent=this
    this.type = 3

    this.draw = function(target_scene){
        target_scene.add(this.mesh)
    }
}


//TEXT
function text(source_x, source_y, source_z, text_string, font, text_size) {
    this.geometry = new THREE.TextGeometry( text_string, {
            font: font,
            size: text_size,
            height: 1,
            curveSegments: 12,
        })
    this.material = new THREE.MeshBasicMaterial({color: 0x000000});
    this.mesh = new THREE.Mesh(this.geometry,this.material)
    this.mesh.position.set(source_x, source_y, source_z)

    this.mesh.metadata = {}
    this.mesh.metadata.parent=this
    this.type = 4

    this.draw = function(target_scene){
        target_scene.add(this.mesh)
    }
}
/*var font_links = [  'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
            'https://threejs.org/examples/fonts/helvetiker_bold.tyace.json',
            'https://threejs.org/examples/fonts/optimer_regular.typeface.json',
            'https://threejs.org/examples/fonts/optimer_bold.typeface.json',
            'https://threejs.org/examples/fonts/gentilis_regular.typeface.json',
            'https://threejs.org/examples/fonts/gentilis_bold.typeface.json'//,
            //'https://threejs.org/examples/fonts/droid_sans_regular.typeface.json',
            //'https://threejs.org/examples/fonts/droid_sans_bold.typeface.json',
            //'https://threejs.org/examples/fonts/droid_serif_regular.typeface.json',
            //'https://threejs.org/examples/fonts/droid_serif_bold.typeface.json'
        ]*/