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
            this.scene.start('level1');
        });
    }
}

class level1 extends Phaser.Scene {
    constructor() {
        super('level1');
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

        this.ballVelocity = {
            x: 0,
            y: 0
        }
        const resetBall = () => {
            ball.setPosition(x, y);
            ball.setVisible(false);
            this.ballVelocity = {
                x: 0,
                y: 0
            };
            setTimeout(() => {
                ball.setVisible(true);
                this.ballVelocity = {
                    x: -5,
                    y: (Math.random() < 0.5) ? Phaser.Math.FloatBetween(-4, -2) : Phaser.Math.FloatBetween(2, 4)
                };
            }, 1000);
        };
        resetBall()

        this.updateBall = () => {
            if (ball.visible) {
                ball.x += this.ballVelocity.x;
                ball.y += this.ballVelocity.y;

                if (this.ballVelocity.x > 0) {
                    this.ballVelocity.x += 0.002;
                }
                else {
                    this.ballVelocity.x -= 0.002;
                }
            }
        };

        this.physics.add.collider(up, ball, () => {
            this.ballVelocity.y = Math.abs(this.ballVelocity.y);
        });

        this.physics.add.collider(down, ball, () => {
            this.ballVelocity.y = -Math.abs(this.ballVelocity.y);
        });

        this.physics.add.collider(left, ball, () => {
            resetBall();
            playerScore++;
            playerScoreText.setText(`Score: ${playerScore}`);
            if (playerScore >= 2) {
                this.cameras.main.fadeOut(1000, 255, 255, 255);
            }
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('level1score', { playerScore, enemyScore });
            });
        });

        this.physics.add.collider(right, ball, () => {
            resetBall();
            enemyScore++;
            enemyScoreText.setText(`Score: ${enemyScore}`);
            if (enemyScore >= 2) {
                this.cameras.main.fadeOut(1000, 255, 255, 255);
            }
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('level1score', { playerScore, enemyScore });
            });
        });

        const barWidth = 15;
        const barHeight = 100;
        const npcbar = this.add.graphics();
        npcbar.fillStyle(0xFF8080);
        npcbar.fillRect(240, y - barHeight / 2, barWidth, barHeight);
        this.physics.add.existing(npcbar);
        npcbar.body.setSize(barWidth, barHeight);
        npcbar.body.setOffset(240, y - barHeight / 2);
        this.updateNpcBar = () => {
            const dist = 5;
            if ((ball.x <= 640) && (ball.x >= 240)) {
                if (npcbar.y < ball.y - dist - 360) {
                    npcbar.y = Phaser.Math.Clamp(npcbar.y + dist, -250, 250);
                }
                else if (npcbar.y > ball.y + dist - 360) {
                    npcbar.y = Phaser.Math.Clamp(npcbar.y - dist, -250, 250);
                }
            }
            else {
                if (npcbar.y < 0 - 2) {
                    npcbar.y = Phaser.Math.Clamp(npcbar.y + 2, -250, 0);
                } 
                else if (npcbar.y > 0 + 2) {
                    npcbar.y = Phaser.Math.Clamp(npcbar.y - 2, 0, 250);
                }
            }
        };

        const playerbar = this.add.graphics();
        playerbar.fillStyle(0x8080FF);
        playerbar.fillRect(1025, y - barHeight / 2, barWidth, barHeight);
        this.physics.add.existing(playerbar);
        playerbar.body.setSize(barWidth, barHeight);
        playerbar.body.setOffset(1025, y - barHeight / 2);
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

        this.physics.add.overlap(npcbar, ball, () => {
            this.ballVelocity.x = Math.abs(this.ballVelocity.x);
        });

        this.physics.add.overlap(playerbar, ball, () => {
            this.ballVelocity.x = -Math.abs(this.ballVelocity.x);
        });
    }

    update() {
        this.updateBall();
        this.updateNpcBar();
        this.updatePlayerBar();
    }
}

class level1score extends Phaser.Scene {
    constructor() {
        super('level1score');
    }

