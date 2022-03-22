import React, {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import socket from '../socket'

class Logination extends Component {
	constructor() {
		super();
 
		this.onSubmit = this.onSubmit.bind(this);
		this.handleChangeLogin = this.handleChangeLogin.bind(this);
		this.handleChangePassword = this.handleChangePassword.bind(this);

		this.state = {
			error: '',
			login: '',
			password: '',
			signedIn: false
		};
	}

  	componentDidMount() {
		socket.on('auth:signin', (response) => {
			if (response.err) {
				this.setState({error: response.err});
			} 
			else {
				document.cookie = `token=${response.token}`;
				this.setState({signedIn: true, userId: response.userId});
			}
		})
  	}

  	componentWillUnmount() {
    	socket.removeAllListeners('auth:signin');
  	}

	onSubmit = (e) => {
		e.preventDefault();

		let {login, password} = this.state;
		let user = {login, password};

		socket.emit('auth:signin', user);
	}

	handleChangeLogin(e) {
		this.setState({login: e.target.value});
	}	  
  
	handleChangePassword(e) {
		this.setState({password: e.target.value});
	}
	
	render() {
		return(
			<div>
				<article>
					<h2>{this.state.signedIn ? <Redirect to={"/Posts/"}/> : ''}</h2>
					<img id="gif" src="assets/animation.gif"></img>
					<div className="main-menu">
						<Link to="/Logination" className="link">Вход</Link>
						<Link to="/Registration" className="link">Регистрация</Link>
					</div>
					<form action="signin" method="POST" className="logination-form">
						<fieldset>
							<legend>Введите нужные данные:</legend>
							<br/>Логин:<br/>
							<input name="login" type="text" value={this.state.login} required onChange={this.handleChangeLogin}/><br/>
							Пароль:<br/>
							<input name="password" type="password" value={this.state.password} required onChange={this.handleChangePassword}/><br/>
							<input type="submit" value="Войти в аккаунт" onClick={this.onSubmit}/>
							<h3>{this.state.error}</h3>
						</fieldset>
					</form>
				</article>
			</div>
		);
	}
}

export default Logination;