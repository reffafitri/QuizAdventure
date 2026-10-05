const startScreen = document.getElementById('startScreen');

let selectedChallengeIndex = 0;
function openSettings(){
    document.getElementById("settingsScreen").classList.remove("hidden");
}
function closeSettings(){
    document.getElementById("settingsScreen").classList.add("hidden");
}
function confirmExit(){
    document.getElementById("exitScreen").classList.remove("hidden");
}
function closeExitConfirm(){
    document.getElementById("exitScreen").classList.add("hidden");
}
function exitToMenu(){
    gameStarted = false;
    keys.a = false;
    keys.s = false;
    keys.w = false;
    keys.d = false;
    document.getElementById("exitScreen").classList.add("hidden");
    document.getElementById("settingsScreen").classList.add("hidden");
    document.getElementById("challengeScreen").classList.add("hidden");
    document.getElementById("gameOver").classList.add("hidden");
    document.getElementById("ending").classList.add("hidden");
    document.getElementById("quizOverlay").classList.add("hidden");
    document.getElementById("startScreen").classList.remove("hidden");
}

function openChallengeScreen(){
    document.getElementById("challengeScreen").classList.remove("hidden");
    renderChallengeUI();
}

function closeChallengeScreen(){
    document.getElementById("challengeScreen").classList.add("hidden");
}

function renderChallengeUI(){
    const sidebar = document.getElementById("stageTabs");
    const grid = document.getElementById("stageGrid");
    sidebar.innerHTML = "";
    grid.innerHTML = "";

    challengeData.forEach((item, index) => {
        const tab = document.createElement("button");
        tab.className = `stage-tab ${selectedChallengeIndex === index ? "active" : ""}`;
        tab.textContent = `Stage ${item.id}`;
        tab.onclick = () => selectChallenge(index);
        sidebar.appendChild(tab);

        const card = document.createElement("button");
        card.className = `stage-card ${selectedChallengeIndex === index ? "selected" : ""}`;
        card.onclick = () => selectChallenge(index);
        card.innerHTML = `<div class="card-thumb" style="background-color:${item.bg}"></div><div class="card-title">${item.title}</div><div class="card-desc">${item.shortDesc}</div><div class="card-reward"><i class="fa-solid fa-key"></i> ${item.reward}</div>`;
        grid.appendChild(card);
    });

    updateDetailPanel();
}

function selectChallenge(index){
    selectedChallengeIndex = index;
    renderChallengeUI();
}

function updateDetailPanel(){
    const current = challengeData[selectedChallengeIndex];
    document.getElementById("detailTitle").textContent = current.title;
    document.getElementById("detailDesc").textContent = current.fullDesc;
    document.getElementById("detailReward").textContent = current.reward;
    document.getElementById("detailImage").style.backgroundColor = current.bg;
}

function startSelectedChallenge(){
    closeChallengeScreen();
    document.getElementById("startScreen").classList.add("hidden");
    gameStarted = true;
    lastTime = 0;
    loadStage(selectedChallengeIndex);
    beep(440, .12);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(loop);
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const W = canvas.width;
const H = canvas.height;

let gameStarted = false;
let gameWon = false;
let stageIndex = 0;
let animationFrameId = null;
let lastTime = 0;

const keys = {};

window.addEventListener("keydown", e=>{
    keys[e.key.toLowerCase()] = true;

    if(
        ["arrowup","arrowdown","arrowleft","arrowright"," "]
        .includes(e.key.toLowerCase())
    ){
        e.preventDefault();
    }

    if(e.key.toLowerCase()==="r" && !gameStarted){
        restartGame();
    }
});

window.addEventListener("keyup", e=>{
    keys[e.key.toLowerCase()] = false;
});

let audioCtx;
let soundEnabled = true;

function toggleSound(enabled){
    soundEnabled = enabled;
}

function beep(freq=440,duration=.08,type="square"){
    if(!soundEnabled) return;
    try{
        if(!audioCtx){
            audioCtx=new AudioContext();
        }

        const osc=audioCtx.createOscillator();
        const gain=audioCtx.createGain();

        osc.type=type;
        osc.frequency.value=freq;

        gain.gain.setValueAtTime(.035,audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            .001,
            audioCtx.currentTime+duration
        );

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime+duration);
    }catch(e){}
}

const stages=[

{
    name:"THE AWAKENING",
    sky:"#24233d",
    ground:"#6f4939",
    platforms:[
        [0,630,1280,90],
        [160,540,150,30],
        [390,470,150,30],
        [630,550,170,30],
        [870,460,160,30],
        [1080,540,150,30]
    ],
    spikes:[
        [320,600,70,30],
        [550,600,80,30],
        [810,600,90,30],
        [1035,600,60,30]
    ],
    moving:[
        [720,390,110,25,1]
    ],
    npcs:[
        {x:205,y:500,name:"Mira",color:"#f09b6e",
         text:"Aku melihat cahaya biru di balik canyon. Cari kristalnya!"}
    ],
    items:[
        {x:450,y:425,type:"crystal"},
        {x:670,y:505,type:"heart"},
        {x:900,y:415,type:"stamina"}
    ],
    checkpoint:[650,510],
    goal:[1180,480]
},

{
    name:"BROKEN BRIDGE",
    sky:"#2b2847",
    ground:"#754d38",
    platforms:[
        [0,630,220,90],
        [310,630,180,90],
        [580,570,160,150],
        [820,500,150,220],
        [1040,430,240,290],
        [250,540,70,25],
        [500,480,80,25],
        [740,420,80,25]
    ],
    spikes:[
        [220,690,90,30],
        [490,690,90,30],
        [740,690,80,30],
        [970,690,70,30]
    ],
    moving:[
        [350,440,120,25,1.5],
        [650,360,100,25,1.2]
    ],
    npcs:[
        {x:345,y:590,name:"Riko",color:"#7bb9e8",
        text:"Jembatan hancur! Lompat lewat batu-batu kecil itu."}
    ],
    items:[
        {x:270,y:500,type:"crystal"},
        {x:535,y:440,type:"heart"},
        {x:765,y:380,type:"stamina"}
    ],
    checkpoint:[585,510],
    goal:[1150,380]
},

{
    name:"SAND TRAPS",
    sky:"#31253b",
    ground:"#8a5639",
    platforms:[
        [0,630,1280,90],
        [100,530,150,25],
        [360,470,150,25],
        [610,520,150,25],
        [850,440,160,25],
        [1080,520,150,25]
    ],
    spikes:[
        [370,600,70,30],
        [630,600,70,30],
        [880,600,70,30],
        [1100,600,60,30]
    ],
    moving:[
        [250,370,120,25,2],
        [570,340,100,25,1.5],
        [900,320,120,25,2]
    ],
    npcs:[
        {x:145,y:490,name:"Taro",color:"#c58b62",
        text:"Jangan terlalu lama di pasir! Gunakan sprint untuk melewati perangkap."}
    ],
    items:[
        {x:405,y:425,type:"crystal"},
        {x:650,y:475,type:"stamina"},
        {x:900,y:395,type:"heart"},
        {x:1030,y:470,type:"crystal"}
    ],
    checkpoint:[610,490],
    goal:[1150,470]
},

{
    name:"CANYON CLIMB",
    sky:"#1f2940",
    ground:"#694637",
    platforms:[
        [0,650,160,70],
        [230,560,120,25],
        [420,480,120,25],
        [610,400,120,25],
        [800,320,120,25],
        [990,400,120,25],
        [1150,300,130,25]
    ],
    spikes:[
        [160,690,70,30],
        [350,690,70,30],
        [540,690,70,30],
        [730,690,70,30],
        [920,690,70,30],
        [1110,690,40,30]
    ],
    moving:[
        [300,420,100,25,1.4],
        [690,250,100,25,1.8],
        [900,220,100,25,1.5]
    ],
    npcs:[
        {x:260,y:520,name:"Sena",color:"#d66b72",
        text:"Naik terus! Kristal berikutnya berada di atas tebing."}
    ],
    items:[
        {x:455,y:435,type:"crystal"},
        {x:825,y:275,type:"heart"},
        {x:1010,y:355,type:"stamina"}
    ],
    checkpoint:[800,290],
    goal:[1200,250]
},

{
    name:"FALLING ROCKS",
    sky:"#38253a",
    ground:"#684034",
    platforms:[
        [0,630,1280,90],
        [150,520,130,25],
        [380,450,130,25],
        [610,530,130,25],
        [850,430,130,25],
        [1080,510,150,25]
    ],
    spikes:[
        [285,600,80,30],
        [515,600,80,30],
        [745,600,90,30],
        [980,600,90,30]
    ],
    moving:[
        [280,350,100,25,2],
        [600,330,100,25,2],
        [880,300,100,25,1.5]
    ],
    npcs:[
        {x:180,y:480,name:"Bram",color:"#8cc878",
         text:"Hati-hati! Batu-batu jatuh dari atas canyon."}
    ],
    items:[
        {x:420,y:405,type:"crystal"},
        {x:650,y:485,type:"heart"},
        {x:900,y:385,type:"stamina"}
    ],
    checkpoint:[610,490],
    goal:[1170,460]
},

{
    name:"THE OLD TEMPLE",
    sky:"#202638",
    ground:"#554239",
    platforms:[
        [0,630,180,90],
        [260,550,120,25],
        [450,470,120,25],
        [640,390,120,25],
        [830,470,120,25],
        [1020,380,120,25],
        [1170,300,110,25]
    ],
    spikes:[
        [180,690,80,30],
        [380,690,70,30],
        [570,690,70,30],
        [760,690,70,30],
        [950,690,70,30],
        [1140,690,30,30]
    ],
    moving:[
        [300,350,110,25,1.5],
        [700,250,100,25,2]
    ],
    npcs:[
        {x:290,y:510,name:"Ena",color:"#bd80d8",
         text:"Kuil ini menyimpan kristal terakhir. Jangan sentuh patungnya!"}
    ],
    items:[
        {x:480,y:425,type:"crystal"},
        {x:860,y:425,type:"heart"},
        {x:1040,y:335,type:"stamina"}
    ],
    checkpoint:[640,360],
    goal:[1210,250]
},

{
    name:"THE GUARDIAN",
    sky:"#261b2f",
    ground:"#52372f",
    platforms:[
        [0,630,1280,90],
        [160,520,140,25],
        [390,450,140,25],
        [620,520,140,25],
        [850,430,140,25],
        [1080,500,150,25]
    ],
    spikes:[
        [300,600,90,30],
        [530,600,90,30],
        [760,600,90,30],
        [990,600,90,30]
    ],
    moving:[
        [300,330,120,25,2],
        [600,300,120,25,1.5],
        [900,280,120,25,2]
    ],
    npcs:[
        {x:200,y:480,name:"Luma",color:"#e4a65c",
         text:"Guardian berada di depan. Kumpulkan kristal untuk membuka portal!"}
    ],
    items:[
        {x:430,y:405,type:"crystal"},
        {x:660,y:475,type:"heart"},
        {x:900,y:385,type:"stamina"}
    ],
    checkpoint:[620,480],
    goal:[1160,450],
    boss:true
},

{
    name:"THE LAST OASIS",
    sky:"#151f30",
    ground:"#3d493c",
    platforms:[
        [0,630,1280,90],
        [140,520,160,25],
        [380,440,160,25],
        [620,360,160,25],
        [860,440,160,25],
        [1080,340,200,25]
    ],
    spikes:[
        [300,600,80,30],
        [540,600,80,30],
        [780,600,80,30],
        [1020,600,60,30]
    ],
    moving:[
        [300,300,120,25,1.5],
        [580,260,120,25,2],
        [850,260,120,25,1.7]
    ],
    npcs:[
        {x:180,y:480,name:"Elder",color:"#d9c18c",
         text:"Itu portal terakhir! Masukkan kristalmu dan akhiri kutukan."}
    ],
    items:[
        {x:430,y:395,type:"crystal"},
        {x:680,y:315,type:"heart"},
        {x:920,y:395,type:"stamina"}
    ],
    checkpoint:[620,330],
    goal:[1160,290]
}

];

