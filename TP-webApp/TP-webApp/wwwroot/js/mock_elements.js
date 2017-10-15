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
    xhr.open('GET','diagrams/1');
    xhr.send();


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

// JSON to elements
function json2elm(font, obj) {

    switch(obj.type) {
        case 'LAYER':
        return new layer(obj.x, obj.y, obj.z, obj.width, obj.height);
        case 'LIFELINE':
        return new lifeline(obj.source_x, obj.source_y, obj.source_z, obj.length);
        case 'MESSAGE':
        return new message(obj.source_x, obj.source_y, obj.source_z, destination_x, destination_y, destination_z);
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