    create() {
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY;
        this.cameras.main.setBackgroundColor('#FFFFFF');
        const { playerScore, enemyScore } = this.scene.settings.data;

        this.add.text(320, 144, 'Enemy Score:')
            .setColor('#FF4040')
            .setFontSize(48)
            .setOrigin(0.5)

        this.add.text(320, 288, `${enemyScore}`)
            .setColor('#FF4040')
            .setFontSize(128)
            .setOrigin(0.5)
        
        this.add.text(960, 144, 'Player Score:')
            .setColor('#4040FF')
            .setFontSize(48)
            .setOrigin(0.5)

        this.add.text(960, 288, `${playerScore}`)
            .setColor('#4040FF')
            .setFontSize(128)
            .setOrigin(0.5)

            if (playerScore > enemyScore) {
                this.add.text(x, 504, 'You won!')
                    .setColor('#4040FF')
                    .setFontSize(64)
                    .setOrigin(0.5)
            }
            else {
                this.add.text(x, 504, 'You lost...')
                    .setColor('#FF4040')
                    .setFontSize(64)
                    .setOrigin(0.5)
            }

        this.add.text(x, 576, 'Press the screen to proceed to level 2')
            .setColor('#000000')
            .setFontSize(48)
            .setOrigin(0.5)

        this.input.on('pointerdown', () => {
            this.cameras.main.fadeOut(1000);
        });
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('level2');
        });
    }
}

class level2 extends Phaser.Scene {
    constructor() {
        super('level2');
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

        this.ballVelocity = {
            x: 0,
            y: 0
        }
        const resetBall = () => {
            ball.setPosition(x, y);
            ball.setVisible(false);
            this.ballVelocity = {
                x: 0,
                y: 0
            };
            setTimeout(() => {
                ball.setVisible(true);
                this.ballVelocity = {
                    x: -7,
                    y: (Math.random() < 0.5) ? Phaser.Math.FloatBetween(-4, -2) : Phaser.Math.FloatBetween(2, 4)
                };
            }, 1000);
        };
        resetBall()

        this.updateBall = () => {
            if (ball.visible) {
                ball.x += this.ballVelocity.x;
                ball.y += this.ballVelocity.y;

                if (this.ballVelocity.x > 0) {
                    this.ballVelocity.x += 0.003;
                }
                else {
                    this.ballVelocity.x -= 0.003;
                }
            }
        };

        this.physics.add.collider(up, ball, () => {
            this.ballVelocity.y = Math.abs(this.ballVelocity.y);
        });

        this.physics.add.collider(down, ball, () => {4
            this.ballVelocity.y = -Math.abs(this.ballVelocity.y);
        });

        this.physics.add.collider(left, ball, () => {
            resetBall();
            playerScore++;
            playerScoreText.setText(`Score: ${playerScore}`);
            if (playerScore >= 3) {
                this.cameras.main.fadeOut(1000, 255, 255, 255);
            }
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('level2score', { playerScore, enemyScore });
            });
        });

        this.physics.add.collider(right, ball, () => {
            resetBall();
            enemyScore++;
            enemyScoreText.setText(`Score: ${enemyScore}`);
            if (enemyScore >= 3) {
                this.cameras.main.fadeOut(1000, 255, 255, 255);
            }
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('level2score', { playerScore, enemyScore });
            });
        });

        const barWidth = 15;
        const barHeight = 100;
        const npcbar = this.add.graphics();
        npcbar.fillStyle(0xFF8080);
        npcbar.fillRect(240, y - barHeight / 2, barWidth, barHeight);
        this.physics.add.existing(npcbar);
        npcbar.body.setSize(barWidth, barHeight);
        npcbar.body.setOffset(240, y - barHeight / 2);
        this.updateNpcBar = () => {
            const dist = 5;
            if ((ball.x <= 640) && (ball.x >= 240)) {
                if (npcbar.y < ball.y - dist - 360) {
                    npcbar.y = Phaser.Math.Clamp(npcbar.y + dist, -250, 250);
                }
                else if (npcbar.y > ball.y + dist - 360) {
                    npcbar.y = Phaser.Math.Clamp(npcbar.y - dist, -250, 250);
                }
            }
            else {
                if (npcbar.y < 0 - 3) {
                    npcbar.y = Phaser.Math.Clamp(npcbar.y + 3, -250, 0);
                } 
                else if (npcbar.y > 0 + 3) {
                    npcbar.y = Phaser.Math.Clamp(npcbar.y - 3, 0, 250);
                }
            }
        };

        const playerbar = this.add.graphics();
        playerbar.fillStyle(0x8080FF);
        playerbar.fillRect(1025, y - barHeight / 2, barWidth, barHeight);
        this.physics.add.existing(playerbar);
        playerbar.body.setSize(barWidth, barHeight);
        playerbar.body.setOffset(1025, y - barHeight / 2);
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

        this.physics.add.overlap(npcbar, ball, () => {
            this.ballVelocity.x = Math.abs(this.ballVelocity.x);
        });

        this.physics.add.overlap(playerbar, ball, () => {
            this.ballVelocity.x = -Math.abs(this.ballVelocity.x);
        });
    }

    update() {
        this.updateBall();
        this.updateNpcBar();
        this.updatePlayerBar();
    }
}