stages.push(
    {
        name:"THE WINDY PASS",
        sky:"#203449",
        ground:"#59624d",
        platforms:[[0,630,1280,90],[180,530,150,25],[430,450,150,25],[690,520,150,25],[940,410,160,25],[1160,330,120,25]],
        spikes:[[330,600,80,30],[580,600,80,30],[840,600,70,30],[1110,600,50,30]],
        moving:[[350,340,120,25,1.6],[750,280,120,25,1.8]],
        npcs:[{x:220,y:480,name:"Nara",color:"#83c9a5",text:"Angin di jalur ini kuat. Gunakan platform yang bergerak."}],
        items:[{x:470,y:415,type:"crystal"},{x:730,y:465,type:"heart"},{x:980,y:375,type:"stamina"}],
        checkpoint:[690,465],
        goal:[1200,270]
    },
    {
        name:"THE CRYSTAL CAVE",
        sky:"#1d2940",
        ground:"#4e536e",
        platforms:[[0,630,220,90],[300,550,150,25],[520,470,150,25],[750,390,150,25],[980,480,150,25],[1160,360,120,25]],
        spikes:[[220,690,80,30],[450,690,70,30],[670,690,80,30],[900,690,80,30],[1130,690,30,30]],
        moving:[[260,350,110,25,1.8],[650,290,110,25,1.5],[900,250,110,25,2]],
        npcs:[{x:350,y:500,name:"Danu",color:"#a98bd1",text:"Cahaya kristal akan menunjukkan jalan di dalam gua."}],
        items:[{x:560,y:435,type:"crystal"},{x:790,y:355,type:"heart"},{x:1020,y:445,type:"stamina"}],
        checkpoint:[750,335],
        goal:[1200,300]
    },
    {
        name:"THE SUNKEN ROAD",
        sky:"#263c48",
        ground:"#49635f",
        platforms:[[0,630,180,90],[250,520,140,25],[470,430,140,25],[700,500,140,25],[920,380,150,25],[1140,300,140,25]],
        spikes:[[180,690,70,30],[390,690,80,30],[610,690,90,30],[840,690,80,30],[1070,690,70,30]],
        moving:[[320,330,120,25,1.7],[600,270,120,25,2],[880,230,120,25,1.6]],
        npcs:[{x:290,y:470,name:"Suri",color:"#e0a56e",text:"Jalan ini tenggelam. Bergerak cepat dan jangan berhenti."}],
        items:[{x:510,y:395,type:"crystal"},{x:740,y:455,type:"heart"},{x:960,y:345,type:"stamina"}],
        checkpoint:[700,445],
        goal:[1200,240]
    },
    {
        name:"THE FINAL SUMMIT",
        sky:"#18283b",
        ground:"#685451",
        platforms:[[0,630,200,90],[280,540,140,25],[500,450,140,25],[720,360,140,25],[940,280,140,25],[1150,200,130,25]],
        spikes:[[200,690,80,30],[420,690,80,30],[640,690,80,30],[860,690,80,30],[1080,690,70,30]],
        moving:[[350,300,110,25,1.8],[650,230,110,25,1.6],[900,170,110,25,2]],
        npcs:[{x:320,y:460,name:"Aru",color:"#d88484",text:"Puncak terakhir sudah dekat. Bawa kristalmu ke portal."}],
        items:[{x:540,y:415,type:"crystal"},{x:760,y:325,type:"heart"},{x:980,y:245,type:"stamina"}],
        checkpoint:[720,305],
        goal:[1200,140]
    },
    {
        name:"THE ANCIENT FOREST",
        sky:"#183b3a",
        ground:"#486447",
        platforms:[[0,630,200,90],[280,540,140,25],[500,460,140,25],[720,380,140,25],[940,470,150,25],[1160,350,120,25]],
        spikes:[[200,690,80,30],[420,690,80,30],[640,690,80,30],[860,690,80,30],[1090,690,70,30]],
        moving:[[330,320,110,25,1.6],[700,260,110,25,1.8]],
        npcs:[{x:320,y:460,name:"Bima",color:"#75c28a",text:"Hutan tua ini menyimpan pengetahuan dan kristal."}],
        items:[{x:540,y:425,type:"crystal"},{x:760,y:345,type:"heart"},{x:980,y:435,type:"stamina"}],
        checkpoint:[720,325],
        goal:[1200,290]
    },
    {
        name:"THE HISTORY RUINS",
        sky:"#3c2d38",
        ground:"#73564a",
        platforms:[[0,630,220,90],[300,530,150,25],[540,440,150,25],[780,350,150,25],[1020,430,140,25],[1190,300,90,25]],
        spikes:[[220,690,80,30],[450,690,90,30],[690,690,90,30],[930,690,90,30],[1160,690,30,30]],
        moving:[[260,310,120,25,1.8],[650,250,120,25,1.5],[900,210,110,25,2]],
        npcs:[{x:350,y:480,name:"Rana",color:"#d39a68",text:"Reruntuhan ini penuh jejak sejarah. Teruskan perjalananmu."}],
        items:[{x:580,y:395,type:"crystal"},{x:820,y:315,type:"heart"},{x:1060,y:385,type:"stamina"}],
        checkpoint:[780,315],
        goal:[1220,240]
    },
    {
        name:"THE PANCASILA GATE",
        sky:"#29384c",
        ground:"#59647a",
        platforms:[[0,630,180,90],[260,520,150,25],[500,410,150,25],[740,500,150,25],[980,370,150,25],[1100,300,180,25],[1180,260,100,25]],
        spikes:[[180,690,80,30],[410,690,90,30],[650,690,90,30],[890,690,90,30],[1130,690,50,30]],
        moving:[[320,300,110,25,1.7],[620,240,120,25,1.9],[900,190,110,25,1.6]],
        npcs:[{x:300,y:470,name:"Saka",color:"#d97878",text:"Gerbang ini terbuka untuk penjelajah yang berani."}],
        items:[{x:540,y:365,type:"crystal"},{x:780,y:465,type:"heart"},{x:1020,y:325,type:"stamina"}],
        checkpoint:[740,445],
        goal:[1220,200]
    },
    {
        name:"THE LAST LIBRARY",
        sky:"#202d42",
        ground:"#665b52",
        platforms:[[0,630,210,90],[290,510,150,25],[530,390,150,25],[770,300,150,25],[1000,400,150,25],[1100,300,180,25],[1180,250,100,25]],
        spikes:[[210,690,80,30],[440,690,90,30],[680,690,90,30],[920,690,80,30],[1150,690,30,30]],
        moving:[[350,270,110,25,1.6],[650,210,120,25,1.8],[930,160,110,25,1.7]],
        npcs:[{x:330,y:460,name:"Lira",color:"#b18bd0",text:"Jawab gerbang terakhir dan bawa kristal ke portal."}],
        items:[{x:570,y:345,type:"crystal"},{x:810,y:255,type:"heart"},{x:1040,y:355,type:"stamina"}],
        checkpoint:[770,265],
        goal:[1220,150]
    },
    {
        name:"THE BLUE RIDGE",
        sky:"#1c3850",
        ground:"#4c6170",
        platforms:[[0,630,190,90],[270,530,150,25],[510,430,150,25],[750,340,150,25],[990,430,150,25],[1180,280,100,25]],
        spikes:[[190,690,80,30],[420,690,90,30],[660,690,90,30],[900,690,90,30],[1140,690,40,30]],
        moving:[[330,290,110,25,1.6],[650,220,120,25,1.8],[930,180,110,25,1.7]],
        npcs:[],
        items:[{x:540,y:395,type:"crystal"}],
        checkpoint:[750,305],
        goal:[1220,220]
    },
    {
        name:"THE GOLDEN VALLEY",
        sky:"#49384a",
        ground:"#806046",
        platforms:[[0,630,210,90],[290,520,150,25],[530,440,150,25],[770,360,150,25],[1010,450,140,25],[1190,320,90,25]],
        spikes:[[210,690,80,30],[440,690,90,30],[680,690,90,30],[920,690,90,30],[1150,690,40,30]],
        moving:[[350,300,120,25,1.8],[680,250,110,25,1.6],[920,210,110,25,1.9]],
        npcs:[],
        items:[{x:580,y:390,type:"crystal"}],
        checkpoint:[770,325],
        goal:[1220,260]
    },
    {
        name:"THE QUIET CLIFF",
        sky:"#23384a",
        ground:"#526875",
        platforms:[[0,630,180,90],[250,500,150,25],[480,390,150,25],[710,300,150,25],[940,390,150,25],[1080,300,120,25],[1170,240,110,25]],
        spikes:[[180,690,70,30],[400,690,80,30],[630,690,80,30],[860,690,80,30],[1090,690,80,30]],
        moving:[[300,260,110,25,1.7],[590,190,120,25,1.9],[870,150,110,25,1.6]],
        npcs:[],
        items:[{x:800,y:250,type:"crystal"}],
        checkpoint:[710,265],
        goal:[1210,180]
    },
    {
        name:"THE FINAL PATH",
        sky:"#172a3c",
        ground:"#5c5967",
        platforms:[[0,630,200,90],[280,510,150,25],[520,400,150,25],[760,300,150,25],[1000,210,150,25],[1190,130,90,25]],
        spikes:[[200,690,80,30],[430,690,90,30],[670,690,90,30],[910,690,90,30],[1150,690,40,30]],
        moving:[[350,260,110,25,1.8],[650,180,120,25,1.7],[930,120,110,25,1.9]],
        npcs:[],
        items:[{x:1040,y:160,type:"crystal"}],
        checkpoint:[760,265],
        goal:[1220,70]
    }
);

