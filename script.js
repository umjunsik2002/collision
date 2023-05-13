class start extends Phaser.Scene {
    constructor() {
        super('start');
    }
    create() {
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY;
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.add.text(x, 240, "Phaser Pong")
            .setColor('#000000')
            .setFontSize(128)
            .setOrigin(0.5)
        this.add.text(x, 480, "Use ⬆️/⬇️ keys to move the bar")
            .setColor('#000000')
            .setFontSize(64)
            .setOrigin(0.5)
        this.add.text(x, 560, "Press the screen to continue")
            .setColor('#000000')
            .setFontSize(64)
            .setOrigin(0.5)
        this.input.on('pointerdown', () => {
            this.cameras.main.fadeOut(1000);
        });
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('round1');
        });
    }
}

class round1 extends Phaser.Scene {
    constructor() {
        super('round1');
    }

    create() {
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY;
        this.cameras.main.setBackgroundColor('#000000');
        
        const boxWidth = 800;
        const boxHeight = 600;
        const box = this.add.graphics();
        box.fillStyle(0x000000, 0);
        box.fillRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);

        const up = this.add.line(x, 60, 0, 0, boxWidth, 0);
        up.setStrokeStyle(1, 0x808080, 1);
        up.setOrigin(0.5);
        this.physics.add.existing(up);

        const down = this.add.line(x, 660, 0, 0, boxWidth, 0);
        down.setStrokeStyle(1, 0x808080, 1);
        down.setOrigin(0.5);
        this.physics.add.existing(down);

        const left = this.add.line(240, y, 0, 0, 0, boxHeight);
        left.setStrokeStyle(1, 0x808080, 1);
        left.setOrigin(0.5);
        this.physics.add.existing(left);

        const right = this.add.line(1040, y, 0, 0, 0, boxHeight);
        right.setStrokeStyle(1, 0x808080, 1);
        right.setOrigin(0.5);
        this.physics.add.existing(right);

        const centerline = this.add.line(x, y, 0, 0, 0, boxHeight);
        centerline.setStrokeStyle(1, 0x808080, 1);
        centerline.setOrigin(0.5);

        this.add.text(120, 60, "Enemy")
            .setColor('#FF8080')
            .setFontSize(48)
            .setOrigin(0.5)

        this.add.text(1160, 660, "Player")
            .setColor('#8080FF')
            .setFontSize(48)
            .setOrigin(0.5)

        let enemyScore = 0;
        let playerScore = 0;

        const enemyScoreText = this.add.text(120, 120, `Score: ${enemyScore}`)
            .setColor('#FF8080')
            .setFontSize(32)
            .setOrigin(0.5);

        const playerScoreText = this.add.text(1160, 600, `Score: ${playerScore}`)
            .setColor('#8080FF')
            .setFontSize(32)
            .setOrigin(0.5);

        const ballRadius = 10;
        const ball = this.add.circle(x, y, ballRadius, 0xFFFFFF);
        this.physics.add.existing(ball);

        const resetBall = () => {
            ball.setPosition(x, y);
            this.ballVelocity = {
                x: -5,
                y: (Math.random() < 0.5) ? Phaser.Math.FloatBetween(-5, -2) : Phaser.Math.FloatBetween(2, 5)
            };
        }
        resetBall()

        this.updateBall = () => {
            ball.x += this.ballVelocity.x;
            ball.y += this.ballVelocity.y;

            if (this.ballVelocity.x > 0) {
                this.ballVelocity.x += 0.001;
            }
            else {
                this.ballVelocity.x -= 0.001;
            }

            console.log("ballVelocity.x = %ld", this.ballVelocity.x);
        };

        this.physics.add.collider(up, ball, () => {
            this.ballVelocity.y *= -1;
        });

        this.physics.add.collider(down, ball, () => {
            this.ballVelocity.y *= -1;
        });

        this.physics.add.collider(left, ball, () => {
            playerScore++;
            playerScoreText.setText(`Score: ${playerScore}`);
            resetBall();
        });

        this.physics.add.collider(right, ball, () => {
            enemyScore++;
            enemyScoreText.setText(`Score: ${enemyScore}`);
            resetBall();
        });

        const barWidth = 20;
        const barHeight = 100;
        const npcbar = this.add.graphics();
        npcbar.fillStyle(0xFF8080);
        npcbar.fillRect(240, y - barHeight / 2, barWidth, barHeight);
        this.physics.add.existing(npcbar);
        npcbar.body.setSize(barWidth, barHeight);
        npcbar.body.setOffset(240, y - barHeight / 2);
        this.updateNpcBar = () => {
            const dist = 5;
            if (ball.x <= 640) {
                if (npcbar.y < ball.y - dist - 360) {
                    npcbar.y = Phaser.Math.Clamp(npcbar.y + dist, -250, 250);
                }
                else if (npcbar.y > ball.y + dist - 360) {
                    npcbar.y = Phaser.Math.Clamp(npcbar.y - dist, -250, 250);
                }
            }
        };

        const playerbar = this.add.graphics();
        playerbar.fillStyle(0x8080FF);
        playerbar.fillRect(1020, y - barHeight / 2, barWidth, barHeight);
        this.physics.add.existing(playerbar);
        playerbar.body.setSize(barWidth, barHeight);
        playerbar.body.setOffset(1020, y - barHeight / 2);
        this.input.keyboard.enabled = true;
        const keys = this.input.keyboard.createCursorKeys();
        this.updatePlayerBar = () => {
            if (keys.up.isDown) {
                playerbar.y = Phaser.Math.Clamp(playerbar.y - 5, -250, 250);
            }
            else if (keys.down.isDown) {
                playerbar.y = Phaser.Math.Clamp(playerbar.y + 5, -250, 250);
            }
        };

        this.physics.add.collider(npcbar, ball, () => {
            this.ballVelocity.x *= -1;
        });

        this.physics.add.collider(playerbar, ball, () => {
            this.ballVelocity.x *= -1;
        });
    }

    update() {
        this.updateBall();
        this.updateNpcBar();
        this.updatePlayerBar();
    }
}

let config = {
    type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade'
    },
    scene: [start, round1]
}

let game = new Phaser.Game(config);