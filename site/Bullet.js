class Bullet {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  draw () {
    fill(255)
    rect(this.x, this.y, 3, 10)
  }
}

class PlayerBullet extends Bullet {
  constructor (x, y, up) {
    super(x, y)
    this.up = up
  }

  update () {
    if (this.up) {
      this.y -= 6
    } else {
      this.y += 6
    }
  }

  isOffScreen () {
    if (this.y < 0 || this.y > height) {
      return true
    } else {
      return false
    }
  }
}

class AlienBullet extends Bullet {
  constructor (x, y) {
    super(x, y)
    this.r = 2
  }

  update () {
    this.y += 2
  }

  hasHitPlayer (player) {
    if (dist(this.x, this.y, player.x, player.y) < this.r + player.r) {
      return true
    }
    return false
  }
}