const player={
    x:80,
    y:560,
    w:32,
    h:54,

    vx:0,
    vy:0,

    speed:4.2,
    sprint:7.2,

    jump:12,

    hp:100,
    maxHp:100,

    stamina:100,
    maxStamina:100,
    staminaRecoveryDelay:0,

    crystals:0,

    grounded:false,
    facing:1,

    checkpointX:80,
    checkpointY:560,

    invincible:0,

    anim:0
};


let world={};

function loadStage(i){
    stageIndex=i;

    const levelProgress=i/(stages.length-1);
    player.speed=4.2+levelProgress*2.1;
    player.sprint=7.2+levelProgress*2.8;
    player.jump=12+levelProgress*2.2;

    const data=stages[i];

    const difficultyBoost = 1 + levelProgress * 1.8;
    const movingAmplitude = 70 + levelProgress * 42;

    world={
        hazardBoost:difficultyBoost,
        platforms:data.platforms.map(p=>({
            x:p[0],y:p[1],w:p[2],h:p[3]
        })),

        spikes:data.spikes.map(p=>({
            x:p[0],y:p[1],w:p[2],h:p[3]
        })),

        moving:data.moving.map(p=>({
            x:p[0],
            y:p[1],
            w:p[2],
            h:p[3],
            speed:p[4] * difficultyBoost,
            amplitude:movingAmplitude,
            baseX:p[0],
            offset:0
        })),

        npcs:[],

        items:data.items.map(item=>({
            ...item,
            collected:false
        })),

        stageCrystalCollected:false,

        checkpoint:{
            x:data.checkpoint[0],
            y:data.checkpoint[1],
            active:false
        },

        energyOrb:{
            x:data.checkpoint[0]+10,
            y:data.checkpoint[1]-78,
            collected:false
        },

        goal:{
            x:data.goal[0],
            y:data.goal[1]
        },

        boss:data.boss||false
    };

    player.x=80;
    player.y=560;
    player.vx=0;
    player.vy=0;

    player.checkpointX=80;
    player.checkpointY=560;

    player.hp=100;

    updateHUD();

    showMessage(
        `LEVEL ${i+1} DIMULAI`,
        1800
    );
}

function startGame(){
    document.getElementById("startScreen")
        .classList.add("hidden");

    gameStarted=true;
    lastTime = 0;

    loadStage(0);

    beep(440,.12);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(loop);
}

function restartGame(){
    document.getElementById("gameOver")
        .classList.add("hidden");

    gameStarted=true;
    lastTime = 0;

    player.hp=100;

    loadStage(stageIndex);

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(loop);
}

function left(){
    return keys["a"] || keys["s"] || keys["arrowleft"];
}

function right(){
    return keys["w"] || keys["d"] || keys["arrowright"];
}

function jump(){
    return keys["arrowup"] || keys[" "];
}

function down(){
    return keys["arrowdown"];
}

const gravity=.55;

