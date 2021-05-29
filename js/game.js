class juego extends Phaser.Scene {
	constructor(){
		super("juego");
	}

	preload()
	{
		this.load.image('suelo','assets/images/suelo.png');
		this.load.spritesheet('tanque','assets/images/tankIdle.png', { frameWidth: 32, frameHeight: 32});
		this.load.image('canon','assets/images/tankCanon.png');
		this.load.image('baliza','assets/images/baliza.png');
		this.load.spritesheet('tanqueMove', 'assets/images/tankMove.png', { frameWidth: 32, frameHeight: 32});
		this.load.image('bala','assets/images/bala.png');
		this.load.image('uniwasp','assets/images/uniwasp.png');
		this.load.image('lumi','assets/images/lumi.png');
	}


	create()
	{
		console.log('dificultad = ' + this.game.config.dificultad)

		this.TGBalas=0;
		this.tiempoEntreBalas = 60;
		this.tiempoMargen = 0;

		this.temporizadorSegundos = 0;
		this.temporizadorMinutos = 1 * this.game.config.dificultad;
		this.limiteEnemigos = 10+ Math.floor(this.game.config.dificultad);

		this.TGEne = 120;
		this.tiempoEntreEnemigos = 120 / this.game.config.dificultad;

		this.background = this.add.image(config.width/2,config.height/2,'suelo');

		this.background.pantallaX = config.width/this.background.width;
		this.background.pantallaY = config.height/this.background.height;

		this.background.setScale(this.background.pantallaX,this.background.pantallaY);
		this.background.tint = 0x555555;

		this.suelo = this.physics.add.staticGroup({
			key: 'suelo',
			setScale: {x: 2, y: 2},
			frameQuantity: 16,
			gridAlign: {
				x: 48,
				y: 48,
				width: 16,
				height: 2,
				cellWidth: 64,
				cellHeight: 64
			},
			setDepth: 3,
		});

		this.suelo.createMultiple({
			key: 'suelo',
			setScale: {x: 2, y: 2},
			frameQuantity: 16,
			gridAlign: {
				x: 48,
				y: config.height-16,
				width: 16,
				height: 2,
				cellWidth: 64,
				cellHeight: 64
			}
		});

		this.suelo.createMultiple({
			key: 'suelo',
			setScale: {x: 2, y: 2},
			frameQuantity: 9,
			gridAlign: {
				x: 48,
				y: 48+64,
				width: 1,
				height: 9,
				cellWidth: 64,
				cellHeight: 64
			}
		});

		this.suelo.createMultiple({
			key: 'suelo',
			setScale: {x: 2, y: 2},
			frameQuantity: 9,
			gridAlign: {
				x: config.width-16,
				y: 48+64,
				width: 1,
				height: 9,
				cellWidth: 64,
				cellHeight: 64
			}
		});

		Phaser.Actions.Call(this.suelo.getChildren(), function(obj) {
			obj.setSize(64,64);
			obj.gridX = (obj.x - 32) / 64;
			obj.gridY = (obj.y - 32) / 64;
			console.log(obj.gridY + ' ' + obj.gridX);
		});

		console.log(this.suelo.getLength());
		//console.log(this.suelo.getChildren());

		this.bala = this.physics.add.group();


		this.baliza = this.add.sprite(64 + 32,config.height - 64 - 32,'baliza');
		this.baliza.setScale(2,2);

		this.tiempo=this.add.text(this.baliza.x-24,this.baliza.y-16,'00:00');
		this.enemigos=this.add.text(this.baliza.x-24,this.baliza.y-0,'00:00');
		this.tiempo.setTint(0x00ff00);
		this.tiempo.time = 0;
		this.enemigos.setTint(0x00ff00);

		this.info=this.add.text(32,32,'disparar = SPACE         pausa = P       ganar nivel automaticamente = M');
		this.info.setDepth(10);

		//score=this.add.text(16,16,'Puntuacion:'+puntuacion,{fontsize:'32px',fill:'#FFF'});
		//console.log(config.width);
		/*{
			key: 'tanque',
			setScale: {x: 2, y: 2},
			setXY: {x: 64,y: 64}
		};*/


		this.tanque = this.physics.add.sprite(this.baliza.x,this.baliza.y,'tanque').setScale(2,2);
		this.tanque.setDepth(3);
		this.tanque.animado = 0;

		this.anims.create({
			key: 'movimiento',
			frames: this.anims.generateFrameNumbers('tanqueMove'),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: 'idle',
			frames: [{ key: 'tanque', frame: 0}],
			frameRate: 20
		});

		this.canon = this.physics.add.sprite(this.tanque.x,this.tanque.y,'canon').setScale(2,2);
		this.tanque.setDepth(2);

		this.tanqueUp = this.add.rectangle(0, 0, 16, 8);
		this.physics.add.existing(this.tanqueUp, false);

		this.physics.add.overlap(this.tanqueUp, this.suelo, function(){
			this.tanqueUp.detector = true;
		}, null, this);

		this.tanqueDown = this.add.rectangle(0, 0, 16, 8);
		this.physics.add.existing(this.tanqueDown, false);

		this.physics.add.overlap(this.tanqueDown, this.suelo, function(){
			this.tanqueDown.detector = true;
		}, null, this);

		this.tanqueLeft = this.add.rectangle(0, 0, 8, 16);
		this.physics.add.existing(this.tanqueLeft, false);

		this.physics.add.overlap(this.tanqueLeft, this.suelo, function(){
			this.tanqueLeft.detector = true;
		}, null, this);

		this.tanqueRight = this.add.rectangle(0, 0, 8, 16);
		this.physics.add.existing(this.tanqueRight, false);

		this.physics.add.overlap(this.tanqueRight, this.suelo, function(){
			this.tanqueRight.detector = true;
		}, null, this);

		this.uniwasp = this.physics.add.group();

		this.lights.enable().setAmbientColor(0x222222);
		
		this.light = this.lights.addLight(0, 0, 300).setScrollFactor(0.0).setIntensity(2);
		this.lightTanque = this.lights.addLight(0, 0, 200, 0xff0000).setScrollFactor(0.0).setIntensity(2);
		this.lightBaliza = this.lights.addLight(0, 0, 100).setScrollFactor(0.0).setIntensity(1);
		//this.suelo.setPipeline('Light2D');
		Phaser.Actions.Call(this.suelo.getChildren(), function(obj) {
			obj.setPipeline('Light2D');
			obj.setDepth(2);
		});

		this.background.setPipeline('Light2D');


		//player = this.add.rectangle(config.width/2,config.height/2, config.width, config.height, 0x00ff00);
		//player.setPipeline('Light2D');

		this.lumi = this.add.image(0,0,'lumi').setScale(2,2);
		this.lumi.setDepth(5);

		var light = this.light;
		var lumi = this.lumi;

		this.input.on('pointermove', function (pointer) {

			this.pointer = pointer;

			light.x = this.pointer.x;
			light.y = this.pointer.y;
			lumi.x = this.pointer.x;
			lumi.y = this.pointer.y;
		});

		this.lightBaliza.x = this.baliza.x;
		this.lightBaliza.y = this.baliza.y;
		//Upthis.tanqueUp.startFollow(tanque);
		//tanque.angle = 90;


		/*{
			key: 'tanque',
			setScale: {x: 2, y: 2},
			setXY: {x: this.baliza.x,y: this.baliza.y}
		};*/

		this.physics.add.collider(this.suelo, this.tanque);

		this.KeyW=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.KeyS=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.KeyA=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.KeyD=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.KeyP=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
		this.KeyM=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
		this.FIRE=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		this.MegaValor = this;

		this.physics.add.overlap(this.bala, this.suelo, function(obj1,obj2){
			//obj1.light.destroy();
			this.lights.removeLight(obj1.light);
			obj1.destroy();
		}, null, this);

		var matarEnemigo = function matarEnemigo(obj1, obj2)
		{
			obj2.destroy();
		}

		this.physics.add.overlap(this.bala, this.uniwasp, matarEnemigo, null, this);
		this.physics.add.overlap(this.tanque, this.uniwasp, matarEnemigo, null, this);

		console.log(this.suelo.getChildren()[0].x + ' ' +this.suelo.getChildren()[1].y)

		//console.log(this.MegaValor)

		//valor=0;
	}

	update()
	{
		this.updateTanque.call(this);
		this.updateSensors.call(this);
		this.updateBalas.call(this);
		this.tiempo.time++;
		this.tiempo.segundos=this.tiempo.time / 60 % 60;
		this.tiempo.minutos =this.tiempo.time / 60 / 60;
		this.updateBaliza.call(this);

		this.TGEne--;
		if(this.TGEne<=0)
		{
			this.TGEne=this.tiempoEntreEnemigos;
			this.generateEnemy.call(this);
		}
		if (this.KeyP.isDown)
		{
			this.scene.pause(this);
			this.scene.launch('menuPausa');
		}

	}

	generateEnemy()
	{

		var e=this.uniwasp.create(-32,-32,'uniwasp');
		e.setOrigin(0.5,0.5);
		e.setScale(2,2);
		e.setPipeline('Light2D');
		e.setDepth(1);

		var nuevaPosicionSuelo=false;
		var nuevaPosicionEnemigo=false;
		while(nuevaPosicionSuelo==false || nuevaPosicionEnemigo==false)
		{
			e.gridX=Phaser.Math.Between(1,config.width/64-1);
			e.gridY=Phaser.Math.Between(1,config.height/64-1);
		
			nuevaPosicionSuelo=true;
			nuevaPosicionEnemigo=true;
			Phaser.Actions.Call(this.suelo.getChildren(), function(obj) {
				//console.log(obj.x + ' X ' + (e.gridX*64+32))
				//console.log(obj.y + ' Y ' + (e.gridY*64+32))
				if (obj.gridX == e.gridX && obj.gridY == e.gridY)
				{
					//console.log('problemas');
					nuevaPosicionSuelo=false;
				}
			});
			Phaser.Actions.Call(this.uniwasp.getChildren(), function(obj) {
				if (obj.gridX == e.gridX && obj.gridY == e.gridY && e != obj)
				{
					//console.log('problemas');
					nuevaPosicionEnemigo=false;
				}
			});
		}

		e.x = e.gridX*64+32;
		e.y = e.gridY*64+32;

		console.log(this.uniwasp.getLength())
		console.log(e.gridX + ' X ' + e.gridY)

		//b.angle = tanque.angle;
	}

	updateBaliza()
	{
		this.baliza.segundos = this.temporizadorSegundos - this.tiempo.segundos + 60;
		this.baliza.minutos = this.temporizadorMinutos - this.tiempo.minutos;

		console.log(this.tiempo.segundos + 'y' + this.temporizadorSegundos);
		console.log(this.tiempo.minutos + 'y' + this.temporizadorMinutos);

		if (this.tiempo.segundos == this.temporizadorSegundos && this.tiempo.minutos == this.temporizadorMinutos || this.KeyM.isDown)
		{
			this.scene.pause(this);
			this.scene.launch('victoria');
		}
		//console.log(this.tiempo.segundos);
		//score=this.MegaValor.add.text(this.baliza.x,this.baliza.y,time,{fontsize:'32px',fill:'#00FF00'});
		this.tiempo.text = Math.floor(this.baliza.minutos)+ ':' +Math.floor(this.baliza.segundos);
		this.enemigos.text = this.uniwasp.getLength() + '/' + this.limiteEnemigos;

		var color = Math.floor((this.uniwasp.getLength() / this.limiteEnemigos)*255);

		this.tiempo.setTint(Phaser.Display.Color.GetColor(color, 255-color, 0));
		this.enemigos.setTint(Phaser.Display.Color.GetColor(color, 255-color, 0));

		if (this.uniwasp.getLength() == this.limiteEnemigos)
		{
			this.scene.pause(this);
			this.scene.launch('derrota');
		}
	}

	updateTanque()
	{
		var Ty = false;
		var Tx = false;
		if(this.KeyW.isDown && (this.tanqueRight.detector == true || this.tanqueLeft.detector == true)){
			this.tanque.setVelocityY(-200);
			this.tanque.animado++;

			if (this.tanqueLeft.detector == true){this.tanque.flipX = true}
			else{this.tanque.flipX = false}

			
		}
		else if(this.KeyS.isDown && (this.tanqueRight.detector == true || this.tanqueLeft.detector == true)){
			this.tanque.setVelocityY(200);
			this.tanque.animado++;

			if (this.tanqueRight.detector == true){this.tanque.flipX = true}
			else{this.tanque.flipX = false}
		}
		else
		{
			this.tanque.setVelocityY(0);
			Ty = true;
		}

		if(this.KeyA.isDown && (this.tanqueUp.detector == true || this.tanqueDown.detector == true)){
			this.tanque.setVelocityX(-200);
			this.tanque.animado++;

			if (this.tanqueDown.detector == true){this.tanque.flipX = true}
			else{this.tanque.flipX = false}
			//valor--;
		}
		else if(this.KeyD.isDown && (this.tanqueUp.detector == true || this.tanqueDown.detector == true)){
			this.tanque.setVelocityX(200);
			this.tanque.animado++;

			if (this.tanqueUp.detector == true){this.tanque.flipX = true}
			else{this.tanque.flipX = false}
			//valor++;
		}
		else
		{

			this.tanque.setVelocityX(0);
			Tx = true;
		}

		if (Ty == true && Tx == true){this.tanque.animado = 0}

		if (this.tanque.animado == 1)
		{
			this.tanque.anims.play('movimiento');
		}
		else if (this.tanque.animado == 0)
		{
			//console.log('idle')
			this.tanque.anims.stop('idle');
		}
		

		this.tanque.EnAire = false;
		
		if (this.tanqueUp.detector == true)
		{
			this.tanque.angle = 180;
			this.tiempoMargen = 2;
		}
		else if (this.tanqueDown.detector == true)
		{
			this.tanque.angle = 0;
			this.tiempoMargen = 2;
		}
		else if (this.tanqueRight.detector == true)
		{
			this.tanque.angle = -90;
			this.tiempoMargen = 2;
		}
		else if (this.tanqueLeft.detector == true)
		{
			this.tanque.angle = 90;
			this.tiempoMargen = 2;
		}
		else
		{
			this.tiempoMargen--;
			
			if (this.tiempoMargen <= 0)
			{
				this.tanque.EnAire = true;
				this.tanque.angle += 8;
				this.tanque.setVelocityY(500);
			}
				
		}

		//canon.x = tanque.x;
		//canon.y = tanque.y;
		this.canon.angle = this.tanque.angle;

		var dirCanon = new Phaser.Math.Vector2( Math.cos((this.tanque.angle+90)*Math.PI/180), Math.sin((this.tanque.angle+90)*Math.PI/180));
		dirCanon.normalize();

		

		this.TGBalas--;

		if(this.FIRE.isDown /*&& this.tanque.EnAire == false*/ && this.TGBalas <= 0){
			var canon = this.canon;
			this.MegaValor.tweens.addCounter({
				from: 0,
				to: 255,
				duration: 200,
				onUpdate: function (tween)
				{
					var value = Math.floor(tween.getValue());

					canon.setTint(Phaser.Display.Color.GetColor(255, value, value));

					canon.posicionAngular = -4 + value/20;
				}
			});
			this.generateBala.call(this);
			//generatethis.bala.call(this);
			this.TGBalas = this.tiempoEntreBalas;
		}
		if(this.TGBalas < 0) {this.canon.posicionAngular = -4;}

		//console.log(this.TGBalas);

		//canon.

		this.canon.x = this.tanque.x+this.canon.posicionAngular*dirCanon.x;
		this.canon.y = this.tanque.y+this.canon.posicionAngular*dirCanon.y;

		this.lightTanque.x = this.tanque.x;
		this.lightTanque.y = this.tanque.y;

		/*if (this.tanque.body.touching.none == true){
			this.tanque.setVelocityY(500);
		}*/
		
		//if (valor < 0) {valor = this.suelo.getLength()-1}
		//valor = valor % this.suelo.getLength();

		/*Phaser.Actions.Call(this.suelo.getChildren(), function(obj) {
			obj.tint=0xffffff;
		});*/

		//this.suelo.getChildren()[valor].tint = 0x000000;
		//console.log(this.suelo.getChildren()[5])


		//console.log(this.tanque.body.touching);
	}

	generateBala()
	{
		var b=this.bala.create(this.tanque.x,this.tanque.y,'bala');
		b.setOrigin(0.5,0.5);
		b.setScale(2,2);
		b.setDepth(0);
		b.angle = this.tanque.angle;
		//game.physics.arcade.velocityFromAngle(b.angle, 500, b.body.velocity);
		var dirBala = new Phaser.Math.Vector2( Math.cos((b.angle+90)*Math.PI/180), Math.sin((b.angle+90)*Math.PI/180));
		dirBala.normalize();

		b.setVelocityX(-1000*dirBala.x);
		b.setVelocityY(-1000*dirBala.y);

		b.body.velocity.x += this.tanque.body.velocity.x/1.5
		b.body.velocity.y += this.tanque.body.velocity.y/1.5

		//console.log(b)

		b.setSize(14,14);

		b.light = this.MegaValor.lights.addLight(0, 0, 100, 0xF3FF00).setScrollFactor(0.0).setIntensity(2);



		//b.setVelocityFromAngle(500);
		//bala=1;
	}

	updateBalas()
	{
		Phaser.Actions.Call(this.bala.getChildren(), function(obj) {
			obj.light.x = obj.x
			obj.light.y = obj.y

			//if (obj == undefined){obj.light.destroy();}
			//console.log(obj.light);
		});
	}

	updateSensors()
	{
		this.tanqueUp.detector=false;
		this.tanqueUp.x=this.tanque.x;
		this.tanqueUp.y=this.tanque.y-32;

		this.tanqueDown.detector=false;
		this.tanqueDown.x=this.tanque.x;
		this.tanqueDown.y=this.tanque.y+32;

		this.tanqueLeft.detector=false;
		this.tanqueLeft.x=this.tanque.x-32;
		this.tanqueLeft.y=this.tanque.y;

		this.tanqueRight.detector=false;
		this.tanqueRight.x=this.tanque.x+32;
		this.tanqueRight.y=this.tanque.y;
	}
}