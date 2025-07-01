// Código do jogo da forca

//Variaveis do Jogo
let StateGame = {
    scrips:{
        palavraJogo: document.querySelector("#PalavraNaTela"),
        dicaJogo: document.querySelector("#DicaNaTela"),
        inputLetra: document.querySelector("#LetraEscolhida"),
        tema: document.querySelector('input[name="Tema"]:checked'),
        btnsAlfabetos: document.querySelector("#AlfabetoJogo"),
    },
    palavrasListas:{
        palavraCorreta:[],
        palavraEscondida:[],
        dificuldade: 0,
        Tema: 0
    }
}
let Vitorias = 0
let Vidas = 6
let Dicas = 1

const audioPerdeu = new Audio('/JogoDaForca/src/audios/SomDerrota.mp3')
const audioAcerto = new Audio('/JogoDaForca/src/audios/SomAcerto.wav')
const audioErrou = new Audio('/JogoDaForca/src/audios/SomIncorreto.wav')
const audioGanhou = new Audio('/JogoDaForca/src/audios/SomVitoria.wav')


//Escolher a palavra com a dica
let palavra = {
    palavra: "",
    dica: "",
}

function EscolherPalavraAleatoria(dificuldade, tema){
    const lista = ListaDePalavras[tema][dificuldade];
    const indiceAleatorio = Math.floor(Math.random() * lista.length);
    const palavraEscolhida = lista[indiceAleatorio];

    palavra.palavra = palavraEscolhida.palavra
    palavra.dica = palavraEscolhida.dica

}

//colocar a palavra e a dica no jogo
function converterPalavra(palavra){
    for(let i = 0;i < palavra.length; i++){
        if(palavra[i] == '-'){
            StateGame.palavrasListas.palavraEscondida.push(`-`)
            StateGame.palavrasListas.palavraCorreta.push(`-`)
        }
        else if(palavra[i] == ' '){
            StateGame.palavrasListas.palavraEscondida.push(` `)
            StateGame.palavrasListas.palavraCorreta.push(` `)
        }else{
            StateGame.palavrasListas.palavraCorreta.push(`${palavra[i]}`)
            StateGame.palavrasListas.palavraEscondida.push(`_`)}
        }
}


function palavraDicaNoJogo(){
    if(StateGame.palavrasListas.palavraEscondida.length == 0){
        converterPalavra(palavra.palavra)
        StateGame.scrips.dicaJogo.innerHTML = `Dica:${palavra.dica}`
    }
    StateGame.scrips.palavraJogo.innerHTML = StateGame.palavrasListas.palavraEscondida.join("")
    
}






//JOGO
function criarTeclado(){
    for(let i = 97; i < 123; i++){
        const btn = document.createElement("button")
        const letter = String.fromCharCode(i).toUpperCase()
        btn.textContent = letter
        btn.classList.add("btn-alfabeto")

        

        //evento de click teclado site
        btn.onclick = () => {
            btn.disabled = true;
            StateGame.scrips.inputLetra.value = letter
            verificarLetra()
        }
        StateGame.scrips.btnsAlfabetos.appendChild(btn)
    }
        //evento de clique teclado real
    document.addEventListener("keydown", (event) => {
        const key = event.key.toUpperCase()
        const botoes = document.querySelectorAll(".btn-alfabeto")

        botoes.forEach(botao =>{
        if(botao.textContent == key && !botao.disabled){
            botao.onclick()
        }
        })
    })
    btnDica = document.createElement("button")
    btnDica.textContent = "💡"
    btnDica.classList.add("btn-dica")
    btnDica.onclick = () => {DicaJogo(btnDica)}
    StateGame.scrips.btnsAlfabetos.appendChild(btnDica)
}

function DicaJogo(btn){
    if(Dicas == 0){
        btn.disabled = true
    }
    
    PegarLetraDaDica()
    palavraDicaNoJogo()
    Dicas--
    const numDicas = document.getElementsByClassName("btn-dica")[0]
    numDicas.setAttribute("data-dica", Dicas + 1)
}

function PegarLetraDaDica(){
    Correta  = StateGame.palavrasListas.palavraCorreta
    Escondida = StateGame.palavrasListas.palavraEscondida
    randomIndex = Math.floor(Math.random()* Escondida.length)
    if(Escondida[randomIndex] == Correta[randomIndex]){
        PegarLetraDaDica()
    }
    StateGame.scrips.inputLetra.value = Correta[randomIndex]
    verificarLetra()

    const botoes = document.querySelectorAll(".btn-alfabeto")

    botoes.forEach(botao =>{
        if(botao.textContent == Correta[randomIndex] && !botao.disabled){
            botao.disabled = true
        }
        })
}

function DesabilitarBotoes(){
    const botoes = document.querySelectorAll(".btn-alfabeto")
    botoes.forEach(botao => botao.disabled = true);
}





