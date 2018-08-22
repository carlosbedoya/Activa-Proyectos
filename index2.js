var restify = require('restify');
var SerialPort = require('serialport');
var porthttp = process.argv[2];

function respond(req, res, next) {
  var port = new SerialPort(req.params.puerto, {
    baudRate: parseInt(req.params.velocidadPuerto),
    parity:   req.params.paridad,
    dataBits: parseInt(req.params.databits),
    stopBits : parseInt(req.params.stopsbits),
  });
  var data = "";
  port.on('data', onData);

  function onData(e) {
    data = "" + e;
    console.log("-" + data);
  } 
  port.on("close", function () {
    
  });

  var error1 = "";
  port.on("error", function (error) {
    console.log(error);
    error1 = error;
    //Handle Error
  });
  var count = 0;
  intervalID = setInterval(function () {
    count++;
    console.log(count, 'seconds passed');
    var jsonArg1 = new Object();
    jsonArg1.vehiculo = req.params.placa;
    jsonArg1.puerto = req.params.puerto;
    jsonArg1.datos = data;
    jsonArg1.error = error1.message;
    //
    if (data !== "") {
      console.log("hay datos");
      res.send(JSON.parse(JSON.stringify(jsonArg1)));
      port.close();
      clearInterval(intervalID);
    }
    else if (count==30) {
      port.close();
      jsonArg1.error= "Data not received with the selected port";
      res.send(JSON.parse(JSON.stringify(jsonArg1)));
      clearInterval(intervalID);
  }
  else if (error1 !=="") {
    res.send(JSON.parse(JSON.stringify(jsonArg1)));
    clearInterval(intervalID);
}
  }, 1000);
  console.log(req.params);
  next();

}

var server = restify.createServer();
server.get('/sede/:sede/placa/:placa/tipodocumento/:tipodocumento/DocEntryDocumento/:DocEntryDocumento/puerto/:puerto/velocidadPuerto/:velocidadPuerto/paridad/:paridad/databits/:databits/stopsbits/:stopsbits/companyDB/:companyDB', respond);
server.head('/sede/:sede/placa/:placa/tipodocumento/:tipodocumento/DocEntryDocumento/:DocEntryDocumento/puerto/:puerto/velocidadPuerto/:velocidadPuerto/paridad/:paridad/databits/:databits/stopsbits/:stopsbits/companyDB/:companyDB', respond);

//server.listen(porthttp, function () {
server.listen(8085, function () {
  console.log('%s listening at %s', server.name, server.url);
});