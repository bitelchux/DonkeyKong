//estado play
var playScene={
    create: function(){
        this.cursors = game.input.keyboard.createCursorKeys();//listener de los eventos de teclado (en cursores)
        this.SpaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //definimos la tecla espacio

        //MUSICA
        //efectos sonoros y musica de fondo
        this.musicaHammerKill = game.add.audio('musicaMartilloAplastar');
        this.musicaSaltaBarril = game.add.audio('musicaSaltarBarril');
        this.musicaFondo = game.add.audio('musicaFondo', 3, true);
        this.musicaFondo.play();

        //ESCALERAS
        //metemos todas las escaleras en un mismo grupo,
        this.escaleras=game.add.physicsGroup();//asi tratamos todas a la vez y no una por una
        this.escalerasRotas=game.add.physicsGroup();//asi tratamos todas a la vez y no una por una

        this.escalera1=this.escaleras.create(445, 501, 'escaleras');
        this.escalera2=this.escaleras.create(140, 407, 'escaleras');
        this.escalera3=this.escaleras.create(310, 403, 'escaleras');
        this.escalera3.scale.setTo(1, 1.15);
        this.escalera4=this.escaleras.create(350, 325, 'escaleras');
        this.escalera5=this.escaleras.create(445, 331, 'escaleras');
        this.escalera6=this.escaleras.create(140, 250, 'escaleras');
        this.escalera7=this.escaleras.create(237, 245, 'escaleras');
        this.escalera8=this.escaleras.create(445, 175, 'escaleras');
        this.escalera9=this.escaleras.create(310, 80, 'escaleras');
        this.escalera9.scale.setTo(1, 1.1);
        this.escalera10=this.escalerasRotas.create(273, 505, 'escalerasRotas');
        this.escalera11=this.escalerasRotas.create(195, 340, 'escalerasRotas');
        this.escalera12=this.escalerasRotas.create(400, 260, 'escalerasRotas');
        this.escalera13=this.escalerasRotas.create(270, 180, 'escalerasRotas');
        this.escaleras.setAll('body.inmovable', true);//las hacemos inmovibles
        this.escalerasRotas.setAll('body.inmovable', true);//las hacemos inmovibles

        //MAPA
        game.add.image(0, 0, 'hud');
        //cargamos un mapa de tiled con las plataformas del nivel1
        this.map=game.add.tilemap('map');
        this.map.addTilesetImage('plataforma');
        this.plataformas=this.map.createLayer('Plataformas');
        this.map.setCollisionBetween(1, 300, true, this.plataformas);
        this.plataformas.resizeWorld();
        this.collidersF=this.map.createLayer('CollidersF');
        this.map.setCollisionBetween(1, 300, true, this.collidersF);
        this.collidersF.resizeWorld();

        //DECORADO
        game.add.image(30, 107, 'decoBarril');
        game.add.image(165, 40, 'decoEscaleras');
        this.oilDrum = game.add.sprite(100, 520, 'drumOil');
        this.oilDrum.animations.add('normal', [0,1], 2, true);
        this.oilDrum.animations.play('normal');

        //TEXTO
        this.bonus = 5000;//puntuacion de bonus
        this.contB = 0;//contador de bonus
        this.textCont = 0;//contador de texto emergente cuando saltas un barril
        this.text = game.add.bitmapText(0, 0, 'gem', "", 12);//texto de puntuacion al saltar barriles
        this.scoreText = game.add.bitmapText(100, 6, 'gem', game.score.toString(), 20);//texto de puntuacion
        this.highScoreText = game.add.bitmapText(450, 25, 'gem', game.highScore.toString(), 20);//texto de maxima puntuacion
        this.bonusText = game.add.bitmapText(537, 118, 'gem', this.bonus.toString(), 16);//texto de bonus
        
        //PRINCESA
        //princesa a la que rescatar
        this.princesa=game.add.sprite(220, 40, 'princesa');
        this.princesa.animations.add('normal', [0,1,0,1,0,1,2,2,2], 6, true);
        this.princesa.animations.add('ganar', [3,4], 1, false);
        this.princesa.animations.play('normal');
        game.physics.arcade.enable(this.princesa);

        //DK
        //villano
        this.DK=game.add.sprite(70, 103, 'DK');
        this.DK.animations.add('normal', [0,1,2], 3, true);
        this.DK.animations.add('barril', [3,4,5], 3, false);
        this.DK.animations.add('flama',[6,7], 4, false);
        this.DK.animations.play('normal');
        game.physics.arcade.enable(this.DK);

       //BARRILES
       this.numBarriles = 10;//maximo de barriles que va a haber en pantalla
       this.frecuenciaBarriles = 5;//los barriles apareceran en un random entre 0 y esta variable
       this.posBarx = 150; this.posBary = 175;//posicion inicial de los barriles
       this.barriles=[];//array de barriles, inicialmente todos inexistentes
       for(var i=0;i<this.numBarriles;i++){
           this.barriles.push(new Barril(this.posBarx, this.posBary, 'barril'));
           this.barriles[i].morir();
       }
       this.count = 0;
       this.rand = 0;
       this.GeneraObjetos(this.frecuenciaBarriles, this.count);//genera los barriles aleatoriamente

       //FLAMAS 
       this.barrilAzul = game.add.sprite(this.DK.x + this.DK.width/2 - 20, this.DK.y + this.DK.height - 20, 'barrilAzul');//barril azul que se lanza
       game.physics.arcade.enable(this.barrilAzul);//habilitamos gravedad
       this.barrilAzul.body.gravity.y=200;
       this.barrilAzul.animations.add('cae', [4,5], 6, true);//animaciones
       this.barrilAzul.animations.play('cae');
       this.barrilAzul.kill();//lo deshabilitamos
       this.hayAzul = false;//indica si hay un barril azul
       this.numFlamas = 3;//maximo de flamas que va a haber en pantalla
       this.frecuenciaFlamas = 40;//los flamas apareceran en un random entre 0 y esta variable
       this.posFlax = 80; this.posFlay = 580;//posicion inicial de las llamas
       this.flamas=[];//array de flamas, inicialmente todos inexistentes
       for(var i=0;i<this.numFlamas;i++){
           this.flamas.push(new Flama (this.posFlax, this.posFlay, 'Flama', 125));
           this.flamas[i].morir();
       }
       this.countF = 1;
       this.randF = 2;
       this.GeneraObjetos(this.frecuenciaFlamas, this.countF);//genera las llamas aleatoriamente
       game.time.events.loop(Phaser.Timer.SECOND, this.actualizaContador, this);//suma al contador 1 cada segundo

       //MARTILLOS
       this.martillos = game.add.physicsGroup();
       this.martillo1 = this.martillos.create(100, 210, 'decoMart');
       this.martillo2 = this.martillos.create(400, 450, 'decoMart');


       //MARIO
       //por ultimo el jugador, para que se pinte por encima de todo
       this.rotas = false;
       this.posInix = 150; this.posIniy = 555;//posicion inicial de mario
       this.mario=new Mario(this.posInix, this.posIniy, 'marioAnim', 70, 530);
    },


    //------------------------------------------BUCLE PRINCIPAL-----------------------------------------------------------
    update: function(){
        //game.debug.body(this.barriles[0]);//vemos en pantalla el collider de x gameobject (debug)
        this.mario.update(this.plataformas, this);//llamamos al update de mario
        for(var i = 0; i < this.barriles.length; i++) this.barriles[i].update(this.plataformas);//update de cada barril en la escena
        for(var i = 0; i < this.flamas.length; i++) this.flamas[i].update(this.plataformas, this, this.mario, this.collidersF);//update de cada llama en la escena
        this.teclas();//llamamos al gestor del input
        this.colisiones();//comprobamos las colisiones
        this.renderHud();//pintamos el hud
    },

    //gestiona el input
    teclas: function(){
        //si se pulsa izquierda mario se mueve en esa direccion
        if(this.cursors.left.isDown)this.mario.mueveIzquierda();
        //lo mismo con derecha
        else if(this.cursors.right.isDown)this.mario.mueveDerecha();
        //si no se pulsa ninguna se queda parado (animacion)
        else this.mario.noCorras();
        //si se pulsa espacio mario salta
        if(this.SpaceKey.isDown)this.mario.saltar();
        //si se pulsa arriba o abajo mario sube o baja por las escaleras
        if(this.cursors.up.isDown && !this.rotas)this.mario.escaleras(-50);
        else if(this.cursors.down.isDown)this.mario.escaleras(50);
        else this.mario.noEscales();
    },
    //----------------------------------------------------------------------------------------------------------------------


    //----------------------------------------------------COLISIONES--------------------------------------------------------
    //gestiona las colisiones
    colisiones: function(){
        //si mario esta sobre una escalera, llama al metodo PuedeSubir (callback). Si no, llama a noPuedeSubir de mario
        if(!game.physics.arcade.overlap(this.mario.gameObject, this.escaleras, this.PuedeSubir, null, this)){
            if(!game.physics.arcade.overlap(this.mario.gameObject, this.escalerasRotas, this.PuedeSubirRotas, null, this)){
                this.mario.noPuedeSubir();
                this.rotas = false;
            }
        }
        //si mario llega hasta la princesa gana (true)
        if(game.physics.arcade.overlap(this.mario.gameObject, this.princesa)){
            this.musicaFondo.stop();
            this.fin(true);
        }
        //si mario choca con DK muere
        if(game.physics.arcade.overlap(this.mario.gameObject, this.DK)) this.mario.morirAnim(this);
        //si mario colisiona con un martillo lo coge
        if(game.physics.arcade.overlap(this.mario.gameObject, this.martillos, this.recogeMartillo, null, this)) this.mario.activaMartillo();

        //Para cada una de las flamas
        for(var i = 0; i < this.flamas.length; i++){
            //si una flama ha colisionado con una escalera decide si subir o no
            if(!game.physics.arcade.overlap(this.flamas[i].gameObject, this.escaleras, this.PuedeEscalarF, null, this))this.flamas[i].noPuedeSubir();
            //si mario choca con alguna flama
            if(game.physics.arcade.overlap(this.mario.gameObject, this.flamas[i].gameObject)){
                if(this.mario.llevaMartillo()) {
                    if(!this.musicaHammerKill.isPlaying) this.musicaHammerKill.play();
                    this.flamas[i].aplastado(this);//si lleva martillo la mata
                }
                else {
                    this.musicaFondo.stop();
                    this.mario.morirAnim(this);//si no muere y pierde una vida
                }
            }
        }

        //para cada uno de los barriles
        for(var i = 0; i < this.barriles.length; i++){
            //si un barril esta sobre una escalera se llama al metodo PuedeBajar (callback). Si no, llama a noDecidido del barril
            if(!game.physics.arcade.overlap(this.barriles[i].gameObject, this.escaleras, this.PuedeBajar, null, this)) this.barriles[i].noDecidido();
            //si mario choca con algun barril
            if(game.physics.arcade.overlap(this.mario.gameObject, this.barriles[i].gameObject)){
                //si mario colisiona con la parte baja del barril
                if(this.mario.y > this.barriles[i].y - this.barriles[i].gameObject.height/2){
                    if(this.mario.llevaMartillo()) {
                        if(!this.musicaHammerKill.isPlaying) this.musicaHammerKill.play();
                        this.barriles[i].aplastado(this);//si lleva un martillo lo mata
                    }
                    else {
                        this.musicaFondo.stop();
                        this.mario.morirAnim(this);//si no muere y pierde una vida
                    }
                }
                //si mario esta por encima del barril y no ha saltado ningun barril y no esta muerto y no lleva martillo
                else if(!this.mario.saltado && !this.mario.muerto && !this.mario.llevaMartillo()){
                    this.mario.haSaltado();//marcamos que ha saltado un barril
                    this.musicaSaltaBarril.play();
                    game.score+=100;//añadimos la puntuacion correspondiente
                    this.hudSpawn(100);//la escribimos en el momento del salto
                }
            }
        }

        //si hay un barril azul y llega abajo se destruye y crea una llama
        if(this.hayAzul && this.barrilAzul.y >= 555){
            this.barrilAzul.kill();
            this.hayAzul = false;
            this.DKreset(this.flamas);
        }
    },
    //-----------------------------------------------------------------------------------------------------------------------


    //---------------------------------------------------HUD-----------------------------------------------------------------
    //dibuja el hud del juego
    renderHud: function(){
        var posx = 15;
        var posy = 30;//pintamos las vidas que le quedan a mario
        for (var i = 0; i < game.vidas; i++) game.add.image(posx+i*14, posy, 'decoVidas');
        this.scoreText.text = game.score.toString();//escribimos la puntuacion
        //si la puntuacion es mayor que la puntuacion maxima, actualizamos la maxima
        if(game.score > game.highScore){
            game.highScore = game.score;
            this.highScoreText.text = game.highScore.toString();
        } 
    },

    //suma cada segundo uno al contador de bonus, y actualiza este si fuera necesario
    actualizaBonus: function(){
        this.contB++;//si han pasado 4 segundos y bonus sigue siendo mayor que 0
        if(this.contB >= 4 && this.bonus > 0){
            this.contB = 0;//se reinicia el contador de bonus
            this.bonus-=100;//se resta 100 al bonus y se escribe
            this.bonusText.text = this.bonus.toString();
        }
    },

    //escribe en la posicion de mario una puntuacion dada (llamado cuando salta barriles)
    hudSpawn(score){
        this.textCont = 0;//reiniciamos contador
        this.text.x = this.mario.x;
        this.text.y = this.mario.y;
        this.text.text = score.toString();
    },

    //suma cada segundo uno al contador de texto si hay un texto activo
    actualizaTexto(){
        if(this.text.text != ""){
            this.textCont++;
            this.text.y-=5;//si hay un texto activo va subiendo en la y durante tres segundos
            if(this.textCont >= 3){
                this.textB = false;
                this.text.text = "";//despues desaparece
            }
        } 
    },
    //-----------------------------------------------------------------------------------------------------------------------


    //-------------------------------------------------AUXILIARES------------------------------------------------------------
    //si un barril esta justo sobre una escalera de bajada puede bajarla o no (random)
    PuedeBajar: function(barril, escaleras){
        if(barril.x >= escaleras.x + escaleras.width*2/5 && barril.x <= escaleras.x + escaleras.width*4/5){
            var i = 0;
            while(i<this.barriles.length && this.barriles[i].gameObject != barril)i++;
            if(barril.y < (escaleras.y-escaleras.anchor.y*escaleras.height) + escaleras.height*3/4) this.barriles[i].bajaOno();
            else this.barriles[i].noAtravieses();//si esta mas abajo de la escalera no puede atravesar mas muros
        }
    },

    PuedeEscalarF: function(flama, escalera){
        var i = 0;
        while(i<this.flamas.length && this.flamas[i].gameObject != flama)i++;
        this.flamas[i].escaleras(escalera);
    },

    //si mario esta justo sobre la escalera puede subirla, si no no
    //si se encuentra en las dos terceras partes de la escalera que esta subiendo podrá atravesar el muro de encima
    PuedeSubir: function(mario, escaleras){
        if(mario.x < escaleras.x + escaleras.width*4/5 && mario.x > escaleras.x)this.mario.puedeSubir();
        else this.mario.noPuedeSubir();
        if(mario.y < (escaleras.y-escaleras.anchor.y*escaleras.height) + escaleras.height*3/4) this.mario.atraviesa();
    },

    PuedeSubirRotas: function(mario, escaleras){
        if(mario.x < escaleras.x + escaleras.width*4/5 && mario.x > escaleras.x)this.mario.puedeSubir();
        else this.mario.noPuedeSubir();
        if(mario.y <= (escaleras.y-escaleras.anchor.y*escaleras.height) + escaleras.height*2/3) this.rotas = true;
        else this.rotas = false;
    },

    //hace al martillo con el que ha chocado mario desaparecer
    recogeMartillo: function(mario, martillo){
        martillo.kill();
    },

    //genera barriles o llamas de forma aleatoria
    GeneraObjetos: function(numRand, cont){
        //si son barriles generamos barriles
        if(numRand == this.frecuenciaBarriles && cont == this.count){
            if(this.count == 0) this.rand = Math.random()*numRand + 3;//generamos un random entre 0 y numRand
            if(this.count >= this.rand){//si el contador llega al random
                this.DK.animations.play('barril');//animacion al soltar barril
                this.DK.animations.currentAnim.onComplete.add(this.reseteaBarriles, this);//cuando termine
            }
        }
        //si no generamos llamas
        else{
            if(this.countF == 0) this.randF = Math.random()*numRand + 10;//generamos un random entre 0 y numRand
            if(this.countF >= this.randF && !this.hayAzul){//si el contador llega al random
                this.DK.animations.play('flama');//animacion al soltar barril azul
                this.DK.animations.currentAnim.onComplete.add(this.tiraBarrilAzul, this);//cuando termine tira un barril azul
            }
        }
    },

    //se encarga de crear el barril azul
    tiraBarrilAzul(){
        this.barrilAzul.reset(this.DK.x + this.DK.width/2 - 20, this.DK.y + this.DK.height - 20);
        this.hayAzul = true;
        this.DK.animations.play('normal');
    },

    reseteaBarriles: function(){ this.DKreset(this.barriles); },

    //llamado cuando termina la animacion, se encarga de soltar un barril o una llama
    DKreset: function (objeto){
        var i = 0;
        while(i<objeto.length && objeto[i].estaVivo())i++;//se busca el primer barril inexistente
        if(i<objeto.length) {
            if(objeto == this.barriles){
                objeto[i].barrilSpawn(this.posBarx, this.posBary);//lo spawneamos
                this.count=0;//se reinicia el contador y se vuelve a hacer un random
                this.rand = Math.random()*this.frecuenciaBarriles;
            }
            else{
                this.flamas[i].flamaSpawn(this.posFlax, this.posFlay);//lo spawneamos
                this.countF=0;//se reinicia el contador y se vuelve a hacer un random
                this.randF = Math.random()*this.frecuenciaFlamas + 3;
            }
            this.DK.animations.play('normal');//reiniciamos la animacion
        }
        else if(objeto == this.flamas){
            //si todas las llamas estan en escena cogemos la primera y la volvemos a spawnear
            this.flamas[0].morir();
            this.flamas[0].flamaSpawn(this.posFlax, this.posFlay);//lo spawneamos
            this.countF=0;//se reinicia el contador y se vuelve a hacer un random
            this.randF = Math.random()*this.frecuenciaFlamas + 10;
        }
    },

    //suma cada segundo uno al contador
    actualizaContador: function(){ 
        this.count++;this.countF++;//contadores
        this.actualizaTexto();//actualizamos los textos que salen al saltar sobre un barril
        this.GeneraObjetos(this.frecuenciaBarriles, this.count);//generador de objetos
        this.GeneraObjetos(this.frecuenciaFlamas, this.countF);
        this.actualizaBonus();//actualizamos el bonus
    },

    //llamado desde mario cuando este pierde una vida
    ResetLevel(){
        if(game.vidas > 0){//si aun le quedan vidas spawneamos todo de nuevo
            for(var i = 0;i<this.barriles.length; i++)this.barriles[i].morir();
            this.mario.morir();
            game.state.start('howHigh');
        }
        else this.fin(false);//si no le quedan vidas pierde
    },

    //llamado cuando la princesa deja de hacer la animacion de haber sido rescatada
    ganar: function(){game.state.start('howHigh');},

    //metodo llamado cuando ganamos (true) o perdemos (false)
    fin: function(ganar){
        //eliminamos a mario y a los barriles
        game.score += this.bonus;
        this.bonus = 0;
        this.mario.morir();
        for(var i = 0;i<this.barriles.length; i++)this.barriles[i].morir();
        for(var i = 0;i<this.flamas.length; i++)this.flamas[i].morir();
        //llamamos al menu de ganar o perder
        if(ganar){
            game.nivel++;
            this.princesa.animations.play('ganar');
            this.princesa.animations.currentAnim.onComplete.add(this.ganar, this);//cuando termine
        }
        else game.state.start('perder');
    }
    //-------------------------------------------------------------------------------------------------------------------------
};