//SETUP
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

    new layer(0,0,-1000,500,600).draw(scene)
    new layer(0,0,-2000,500,600).draw(scene)
    new layer_simple(3).draw(scene)


    new lifeline(-100,250,-1000, 500).draw(scene)
    new lifeline(100,250,-1000, 500).draw(scene)

    new lifeline(-100,250,-2000, 500).draw(scene)
    new lifeline(100,250,-2000, 500).draw(scene)


    new message(-100,200,-1000,-100,200,-2000).draw(scene)

    new message(-100,150,-2000,100,150,-2000).draw(scene)
    new message(100,100,-2000,-100,100,-2000).draw(scene)

    new message(-100,50,-2000,-100,50,-1000).draw(scene)

    new message(-100,0,-1000,100,0,-1000).draw(scene)
    new message(100,-50,-1000,-100,-50,-1000).draw(scene)


    new text(-250,300,-1000, "Layer1", font, 12).draw(scene)
    new text(-50,5,-1000, "Sample call(params)", font, 8).draw(scene)
    new text(-120,250,-1000, "Lifeline1", font, 8).draw(scene)
    new text(80,250,-1000, "Lifeline2", font, 8).draw(scene)


    //RENDER
    renderer.render(scene,camera);

    requestAnimationFrame(render)
    function render(){
        renderer.render(scene,camera)
        requestAnimationFrame(render)
    }

}).catch((error) => {
    console.log(error);
});


//*********************************************************************************
//************************************FUNCTIONS************************************
//*********************************************************************************

//LAYER
function layer(x, y, z, width, height) {
    this.geometry = new THREE.PlaneGeometry(width,height);
    this.material = new THREE.MeshLambertMaterial({color:0xffffff, transparent:true, opacity:0.1});
    this.mesh = new THREE.Mesh(this.geometry,this.material);
    this.mesh.position.set(x,y,z)

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

    this.geometry = new THREE.CylinderGeometry( 1, 1, this.length, 8 );
    this.material = new THREE.MeshBasicMaterial( {color: 0x000000} );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.position.set(this.center_x, this.center_y, this.center_z)

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

    this.geometry = new THREE.CylinderGeometry( 1, 2, this.length, 8 );
    this.material = new THREE.MeshBasicMaterial( {color: 0x000000} );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.position.set(this.center_x, this.center_y, this.center_z)
    this.mesh.rotateZ(Math.atan2(destination_y-source_y, destination_x-source_x)-Math.PI/2)
    this.mesh.rotateX(Math.atan2(destination_z-source_z, destination_y-source_y))

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