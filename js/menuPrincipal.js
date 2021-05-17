class menuPrincipal extends Phaser.Scene {
	constructor(){
		super("menuPrincipal");
	}

	preload()
	{
		this.load.image('pantallaInicio','assets/menus/menuPrincipal.jpg');
		this.load.image('pantallaOpciones','assets/menus/menuOpciones.jpg');
	}

	create()
	{
		console.log('dificultad = ' + this.game.config.dificultad);

		var scene = this;

		this.background = this.add.image(config.width/2,config.height/2,'pantallaInicio');

		this.lights.enable().setAmbientColor(0x555555);
		
		this.light = this.lights.addLight(-200, -200, 300).setScrollFactor(0.0).setIntensity(2);
		this.lightPoint = this.lights.addLight(0, 0, 75, 0x7777ff).setScrollFactor(0.0).setIntensity(10);

		this.background.setPipeline('Light2D');

		var lightPoint = this.lightPoint;
		this.input.on('pointermove', function (pointer) {

			this.pointer = pointer;

			lightPoint.x = this.pointer.x;
			lightPoint.y = this.pointer.y;

			//console.log('X='+this.pointer.x+'Y='+this.pointer.y)
		});

		this.jugar = this.add.rectangle(825, 325, 400, 200);
		this.physics.add.existing(this.jugar, false);
		this.jugar.setInteractive();

		var light = this.light;
		var jugar = this.jugar;
		this.jugar.on('pointerover', function () {
			//console.log('hola')
			light.x = jugar.x;
			light.y = jugar.y;
		});
		this.jugar.on('pointerout', function () {
			//console.log('hola')
			light.x = -200;
			light.y = -200;
		});
		this.jugar.on('pointerdown', function () {
			scene.scene.stop(scene);
			scene.scene.launch('juego')
		});

		this.options = this.add.rectangle(190, 213, 300, 100);
		this.physics.add.existing(this.options, false);
		this.options.setInteractive();

		var options = this.options;
		
		this.options.on('pointerover', function () {
			//console.log('hola')
			light.x = options.x;
			light.y = options.y;
		});
		this.options.on('pointerout', function () {
			//console.log('hola')
			light.x = -200;
			light.y = -200;
		});
		
		

		this.pantallaOptions = scene.add.image(config.width/2,config.height/2,'pantallaOpciones');
		this.pantallaOptions.alpha = 0;
		this.pantallaOptions.activa = false;

		this.options.on('pointerdown', function () {
			//console.log('hola')
			scene.pantallaOptions.alpha = 1;
			scene.pantallaOptions.activa = true;
			//this.background = this.add.image;
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