function updatePlayer(){

    if(player.invincible>0){
        player.invincible--;
    }

    let moving=false;

    const sprinting=
        keys["shift"] &&
        player.stamina>0 &&
        (left()||right());

    let moveSpeed=sprinting?
        player.sprint:
        player.speed;

    if(left()){
        player.vx=-moveSpeed;
        player.facing=-1;
        moving=true;
    }

    if(right()){
        player.vx=moveSpeed;
        player.facing=1;
        moving=true;
    }

    if(!moving){
        player.vx*=.75;
    }

    player.stamina=Math.max(
        0,
        Math.min(player.maxStamina,player.stamina)
    );

    if(
        jump() &&
        player.grounded &&
        !player.jumpLock
    ){
        player.vy=-player.jump;
        player.grounded=false;
        player.jumpLock=true;
        beep(520,.06);
    }

    if(!jump()){
        player.jumpLock=false;
    }

    player.vy+=gravity;

    if(down() && !player.grounded){
        player.vy+=1.2;
    }

    player.x+=player.vx;
    player.y+=player.vy;

    player.grounded=false;

    for(const p of world.platforms){

        if(
            player.x < p.x+p.w &&
            player.x+player.w > p.x &&
            player.y+player.h >= p.y &&
            player.y+player.h <= p.y+25 &&
            player.vy>=0
        ){
            player.y=p.y-player.h;
            player.vy=0;
            player.grounded=true;
        }
    }

    for(const p of world.moving){

        if(
            player.x < p.x+p.w &&
            player.x+player.w > p.x &&
            player.y+player.h >= p.y &&
            player.y+player.h <= p.y+25 &&
            player.vy>=0
        ){
            player.y=p.y-player.h;
            player.vy=0;
            player.grounded=true;
        }
    }

    if(player.x<0)
        player.x=0;

    if(player.x+player.w>W)
        player.x=W-player.w;

    if(player.y>760){
        recoverFromFall();
    }

    player.anim+=Math.abs(player.vx)*.15;
}

function updateMoving(){

    for(const p of world.moving){

        p.offset+=p.speed*.016;

        p.x=
            p.baseX+
            Math.sin(p.offset)*(p.amplitude || 70);
    }
}

function recoverFromFall(){
    drainStamina(35);
    player.x=player.checkpointX;
    player.y=player.checkpointY;
    player.vx=0;
    player.vy=0;
    player.invincible=45;
    showMessage("Kamu jatuh. Stamina berkurang dan kamu kembali ke checkpoint.",1800);
}

function drainStamina(amount){
    player.stamina=Math.max(0,player.stamina-amount);
    player.staminaRecoveryDelay=150;
}

function damage(amount){

    if(player.invincible>0)
        return;

    const difficultyBonus = 1 + (stageIndex * 0.08);
    player.hp -= amount * difficultyBonus;
    player.invincible=90;

    beep(110,.12,"sawtooth");

    if(player.hp<=0){
        player.hp=0;
        player.x=player.checkpointX;
        player.y=player.checkpointY;
        player.vx=0;
        player.vy=0;

        document.getElementById("gameOver")
            .classList.remove("hidden");

        gameStarted=false;
    }
}

function checkSpikes(){

    const spikePenalty = 25 + stageIndex * 7;

    for(const s of world.spikes){

        if(player.invincible>0) continue;

        if(
            player.x < s.x+s.w &&
            player.x+player.w > s.x &&
            player.y+player.h > s.y &&
            player.y < s.y+s.h
        ){
            drainStamina(spikePenalty);
            player.x=player.checkpointX;
            player.y=player.checkpointY;
            player.vx=0;
            player.vy=0;
            player.invincible=45;
            showMessage("Duri tajam! Stamina berkurang.",1200);
        }
    }  
}

let messageTimer=0;
let bossAttackCooldown=0;
let quizOpen=false;
let quizStage=0;
let quizWrongAttempts=0;
let currentQuiz=null;
const lastQuestionByStage={};
let lastQuestionText=null;
const usedQuestionTexts=new Set();

try{
    lastQuestionText=localStorage.getItem("lastLembahBiruQuestionV3");
    const savedQuestions=JSON.parse(
        localStorage.getItem("usedLembahBiruQuestionsV3")||"[]"
    );
    savedQuestions.forEach(question=>usedQuestionTexts.add(question));
}catch(error){}

function pickQuiz(stage){
    const difficulty=stage<6?"mudah":stage<13?"sedang":"sulit";
    const generalPool=(difficulty==="sulit"?
        [...generalQuestions,...advancedGeneralQuestions]:
        generalQuestions
    ).filter(question=>question.difficulty===difficulty);
    const codingPool=[...quizQuestions,...replacementQuestions.flat()]
        .filter(question=>question.difficulty===difficulty);
    const questions=[...generalQuestions,...quizQuestions,...replacementQuestions.flat()];
    const previous=lastQuestionByStage[stage];
    const availableGeneral=generalPool.filter(question=>
        question!==previous &&
        question.question!==lastQuestionText &&
        !usedQuestionTexts.has(question.question)
    );
    const available=questions.filter(question=>
        question!==previous &&
        question.question!==lastQuestionText &&
        !usedQuestionTexts.has(question.question)
    );
    const fallback=questions.filter(question=>
        question!==previous && question.question!==lastQuestionText
    );
    const weightedPool=[
        ...availableGeneral,
        ...availableGeneral,
        ...availableGeneral,
        ...availableGeneral,
        ...availableGeneral,
        ...codingPool.filter(question=>
            question!==previous &&
            question.question!==lastQuestionText &&
            !usedQuestionTexts.has(question.question)
        )
    ];
    const pool=weightedPool.length>0?
        weightedPool:
        (available.length>0?available:(fallback.length>0?fallback:questions));
    const selected=pool[Math.floor(Math.random()*pool.length)];
    lastQuestionByStage[stage]=selected;
    lastQuestionText=selected.question;
    usedQuestionTexts.add(selected.question);
    try{
        localStorage.setItem("lastLembahBiruQuestionV3",lastQuestionText);
        localStorage.setItem(
            "usedLembahBiruQuestionsV3",
            JSON.stringify([...usedQuestionTexts])
        );
    }catch(error){}
    return selected;
}

const quizQuestions=[
    {
        question:"Di Python, fungsi untuk menghitung jumlah elemen dalam list adalah...",
        answers:["count()", "size()", "len()", "length()"],
        correct:2
    },
    {
        question:"Dalam OOP, konsep menyembunyikan detail data dan menyediakan akses melalui method disebut...",
        answers:["Inheritance", "Encapsulation", "Polymorphism", "Looping"],
        correct:1
    },
    {
        question:"Tag HTML yang paling tepat untuk judul utama halaman adalah...",
        answers:["<h1>", "<title>", "<header>", "<heading>"],
        correct:0
    },
    {
        question:"Properti CSS untuk mengatur jarak di dalam elemen adalah...",
        answers:["margin", "padding", "spacing", "inside-gap"],
        correct:1
    },
    {
        question:"Apa output JavaScript dari `console.log(typeof [])`?",
        answers:["array", "list", "object", "undefined"],
        correct:2
    },
    {
        question:"Struktur data Python yang menyimpan pasangan key dan value adalah...",
        answers:["dict", "tuple", "set", "string"],
        correct:0
    },
    {
        question:"Method JavaScript untuk memilih elemen berdasarkan id adalah...",
        answers:["queryById()", "selectId()", "getElementById()", "findId()"],
        correct:2
    }
];

