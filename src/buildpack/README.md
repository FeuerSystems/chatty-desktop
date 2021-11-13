# Buildpack

> What.. What the fuck is this?

Glad you asked! Chatty's buildpack provides the entire framework (Core, Debug, Rest, WebSocket) that allows you to save and require modules

> How do I require a Module?

Quite simple! Theres a global method for the vue mounted lifecycle that lets you implement anything you want, and example is below ⬇️ 
```js
 await this.requireModules('module1', 'module2'); // You need to await this because the websocket waits for connection then logs in for you
```

> Dope! But what if I want to make my own function? 

Just as easy!

1. First you need to import the module
```js
import RestClient from '@/buildpack/Rest/RestClient';
```   
2. Next you need to import 'Vue'
```js
import Vue from 'vue';
```   
3. Prototype the Vue module like this: (**MAKE SURE `this.Chatty` IS DEFINED**)
```js
 import RestClient from '@/buildpack/Rest/RestClient';
 import Vue from 'vue';

 Vue.prototype.Chatty.Rest = new RestClient({
     // Options
 })    
```
4. Profit Mwahahahahaha