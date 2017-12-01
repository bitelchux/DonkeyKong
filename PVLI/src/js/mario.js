//clase Mario, el jugador
class Mario{
    //constructora de Mario
    constructor(){
        this._mario=game.add.sprite(100, 520, 'mario');//carga el sprite de Mario
        this._jump=true;//indica si mario puede saltar
        this._jumpLadder = false;
        this._sube=false;//indica si mario puede subir escaleras
        this._atraviesa = false;
        this._inmovil=false;
        this._vel=150;//velocidad a la que se mueve mario
        this._alturaSalto=-150;//altura a la que salta mario
        game.physics.arcade.enable(this._mario);//habilitamos fisicas, gravedad, etc.
        this._mario.body.gravity.y=400;
        this._mario.body.colliderWorldBounds=true;
        //this._mario.scale.setTo(0.15, 0.15);//lo escalamos a gusto
        this._mario.anchor.setTo(0.5, 0.5);
    }

    //mueve a mario a la izquierda a una velocidad
    mueveIzquierda(){
        this._mario.scale.setTo(-1, 1);
        if(!this._inmovil)this._mario.body.velocity.x=-this._vel;
    }

    //mueve a mario a la derecha a una velocidad
    mueveDerecha(){
        this._mario.scale.setTo(1, 1);
        if(!this._inmovil)this._mario.body.velocity.x=this._vel;
    }

    //hace saltar a mario a una altura, si no ha saltado ya
    saltar(){
        if(this._jump){
            this._mario.body.velocity.y=this._alturaSalto;
            this._jump=false;
            this._jumpLadder = true;
        }
    }

    //hace subir o bajar a mario por una escalera, si puede
    escaleras(velEscalera){
        if(this._sube){
        this._mario.body.velocity.y=velEscalera;
        this._inmovil=true;
        }
    }

    //update del jugador, mira si mario choca con el suelo
    update(plataformas){
        //mario colisiona con las plataformas
        if(!this._atraviesa)game.physics.arcade.collide(this._mario, plataformas);
        this._atraviesa = false;
        this._mario.body.velocity.x=0;//reiniciamos su velocidad por si se hubiera dejado de pulsar las teclas
        if(!this._sube)this._mario.body.gravity.y=400;//lo mismo con su gravedad (si no esta subiendo una escalera)
        else this._mario.body.gravity.y=0;
        if(this._mario.body.touching.down){
             this._jump=true;//cuando toca el suelo puede volver a saltar
             this._inmovil=false;
             this._jumpLadder = false;
        }
        console.log(this._mario.body.velocity.y);
    }

    //cuando mario pierde se destruye
    morir(){ this._mario.kill(); }

    //se llama cuando estas sobre una escalera, te permite subirla
    puedeSubir(){ 
      if (!this._jumpLadder)
        this._sube=true;
     }

    //se llama cuando sales de una escalera, ya no puedes subirla
    noPuedeSubir(){ 
        this._sube=false;
        this._inmovil=false;
     }

    //devuelven la posicion de mario
    get x(){ return this._mario.x; }
    get y(){ return this._mario.y; }

    //devuelven a mario
    get mario(){ return this._mario; }
}