const replacementQuestions=[
    [
        {
            question:"Di Python, simbol untuk membuat komentar satu baris adalah...",
            answers:["//", "#", "<!--", "**"],
            correct:1
        },
        {
            question:"Dalam OOP, class turunan yang mewarisi sifat dari class lain menggunakan konsep...",
            answers:["Inheritance", "Casting", "Iteration", "Parsing"],
            correct:0
        }
    ],
    [
        {
            question:"Method khusus Python yang dipanggil saat object baru dibuat adalah...",
            answers:["__start__", "__new__", "__init__", "__create__"],
            correct:2
        },
        {
            question:"Dalam OOP, satu interface dengan banyak bentuk implementasi disebut...",
            answers:["Encapsulation", "Polymorphism", "Inheritance", "Compilation"],
            correct:1
        }
    ],
    [
        {
            question:"Tag HTML untuk membuat tautan ke halaman lain adalah...",
            answers:["<link>", "<a>", "<url>", "<href>"],
            correct:1
        },
        {
            question:"Atribut HTML yang wajib dimiliki gambar agar memiliki teks alternatif adalah...",
            answers:["src", "alt", "title", "text"],
            correct:1
        },
        {
            question:"Elemen HTML untuk membuat daftar dengan angka adalah...",
            answers:["<ul>", "<li>", "<ol>", "<list>"],
            correct:2
        }
    ],
    [
        {
            question:"CSS Flexbox diaktifkan dengan nilai display...",
            answers:["flex", "flexbox", "box", "layout"],
            correct:0
        },
        {
            question:"Selector CSS untuk memilih semua elemen dengan class `menu` adalah...",
            answers:["#menu", ".menu", "menu", "*menu"],
            correct:1
        }
    ],
    [
        {
            question:"Keyword JavaScript untuk membuat variabel yang nilainya tidak dapat diganti adalah...",
            answers:["let", "var", "const", "static"],
            correct:2
        },
        {
            question:"Method JavaScript untuk menambahkan item ke akhir array adalah...",
            answers:["add()", "push()", "append()", "insert()"],
            correct:1
        }
    ],
    [
        {
            question:"Di Python, keyword untuk mengulang selama kondisi bernilai benar adalah...",
            answers:["for", "repeat", "while", "loop"],
            correct:2
        },
        {
            question:"Method JavaScript untuk mengubah string menjadi huruf besar adalah...",
            answers:["upperCase()", "toUpperCase()", "uppercase()", "makeUpper()"],
            correct:1
        }
    ],
    [
        {
            question:"Dalam OOP, method yang memiliki nama sama tetapi parameter berbeda disebut...",
            answers:["Overloading", "Overwriting", "Wrapping", "Hiding"],
            correct:0
        },
        {
            question:"Event JavaScript untuk merespons klik tombol adalah...",
            answers:["onload", "onclick", "onhover", "onwrite"],
            correct:1
        }
    ]
];

const generalQuestions=[
    {
        question:"Planet yang dikenal sebagai Planet Merah adalah...",
        answers:["Venus", "Mars", "Jupiter", "Saturnus"],
        correct:1
    },
    {
        question:"Hewan yang mengalami metamorfosis sempurna adalah...",
        answers:["Kupu-kupu", "Kucing", "Ayam", "Kambing"],
        correct:0
    },
    {
        question:"Organ tubuh manusia yang berfungsi memompa darah adalah...",
        answers:["Paru-paru", "Jantung", "Lambung", "Ginjal"],
        correct:1
    },
    {
        question:"Proses tumbuhan membuat makanan dengan bantuan cahaya disebut...",
        answers:["Respirasi", "Fotosintesis", "Evaporasi", "Fermentasi"],
        correct:1
    },
    {
        question:"Sumber energi utama bagi kehidupan di Bumi adalah...",
        answers:["Bulan", "Matahari", "Angin", "Air"],
        correct:1
    },
    {
        question:"Ibu kota Indonesia adalah...",
        answers:["Bandung", "Surabaya", "Jakarta", "Medan"],
        correct:2
    },
    {
        question:"Kegiatan menjual barang ke luar negeri disebut...",
        answers:["Impor", "Ekspor", "Konsumsi", "Produksi"],
        correct:1
    },
    {
        question:"Peta yang menunjukkan wilayah daratan dan perairan disebut peta...",
        answers:["Politik", "Topografi", "Geologi", "Cuaca"],
        correct:1
    },
    {
        question:"Semboyan bangsa Indonesia adalah...",
        answers:["Tut Wuri Handayani", "Bhinneka Tunggal Ika", "Ing Ngarsa Sung Tuladha", "Merdeka atau Mati"],
        correct:1
    },
    {
        question:"Proklamasi Kemerdekaan Indonesia dibacakan pada tanggal...",
        answers:["20 Mei 1908", "28 Oktober 1928", "17 Agustus 1945", "10 November 1945"],
        correct:2
    },
    {
        question:"Tokoh yang dikenal sebagai Bapak Pendidikan Nasional adalah...",
        answers:["Ki Hajar Dewantara", "R.A. Kartini", "Pattimura", "Cut Nyak Dien"],
        correct:0
    },
    {
        question:"Hari Pahlawan diperingati setiap tanggal...",
        answers:["1 Juni", "17 Agustus", "10 November", "28 Oktober"],
        correct:2
    },
    {
        question:"Hasil dari 15 + 27 adalah...",
        answers:["32", "42", "52", "62"],
        correct:1
    },
    {
        question:"Hasil dari 9 x 7 adalah...",
        answers:["56", "63", "72", "81"],
        correct:1
    },
    {
        question:"Pecahan yang senilai dengan 1/2 adalah...",
        answers:["2/3", "2/4", "3/5", "4/6"],
        correct:1
    },
    {
        question:"Bangun datar yang memiliki tiga sisi disebut...",
        answers:["Persegi", "Lingkaran", "Segitiga", "Trapesium"],
        correct:2
    },
    {
        question:"Antonim dari kata 'tinggi' adalah...",
        answers:["Panjang", "Rendah", "Besar", "Lebar"],
        correct:1
    },
    {
        question:"Kalimat yang digunakan untuk menanyakan sesuatu diakhiri dengan tanda...",
        answers:["Titik (.)", "Koma (,)", "Tanya (?)", "Seru (! )"],
        correct:2
    },
    {
        question:"Sinonim dari kata 'pandai' adalah...",
        answers:["Cerdas", "Lambat", "Malas", "Lemah"],
        correct:0
    },
    {
        question:"Lawan kata 'hemat' adalah...",
        answers:["Rajin", "Boros", "Sabar", "Teliti"],
        correct:1
    },
    {
        question:"Jumlah sila dalam Pancasila adalah...",
        answers:["Tiga", "Empat", "Lima", "Enam"],
        correct:2
    },
    {
        question:"Lambang sila pertama Pancasila adalah...",
        answers:["Bintang", "Rantai", "Pohon beringin", "Padi dan kapas"],
        correct:0
    },
    {
        question:"Sikap menghargai perbedaan suku dan budaya sesuai dengan sila...",
        answers:["Pertama", "Kedua", "Ketiga", "Kelima"],
        correct:2
    },
    {
        question:"Alat pernapasan utama manusia adalah...",
        answers:["Jantung", "Paru-paru", "Kulit", "Hati"],
        correct:1
    },
    {
        question:"Perubahan air menjadi uap karena panas disebut...",
        answers:["Membeku", "Menguap", "Mengembun", "Mencair"],
        correct:1
    },
    {
        question:"Kegiatan membeli barang dari luar negeri disebut...",
        answers:["Ekspor", "Impor", "Produksi", "Distribusi"],
        correct:1
    },
    {
        question:"Kerja sama negara-negara di kawasan Asia Tenggara disebut...",
        answers:["APEC", "ASEAN", "PBB", "OPEC"],
        correct:1
    },
    {
        question:"Bilangan prima terkecil adalah...",
        answers:["0", "1", "2", "3"],
        correct:2
    },
    {
        question:"Hasil dari 144 dibagi 12 adalah...",
        answers:["10", "11", "12", "14"],
        correct:2
    },
    {
        question:"Kata tanya untuk menanyakan alasan adalah...",
        answers:["Apa", "Siapa", "Mengapa", "Kapan"],
        correct:2
    },
    {
        question:"Gagasan utama dalam sebuah paragraf disebut juga...",
        answers:["Kalimat penjelas", "Ide pokok", "Kata sambung", "Judul"],
        correct:1
    },
    {
        question:"Peristiwa sejarah yang menjadi tonggak berdirinya organisasi Budi Utomo terjadi pada tahun...",
        answers:["1908", "1928", "1945", "1950"],
        correct:0
    }
];

