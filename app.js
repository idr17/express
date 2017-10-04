var http = require('http'),
	url = require('url'),
	router = require('routes')(),
	view = require('swig'),
	mysql = require('mysql'),
	path = require('path'),
	fs = require('fs');

/* pegination testing */
//var pagination = require('pagination');
	
/* Database Connection */
var connection = mysql.createConnection({
	host	: 'localhost',
	user	: 'root',
	password: '',
	database: 'testing'
});

/*
** Node CreateServer
** and provide routes for some static resource 
*/
http.createServer(function(req, res){

	/* dynamic route */
	var reqPath = url.parse(req.url).pathname;
	var match = router.match(reqPath);
	
	/* static route to serve static file */
	var extname = path.extname(reqPath);
	
	if(match){
		match.fn(req, res);
	}
	/* manual routing static files */
	else if(extname == '.css' || extname == '.js' || extname == '.jpg' || extname == '.png' || '.json' || extname == '.wav' || extname == '.ico'){
		switch(extname){
			case '.js':
				contentType = 'text/javascript';
				break;
			case '.css':
				contentType = 'text/css';
				break;
			case '.jpg':
				contentType = 'image/jpg';
				break;
			case '.png':
				contentType = 'image/png';
				break;
			case '.json':
				contentType = 'application/json';
				break;
			case '.wav':
				contentType = 'audio/wav';
				break;
			case '.ico':
				contentType = 'image/vnd.microsoft.icon';
				break;
		}
		
		fs.readFile('.' + req.url, function(err, data){
			if (err && err.code != 'ENOENT') console.log(err);
			
			res.writeHead(200, {"Content-Type" : contentType});
			res.end(data, 'utf-8');
		});
	}
	/* then when Not Found send to 404 */
	else{
		res.writeHead(404, {"Content-Type" : "text/plain"});
		res.end("Page Not Found");
	}
}).listen(8888);

/* 
** Function to compile html template and fill meta header and data. 
** argument in json format.
*/
var template = function(template){
	var html = view.compileFile(template.path);
	var output = html({
		data: template.res,
		meta: template.meta
	});
	
	return output;
};

/*
** Home Method
*/
var home = function(req, res){
	connection.query('SELECT * FROM news ORDER BY date_publish DESC LIMIT 9', function(error, result, fields){
		if (error) {
			console.log(error);
			result = {};
		}
		
		var rawData = {
			'path'	: './template/index.html',
			'res' 	: result,
			'meta'	: {
				'title'			: 'Single Page Website | duasedjoli.com', 
				'description' 	: 'single page dengan native node js',
				'keywords'		: 'single page, website, native nodejs, learning, skill up'
				}
		};
		var compiledTemplate = template(rawData);
		
		res.writeHead(200, {"Content-Type" : "text/html"});
		res.end(compiledTemplate);
	});
};

/*
** Routing List
**
*/
router.addRoute('/', home);
router.addRoute('#', home);

console.log('Server is running..');
