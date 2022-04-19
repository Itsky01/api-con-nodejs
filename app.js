var express = require('express');
var mysql= require('mysql');
var path = require('path');
var fs = require('fs'); // para leer archivo de carpetas
//var multer  = require('multer')
const fileUpload = require('express-fileupload');

const { json } = require('express')
var app= express() // constructor de express, para q el servidor acceda a todos los metodos y prop de express
var cors = require('cors');


app.use(express.json());
app.use(cors());
app.use(fileUpload());


// conex a bd
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'base_productos'
});
 
connection.connect(error =>{

if (error){
console.log('no se conecta a bd');
}else{

    console.log('estamos conectados');
}
});
// mostramos todo de la tabla productos
app.get('/productos/',(req,res)=>{
    connection.query('SELECT * from productos', (error, results)=> {
        if (error){
         throw error;
        console.log(error);
    }else{

        res.send(results);
    }})  
})


// mostrar un registro especifico de la tabla
    app.get('/productos/:id',(req,res)=>{
    connection.query('SELECT * from productos where id =?',[req.params.id], (error, result)=> {
        if (error){
         throw error;
        console.log(error);
    }else{

        res.send(result);
    }})
})

// subir imagenes carpeta
/*var upload = multer({ dest: './imagenes' })
app.post('/upload', upload.single('avatar'), function (req, res) {
   
   console.log(req.file, req.body)
  
     const ext = path.extname(req.file.originalname).toLocaleLowerCase();
    fs.rename(req.file.path, `./imagenes/${req.file.originalname}`, () => {
       // res.send('received');
          //res.redirect('./index.html'); 
})}); */

/*const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, './imagenes'),
    filename: (req, file, cb) => { // cb es callback
        cb(null, Date.now() + file.originalname)
    }
})

const fileUpload = multer({
    storage: diskstorage
}).single('avatar')

app.post('/upload', fileUpload,(req, res) => {
console.log(req.file)

    const type = req.body.nombre;
    const name = req.file.originalname
    const data = fs.readFileSync(path.join(__dirname, './imagenes/' + req.files.file))
    let dta = {tipo:type,nombre:name,datos:data}
    let sql = "INSERT INTO images SET ?"
    connection.query(sql,dta, function(err, result){
            if(err){
               throw err
            }else{              
            
            // Object.assign(data, {id: result.insertId })  // nuevo id creado           
            res.send('imagen recibida') //enviar datos                       
        }
    })
})*/



        
   
// insertar registros
/*app.post('/productos/', fileUpload, (req,res)=>{
   const dta = req.file.originalname
   let data = {nombre:req.body,descripcion:req.body.descripcion,ruta:dta}
    let sql = "INSERT INTO productos SET ?"
    connection.query(sql, data, function(err, result){
            if(err){
               throw err
            }else{              
            
             Object.assign(data, {id: result.insertId })  // nuevo id creado           
             res.send(data) //enviar datos                       
        }
    })
})*/

// acceder a las imagenes  desde front end y desde ruta de la bd
const staticRoute = path.join(__dirname, '/imagenes')

app.use('/imagenes', express.static(staticRoute))
 


//ACTUALIZAR un REGISTRO de productos
app.put('/productos/:id',(req,res)=>{
    const id = req.params.id;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
   // const ruta = 'imagenes/'+ sampleFile.name

    connection.query('UPDATE productos SET ? WHERE id = ?',[{nombre:nombre, descripcion:descripcion}, id], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
           // res.redirect('/'); 
            res.send(results);         
        }
});
});

// borrar registro de tabla productos
app.delete('/productos/:id',(req,res)=>{
   // const id = req.body.id;
    connection.query('DELETE from productos WHERE id = ?',[req.params.id], function(error, results){
        if(error){
            console.log(error);
        }else{           
          //  res.redirect('/');
          res.send(results);          
        }
});

});

// conectar navegador 
app.get('/',(req,res)=> {

    res.send('pantalla principal');
    
    })
    
      
    
    // puerto de trabajo
    
    const mipuerto= 7000;
    app.listen(mipuerto, () => {
    
        console.log('puerto funcionando en'+ mipuerto );
    })


    app.post('/upload', function(req, res) {
        let sampleFile;
        let uploadPath;
        const nombre = req.body.nombre;
        const descripcion = req.body.descripcion;
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).send('No files were uploaded.');
        }
      
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        sampleFile = req.files.avatar;
        uploadPath = __dirname + '/imagenes/' + sampleFile.name;
      
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, function(err) {
          if (err)
            return res.status(500).send(err);
      
         // res.send(nombre);
        });

      let data = {nombre:req.body.nombre,descripcion: req.body.descripcion,ruta:'imagenes/'+ sampleFile.name}
    let sql = "INSERT INTO productos SET ?"
    connection.query(sql, data, function(err, result){
            if(err){
               throw err
            }else{              
            
             Object.assign(data, {id: result.insertId })  // nuevo id creado           
             res.send(data) //enviar datos       
                          
        }
      });
   
    })


    app.post('/producto', function(req, res) {
        let sampleFile;
        let uploadPath;
        const id = req.params.id;
      
       const ruta = 'imagenes/'+ sampleFile.name
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).send('No files were uploaded.');
        }
      
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
         sampleFile = req.files.imp;
        uploadPath = __dirname + '/imagenes/' + sampleFile.name;
      
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, function(err) {
          if (err)
            return res.status(500).send(err);
      console.log(err);
         // res.send(nombre);
        });

        connection.query('UPDATE productos SET ruta WHERE id ="1"',[{ruta:ruta}], (error, results)=>{
            if(error){
                
            }else{           
               // res.redirect('/'); 
                res.send(results);         
            }
    });
   
    })