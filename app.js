let scene, camera, renderer, model;

// Ініціалізація Three.js
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
                console.log(child.name);  // Друкуємо назву кожного об'єкта
            }
        });
        scene.add(model);
    });

    window.addEventListener('resize', onWindowResize, false);
    animate();
}

// Анімація сцени
function animate() {
    requestAnimationFrame(animate);
    if (model) model.rotation.y += 0.01;
    renderer.render(scene, camera);
}

// Обробка зміни розміру вікна
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Функції для зміни матеріалів, кольорів і фурнітури

// Додавання слухачів подій для вибору матеріалу
document.querySelectorAll('.material-btn').forEach(button => {
    button.addEventListener('click', function() {
        const material = this.getAttribute('data-material');
        updateBackpackMaterial(material);
    });
});

// Додавання слухачів подій для вибору кольору
document.querySelectorAll('.color-circle').forEach(circle => {
    circle.addEventListener('click', function() {
        const color = this.getAttribute('data-color');
        updateBackpackColor(color);
    });
});

// Додавання слухачів подій для вибору фурнітури
document.querySelectorAll('.hardware-btn').forEach(button => {
    button.addEventListener('click', function() {
        const hardware = this.getAttribute('data-hardware');
        updateBackpackHardware(hardware);
    });
});

// Функція для зміни матеріалу рюкзака
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

// Функція для зміни кольору рюкзака
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

// Функція для зміни фурнітури рюкзака
function updateBackpackHardware(hardwareType) {
    model.traverse(function (child) {
        if (child.isMesh && child.name === 'hardware') {  // Переконайтесь, що об'єкт зветься "hardware"
            let baseColor, normalMap = null, ormMap = null;

            if (hardwareType === 'silver') {
                baseColor = new THREE.TextureLoader().load('models/metall_baseColor.jpg');  // Срібляста фурнітура
                normalMap = new THREE.TextureLoader().load('models/metall_normal.jpg');
                ormMap = new THREE.TextureLoader().load('models/metall_occlusionRoughnessMetallic.jpg');
            } else if (hardwareType === 'black') {
                baseColor = new THREE.Color(0x000000);  // Чорна фурнітура
            } else if (hardwareType === 'gold') {
                baseColor = new THREE.Color(0xFFD700);  // Золота фурнітура
            }

            child.material.map = baseColor;
            child.material.normalMap = normalMap;
            child.material.roughnessMap = ormMap;
            child.material.metalnessMap = ormMap;
            child.material.needsUpdate = true;
        }
    });
}

// AR логіка
document.getElementById('ar-button').addEventListener('click', function() {
    if (isMobileDevice()) {
        startAR();
    } else {
        showQRCode();
    }
});

// Перевірка, чи пристрій мобільний
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Логіка для запуску AR
function startAR() {
    // Логіка для запуску WebAR (вставьте свій URL-страниці для AR)
    window.location.href = 'your-AR-page-url-here';
}

// Показ QR-коду, якщо пристрій не мобільний
function showQRCode() {
    document.getElementById('qr-popup').classList.remove('hidden');
}

document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('qr-popup').classList.add('hidden');
});

// Ініціалізація сцени
init();
