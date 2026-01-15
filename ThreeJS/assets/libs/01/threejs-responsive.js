import * as THREE from 'three';
function main(){
  const canvas = document.querySelector( '#c' );
  const renderer = new THREE.WebGLRenderer({antialias:true, canvas});

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.z = 2;

  const scene = new THREE.Scene();

  {

    const color = 0xFFFFFF; // 光的颜色，白色
    const intensity = 1; // 光的强度，1表示标准强度
    const light = new THREE.DirectionalLight( color, intensity );
    light.position.set( - 1, 2, 4 ); // 光源位置，x=-1, y=2, z=4
    scene.add( light );

  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

  function makeInstance(geometry, color, x){
    const material = new THREE.MeshPhongMaterial( { color } ); // greenish blue
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    cube.position.x = x;
    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88,  0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844,  2),
  ];

  // 判断渲染器的尺寸是否需要更新
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // 检查渲染器的尺寸是否与画布的尺寸不同
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }


  // 动画实现
  function render(time){
    time *= 0.001; // convert time to seconds

    // 重新渲染 canvas 不变形
    if(resizeRendererToDisplaySize(renderer)){
      let canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube,index) => {
      const speed = 1 + index * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render( scene, camera );

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // renderer.render( scene, camera );
}
main();