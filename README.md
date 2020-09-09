# AngularAuth

Esse projeto foi criado utilizando o [Angular CLI](https://github.com/angular/angular-cli) versão 9.1.12.

## Utilizando o projeto

Execute o comando `ng serve` para levantar o servidor de desenvolvimento localmente. Acesse `http://localhost:4200/` para visualizar a aplicação.

Para funcionar a autenticação com [Firebase](https://firebase.google.com/) é necessário colocar seus dados de integração com a plataforma no arquivo `environments/environments.ts` e no arquivo  `environments/environment.prod`. O código de integração deverá ficar assim:
```
firebaseConfig : {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "" 
}
```
