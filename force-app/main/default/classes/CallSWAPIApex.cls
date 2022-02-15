public with sharing class CallSWAPIApex {
    
    public static final String URL = 'https://swapi.dev/api/people/';
    
    @AuraEnabled(cacheable = true)
    public static SwapiWrapper getCharacter(String id){
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(URL+id);
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json');
        request.setHeader('Accept','application/json');
        HttpResponse response = http.send(request);
        Map<String, Object> results = new Map<String, Object>();
        SwapiWrapper character = new SwapiWrapper();
        // If the request is successful, parse the JSON response.
        if(response.getStatusCode() == 200) {
            // Deserialize the JSON string into collections of primitive data types.
            results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            System.debug(results);
        }
        else if(response.getStatusCode() == 404) {
            // Deserialize the JSON string into collections of primitive data types.
            character = null;
        }
        
        if(!results.isEmpty()){
            character.nombre = (String)results.get('name');
            character.altura = (String)results.get('height');
            character.genero = (String)results.get('gender');
            character.colorCabello = (String)results.get('hair_color');
            character.colorOjos = (String)results.get('eye_color');
            character.url = (String)results.get('url');
            character.planeta = (String)results.get('homeworld');
            character.numero = id;
        }
        
        System.debug('characters: '+ character);
        return character;
        
    }

    @AuraEnabled
    public static Boolean saveContact(String objeto){

        Map<String, Object> mapContact = new Map<String,Object>();
        Contact contactInsert = new Contact();
        if(!String.isBlank(objeto)){
            mapContact = (Map<String,Object>) JSON.deserializeUntyped(objeto);
            System.debug(mapContact);
            contactInsert.LastName = (String)mapContact.get('nombre');
            contactInsert.Altura__c = (String)mapContact.get('altura');
            contactInsert.Genero__c = (String)mapContact.get('genero');
            contactInsert.Color_de_cabello__c = (String)mapContact.get('colorCabello');
            contactInsert.Color_de_ojos__c = (String)mapContact.get('colorOjos');
            contactInsert.Url__c = (String)mapContact.get('url');
            contactInsert.Planeta__c = (String)mapContact.get('planeta');
            contactInsert.numero_personaje__c = (String)mapContact.get('numero');
        }

        System.debug(contactInsert);

        try {
            insert contactInsert;
            return true;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());

        }
    }
    
    public class SwapiWrapper{
        @AuraEnabled
        public String nombre;
        @AuraEnabled
        public String altura;
        @AuraEnabled
        public String genero;
        @AuraEnabled
        public String colorCabello;
        @AuraEnabled
        public String colorOjos;
        @AuraEnabled
        public String url;
        @AuraEnabled
        public String planeta;
        @AuraEnabled
        public String numero;
    }
    
}