const express = require('express')
const port = 5002
const helmet = require('helmet')
const router = require('./routes/controller.js')
const user = require('./routes/user/user.js')
const schedule = require('./routes/rulebook/schedule/schedule.js')
const search = require('./routes/rulebook/search/search.js')
const document = require('./routes/rulebook/newtab/document.js')
const process = require('./routes/rulebook/process/process.js')
const jwwdxf = require('./routes/jww_dxf/jww_dxf.js')
const auth = require('./auth.js')

 
const app = express()
app.use(helmet())
 

app.use('/', router)
app.use('/user', user)
app.use('/schedule', schedule)
app.use('/search', search)
app.use('/document', document)
app.use('/process', process)
app.use('/jwwdxf', jwwdxf)
 
app.listen(port,function(){
	console.log('listening to port ' + port);
})