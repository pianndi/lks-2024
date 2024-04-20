class Hexagon {
  side = 6
  angle = 2 * Math.PI / this.side
  color = false
  audio = new Audio('./audio/click.mp3')
  hover = false
  constructor(game, x, y, r, disabled = false, number = 0) {
    this.game = game
    this.x = x
    this.y = y
    this.r = r
    this.disabled = disabled
    this.number = number

  }
  draw() {
    this.game.ctx.beginPath()
    for (let i = 0; i < this.side; i++) {
      this.game.ctx.lineTo(this.x + this.r * Math.sin(i * this.angle), this.y + this.r * Math.cos(i * this.angle))
    }
    this.game.ctx.closePath()
    this.game.ctx.strokeStyle = 'silver'
    if (this.disabled) {
      this.game.ctx.fillStyle = 'gray'
      this.game.ctx.fill()
    }
    if (this.color) {
      this.game.ctx.fillStyle = this.color
      this.game.ctx.fill()
    }
    this.game.ctx.stroke()
    if (this.number) {
      this.game.ctx.font = 'bold 24px Arial'
      this.game.ctx.textAlign = 'center'
      this.game.ctx.textBaseline = 'middle'
      this.game.ctx.fillStyle = 'silver'
      this.game.ctx.fillText(this.number, this.x, this.y)
    }

    if (this.hover) {
      this.game.ctx.save()
      this.game.ctx.globalAlpha = 0.5
      this.game.ctx.fillStyle = this.game.turn ? 'red' : 'blue'
      this.game.ctx.fill()
      this.game.ctx.font = 'bold 24px Arial'
      this.game.ctx.textAlign = 'center'
      this.game.ctx.textBaseline = 'middle'
      this.game.ctx.fillStyle = 'silver'
      this.game.ctx.fillText(this.game.number, this.x, this.y)
      this.game.ctx.restore()
    }

  }
  collide(el) {
    const distance = this.game.distance(this, el)
    const inside = distance < this.r * Math.sin(this.angle)
    if (inside && !this.number && !this.disabled) {
      this.hover = true
    } else {
      this.hover = false
    }
    return inside
  }
  click() {
    if (this.disabled) return
    if (this.game.number < this.number) return
    if (this.number) return
    this.color = this.game.turn ? 'red' : 'blue'
    this.number = this.game.number
    this.audio.play()
    this.game.score = [0, 0]
    this.game.hexagons.forEach(hexagon => {
      const distance = this.game.distance(this, hexagon)
      if (distance && distance < this.r * 2 && hexagon.number) {
        if (hexagon.color == (this.game.turn ? 'red' : 'blue')) {
          hexagon.number++
        }
        if (hexagon.number < this.game.number && hexagon.color) {
          hexagon.color = this.game.turn ? 'red' : 'blue'
        }


      }
      this.game.score[hexagon.color == 'red' ? 0 : 1] += hexagon.number
      hexagon.hover = false

    })
    this.game.gameOver()
    this.game.number = Math.ceil(Math.random() * 20)
    this.game.turn = !this.game.turn
    this.game.current.number = this.game.number
    this.game.current.color = this.game.turn ? 'red' : 'blue'
    if (this.game.competitor == 'bot' && !this.game.turn) {
      console.log(this.game.competitor)
      const available = this.game.hexagons.filter(item => !item.disabled && !item.number)
      let indexRand = 0
      const random = Math.random() * (10 - 4) + 4
      for (let i = 0; i < random; i++) {
        setTimeout(() => {
          indexRand = Math.floor(Math.random() * available.length)
          available.map(item => item.hover = false)
          available[indexRand].hover = true
        }, Math.random() * i * 200)
      }
      setTimeout(() => {
        available[indexRand].click()
      }, 200 * random + (Math.random() * (300 - 100) + 100))
    }
  }
}