//Partida
//verificar Letra
function verificarLetra(){
    //pegar letra
    letra = StateGame.scrips.inputLetra.value
    palavra = StateGame.palavrasListas.palavraCorreta
    palavraEscondida = StateGame.palavrasListas.palavraEscondida
    //verificar letra realmente
    let TemNaPalavra = false
    for(let i = 0;i < palavra.length; i++){
        if(palavra[i].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase() == letra.toUpperCase()){
            palavraEscondida[i] = palavra[i].toUpperCase()
            TemNaPalavra = true
            audioAcerto.play();
        }
    }
    if(palavra.map(item => item.toUpperCase()).join('') == palavraEscondida.map(item => item.toUpperCase()).join('')){
        GanhouJogo();
    }
    if(!TemNaPalavra){
        Vidas--
        audioErrou.play();
        if(Vidas == 0 ){
            Perdeu()
        }
    }
    //limpar input
    imagemForca();
    palavraDicaNoJogo();
    StateGame.scrips.inputLetra.value = ''
}
//Trocar imagem forca
function imagemForca(){
    if(Vidas >= 0){
        imagem = document.getElementsByClassName("forcaImg")
        Array.from(imagem).forEach((img) => img.src = `/JogoDaForca/src/imagens/Forca/forca${Vidas}.jpeg`)
    }   
}
//ganhou
function GanhouJogo(){
    audioGanhou.play()
    Vitorias++
    window.localStorage.setItem("vitorias", Vitorias)
    document.getElementById("vitorias").innerHTML = `Vitorias:${Vitorias}`
    criarDialog("ganhou");
    abrirFecharDialog();
    document.getElementsByClassName("Jogo")[0].style.display = "none"
}
//perdeu
function Perdeu(){
    audioPerdeu.play()
    criarDialog("perdeu")
    abrirFecharDialog();
    document.getElementsByClassName("Jogo")[0].style.display = "none"
}
//Iniciar partida
function IniciarPartida(){
    let dificuldade = document.querySelector('input[name="Dificuldade"]:checked')
    let tema = document.querySelector('input[name="Tema"]:checked')
    document.getElementsByClassName("menu")[0].style.display = "none"
    EscolherPalavraAleatoria(dificuldade.value, tema.value)
    palavraDicaNoJogo()
    criarTeclado()
    document.getElementsByClassName("Jogo")[0].style.display = "flex"
    const numDicas = document.getElementsByClassName("btn-dica")[0]
    numDicas.setAttribute("data-dica", Dicas + 1)
}
//reset
function ResetarJogo(){
    let dificuldade = document.querySelector('input[name="Dificuldade"]:checked')
    let tema = document.querySelector('input[name="Tema"]:checked')
    StateGame.scrips.palavraJogo.innerHTML = ""
    StateGame.scrips.dicaJogo.innerHTML = ""
    StateGame.scrips.inputLetra.value = ""
    StateGame.scrips.btnsAlfabetos.innerHTML = ""
    StateGame.palavrasListas.palavraCorreta = []
    StateGame.palavrasListas.palavraEscondida = []
    Vidas = 6
    Dicas = 1
    imagemForca();
    document.getElementsByClassName("Jogo")[0].style.display = "flex"
    document.querySelector("dialog").style.display = "none"
    EscolherPalavraAleatoria(dificuldade.value, tema.value)
    criarTeclado();
    palavraDicaNoJogo();
    tiraDialog();
}

//Dialog - Modal
const dialog = document.querySelector("dialog");
const dialogItems = {
    resultado: document.querySelector("#dialog-resultado"),
    img: document.querySelector("#dialog-img"),
    palavraCorreta: document.querySelector("#dialog-palavra-correta"),
}
function abrirFecharDialog(){
    dialog.style.display = "flex"
    if(dialog.open){
        dialog.close();
    }else{
        dialog.show();
    }
}
function criarDialog(resultado){
    if(resultado == "ganhou"){
        dialog.classList.add("dialog-ganhou");
        dialogItems.resultado.innerHTML = "👑Ganhou!!👑"
    }else{
        dialog.classList.add("dialog-perdeu");
        dialogItems.resultado.innerHTML = "💀Perdeu!!💀"
    }
    DesabilitarBotoes();  
    dialogItems.palavraCorreta.innerHTML = `Palavra correta: ${StateGame.palavrasListas.palavraCorreta.join("")}`
}
function tiraDialog(){
    dialog.classList.remove("dialog-ganhou");
    dialog.classList.remove("dialog-perdeu");
    const numDicas = document.getElementsByClassName("btn-dica")[0]
    numDicas.setAttribute("data-dica", Dicas + 1)
}






//init - quando o jogo iniciar
function init(){
    if(window.localStorage.getItem("vitorias")){
        Vitorias = window.localStorage.getItem("vitorias")
    }

    document.getElementById("vitorias").innerHTML = `Vitorias:${Vitorias}`
}

init()
