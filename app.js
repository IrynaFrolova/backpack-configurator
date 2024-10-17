let scene, camera, renderer, model;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    const loader = new THREE.GLTFLoader();
    loader.load('./models/backpack.glb', function (gltf) {
        model = gltf.scene;
        model.traverse(function (child) {
            if (child.isMesh) {
                console.log(child.name); 
            }
        });
        scene.add(model);
    });

    window.addEventListener('resize', onWindowResize, false);
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (model) model.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


document.querySelectorAll('.material-btn').forEach(button => {
    button.addEventListener('click', function() {
        const material = this.getAttribute('data-material');
        updateBackpackMaterial(material);
    });
});

document.querySelectorAll('.color-circle').forEach(circle => {
    circle.addEventListener('click', function() {
        const color = this.getAttribute('data-color');
        updateBackpackColor(color);
    });
});

document.querySelectorAll('.hardware-btn').forEach(button => {
    button.addEventListener('click', function() {
        const hardware = this.getAttribute('data-hardware');
        updateBackpackHardware(hardware);
    });
});

function updateBackpackMaterial(materialType) {
    let baseColor, normalMap, ormMap;

    if (materialType === 'denim') {
        baseColor = new THREE.TextureLoader().load('models/denim_baseColor.jpg');
        normalMap = new THREE.TextureLoader().load('models/denim_normal.jpg');
        ormMap = new THREE.TextureLoader().load('models/denim_occlusionRoughnessMetallic.jpg');
    } else if (materialType === 'fabric') {
        baseColor = new THREE.TextureLoader().load('models/fabric_baseColor.jpg');
        normalMap = new THREE.TextureLoader().load('models/fabric_normal.jpg');
        ormMap = new THREE.TextureLoader().load('models/fabric_occlusionRoughnessMetallic.jpg');
    } else if (materialType === 'leather') {
        baseColor = new THREE.TextureLoader().load('models/leather_baseColor.jpg');
        normalMap = new THREE.TextureLoader().load('models/leather_normal.jpg');
        ormMap = new THREE.TextureLoader().load('models/leather_occlusionRoughnessMetallic.jpg');
    }

    model.traverse(function (child) {
        if (child.isMesh) {
            child.material.map = baseColor;
            child.material.normalMap = normalMap;
            child.material.roughnessMap = ormMap;
            child.material.metalnessMap = ormMap;
            child.material.needsUpdate = true;
        }
    });
}

function updateBackpackColor(color) {
    let newColor;

    if (color === 'brown') {
        newColor = 0x8B4513; // коричневий
    } else if (color === 'black') {
        newColor = 0x000000; // чорний
    } else if (color === 'navy') {
        newColor = 0x000080; // темносиній
    }

    model.traverse(function (child) {
        if (child.isMesh) {
            child.material.color.setHex(newColor);
            child.material.needsUpdate = true;
        }
    });
}

function updateBackpackHardware(hardwareType) {
    model.traverse(function (child) {
        if (child.isMesh && child.name === 'hardware') {  
            let baseColor, normalMap = null, ormMap = null;

            if (hardwareType === 'silver') {
                baseColor = new THREE.TextureLoader().load('models/metall_baseColor.jpg');  
                normalMap = new THREE.TextureLoader().load('models/metall_normal.jpg');
                ormMap = new THREE.TextureLoader().load('models/metall_occlusionRoughnessMetallic.jpg');
            } else if (hardwareType === 'black') {
                baseColor = new THREE.Color(0x000000);  
            } else if (hardwareType === 'gold') {
                baseColor = new THREE.Color(0xFFD700); 
            }

            child.material.map = baseColor;
            child.material.normalMap = normalMap;
            child.material.roughnessMap = ormMap;
            child.material.metalnessMap = ormMap;
            child.material.needsUpdate = true;
        }
    });
}

document.getElementById('ar-button').addEventListener('click', function() {
    if (isMobileDevice()) {
        startAR();
    } else {
        showQRCode();
    }
});

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function startAR() {
    window.location.href = 'your-AR-page-url-here';
}

function showQRCode() {
    document.getElementById('qr-popup').classList.remove('hidden');
}

document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('qr-popup').classList.add('hidden');
});

init();
