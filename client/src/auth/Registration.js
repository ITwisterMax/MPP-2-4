import React, {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import socket from '../socket'

class Registration extends Component {
  	constructor() {
		super();

		this.onSubmit = this.onSubmit.bind(this);
		this.onChangeLogin = this.onChangeLogin.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.onChangeName = this.onChangeName.bind(this);

		this.state = {
			name: '',
			login: '',
			password: '',
			userId: '',
			error: '',
			signedUp: false
		};
  	}

  	componentDidMount() {
		socket.on('auth:signup', (response) => {
			if (response.err) {
				this.setState({error: response.err});
			} 
			else {
				document.cookie = `token=${response.token}`;
				this.setState({signedUp: true, userId: response.userId});
			}
		})
  	}

	componentWillUnmount() {
		socket.removeAllListeners('auth:signup');
	}

	onChangeName(e) {
		this.setState({name: e.target.value});
	}

	onChangeLogin(e) {
		this.setState({login: e.target.value});
	}

	onChangePassword(e) {
		this.setState({password: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();

		let {name, login, password} = this.state;
		let user = {name, login, password};

		socket.emit('auth:signup', user);
	}

	render() {
		return (
			<div>
				<article>
					<h2>{this.state.signedUp ? <Redirect to={`/Posts/`}/> : ''}</h2>
					<img id="gif" src="assets/animation.gif"></img>
					<div className="main-menu">
						<Link to="/Logination" className="link">Вход</Link>
						<Link to="/Registration" className="link">Регистрация</Link>
					</div>
					<form action="signup" method="POST" className="registration-form">
						<fieldset>
						<legend>Введите нужные данные:</legend>
						<br/>Имя пользователя:<br/>
						<input name="name" type="text" value={this.name}  required onChange={this.onChangeName}/><br/>
						Логин:<br/>
						<input name="login" type="text" value={this.login} required onChange={this.onChangeLogin} /><br/>
						Пароль:<br/>
						<input name="password" type="password" value={this.password} required onChange={this.onChangePassword} /><br/>
						<input type="submit" value="Регистрация" onClick={this.onSubmit}/>
						<h3>{this.state.error}</h3>
						</fieldset>
					</form>
				</article>
			</div>
		);
	}
}

export default Registration;