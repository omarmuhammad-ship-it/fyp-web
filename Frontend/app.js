console.log("JS LOADED")

const API_URL =
location.hostname === "localhost"
? "http://localhost:3000/designs"
: "https://fyp-web-fumi.onrender.com/designs"

const feed = document.getElementById("feed")
const threadContainer = document.getElementById("threadContainer")

let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

let currentParentId = null
let currentThreadRoot = null
let replyParentId = null

let baseImage = null
let elements = []

let selected = null
let dragging = false
let resizing = false
let resizeHandle = null
let sketching = false

let currentPath = null
let offsetX = 0
let offsetY = 0

const HANDLE = 10

/* =======================
MOUSE POSITION
======================= */

function getMouse(e){
const rect = canvas.getBoundingClientRect()

const scaleX = canvas.width / rect.width
const scaleY = canvas.height / rect.height

return {
x:(e.clientX - rect.left) * scaleX,
y:(e.clientY - rect.top) * scaleY
}
}

/* =======================
LOAD FEED
======================= */

async function loadDesigns(){
try{

const res = await fetch(API_URL + "/thread")
if(!res.ok) return

const designs = await res.json()

feed.innerHTML=""

const originals = designs.filter(d=>!d.parent)

originals.forEach(design=>{

const card=document.createElement("div")
card.className="design-card"

const img=document.createElement("img")
img.loading = "lazy"
img.src=design.image

const caption=document.createElement("div")
caption.innerText=design.caption || ""

const actions=document.createElement("div")
actions.className="card-actions"

const redesignBtn=document.createElement("button")
redesignBtn.innerText="Redesign"
redesignBtn.onclick=()=>openRedesign(design.image,design._id)

const deleteBtn=document.createElement("button")
deleteBtn.innerText="Delete"
deleteBtn.onclick=async()=>{
await fetch(API_URL+"/"+design._id,{method:"DELETE"})
loadDesigns()
}

actions.appendChild(redesignBtn)
actions.appendChild(deleteBtn)

const showBtn=document.createElement("button")
showBtn.className="show-comments"
showBtn.innerText="Show Thread"
showBtn.onclick=()=>openThread(design._id)

card.appendChild(img)
card.appendChild(caption)
card.appendChild(actions)
card.appendChild(showBtn)

feed.appendChild(card)

})

}catch(err){
console.log(err)
}
}

loadDesigns()

/* =======================
THREAD SYSTEM
======================= */

async function openThread(id){

currentThreadRoot = id

const modal = document.getElementById("threadModal")
modal.classList.remove("hidden")
modal.style.display = "flex"

renderThread()
}

function closeThread(){
const modal = document.getElementById("threadModal")
modal.style.display="none"
modal.classList.add("hidden")
}

async function renderThread(){

const res = await fetch(API_URL)
if(!res.ok) return

const designs = await res.json()

threadContainer.innerHTML=""

function buildTree(parent, level=0){

const children = designs.filter(d=>d.parent === parent)

children.forEach(item=>{

const div = document.createElement("div")
div.className="thread-item"
div.style.marginLeft = level * 20 + "px"

if(item.caption){
const cap = document.createElement("div")
cap.className="thread-comment"
cap.innerText = item.caption
div.appendChild(cap)
}

if(item.image){
const img = document.createElement("img")
img.src = item.image
div.appendChild(img)
}

if(item.comment){
const comment = document.createElement("div")
comment.className="thread-comment"
comment.innerText = item.comment
div.appendChild(comment)
}

const actions=document.createElement("div")
actions.className="thread-actions"

const replyBtn=document.createElement("button")
replyBtn.innerText="Comment"
replyBtn.onclick=()=>replyComment(item._id)

const redesignBtn=document.createElement("button")
redesignBtn.innerText="Redesign"
redesignBtn.onclick=()=>openRedesign(item.image,item._id)

actions.appendChild(replyBtn)
actions.appendChild(redesignBtn)

div.appendChild(actions)

threadContainer.appendChild(div)

buildTree(item._id, level+1)

})

}

buildTree(currentThreadRoot)

}

function replyComment(parentId){
replyParentId = parentId
document.getElementById("commentInput").focus()
}

/* =======================
COMMENT
======================= */

async function submitComment(){

const text = document.getElementById("commentInput").value
if(!text) return

await fetch(API_URL,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
image:"",
creator:"omar",
parent: replyParentId || currentThreadRoot,comment:text
})
})