const advancedGeneralQuestions=[
    {
        question:"Jika gaya total pada benda nol, keadaan gerak benda menurut hukum Newton adalah...",
        answers:["Pasti diam", "Pasti bergerak melingkar", "Diam atau bergerak lurus beraturan", "Selalu dipercepat"],
        correct:2,
        difficulty:"sulit"
    },
    {
        question:"Organel sel yang menjadi tempat respirasi sel dan menghasilkan energi adalah...",
        answers:["Ribosom", "Mitokondria", "Vakuola", "Lisosom"],
        correct:1,
        difficulty:"sulit"
    },
    {
        question:"Interaksi sosial yang terjadi ketika dua pihak bekerja sama mencapai tujuan disebut...",
        answers:["Konflik", "Kompetisi", "Asimilasi", "Kerja sama"],
        correct:3,
        difficulty:"sulit"
    },
    {
        question:"Inflasi dapat menyebabkan daya beli masyarakat...",
        answers:["Meningkat tajam", "Menurun", "Tetap selalu sama", "Tidak terpengaruh"],
        correct:1,
        difficulty:"sulit"
    },
    {
        question:"Makna Sumpah Pemuda paling tepat adalah...",
        answers:["Menegaskan persatuan pemuda sebagai satu bangsa", "Membentuk kerajaan baru", "Menghapus semua budaya daerah", "Mengganti dasar negara"],
        correct:0,
        difficulty:"sulit"
    },
    {
        question:"Peristiwa Rengasdengklok berkaitan erat dengan...",
        answers:["Penyusunan teks proklamasi", "Pembentukan ASEAN", "Konferensi Asia Afrika", "Pemilu pertama"],
        correct:0,
        difficulty:"sulit"
    },
    {
        question:"Penerapan sila keempat Pancasila dalam pengambilan keputusan dilakukan melalui...",
        answers:["Musyawarah untuk mufakat", "Pemaksaan kehendak", "Kemenangan mayoritas tanpa diskusi", "Keputusan satu orang"],
        correct:0,
        difficulty:"sulit"
    },
    {
        question:"Nilai x yang memenuhi persamaan 2x + 7 = 25 adalah...",
        answers:["7", "8", "9", "10"],
        correct:2,
        difficulty:"sulit"
    },
    {
        question:"Luas lingkaran dengan jari-jari 7 cm menggunakan pi = 22/7 adalah...",
        answers:["44 cm2", "88 cm2", "154 cm2", "308 cm2"],
        correct:2,
        difficulty:"sulit"
    },
    {
        question:"Kalimat yang memiliki hubungan sebab-akibat adalah...",
        answers:["Ia membaca buku dan menulis catatan.", "Karena hujan deras, pertandingan ditunda.", "Adik membeli pensil baru.", "Mereka pergi ke perpustakaan."],
        correct:1,
        difficulty:"sulit"
    },
    {
        question:"Simpulan paragraf harus sesuai dengan...",
        answers:["Pendapat pribadi pembaca", "Informasi dan gagasan utama paragraf", "Kalimat paling panjang", "Kata terakhir paragraf"],
        correct:1,
        difficulty:"sulit"
    },
    {
        question:"Perubahan energi pada panel surya adalah energi cahaya menjadi energi...",
        answers:["Bunyi", "Kimia", "Listrik", "Gerak"],
        correct:2,
        difficulty:"sulit"
    }
];

function assignDifficulty(questions){
    const easyLimit=Math.ceil(questions.length/3);
    const mediumLimit=Math.ceil(questions.length*2/3);
    questions.forEach((question,index)=>{
        question.difficulty=index<easyLimit?
            "mudah":
            (index<mediumLimit?"sedang":"sulit");
    });
}

assignDifficulty(generalQuestions);
assignDifficulty(quizQuestions);
assignDifficulty(replacementQuestions.flat());

function showMessage(text,duration=2400){
    const box=document.getElementById("message");
    box.textContent=text;
    box.style.display="block";
    clearTimeout(messageTimer);
    messageTimer=setTimeout(()=>box.style.display="none",duration);
}

function updateHUD(){
    document.getElementById("hpFill").style.width=`${player.hp}%`;
    document.getElementById("staminaFill").style.width=`${player.stamina}%`;
    document.getElementById("crystals").textContent=player.crystals;
    document.getElementById("stage").textContent=stageIndex+1;

    const stageName = stages[stageIndex]?.name || "THE AWAKENING";
    const stageNameEl = document.getElementById("stageName");
    if (stageNameEl) {
        stageNameEl.textContent = stageName;
    }
}

function distanceTo(x,y){
    return Math.hypot(player.x-x,player.y-y);
}

function talkToNPC(){
    if(!gameStarted) return;

    if(world.boss && distanceTo(world.boss.x,world.boss.y)<110){
        attackBoss();
        return;
    }

    showMessage("Tidak ada siapa-siapa di dekatmu.");
}

function checkItems(){
    for(const item of world.items){
        if(item.collected || distanceTo(item.x,item.y)>42) continue;

        item.collected=true;
        if(item.type==="crystal"){
            player.crystals++;
            world.stageCrystalCollected=true;
            beep(760,.12);
            showMessage("Kristal biru ditemukan! Jalan rahasia mulai menyala.");
        }
        if(item.type==="heart"){
            player.hp=Math.min(player.maxHp,player.hp+35);
            showMessage("Relik matahari memulihkan nyawa.");
        }
        if(item.type==="stamina"){
            player.stamina=player.maxStamina;
            showMessage("Air oasis memulihkan stamina penuh.");
        }
    }
}

function checkCheckpoint(){
    const cp=world.checkpoint;
    if(cp.active || distanceTo(cp.x,cp.y)>55) return;
    cp.active=true;
    player.checkpointX=cp.x;
    player.checkpointY=cp.y-55;
    player.hp=player.maxHp;
    showMessage("Checkpoint aktif. Jika jatuh, kamu kembali ke sini.");
    beep(620,.15);
}

function checkEnergyOrb(){
    const orb=world.energyOrb;
    if(orb.collected || distanceTo(orb.x,orb.y)>38) return;
    orb.collected=true;
    player.hp=Math.min(player.maxHp,player.hp+20);
    player.stamina=Math.min(player.maxStamina,player.stamina+35);
    player.staminaRecoveryDelay=0;
    beep(840,.16);
    showMessage("Orb energi diambil! Nyawa dan stamina pulih.",1600);
}

function checkRoute(){
    if(world.route) return;
    if(player.x>700){
        world.route=player.y<500?"jalur atas":"jalur bawah";
        showMessage(`Kamu memilih ${world.route}. Jalan ini akan membawa tantangan berbeda.`);
    }
}

function checkGoal(){
    if(distanceTo(world.goal.x,world.goal.y)>70) return;
    if(!world.checkpoint.active){
        showMessage("Injak checkpoint dulu sebelum menuju portal.");
        return;
    }
    if(!world.stageCrystalCollected){
        showMessage("Ambil kristal biru dulu sebelum menuju portal.");
        return;
    }
    if(stageIndex<stages.length-1){
        showQuiz(stageIndex+1);
    }else{
        gameStarted=false;
        gameWon=true;
        document.getElementById("ending").classList.remove("hidden");
        beep(880,.3);
    }
}

let quizTimer = null;
let quizTimeLeft = 15;
const QUIZ_TIME_LIMIT = 15;

function startQuizTimer(){
    clearInterval(quizTimer);
    quizTimeLeft = QUIZ_TIME_LIMIT;

    const timerEl = document.getElementById("quizTimeValue");
    const timerBox = document.getElementById("quizTimer");

    if (timerEl) timerEl.textContent = String(quizTimeLeft);
    if (timerBox) timerBox.classList.remove("danger");

    quizTimer = setInterval(() => {
        quizTimeLeft -= 1;
        if (timerEl) timerEl.textContent = String(Math.max(0, quizTimeLeft));
        if (timerBox && quizTimeLeft <= 5) {
            timerBox.classList.add("danger");
        }

        if (quizTimeLeft <= 0) {
            clearInterval(quizTimer);
            handleQuizTimeout();
        }
    }, 1000);
}

function handleQuizTimeout(){
    if (!quizOpen) return;

    quizWrongAttempts++;
    player.hp = Math.max(1, player.hp - 10);
    const feedback = document.getElementById("quizFeedback");
    feedback.style.color = "#ef8b75";
    feedback.textContent = `Waktu habis! Kamu kehilangan 10 nyawa (${quizWrongAttempts}/3).`;
    updateHUD();
    beep(120, .1, "sawtooth");

    if (quizWrongAttempts >= 3) {
        if (generalQuestions.length > 0) {
            currentQuiz = pickQuiz(stageIndex);
            quizWrongAttempts = 0;
            feedback.textContent = "Soal diganti. Coba lagi dengan fokus lebih cepat.";
            setTimeout(() => renderQuiz(currentQuiz), 700);
        }
        return;
    }

    setTimeout(() => renderQuiz(currentQuiz), 700);
}

function showQuiz(nextStage){
    if(quizOpen) return;
    quizOpen=true;
    quizStage=nextStage;
    quizWrongAttempts=0;
    gameStarted=false;

    currentQuiz=pickQuiz(stageIndex);
    renderQuiz(currentQuiz);
    document.getElementById("quizOverlay").classList.remove("hidden");
}

