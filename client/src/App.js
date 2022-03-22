import React from 'react'
import {BrowserRouter, Route, Switch } from 'react-router-dom'
import Logination from './auth/Logination'
import Registration from './auth/Registration'
import Posts from './post/Posts'

function App() {
  	return (
		<div>
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Logination}/>
					<Route exact path="/Logination" component={Logination}/>
					<Route exact path="/Registration" component={Registration}/>
					<Route exact path="/Posts" component={Posts}/>
				</Switch>
			</BrowserRouter>
		</div>
  	);
}	

export default App;