const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: './dhk.mind',
			maxTrack: 3,
        });

        const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
 		const knife = await  loadGLTF('./knife/scene.gltf');
		knife.scene.scale.set(1.2, 1.2, 1.2);
		
		// calling knifeAclip and we are loading the audio from our hard disk
		const knifeAclip = await loadAudio("./sound/knife.mp3");
		const knifeListener = new THREE.AudioListener();
		const knifeAudio = new THREE.PositionalAudio(knifeListener);
		
		const hat = await  loadGLTF('./hat/scene.gltf');
		hat.scene.scale.set(0.015, 0.015, 0.015);
		
		const deer = await  loadGLTF('./deer/scene.gltf');
		deer.scene.scale.set(0.005, 0.005, 0.005);
		deer.scene.position.set(0, -0.4, 0);
		
		const hatMixer = new THREE.AnimationMixer(hat.scene);
		const hatAction = hatMixer.clipAction(hat.animations[0]);
		hatAction.play();
		
		const hatAclip = await loadAudio("./sound/hat.mp3");
		const hatListener = new THREE.AudioListener();
		const hatAudio = new THREE.PositionalAudio(hatListener);
		
		const deerMixer = new THREE.AnimationMixer(deer.scene);
		const deerAction = deerMixer.clipAction(deer.animations[0]);
		deerAction.play();
		
		const deerAclip = await loadAudio("./sound/deer.mp3");
		const deerListener = new THREE.AudioListener();
		const deerAudio = new THREE.PositionalAudio(deerListener);
		
		const knifeAnchor = mindarThree.addAnchor(0);
		knifeAnchor.group.add(knife.scene);
		camera.add(knifeListener);
		knifeAudio.setRefDistance(300);
		knifeAudio.setBuffer(knifeAclip);
		knifeAudio.setLoop(true);
		knifeAnchor.group.add(knifeAudio)
		
		knifeAnchor.onTargetFound = () => {
			knifeAudio.play();
		}
		
		knifeAnchor.onTargetLost = () => {
			knifeAudio.pause(); 
		}
		
		const hatAnchor = mindarThree.addAnchor(1);
		hatAnchor.group.add(hat.scene);
		camera.add(hatListener);
		hatAudio.setRefDistance(300);
		hatAudio.setBuffer(hatAclip);
		hatAudio.setLoop(true);
		hatAnchor.group.add(hatAudio)
		
		hatAnchor.onTargetFound = () => {
			hatAudio.play();
		}
		
		hatAnchor.onTargetLost = () => {
			hatAudio.pause(); 
		}
		
		
		const deerAnchor = mindarThree.addAnchor(2);
		deerAnchor.group.add(deer.scene);
		camera.add(deerListener);
		deerAudio.setRefDistance(300);
		deerAudio.setBuffer(deerAclip);
		deerAudio.setLoop(true);
		deerAnchor.group.add(deerAudio)
		
		deerAnchor.onTargetFound = () => {
			deerAudio.play();
		}
		
		deerAnchor.onTargetLost = () => {
			deerAudio.pause(); 
		}
		
		const clock = new THREE.Clock();
		
        await mindarThree.start();

        renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			deerMixer.update(delta);
			hatMixer.update(delta);
			hat.scene.rotation.set(0, hat.scene.rotation.y + delta, 0);
			knife.scene.rotation.set(0, knife.scene.rotation.y + delta, 0);
			deer.scene.rotation.set(0, deer.scene.rotation.y + delta, 0);
            renderer.render(scene, camera);
        });
    }

    start();
});