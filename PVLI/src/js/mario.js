//clase Mario, el jugador, hereda de GameObject
class Mario extends GameObject{

    //--------------------------------------CONSTRUCTORA-------------------------------------
    //constructora de Mario
    constructor(x, y, nombre){
        super(x, y, nombre);//llama a constructora de GamObject
        this._vidas=3;//vidas de mario
        this._jump=true;//indica si mario puede saltar
        this._limiteIzq = 70;//limites del mapa
        this._limiteDrcha = 530;
        this._yProv = this.y;//variable donde guardamos la altura provisional
        this._alturaCaida = 55;//altura maxima desde la que caer   
        this._volando = false;//indica si esta en el aire o no
        this._sube=false;//indica si mario puede subir escaleras
        this._subiendo=false;//indica si mario esta subiendo escaleras
        this._inmovil=false;//indica si mario puede moverse en el eje x
        this._alturaSalto=-150;//altura a la que salta mario
        this._velMax = 125;//velocidad a la que sube las rampas
        this._velMin = 75;//velocidad normal a la que camina
        this._corriendo = false;//indica si mario esta corriendo (para las animaciones)
        this._muerto=false;//indica si mario ha muerto
        //redimensionamos su collider
        this._gameObject.body.setSize(this._gameObject.width*2/3, this._gameObject.height/5);

        //ANIMACIONES
        //todas se guardaran en anim
        this._anim.add('stop', [0], null);//parado
        this._anim.add('walk', [1,0,2], 20, true);//andando
        this._anim.add('saltar', [5], null);//salto
        this._anim.add('escalera', [3,4], 8, true);//en una escalera
        this._anim.add('escaleraStop', [3], null);//parado en una escalera
        this._anim.add('morir', [10,11,12,13,14], 4, null);//muerto
    }
    //--------------------------------------------------------------------------------------


    //----------------------------------MOVIMIENTO------------------------------------------

    //mueve a mario a la izquierda a una velocidad si puede hacerlo y si no se sale del mapa
    mueveIzquierda(){
        if(!this._inmovil && this._gameObject.x > this._limiteIzq && !this._muerto && this._jump){
            this._gameObject.scale.setTo(-1, 1);//se de la vuelta
            if(!this._corriendo){
                this._corriendo=true;//si esta corriendo y no saltando
                this._anim.play('walk');
            }
            this._gameObject.body.velocity.x=-this._vel;
        }
    }

    //mueve a mario a la derecha a una velocidad si puede hacerlo y si no se sale del mapa
    mueveDerecha(){
        if(!this._inmovil && this._gameObject.x < this._limiteDrcha && !this._muerto && this._jump){
            this._gameObject.scale.setTo(1, 1);
            if(!this._corriendo){
                this._corriendo=true;
                this._anim.play('walk');
            }
            this._gameObject.body.velocity.x=this._vel;
        }
    }

    //hace saltar a mario a una altura, si no ha saltado ya
    saltar(){
        if(this._jump && !this._muerto){
            this._jump=false;
            this._anim.play("saltar");//anim de saltar
            this._gameObject.body.velocity.y=this._alturaSalto;
        }
    }

    //hace subir o bajar a mario por una escalera, si puede
    escaleras(velEscalera){
        if(this._sube && !this._muerto){
            this._subiendo=true;
            this._gameObject.body.velocity.y=velEscalera;
            this._inmovil=true;//no puede moverse en el eje x
            this._jump=false;//no puede saltar
            this._anim.play("escalera");
        }
    }
    //-----------------------------------------------------------------------------


    //--------------------------------UPDATE---------------------------------------

    //update del jugador, mira si mario choca con el suelo
    update(plataformas, self){
        //mario colisiona con las plataformas si no puede atravesarlas
        if(!this._atraviesa)game.physics.arcade.collide(this._gameObject, plataformas);
        this._atraviesa = false;//reiniciamos atraviesa
        this._gameObject.body.velocity.x=0;//reiniciamos su velocidad
        // por si se hubiera dejado de pulsar las teclas
        if(!this._subiendo)this._gameObject.body.gravity.y=400;//lo mismo con su gravedad 
        //(si no esta subiendo una escalera)
        else {
            this._corriendo = false;
            this._gameObject.body.gravity.y=0;//si esta subiendo tanto gravedad
            this._gameObject.body.velocity.y=0;//como velocidad se reinician
        }
        //si ha saltado y se estaba moviendo en una direccion, salta en esa direccion
        if(this._corriendo && !this._jump && !this._subiendo &&
            this._gameObject.x < this._limiteDrcha && this._gameObject.x > this._limiteIzq) {
            if(this._gameObject.scale.x == 1) this._gameObject.body.velocity.x=this._vel;
            else this._gameObject.body.velocity.x=-this._vel
        }
        //si toca el suelo
        if(this._gameObject.body.onFloor()){
            //si es una pared (rampas) aumentamos la velocidad para que pueda subirlas
            console.log( this.y - this._yProv);
            if(this._alturaCaida < this.y - this._yProv)this.morirAnim(self);
            this._yProv = this.y;
            if(this._gameObject.body.onWall())this._vel = this._velMax;
            else this._vel = this._velMin;//si no, vuelve a su velocidad normal
            this._jump=true;//cuando toca el suelo puede volver a saltar
            this._inmovil=false;//puede moverse en el eje x otra vez
            this._subiendo=false;//ya no esta subiendo
            this.volando = false;
            if(!this._muerto) this._anim.play("walk");
        }
        else if(!this._volando){
        this.yProv = this._gameObject.y;
        this._volando = true;
        }
    }
    //----------------------------------------------------------------------

    
    //-----------------------------AUXILIARES-------------------------------

    //se llama cuando estas sobre una escalera, te permite subirla
    puedeSubir(){ 
        if (this._jump){//si no has saltado
        this._sube=true;    
        this._corriendo = false;
        }
     }

    //se llama cuando sales de una escalera, ya no puedes subirla
    noPuedeSubir(){ 
        this._sube=false;
        this._subiendo=false;
        this._inmovil=false;
     }

     //permite atravesar muros si no has saltado antes y si estas subiendo
     atraviesa(){ if(this._subiendo)this._atraviesa = true; }

     //llamado cuando se sueltan las teclas, anim de parado
     noCorras(){ 
         if(this._jump && !this._subiendo && !this._muerto){
         this._corriendo=false; 
         this._anim.play("stop");
         }
    }

    //llamado cuando dejas de subir por una escalera
    noEscales(){ if(this._sube && this._subiendo && !this._muerto) this._anim.play("escaleraStop"); }

    //llamado cuando te golpea un barril
    morirAnim(self){
        if(!this._muerto){
        this._anim.play('morir');//mueres
        this._muerto = true;
        this._vidas--;//se restan vidas
        this._anim.currentAnim.onComplete.add(self.ResetLevel, self);//se llama a reset level de play.js
        }
    }

    get vidas(){ return this._vidas; }//devuelve el numero de vidas

    noMuerto(){ this._muerto = false; }//"revive"  mario
    //-----------------------------------------------------------------------
}