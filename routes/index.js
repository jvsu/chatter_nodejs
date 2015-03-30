module.exports = function Route(app)
{
 	app.get('/', function(req, res)
 	{    
 		res.render('index');
	}); //you will add more routes and logic here but this is how to write the default route for your project
	
 	var users = {};

 	app.io.route('new_user',function(req)
 	{
 		var name = req.data.user_name;
 		req.session.name = name;
 		users[req.sessionID] = name;
 		app.io.broadcast('nusers',{userID:req.sessionID,name:name});
 		console.log(name, req.sessionID);
 		// req.session.save(function(){
 		// 	app.io.broadcast('users',{userID:req.sessionID,users:users});
 		// 	app.io.broadcast('setup'),{userID:req.sessionID,users:users};
 		// });
 	});
 	app.io.route('user_message',function(req){
 		var message = req.data.umessage;
 		app.io.broadcast('update',{uID:req.sessionID,umessage:message});
 		console.log(req.sessionID,message);
 	});	
 	//the your box is going to be setup by regular loading.
 	app.post('/new_user',function(req,res){
 		name = req.body.name;
 		req.session.name = name;
 		req.session.save(function(){
 			res.redirect('/chat');
 		});
 	});
 	app.get('/chat',function(req,res){
 		res.render('chat',{uID:req.sessionID,name:req.session.name});
 	});
 	app.io.route('get_users',function(req,res){
 		req.io.emit('all_users',{uID:req.sessionID,users:users});
 	});
 	app.io.route('message',function(req,res){
 		message = req.data.new_message;
 		app.io.broadcast('new_message',{message:message,uID:req.sessionID});
 		// send the ID as well. 
 		console.log(message);
 	});
 	app.get('/logoff',function(req,res){
 		uID = req.sessionID;
 		delete users[req.sessionID];
 		app.io.broadcast('delete_user',{user_id:uID});
 		res.redirect('/');
 	});
}