class level2score extends Phaser.Scene {
    constructor() {
        super('level2score');
    }

    create() {
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY;
        this.cameras.main.setBackgroundColor('#FFFFFF');
        const { playerScore, enemyScore } = this.scene.settings.data;

        this.add.text(320, 144, 'Enemy Score:')
            .setColor('#FF4040')
            .setFontSize(48)
            .setOrigin(0.5)

        this.add.text(320, 288, `${enemyScore}`)
            .setColor('#FF4040')
            .setFontSize(128)
            .setOrigin(0.5)
        
        this.add.text(960, 144, 'Player Score:')
            .setColor('#4040FF')
            .setFontSize(48)
            .setOrigin(0.5)

        this.add.text(960, 288, `${playerScore}`)
            .setColor('#4040FF')
            .setFontSize(128)
            .setOrigin(0.5)

        if (playerScore > enemyScore) {
            this.add.text(x, 504, 'You won!')
                .setColor('#4040FF')
                .setFontSize(64)
                .setOrigin(0.5)
        }
        else {
            this.add.text(x, 504, 'You lost...')
                .setColor('#FF4040')
                .setFontSize(64)
                .setOrigin(0.5)
        }

        this.add.text(x, 576, 'Press the screen to proceed to level 3')
            .setColor('#000000')
            .setFontSize(48)
            .setOrigin(0.5)

        this.input.on('pointerdown', () => {
            this.cameras.main.fadeOut(1000);
        });
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('level3');
        });
    }
}