document.getElementById("commentInput").value=""

setTimeout(()=>{
renderThread()
},200)

}

/* =======================
OPEN REDESIGN
======================= */

function openRedesign(image,id){

currentParentId=id

const modal=document.getElementById("redesignModal")
modal.classList.remove("hidden")
modal.style.display="flex"

canvas.width = 700
canvas.height = 450

elements=[]
selected=null

baseImage=new Image()
baseImage.src=image
baseImage.onload=draw
}

/* =======================
DRAW
======================= */

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

if(baseImage){
ctx.drawImage(baseImage,0,0,canvas.width,canvas.height)
}

elements.forEach(el=>{

if(el.type==="image"){
ctx.drawImage(el.img,el.x,el.y,el.w,el.h)
}

if(el.type==="text"){
ctx.font = el.size+"px Arial"
ctx.fillStyle="black"
ctx.fillText(el.text,el.x,el.y+el.h)
}

if(el.type==="path"){
ctx.beginPath()
ctx.lineWidth=3
ctx.lineCap="round"
ctx.strokeStyle="black"

el.points.forEach((p,i)=>{
if(i===0) ctx.moveTo(p.x,p.y)
else ctx.lineTo(p.x,p.y)
})

ctx.stroke()
}

})

if(currentPath){
ctx.beginPath()
ctx.lineWidth=3
ctx.lineCap="round"
ctx.strokeStyle="black"

currentPath.points.forEach((p,i)=>{
if(i===0) ctx.moveTo(p.x,p.y)
else ctx.lineTo(p.x,p.y)
})

ctx.stroke()
}

}

/* =======================
SKETCH
======================= */

function enableSketch(){
sketching=true
selected=null
}

/* =======================
MOUSE EVENTS
======================= */

canvas.onmousedown = function(e){

const {x,y} = getMouse(e)

if(sketching){
currentPath={ type:"path", points:[{x,y}] }
dragging=true
return
}

}

canvas.onmousemove = function(e){

const {x,y} = getMouse(e)

if(sketching && dragging){
currentPath.points.push({x,y})
draw()
}

}

canvas.onmouseup=function(){

if(sketching && currentPath){
elements.push(currentPath)
currentPath=null
}

dragging=false

}

/* =======================
TOUCH EVENTS (iPad)
======================= */

canvas.addEventListener("touchstart", e=>{
e.preventDefault()
canvas.onmousedown(e.touches[0])
})

canvas.addEventListener("touchmove", e=>{
e.preventDefault()
canvas.onmousemove(e.touches[0])
})

canvas.addEventListener("touchend", e=>{
canvas.onmouseup(e)
})

/* =======================
ADD IMAGE
======================= */

document.getElementById("stickerInput").addEventListener("change",e=>{

sketching=false

const file=e.target.files[0]
if(!file) return

const reader=new FileReader()

reader.onload=function(){

const img=new Image()
img.src=reader.result

img.onload=()=>{

elements.push({
type:"image",
img,
x:100,
y:100,
w:200,
h:200
})

draw()
document.getElementById("stickerInput").value = ""

}

}

reader.readAsDataURL(file)

})

/* =======================
SUBMIT REDESIGN
======================= */

async function submitRedesign(){

const caption = document.getElementById("captionInput").value
const imageData = canvas.toDataURL("image/jpeg", 0.4)

await fetch(API_URL,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
image:imageData,
creator:"omar",
parent:currentParentId,
caption:caption
})
})

document.getElementById("captionInput").value=""

closeModal()

setTimeout(()=>{
loadDesigns()
renderThread()
},300)

}

/* =======================
MODAL
======================= */

function closeModal(){
const modal=document.getElementById("redesignModal")
modal.style.display="none"
modal.classList.add("hidden")
}

/* =======================
UPLOAD
======================= */

async function uploadDesign(){

const fileInput=document.getElementById("fileInput")
const file=fileInput.files[0]

const caption = prompt("Enter caption")
if(!file) return

const reader=new FileReader()

reader.onload=async function(){

await fetch(API_URL,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
image:reader.result,
creator:"omar",
parent:null,
caption:caption
})
})

loadDesigns()
}

reader.readAsDataURL(file)

}

function triggerUpload(){
document.getElementById("fileInput").click()
}

document.getElementById("fileInput").addEventListener("change", uploadDesign)
