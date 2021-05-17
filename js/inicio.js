var config={
		type:Phaser.AUTO,
		width:1024,
		height:704,
		pixelArt: true,
		physics:{
			default:'arcade',
			arcade:{
				debug: false,
				gravity:{y:0, x:0}
			}
		},
		scene: [menuPrincipal, juego, menuPausa, victoria, derrota],

		dificultad: 1
};

game=new Phaser.Game(config);

game.config.dificultad = 1;