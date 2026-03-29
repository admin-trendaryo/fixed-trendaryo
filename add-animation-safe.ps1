$script = @'
<script>
let scene,camera,renderer,particles,mx=0,my=0;function initThreeJS(){const canvas=document.getElementById('three-canvas');if(!canvas)return;scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);camera.position.z=100;renderer=new THREE.WebGLRenderer({canvas,alpha:true});renderer.setSize(window.innerWidth,window.innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const g=new THREE.BufferGeometry(),c=1500,p=new Float32Array(c*3),col=new Float32Array(c*3),c1=new THREE.Color(0x00f0ff),c2=new THREE.Color(0xff00aa),c3=new THREE.Color(0x00ff88);for(let i=0;i<c*3;i+=3){p[i]=(Math.random()-0.5)*800;p[i+1]=(Math.random()-0.5)*800;p[i+2]=(Math.random()-0.5)*500;const cc=Math.random()<0.33?c1:Math.random()<0.66?c2:c3;col[i]=cc.r;col[i+1]=cc.g;col[i+2]=cc.b;}g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));particles=new THREE.Points(g,new THREE.PointsMaterial({size:2,vertexColors:true,transparent:true,opacity:0.8,blending:THREE.AdditiveBlending}));scene.add(particles);window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});animate();}function animate(){requestAnimationFrame(animate);camera.position.x+=(mx-camera.position.x)*0.05;camera.position.y+=(-my-camera.position.y)*0.05;camera.lookAt(scene.position);particles.rotation.y+=0.001;particles.rotation.x+=0.0005;renderer.render(scene,camera);}document.addEventListener('mousemove',e=>{mx=(e.clientX-window.innerWidth/2)*0.5;my=(e.clientY-window.innerHeight/2)*0.5;});window.addEventListener('load',initThreeJS);
</script>
'@

$files = @('shop.html','about.html','cart.html','product.html','contact.html','faq.html','returns.html','shipping.html','terms.html','track-order.html','wishlist.html','checkout.html')

foreach($f in $files) {
    $path = "c:\Users\trendaryo\Desktop\rahim\$f"
    if(!(Test-Path $path)) { continue }
    
    $content = Get-Content $path -Raw
    if($content -notmatch 'three-canvas') { continue }
    if($content -match 'function initThreeJS\(\)') { 
        Write-Host "SKIP: $f (already has animation)"
        continue 
    }
    
    $content = $content -replace '</body>', "$script`r`n</body>"
    Set-Content $path $content -NoNewline
    Write-Host "ADDED: $f"
}
