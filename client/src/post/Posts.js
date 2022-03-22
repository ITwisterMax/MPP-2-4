import React, {Component} from 'react'
import Post from './Post'
import {Redirect, Link} from 'react-router-dom'
import socket from '../socket'
import Cookies from 'js-cookie'

class Posts extends Component {
    constructor() {
        super();

        this.state = {
            posts: [],
			redirect: false,
        }
		
		this.onTableSearch = this.onTableSearch.bind(this);
		this.onShowOrHideForm = this.onShowOrHideForm.bind(this);
		this.onLinkClick = this.onLinkClick.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onChangeFile = this.onChangeFile.bind(this);
		this.onChangeText = this.onChangeText.bind(this);
    }
	
	onTableSearch() {
		var phrase = document.getElementById('search');
		var table = document.getElementById('posts-grid');
		var regPhrase = new RegExp(phrase.value, 'i');
		var flag = false;

		for (var i = 1; i < table.rows.length; i++) {
			flag = false;
	
			for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
				flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
				if (flag) break;
			}
	
			if (flag) {
				table.rows[i].style.display = "";
			} else {
				table.rows[i].style.display = "none";
			}
		}
	}

	onShowOrHideForm(e) {
		e.preventDefault();

		var form = document.getElementById("add-form");

		if (form.hidden) {
			form.hidden = false;
		}
		else {
			form.hidden = true;
		} 
	}

	onLinkClick() {
		socket.emit('auth:signout');
		document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  	}

	onSubmit(e) {
		e.preventDefault();

		if (this.filedata === null || this.filedata === undefined || this.description === null || this.description === undefined) {
			return;
		}

		let reader = new FileReader();
		reader.readAsArrayBuffer(this.filedata);
		reader.onload = () => {
			let token = Cookies.get('token')
			socket.emit('post:create', {
				token: token, 
				filedata: reader.result, 
				filename: this.filedata.name,
				description: this.description 
			});
		}

		document.getElementById("add-form").hidden = true;
	}
	
	onChangeFile(e) {
	  	this.filedata = e.target.files[0];
	}
	
	onChangeText(e) {
	  this.description = e.target.value;
	}

	componentDidMount() {
		let token = Cookies.get('token')

		socket.on('posts', (response) => {
			if (response.err) {
				return
			}

			this.setState({posts: response.posts})
		})

		socket.on('post:create', (response) => {
			this.state.posts.unshift(response);
			this.setState({posts: this.state.posts});
		})

		socket.on('error:401', () => {
			this.setState({redirect: true}); 
		})

		socket.emit('posts', {token: token});
	}

	componentWillUnmount() {
		socket.removeAllListeners('posts');
		socket.removeAllListeners('post:create');
		socket.removeAllListeners('error:401');
	}

    render() {
		return (
			<div className="grid-container">
				{this.state.redirect ? <Redirect to="/Logination"/> : ''}
				<article>
					<img id="main-gif" src="/assets/animation.gif"/>
					<h2><Link onClick={this.onLinkClick} to="/">Выйти</Link></h2>
					<input id="search" type="text" placeholder="Искать" onKeyUp={this.onTableSearch} />
					<div id="add-form" hidden>
						<form action="create" encType="multipart/form-data" className="add-post-form">
							<button id="hide-add-form" onClick={this.onShowOrHideForm}>X</button>
							<div className="form-group">
								<label>Описание</label><br/>
								<input type="text" className="form-control" name="description" onChange={this.onChangeText} required />
							</div>
							<div className="form-group">
								<label>Добавить файл</label><br/>
								<input id="add-file" type="file" name="filedata" onChange={this.onChangeFile} />
							</div>
							<input type="submit" value="Cохранить" onClick={this.onSubmit}/>
						</form>
					</div>
					<fieldset id="posts-form">
						<table id="posts-grid">
							<thead>
								<tr>
									<th scope="col">№</th>
									<th scope="col">Имя автора</th>
									<th scope="col">Описание</th>
									<th scope="col">Дата</th>
									<th scope="col">Файл</th>
								</tr>
							</thead>
							<tbody>
								{this.state.posts.map((post) => {return <Post post={post} key={post.postId}/>})}
							</tbody>
						</table>
					</fieldset>
					<button id="show-add-form" onClick={this.onShowOrHideForm}>Добавить новый пост</button>
				</article>
			</div>
      	);   
    }
}

export default Posts;