const products = [
['STAT GOLD','Insecticide',2],['JC PRIDE','Insecticide',2],['JC-3G','Insecticide',2],['MARVEL','Fungicide',2],['KILLDON','Insecticide',2],['GOVERNOR','Insecticide',2],
['OCEAN TOP','Fungicide',3],['J-MITE','Insecticide',3],['JC CHLORO','Insecticide',3],['JC GLYPO','Herbicide',3],['IMDA 17.8','Insecticide',3],['CLEAN','Herbicide',3],
['JC-10G','Insecticide',4],['SAFER','Fungicide',4],['JC-4G','Insecticide',4],['AGENT','Insecticide',4],['MITE PLUS','Other',4],['OXYGEN','Insecticide',4],
['JC-QUIET','Herbicide',5],['JC-505','Insecticide',5],['HARMAR','Insecticide',5],['JC PRO PLUS','Insecticide',5],['JC Zen','Insecticide',5],['JC CHLORO+','Insecticide',5],
['LAMDEX','Insecticide',6],['PROFENO-50','Insecticide',6],['TEMPER','Insecticide',6],['POWER','Insecticide',6],['STAT PLUS','Insecticide',6],['POWER PUNCH','Insecticide',6],
['BISPYRA 10','Herbicide',7],['REZENT','Insecticide',7],['TERRA','Insecticide',7],['IMDA SUPER','Insecticide',7],['OXYFEN','Herbicide',7],['JC CYPERKILL','Insecticide',7],
['CAPHEX','Fungicide',8],['JC JOULE','Insecticide',8],['JC FAN','Insecticide',8],['ATLAS','Other',8],['JC GIB','Other',8],['TEBU FORCE','Fungicide',8],
['QUIZIMAX','Herbicide',9],['BLUETALKS','Fungicide',9],['JC GLYPO PLUS','Herbicide',9],['MYCLOBAN-10','Fungicide',9],['MITE','Insecticide',9],['STRIKE','Herbicide',9],
['REZENT GOLD','Insecticide',10],['RACER','Insecticide',10],['DELL-11','Insecticide',10],['PROKILL','Insecticide',10],['ALPHAMET 10','Insecticide',10],['AMBASSADOR','Insecticide',10],
['JC KASU','Fungicide',11],['KASUCOP','Fungicide',11],['NEEM GUARD','Insecticide',11],['POSMITE 50 EC','Insecticide',11],['SAKUMI','Insecticide',11],['HEXA 75','Fungicide',11],
['JC METHALIN','Herbicide',12],['FIPRIMID 4X','Insecticide',12],['CARBOMAX','Insecticide',12],['DELIGHT','Insecticide',12],['LAMDEX 22.8','Insecticide',12],['LAMDEX PLUS','Insecticide',12]
].map(([name,type,page])=>({name,type,page}));

const root=document.getElementById('app');
const intro=document.getElementById('intro');
const lab=document.getElementById('lab');
const cards=[...document.querySelectorAll('.clue-card')];
const selected=new Set();
const unlockBtn=document.getElementById('unlockBtn');
const progressBar=document.getElementById('progressBar');
const clueStatus=document.getElementById('clueStatus');
const productsEl=document.getElementById('products');
const search=document.getElementById('search');
const filters=document.getElementById('filters');
const resultCount=document.getElementById('resultCount');
const empty=document.getElementById('empty');
const productDialog=document.getElementById('productDialog');
const galleryDialog=document.getElementById('galleryDialog');
let activeFilter='all';

function setPuzzle(){
  const n=selected.size;
  progressBar.style.width=`${n/3*100}%`;
  clueStatus.textContent=`${n} / 3 shields selected`;
  unlockBtn.disabled=n!==3;
}

cards.forEach(card=>{
  const choose=()=>{const key=card.dataset.clue; if(selected.has(key)){selected.delete(key);card.classList.remove('selected')}else{selected.add(key);card.classList.add('selected')} setPuzzle();};
  card.addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')choose();});
  card.querySelector('button').addEventListener('click',choose);
  card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&document.activeElement===card){e.preventDefault();choose();}});
});

unlockBtn.addEventListener('click',()=>{intro.classList.remove('active');lab.classList.add('active');window.scrollTo(0,0);render();});
document.getElementById('replayBtn').addEventListener('click',()=>{lab.classList.remove('active');intro.classList.add('active');selected.clear();cards.forEach(c=>c.classList.remove('selected'));setPuzzle();window.scrollTo(0,0);});

document.getElementById('brochureBtn').addEventListener('click',openGallery);
document.getElementById('openGallery').addEventListener('click',openGallery);
document.getElementById('closeGallery').addEventListener('click',()=>galleryDialog.close());
document.getElementById('closeProduct').addEventListener('click',()=>productDialog.close());

function render(){
  const q=search.value.trim().toLowerCase();
  const list=products.filter(p=>(activeFilter==='all'||p.type===activeFilter)&&(!q||p.name.toLowerCase().includes(q)));
  resultCount.textContent=`${list.length} products shown`;
  productsEl.innerHTML=list.map((p,i)=>`<article class="product-card" data-index="${products.indexOf(p)}" tabindex="0"><span class="type">${p.type}</span><h3>${p.name}</h3><p>Featured in the Jagruthi Agro Chemicals brochure.</p><span class="page-tag">BROCHURE · PAGE ${p.page}</span></article>`).join('');
  empty.hidden=list.length>0;
  productsEl.querySelectorAll('.product-card').forEach(card=>{
    const open=()=>openProduct(products[Number(card.dataset.index)]);
    card.addEventListener('click',open);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
  updateCounts();
}
function updateCounts(){
  document.querySelector('[data-filter="Insecticide"] span').textContent=products.filter(p=>p.type==='Insecticide').length;
  document.querySelector('[data-filter="Fungicide"] span').textContent=products.filter(p=>p.type==='Fungicide').length;
  document.querySelector('[data-filter="Herbicide"] span').textContent=products.filter(p=>p.type==='Herbicide').length;
  document.querySelector('[data-filter="Other"] span').textContent=products.filter(p=>p.type==='Other').length;
}
filters.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;activeFilter=b.dataset.filter;document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b));render();});
search.addEventListener('input',render);

function openProduct(p){
  document.getElementById('productDetail').innerHTML=`<div class="product-detail"><div class="detail-copy"><span class="type">${p.type}</span><h2>${p.name}</h2><p>This product is listed in the supplied Jagruthi Agro Chemicals brochure under the <strong>${p.type}</strong> category.</p><p class="page-tag">SOURCE PAGE ${p.page} · Product wording preserved from the brochure.</p></div><img class="detail-page" src="brochure_webp/page-${String(p.page).padStart(2,'0')}.webp" alt="Brochure page ${p.page} showing ${p.name}" /></div>`;
  productDialog.showModal();
}
function openGallery(){
  const gallery=document.getElementById('gallery');
  gallery.innerHTML=Array.from({length:12},(_,i)=>`<figure><img src="brochure_webp/page-${String(i+1).padStart(2,'0')}.webp" alt="Jagruthi Agro Chemicals brochure page ${i+1}"><figcaption>PAGE ${i+1} / 12</figcaption></figure>`).join('');
  galleryDialog.showModal();
}
setPuzzle();updateCounts();