function renderQuiz(quiz){
    document.getElementById("quizProgress").textContent=`GERBANG ${stageIndex+1}/${stages.length-1} - MENUJU STAGE ${quizStage+1}`;
    document.getElementById("quizQuestion").textContent=quiz.question;
    document.getElementById("quizFeedback").textContent="";

    const answers=document.getElementById("quizAnswers");
    answers.innerHTML="";
    quiz.answers.forEach((answer,index)=>{
        const button=document.createElement("button");
        button.type="button";
        button.textContent=`${String.fromCharCode(65+index)}. ${answer}`;
        button.addEventListener("click",()=>answerQuiz(index));
        answers.appendChild(button);
    });

    startQuizTimer();
}

function answerQuiz(answerIndex){
    if(!quizOpen) return;
    clearInterval(quizTimer);

    const quiz=currentQuiz;
    const feedback=document.getElementById("quizFeedback");

    if(answerIndex===quiz.correct){
        feedback.style.color="#73e0bd";
        feedback.textContent="Jawaban benar! Gerbang terbuka.";
        beep(720,.12);
        quizOpen=false;
        quizWrongAttempts=0;
        setTimeout(()=>{
            document.getElementById("quizOverlay").classList.add("hidden");
            gameStarted=true;
            loadStage(quizStage);
        },650);
    }else{
        quizWrongAttempts++;
        player.hp=Math.max(1,player.hp-8);
        feedback.style.color="#ef8b75";
        feedback.textContent=`Belum tepat (${quizWrongAttempts}/3). Kamu kehilangan 8 nyawa.`;
        updateHUD();
        beep(140,.1,"sawtooth");

        if(quizWrongAttempts>=3){
            if(generalQuestions.length>0){
                currentQuiz=pickQuiz(stageIndex);
                quizWrongAttempts=0;
                feedback.textContent="Soal diganti. Pelajari pertanyaan baru dan coba lagi.";
                setTimeout(()=>renderQuiz(currentQuiz),650);
            }
        } else {
            setTimeout(() => renderQuiz(currentQuiz), 700);
        }
    }
}

function updateSand(){
    for(const trap of world.sand){
        if(player.x< trap.x+trap.w && player.x+player.w>trap.x && player.y+player.h>trap.y){
            player.vx*=.82;
            if(Math.random()<.025) showMessage("Pasir hisap! Sprint untuk keluar.",900);
        }
    }
}

function updateFallingRocks(){
    for(const rock of world.rocks){
        rock.timer--;
        if(rock.timer<=0){
            rock.y+=rock.speed;
            if(rock.y>720){
                rock.y=rock.startY;
                rock.timer=rock.delay+Math.random()*80;
            }
            if(player.x<rock.x+rock.w && player.x+player.w>rock.x && player.y<rock.y+rock.h && player.y+player.h>rock.y){
                drainStamina(25);
                rock.y=rock.startY;
                rock.timer=rock.delay;
                showMessage("Kotak jatuh mengenai kamu! Stamina berkurang.",1200);
            }
        }
    }
}

function attackBoss(){
    if(!world.boss || world.boss.defeated || bossAttackCooldown>0) return;

    const dist = distanceTo(world.boss.x, world.boss.y);
    if(dist > 100){
        showMessage("Terlalu jauh! Dekati Guardian lalu tekan J.");
        return;
    }

    const damageToBoss = 18 + stageIndex * 1.2;
    world.boss.hp = Math.max(0, world.boss.hp - damageToBoss);
    bossAttackCooldown = 26;
    beep(240,.1,"square");
    showMessage(`Serangan mengenai Guardian! Energi Guardian: ${Math.max(0,world.boss.hp)}`);

    if(world.boss.hp<=0){
        world.boss.defeated=true;
        showMessage("Guardian kalah! Portal menuju oasis terbuka.",3000);
        updateHUD();
    }
}

function updateBoss(){
    if(!world.boss || world.boss.defeated) return;
    if(bossAttackCooldown>0) bossAttackCooldown--;

    const boss=world.boss;
    const dist = distanceTo(boss.x, boss.y);

    if(dist < 430){
        boss.x += (player.x - boss.x) * .006;
        boss.attackTimer--;

        if(boss.attackTimer <= 0){
            boss.attackTimer = 120;
            const bossDamage = 8 + stageIndex * 0.9;
            if(dist < 110) damage(bossDamage);
        }
    }
}

function updateWorld(){
    updateMoving();
    updateFallingRocks();
    updateSand();
    updateBoss();
    checkItems();
    checkCheckpoint();
    checkEnergyOrb();
    checkSpikes();
    checkGoal();
    updateHUD();
}

function drawRect(x,y,w,h,color){
    ctx.fillStyle=color;
    ctx.fillRect(Math.round(x),Math.round(y),w,h);
}

function drawMountainLayer(baseY,height,color,offset){
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(0,H);
    ctx.lineTo(0,baseY);
    for(let x=-160;x<=W+160;x+=160){
        const peak=x+80+offset;
        ctx.lineTo(peak,baseY-height);
        ctx.lineTo(x+160+offset,baseY);
    }
    ctx.lineTo(W,H);
    ctx.closePath();
    ctx.fill();
}

