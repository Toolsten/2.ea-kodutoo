/* TYPER */
const TYPER = function () {
  if (TYPER.instance_) {
    return TYPER.instance_
  }
  TYPER.instance_ = this

  this.WIDTH = window.innerWidth
  this.HEIGHT = window.innerHeight
  this.canvas = null
  this.ctx = null

  this.words = []
  this.word = null
  this.wordMinLength = 5
  this.guessedWords = 0
  this.user = {name: null}
  this.score = 0

  this.init()
}

window.TYPER = TYPER

TYPER.prototype = {
  init: function () {
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.ctx = this.canvas.getContext('2d')

    this.canvas.style.width = this.WIDTH + 'px'
    this.canvas.style.height = this.HEIGHT + 'px'

    this.canvas.width = this.WIDTH * 2
    this.canvas.height = this.HEIGHT * 2

    this.loadWords()
  },

  loadWords: function () {
    const xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
        const response = xmlhttp.responseText
        const wordsFromFile = response.split('\n')

        typer.words = structureArrayByWordLength(wordsFromFile)

    typer.askPlayerData();

        typer.start()
      }
    }

    xmlhttp.open('GET', './lemmad2013.txt', true)
    xmlhttp.send()
  },

  start: function () {
    this.generateWord()
    this.word.Draw()

    window.addEventListener('keypress', this.keyPressed.bind(this))
    this.BeginTime = new Date().getTime()
    this.timer = window.setInterval(this.loop.bind(this), 1)
  },
  askPlayerData: function(){
		var user = prompt("Sisesta mängija nimi");
    localStorage.setItem('user', JSON.stringify(user))
  }, 
  savePlayerData: function(){
    let allPlayers = JSON.parse(localStorage.getItem('allPlayers'))
    if(allPlayers === null){allPlayers = []}
    this.user = JSON.parse(localStorage.getItem('user'))
		if (this.user !== null && this.user !== '') {
      let player = {
        'Mangija': this.user,
        'Skoor': this.score
      }
      localStorage.setItem('player', JSON.stringify(player))
      allPlayers.push(player)
      localStorage.setItem('allPlayers', JSON.stringify(allPlayers))
    }
	},
  loop: function () {
    const RealTime = new Date().getTime()
    this.counter = RealTime - this.BeginTime
    this.word.Draw()
    this.stop();
  },

  stop: function () {
    const time = document.getElementById('time').value

    if (this.counter >= parseInt(time + '000')) {
      clearInterval(this.timer)
      this.savePlayerData()
      var playername = JSON.parse(localStorage.getItem('user'))
      alert(`Täname mängimast ${playername} teie skoor on ${this.score}`)
      
      this.canvas.remove()
      this.new()
    }
  },

  new: function () {
    this.canvas.remove()
    clearInterval(this.timer)
    document.getElementById("Restart").addEventListener("click", function(){
    location.reload()
});
  }, 

  generateWord: function () {
    const generatedWordLength = this.wordMinLength + parseInt(this.guessedWords / 5)
    const randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()
    const wordFromArray = this.words[generatedWordLength][randomIndex]

    this.word = new Word(wordFromArray, this.canvas, this.ctx)
  },

  keyPressed: function (event) {
    const letter = String.fromCharCode(event.which)

    if (letter === this.word.left.charAt(0)) {
      this.word.removeFirstLetter()
      this.score += 1;

      if (this.word.left.length === 0) {
        this.guessedWords += 1
        this.score = this.guessedWords * 10;
        
        this.generateWord()
      }

      this.word.Draw()

    } else {
			
			// vale tähe korral blinkib errori
			document.getElementById("canvas").style.backgroundColor = "red";
			setTimeout(function(){ document.getElementById("canvas").style.backgroundColor = "white"; }, 100);
			this.score -= 4;
      console.log(this.score)

			
		}
  }
}

/* WORD */
const Word = function (word, canvas, ctx) {
  this.word = word
  this.left = this.word
  this.canvas = canvas
  this.ctx = ctx
}

Word.prototype = {
  Draw: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.textAlign = 'center'
    this.ctx.font = '140px Courier'
    this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)
  },

  removeFirstLetter: function () {
    this.left = this.left.slice(1)
  }
}

/* HELPERS */
function structureArrayByWordLength (words) {
  let tempArray = []

  for (let i = 0; i < words.length; i++) {
    const wordLength = words[i].length
    if (tempArray[wordLength] === undefined)tempArray[wordLength] = []

    tempArray[wordLength].push(words[i])
  }

  return tempArray
}

const startgame = function () {
  document.getElementById('gamestarter').style.display = 'none'
  const typer = new TYPER()
  window.typer = typer
}

