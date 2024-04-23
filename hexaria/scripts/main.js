class Game {
  level = 4;
  hexagons = [];
  turn = 1;
  mouse = {
    x: 0,
    y: 0,
  };
  score = [0, 0];
  number = Math.ceil(Math.random() * 20);
  over = false;
  player1 = "Player";
  player2 = "Bot";
  competitor = "bot";

  constructor(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.bound = this.canvas.getBoundingClientRect();
    this.current = new Hexagon(
      this,
      this.width / 2,
      this.height - 110,
      24,
      true,
      this.number
    );
    this.current.color = this.turn ? "red" : "blue";
    this.canvas.onmousemove = (e) => {
      if (this.competitor == "bot" && !this.turn) return;
      this.mouse = {
        x: e.clientX - this.bound.left,
        y: e.clientY - this.bound.top,
      };

      this.hexagons.map((hexagon) => {
        hexagon.collide(this.mouse);
      });
    };
    this.canvas.onclick = (e) => {
      if (this.competitor == "bot" && !this.turn) return;
      this.mouse = {
        x: e.clientX - this.bound.left,
        y: e.clientY - this.bound.top,
      };

      this.hexagons.map((hexagon) => {
        if (hexagon.collide(this.mouse)) {
          hexagon.click();
        }
      });
    };
    window.onresize = () => {
      this.bound = this.canvas.getBoundingClientRect();
    };
  }
  render() {
    this.hexagons.map((item) => item.draw());
    this.current.draw();
    this.ctx.font = "20px Arial";
    this.ctx.textAlign = "end";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = "silver";
    this.ctx.fillText("Current", this.width / 2 - 30, this.height - 110);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.width / 4, this.height - 80, 20, 20);
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(this.width - this.width / 4, this.height - 80, 20, 20);
    this.ctx.fillStyle = "silver";
    this.ctx.font = "bold 24px Arial";
    this.ctx.textAlign = "start";
    this.ctx.fillText(this.player1, this.width / 4 + 25, this.height - 70);
    this.ctx.textAlign = "end";
    this.ctx.fillText(
      this.player2,
      this.width - this.width / 4 - 5,
      this.height - 70
    );
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.score[0], this.width / 4 + 10, this.height - 40);
    this.ctx.fillText(
      this.score[1],
      this.width - this.width / 4 + 10,
      this.height - 40
    );
  }
  generateHexagons() {
    const a = (2 * Math.PI) / 6;
    const r = 35;
    for (
      let x = 60;
      x + r * Math.sin(a) < r * 10 * 2 - r;
      x += r * 2 * Math.sin(a)
    ) {
      for (
        let y = 60, j = 0;
        y + r * (1 + Math.cos(a)) < r * 2 * 8 - r;
        y += r * (1 + Math.cos(a)), x += (-1) ** j++ * r * Math.sin(a)
      ) {
        this.hexagons.push(new Hexagon(this, x, y, r, false));
      }
    }
    for (let i = 0; i < this.level; i++) {
      const filteredHex = this.hexagons.filter((item) => !item.disabled);
      filteredHex[
        Math.floor(Math.random() * filteredHex.length)
      ].disabled = true;
    }
  }
  distance(a, b) {
    const x = a.x - b.x;
    const y = a.y - b.y;

    return Math.sqrt(x * x + y * y);
  }
  gameOver() {
    const disabled = this.hexagons.filter((item) => item.disabled).length;
    const all = this.hexagons.filter((item) => item.number).length;

    if (all >= this.hexagons.length - disabled) {
      this.over = true;
    }
  }
  saveScore() {
    const score =
      JSON.parse(localStorage.getItem("hex-leaderboard")) || new Array();
    score.push({
      player1: {
        name: this.player1,
        score: this.score[0],
      },
      player2: {
        name: this.player2,
        score: this.score[1],
      },
      date: Date.now(),
    });
    localStorage.setItem("hex-leaderboard", JSON.stringify(score));
    fetchLeaderboard();
  }
}
// input
const sort = document.getElementById("sort");

//element
const bodyLeader = document.getElementById("bodyLeader");
const alertDialog = document.querySelector(".alert.over");
const gameboard = document.querySelector(".container.game");
function main() {
  const urlParam = new URLSearchParams(window.location.search);
  gameboard.classList.remove("hide");
  fetchLeaderboard();
  alertDialog.classList.add("hide");
  const canvas = document.getElementById("cvs");
  canvas.width = 700;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  // config
  const game = new Game(canvas, ctx);
  game.level = parseInt(urlParam.get("level")) || 4;
  game.competitor = urlParam.get("competitor") || "bot";
  game.player1 = urlParam.get("player1") || "Player";
  game.player2 = urlParam.get("player2") || "Bot";
  game.generateHexagons();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render();
    if (game.over) {
      game.saveScore();
      alertDialog.classList.remove("hide");
    } else {
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}
main();
function fetchLeaderboard() {
  const score =
    JSON.parse(localStorage.getItem("hex-leaderboard")) || new Array();
  if (sort.value == "score") {
    score.sort(
      (a, b) =>
        b.player1.score + b.player2.score - (a.player1.score + a.player2.score)
    );
  } else {
    score.sort((a, b) => b.date - a.date);
  }
  let html = "";
  score.forEach((item, i) => {
    html += `
    <div class="item" onclick='detail(${i})'>
          <span><b>${item.player1.name}</b> vs <b>${item.player2.name}</b></span>
          <span>${item.player1.score} - ${item.player2.score}</span>
          <button>Detail</button>
        </div>
    `;
  });
  if (!score.length) html += "<h3>Kosong</h3>";
  bodyLeader.innerHTML = html;
  return score;
}

function detail(index) {
  const score = fetchLeaderboard()[index];
  const tanggal = new Date(score.date);
  detailDialog.classList.remove("hide");
  detailDialog.innerHTML = `<div class="close">&times;</div>
  <h2>Detail</h2>
  <p><b>${score.player1.name}</b> vs <b>${score.player2.name}</b></p>
  <p>${score.player1.score} - ${score.player2.score}</p>
  <p>${tanggal.toString()}</p>`;
  document.querySelector(".close").addEventListener("click", (e) => {
    e.target.parentElement.classList.add("hide");
  });
}

sort.addEventListener("change", () => {
  fetchLeaderboard();
});
