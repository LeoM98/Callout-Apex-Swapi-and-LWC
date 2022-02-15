import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCharacter from '@salesforce/apex/CallSWAPIApex.getCharacter';
import saveContact from '@salesforce/apex/CallSWAPIApex.saveContact';

export default class CallSWAPI extends LightningElement {

    @track id;
    @track ContactSwapi
    @track target_copy;
    @track error;
    @track showForm = false;
    @track saveContact = {
        nombre: '',
        altura: '',
        genero: '',
        colorCabello: '',
        colorOjos: '',
        url: '',
        planeta: '',
        numero: ''
    }

    //Read or non readonly fields
    @track Isnombre;
    @track Isaltura;
    @track Isgenero;
    @track Ispelo;
    @track Isojos;
    @track Isplaneta;
    @track Isurl;


    onchangeId(event){
        this.id = event.target.value;
    }

    handleSearch(){

        getCharacter({id: this.id})
        .then((result)=>{
            
            this.ContactSwapi = result;
            if (this.ContactSwapi != null) {

                this.saveContact.altura = this.ContactSwapi.altura;
                this.saveContact.colorCabello = this.ContactSwapi.colorCabello;
                this.saveContact.colorOjos = this.ContactSwapi.colorOjos;
                this.saveContact.genero = this.ContactSwapi.genero;
                this.saveContact.nombre = this.ContactSwapi.nombre;
                this.saveContact.planeta = this.ContactSwapi.planeta;
                this.saveContact.url = this.ContactSwapi.url;
                this.saveContact.numero = this.ContactSwapi.numero;

                console.log(this.saveContact);

                this.showForm = true;
                this.readOnlyFields(this.ContactSwapi);
                this.foundCharacters();
            }else{
                this.notFoundCharacters();
            }

            console.log(this.ContactSwapi);
        })
        .catch(error =>{
            this.error = error;
        });

    }

    handleSave(){
        console.log("Está entrando?")
        this.target_copy = Object.assign({}, this.saveContact);
        const myJSON = JSON.stringify(this.target_copy);
        console.log(myJSON);

        saveContact({objeto: myJSON})
        .then((result)=>{
            if(result){
                this.savedCont();
                this.showForm = false;
                this.id = null;
            }else{
                this.errorSaving();
            }
        })
        .catch(error =>{
            this.error = error;
            this.errorSaving();
        });
    }

    foundCharacters(){
        const event = new ShowToastEvent({
            title: 'Éxito!',
            message: 'Se encontró el personaje '+ this.ContactSwapi.nombre,
            variant: 'success'
            
        });
        this.dispatchEvent(event);
    }

    savedCont(){
        const event = new ShowToastEvent({
            title: 'Éxito!',
            message: 'Se ha guardado el contacto '+ this.saveContact.nombre,
            variant: 'success'
            
        });
        this.dispatchEvent(event);
    }

    errorSaving(){
        const event = new ShowToastEvent({
            title: 'Error!',
            message: 'Error al guardar contacto '+ this.saveContact.nombre,
            variant: 'error'
            
        });
        this.dispatchEvent(event);
    }

    notFoundCharacters(){
        const event = new ShowToastEvent({
            title: 'Error!',
            message: 'No se encontró ningún personaje',
            variant: 'warning'
            
        });
        this.dispatchEvent(event);
    }

    readOnlyFields(fields){

        if(fields.nombre != "" && fields.nombre != "n/a" && fields.nombre != "none"){
            this.Isnombre = true;
        }else{
            this.Isnombre = false;
        }
        if(fields.altura != "" && fields.altura != "n/a" && fields.altura != "none"){
            this.Isaltura = true;
        }else{
            this.Isaltura = false;
        }
        if(fields.genero != "" && fields.genero != "n/a" && fields.genero != "none"){
            this.Isgenero = true;
        }else{
            this.Isgenero = false;
        }
        if(fields.colorCabello != "" && fields.colorCabello != "n/a" && fields.colorCabello != "none"){
            this.Ispelo = true;
        }else{
            this.Ispelo = false;
        }
        if(fields.colorOjos != "" && fields.colorOjos != "n/a" && fields.colorOjos != "none"){
            this.Isojos = true;
        }else{
            this.Isojos = false;
        }
        if(fields.url != "" && fields.url != "n/a" && fields.url != "none"){
            this.Isurl = true;
        }else{
            this.Isurl = false;
        }
        if(fields.planeta != "" && fields.planeta != "n/a" && fields.planeta != "none"){
            this.Isplaneta = true;
        }else{
            this.Isplaneta = false;
        }
    }

    handleChangeCabello(event){
        this.saveContact.colorCabello = event.detail.value;
    }
    handleChangeNombre(event){
        this.saveContact.nombre = event.detail.value;
    }
    handleChangeAltura(event){
        this.saveContact.altura = event.detail.value;
    }
    handleChangeGenero(event){
        this.saveContact.genero = event.detail.value;
    }
    handleChangeOjos(event){
        this.saveContact.colorOjos = event.detail.value;
    }
    handleChangeUrl(event){
        this.saveContact.url = event.detail.value;
    }
    handleChangePlaneta(event){
        this.saveContact.planeta = event.detail.value;
    }
    
}