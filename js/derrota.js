class derrota extends Phaser.Scene {
	constructor(){
		super("derrota");
	}

	preload()
	{
		this.load.image('derrota','assets/menus/lastima.png');
		this.load.image('pantallaOpciones','assets/menus/menuOpciones.jpg');
	}

	create()
	{
		var scene = this;

		//console.log('pausado')

		this.comunicadorPausa = this.add.image(config.width/2,config.height/2,'derrota');
		this.comunicadorPausa.setDepth(5);
		console.log(this.comunicadorPausa)

		this.salir = this.add.rectangle(412, 560, 50, 50);
		this.physics.add.existing(this.salir, false);
		this.salir.setInteractive();

		this.salir.on('pointerdown', function () {
			scene.scene.stop(scene);
			scene.scene.stop('juego');
			scene.scene.launch('menuPrincipal');
		});

		this.options = this.add.rectangle(76, 560, 50, 50);
		this.physics.add.existing(this.options, false);
		this.options.setInteractive();

		var options = this.options;
		
		this.pantallaOptions = scene.add.image(config.width/2,config.height/2,'pantallaOpciones');
		this.pantallaOptions.setDepth(10);
		this.pantallaOptions.alpha = 0;
		this.pantallaOptions.activa = false;

		this.options.on('pointerdown', function () {
			//console.log('hola')
			scene.scene.stop(scene);
			scene.scene.stop('juego');
			scene.scene.launch('juego');
			//this.comunicadorPausa = this.add.image;
		});

		this.KeyS=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	}

	update()
	{
		if (this.pantallaOptions.activa == true && this.KeyS.isDown)
		{
			this.pantallaOptions.alpha = 0;
			this.pantallaOptions.activa = false;
		}
	}
}