function drawCloud(x,y,scale,alpha){
    ctx.save();
    ctx.globalAlpha=alpha;
    ctx.fillStyle="#e8fbff";
    ctx.beginPath();
    ctx.arc(x,y,18*scale,0,Math.PI*2);
    ctx.arc(x+24*scale,y-8*scale,25*scale,0,Math.PI*2);
    ctx.arc(x+54*scale,y,17*scale,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
}

function drawSkyDetails(){
    const drift=(stageIndex*37)%180;
    drawCloud(120-drift,125,.8,.2);
    drawCloud(760-drift*.5,175,.55,.16);
    drawMountainLayer(500,180,"rgba(18,69,105,.48)",-drift*.25);
    drawMountainLayer(590,130,"rgba(8,44,75,.7)",drift*.18);

    ctx.save();
    ctx.globalAlpha=.35;
    ctx.fillStyle="#d9fbff";
    for(let i=0;i<18;i++){
        const x=(i*139+stageIndex*31)%W;
        const y=70+(i*67)%330;
        ctx.fillRect(x,y,2+(i%2),2+(i%3));
    }
    ctx.restore();
}

function drawStageDecorations(){
    if(stageIndex!==2) return;

    ctx.save();
    ctx.globalAlpha=.28;
    ctx.strokeStyle="#d9fbff";
    ctx.lineWidth=3;
    for(let i=0;i<5;i++){
        const y=180+i*72;
        const drift=(performance.now()*.08+i*170)%150;
        ctx.beginPath();
        ctx.moveTo(-40+drift,y);
        ctx.quadraticCurveTo(120+drift,y-24,270+drift,y);
        ctx.stroke();
    }
    ctx.restore();

    for(let i=0;i<10;i++){
        const x=(i*137+performance.now()*.025)%W;
        const y=230+(i*43)%280;
        drawRect(x,y,3,3,"#fff0a0");
    }
}

function drawWorld(){
    const data=stages[stageIndex];
    const skyGradient=ctx.createLinearGradient(0,0,0,H);
    skyGradient.addColorStop(0,"#9af0ff");
    skyGradient.addColorStop(.38,"#38c8f5");
    skyGradient.addColorStop(.72,data.sky);
    skyGradient.addColorStop(1,"#063c7c");
    ctx.fillStyle=skyGradient;
    ctx.fillRect(0,0,W,H);

    drawSkyDetails();
    drawStageDecorations();

    for(let i=0;i<22;i++){
        drawRect((i*83+stageIndex*19)%W,80+(i*47)%430,3,3,"rgba(255,240,138,.45)");
    }
    drawRect(0,690,W,30,"#17283a");

    for(const p of world.platforms){
        drawRect(p.x,p.y,p.w,p.h,"#49382c");
        drawRect(p.x,p.y+6,p.w,p.h-6,data.ground);
        drawRect(p.x,p.y,p.w,8,"#79b83d");
        drawRect(p.x,p.y+8,p.w,4,"#315d2c");
    }
    for(const p of world.moving){
        drawRect(p.x,p.y,p.w,p.h,"#3f3229");
        drawRect(p.x,p.y+5,p.w,p.h-5,"#795338");
        drawRect(p.x,p.y,p.w,7,"#8bc34a");
    }
    for(const s of world.spikes){
        const spikeCount=Math.ceil(s.w/14);
        const spikeWidth=s.w/spikeCount;
        for(let spikeIndex=0;spikeIndex<spikeCount;spikeIndex++){
            const x=s.x+spikeIndex*spikeWidth;
            ctx.fillStyle="#d95b4c";
            ctx.beginPath();
            ctx.moveTo(x,s.y+s.h);
            ctx.lineTo(x+spikeWidth/2,s.y);
            ctx.lineTo(x+spikeWidth,s.y+s.h);
            ctx.fill();
        }
        if(stageIndex===2){
            drawRect(s.x,s.y+s.h-3,s.w,3,"#ffb45e");
        }
    }
    for(const trap of world.sand){
        drawRect(trap.x,trap.y,trap.w,trap.h,"#d09a4f");
        for(let x=trap.x+8;x<trap.x+trap.w;x+=22) drawRect(x,trap.y+8,8,3,"#f0c778");
    }
    for(const rock of world.rocks) drawRect(rock.x,rock.y,rock.w,rock.h,"#a15b45");

    drawCheckpoint();
    drawItems();
    drawGoal();
    drawBoss();
    drawPlayer();
}

function drawCheckpoint(){
    const cp=world.checkpoint;
    const pulse=4+Math.sin(performance.now()*.006)*3;
    ctx.save();
    ctx.globalAlpha=.18;
    ctx.fillStyle=cp.active?"#73e0bd":"#8b7582";
    ctx.beginPath();
    ctx.arc(cp.x+10,cp.y-28,25+pulse,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
    drawRect(cp.x-5,cp.y-45,10,45,cp.active?"#73e0bd":"#6b6276");
    drawRect(cp.x+5,cp.y-42,22,14,cp.active?"#ffe27a":"#8b7582");
    drawRect(cp.x+10,cp.y-39,5,8,cp.active?"#fff6ba":"#b6a9a9");
    drawEnergyOrb();
}

function drawEnergyOrb(){
    const orb=world.energyOrb;
    if(!orb || orb.collected) return;
    const bob=Math.sin(performance.now()*.005)*5;
    ctx.save();
    ctx.globalAlpha=.2;
    ctx.fillStyle="#ffe27a";
    ctx.beginPath();
    ctx.arc(orb.x,orb.y+bob,22,0,Math.PI*2);
    ctx.fill();
    ctx.globalAlpha=1;
    ctx.fillStyle="#ffe27a";
    ctx.beginPath();
    ctx.moveTo(orb.x,orb.y-13+bob);
    ctx.lineTo(orb.x+10,orb.y+bob);
    ctx.lineTo(orb.x,orb.y+13+bob);
    ctx.lineTo(orb.x-10,orb.y+bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle="#fff9cf";
    ctx.fillRect(orb.x-2,orb.y-8+bob,4,16);
    ctx.restore();
}

function drawItems(){
    for(const item of world.items){
        if(item.collected) continue;
        if(item.type==="crystal"){
            ctx.fillStyle="#65d9ff";
            ctx.beginPath();
            ctx.moveTo(item.x,item.y-24);
            ctx.lineTo(item.x+14,item.y-8);
            ctx.lineTo(item.x+8,item.y+18);
            ctx.lineTo(item.x,item.y+25);
            ctx.lineTo(item.x-8,item.y+18);
            ctx.lineTo(item.x-14,item.y-8);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle="#d9fbff";
            ctx.beginPath();
            ctx.moveTo(item.x,item.y-18);
            ctx.lineTo(item.x+5,item.y-7);
            ctx.lineTo(item.x,item.y+14);
            ctx.lineTo(item.x-4,item.y-6);
            ctx.closePath();
            ctx.fill();
            continue;
        }
        if(item.type==="heart"){
            ctx.fillStyle="#ffcc35";
            ctx.beginPath();
            ctx.arc(item.x,item.y,11,0,Math.PI*2);
            ctx.fill();
            ctx.fillStyle="#fff0a0";
            ctx.fillRect(item.x-3,item.y-7,3,10);
            ctx.fillStyle="#9b5b19";
            ctx.fillRect(item.x-8,item.y+8,16,3);
            continue;
        }
        const colors={heart:"#ef6574",stamina:"#8ee56c"};
        drawRect(item.x-10,item.y-10,20,20,colors[item.type]||"#fff");
        drawRect(item.x-4,item.y-16,8,32,"#fff3b0");
    }
}

function drawNPCs(){
    return;
}

function drawGoal(){
    const pulse=1+Math.sin(performance.now()*.005)*.12;
    ctx.save();
    ctx.globalAlpha=.2;
    ctx.fillStyle="#b895ff";
    ctx.beginPath();
    ctx.ellipse(world.goal.x,world.goal.y-30,42*pulse,55*pulse,0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
    drawRect(world.goal.x-25,world.goal.y-60,50,60,"#17213b");
    drawRect(world.goal.x-17,world.goal.y-52,34,52,"#9a72ff");
    drawRect(world.goal.x-9,world.goal.y-44,18,44,"#10192c");
    drawRect(world.goal.x-5,world.goal.y-39,10,35,"#d9c6ff");
}

function drawBoss(){
    if(!world.boss || world.boss.defeated) return;
    const b=world.boss;
    drawRect(b.x-35,b.y-70,70,70,"#a33e59");
    drawRect(b.x-25,b.y-95,50,25,"#d27557");
    drawRect(b.x-22,b.y-88,8,8,"#ffe38d");
    drawRect(b.x+14,b.y-88,8,8,"#ffe38d");
    drawRect(b.x-50,b.y-112,100,8,"#261b24");
    drawRect(b.x-50,b.y-112,100*b.hp/b.maxHp,8,"#ef4e61");
}

function drawLabel(x,y,text){
    drawRect(x,y,28,22,"#090b13");
    ctx.fillStyle="#ffe58a";
    ctx.font="bold 15px Courier New";
    ctx.fillText(text,x+9,y+16);
}

function drawPlayer(){
    if(player.invincible>0 && Math.floor(player.invincible/5)%2===0) return;
    const step=Math.floor(player.anim)%2;
    drawRect(player.x+4,player.y+18,24,30,"#8e4034");
    drawRect(player.x+8,player.y+20,16,22,"#d96c42");
    drawRect(player.x+1,player.y+4,30,20,"#f1bd82");
    drawRect(player.x-2,player.y,36,8,"#2a2021");
    drawRect(player.x+6,player.y-3,22,6,"#3d2922");
    drawRect(player.x+8,player.y+12,5,6,"#241b31");
    drawRect(player.x+21,player.y+12,5,6,"#241b31");
    drawRect(player.x+5,player.y+46+step,8,8,"#3a2925");
    drawRect(player.x+20,player.y+46+(1-step),8,8,"#3a2925");
    drawRect(player.x-3,player.y+24,8,18,"#bd714a");
}

function loop(timestamp=0){
    const dt=Math.min(2,(timestamp-lastTime)/16.67||1);
    lastTime=timestamp;
    if(gameStarted){
        updatePlayer();
        updateWorld();
        drawWorld();
    }
    animationFrameId = requestAnimationFrame(loop);
}

window.addEventListener("keydown",e=>{
    if(e.key.toLowerCase()==="j") attackBoss();
});

const originalLoadStage=loadStage;
loadStage=function(i){
    originalLoadStage(i);
    world.sand=[];
    world.rocks=[];
    world.route=null;
    world.npcs=[];
    if(i===4 || i===6){
        world.rocks.push({
            x:190+Math.random()*800,
            y:-80,
            startY:-80,
            w:28,
            h:28,
            speed:4,
            delay:100,
            timer:100
        });
    }
    if(i===6) {
        const bossHealth = 160 + i * 18;
        world.boss={x:1030,y:560,hp:bossHealth,maxHp:bossHealth,attackTimer:90,defeated:false};
    } else world.boss=null;
    updateHUD();
};

window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.confirmExit = confirmExit;
window.closeExitConfirm = closeExitConfirm;
window.exitToMenu = exitToMenu;
window.startGame = startGame;
window.restartGame = restartGame;
window.toggleSound = toggleSound;
window.startSelectedChallenge = startSelectedChallenge;
window.selectChallenge = selectChallenge;
window.openChallengeScreen = openChallengeScreen;
window.closeChallengeScreen = closeChallengeScreen;