class level3 extends Phaser.Scene {
    constructor() {
        super('level3');
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

        this.ballVelocity = {
            x: 0,
            y: 0
        }
        const resetBall = () => {
            ball.setPosition(x, y);
            ball.setVisible(false);
            this.ballVelocity = {
                x: 0,
                y: 0
            };
            setTimeout(() => {
                ball.setVisible(true);
                this.ballVelocity = {
                    x: -10,
                    y: (Math.random() < 0.5) ? Phaser.Math.FloatBetween(-4, -2) : Phaser.Math.FloatBetween(2, 4)
                };
            }, 1000);
        };
        resetBall()

        this.updateBall = () => {
            if (ball.visible) {
                ball.x += this.ballVelocity.x;
                ball.y += this.ballVelocity.y;

                if (this.ballVelocity.x > 0) {
                    this.ballVelocity.x += 0.005;
                }
                else {
                    this.ballVelocity.x -= 0.005;
                }
            }
        };

        this.physics.add.collider(up, ball, () => {
            this.ballVelocity.y = Math.abs(this.ballVelocity.y);
        });

        this.physics.add.collider(down, ball, () => {4
            this.ballVelocity.y = -Math.abs(this.ballVelocity.y);
        });

        this.physics.add.collider(left, ball, () => {
            resetBall();
            playerScore++;
            playerScoreText.setText(`Score: ${playerScore}`);
            if (playerScore >= 4) {
                this.cameras.main.fadeOut(1000, 255, 255, 255);
            }
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('level3score', { playerScore, enemyScore });
            });
        });

        this.physics.add.collider(right, ball, () => {
            resetBall();
            enemyScore++;
            enemyScoreText.setText(`Score: ${enemyScore}`);
            if (enemyScore >= 4) {
                this.cameras.main.fadeOut(1000, 255, 255, 255);
            }
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('level3score', { playerScore, enemyScore });
            });
        });

        const barWidth = 15;
        const barHeight = 100;
        const npcbar = this.add.graphics();
        npcbar.fillStyle(0xFF8080);
        npcbar.fillRect(240, y - barHeight / 2, barWidth, barHeight);
        this.physics.add.existing(npcbar);
        npcbar.body.setSize(barWidth, barHeight);
        npcbar.body.setOffset(240, y - barHeight / 2);
        let npcdist = 5;
        this.updateNpcBar = () => {
            if (npcbar.y < ball.y - npcdist - 360) {
                npcbar.y = Phaser.Math.Clamp(npcbar.y + npcdist, -250, 250);
            }
            else if (npcbar.y > ball.y + npcdist - 360) {
                npcbar.y = Phaser.Math.Clamp(npcbar.y - npcdist, -250, 250);
            }
            npcdist += 0.001;
        };

        const playerbar = this.add.graphics();
        playerbar.fillStyle(0x8080FF);
        playerbar.fillRect(1025, y - barHeight / 2, barWidth, barHeight);
        this.physics.add.existing(playerbar);
        playerbar.body.setSize(barWidth, barHeight);
        playerbar.body.setOffset(1025, y - barHeight / 2);
        this.input.keyboard.enabled = true;
        const keys = this.input.keyboard.createCursorKeys();
        let playerdist = 5;
        this.updatePlayerBar = () => {
            if (keys.up.isDown) {
                playerbar.y = Phaser.Math.Clamp(playerbar.y - playerdist, -250, 250);
            }
            else if (keys.down.isDown) {
                playerbar.y = Phaser.Math.Clamp(playerbar.y + playerdist, -250, 250);
            }
            playerdist += 0.001;
        };

        this.physics.add.overlap(npcbar, ball, () => {
            this.ballVelocity.x = Math.abs(this.ballVelocity.x);
        });

        this.physics.add.overlap(playerbar, ball, () => {
            this.ballVelocity.x = -Math.abs(this.ballVelocity.x);
        });
    }

    update() {
        this.updateBall();
        this.updateNpcBar();
        this.updatePlayerBar();
    }
}

class level3score extends Phaser.Scene {
    constructor() {
        super('level3score');
    }

    create() {
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY;
        this.cameras.main.setBackgroundColor('#FFFFFF');
        const { playerScore, enemyScore } = this.scene.settings.data;

        this.add.text(320, 144, 'Enemy Score:')
            .setColor('#FF4040')
            .setFontSize(48)
            .setOrigin(0.5)

        this.add.text(320, 288, `${enemyScore}`)
            .setColor('#FF4040')
            .setFontSize(128)
            .setOrigin(0.5)
        
        this.add.text(960, 144, 'Player Score:')
            .setColor('#4040FF')
            .setFontSize(48)
            .setOrigin(0.5)

        this.add.text(960, 288, `${playerScore}`)
            .setColor('#4040FF')
            .setFontSize(128)
            .setOrigin(0.5)

        if (playerScore > enemyScore) {
            this.add.text(x, 504, 'You won!')
                .setColor('#4040FF')
                .setFontSize(64)
                .setOrigin(0.5)
        }
        else {
            this.add.text(x, 504, 'You lost...')
                .setColor('#FF4040')
                .setFontSize(64)
                .setOrigin(0.5)
        }

        this.add.text(x, 576, 'Press the screen to proceed to main menu')
            .setColor('#000000')
            .setFontSize(48)
            .setOrigin(0.5)

        this.input.on('pointerdown', () => {
            this.cameras.main.fadeOut(1000, 255, 255, 255);
        });
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('start');
        });
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        fps: 240
    },
    scene: [start, level1, level1score, level2, level2score, level3, level3score]
};

let game = new Phaser.Game(config);