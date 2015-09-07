import { Component, View, Inject } from 'angular2/angular2';
import { Router } from 'angular2/router';
import { Material } from 'src/directives/material';
import { Client } from 'src/services/api';
import { SessionFactory } from 'src/services/session';

@Component({
  viewBindings: [ Client ]
})
@View({
  templateUrl: 'templates/register.html',
  directives: [ Material ]
})

export class Register {

	session = SessionFactory.build();
  errorMessage : string = "";
  twofactorToken : string = "";
  hideLogin : boolean = false;

	constructor(public client : Client, @Inject(Router) public router: Router){
		window.componentHandler.upgradeDom();
	}

	register(username, password, email){
    this.errorMessage = "";
		var self = this; //this <=> that for promises
		this.client.post('api/v1/register', {username: username.value, password: password.value, email: email.value})
			.then((data : any) => {
				username.value = '';
				password.value = '';
        email.value = '';


				self.session.login(data.user);
				self.router.parent.navigate('/newsfeed');
			})
			.catch((e) => {
        console.log(e);
        if(e.status == 'failed'){
          //incorrect login details
          self.errorMessage = "Incorrect username/password. Please try again.";
          self.session.logout();
        }

        if(e.status == 'error'){
          //two factor?
          self.errorMessage = e.message;
          self.session.logout();
        }

			});
	}

}
