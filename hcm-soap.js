var soap = require('soap');


var HCMGetBirthday = function (callback){
     var xdo = 'bdayr.xdo';
     var args = {_xml:'<v2:runReport xmlns:v2="http://xmlns.oracle.com/oxp/service/v2"> <v2:reportRequest> <v2:attributeFormat>csv</v2:attributeFormat> <v2:reportAbsolutePath>/Custom/'+xdo+'</v2:reportAbsolutePath> <v2:sizeOfDataChunkDownload>-1</v2:sizeOfDataChunkDownload> </v2:reportRequest> <v2:userID>ivan.austria</v2:userID> <v2:password>Posporuz1#</v2:password> </v2:runReport>'};                 
                             
     //SOAP Client Request
     var client = soap.createClient('https://bi-aufsn4x0cba.oracleoutsourcing.com/xmlpserver/services/PublicReportService?wsdl', { wsdl_headers: { } }, (err, client) => {
          if (err) {
          } else {
               return client.runReport( args, function(err, result) {
                    var decoded = new Buffer(result.runReportReturn.reportBytes, 'base64').toString('ascii');
                     var decoded = decoded.replace(new RegExp('"', 'g'), '');
                     bdayArray = decoded.split('\n');
                     bdayArray.shift();
                     callback(bdayArray);
                });
          }
     });
 
}
module.exports.HCMGetBirthday = HCMGetBirthday;

var HCMGetAnniv = function (callback){
     var xdo = 'annivr.xdo';
     var args = {_xml:'<v2:runReport xmlns:v2="http://xmlns.oracle.com/oxp/service/v2"> <v2:reportRequest> <v2:attributeFormat>csv</v2:attributeFormat> <v2:reportAbsolutePath>/Custom/'+xdo+'</v2:reportAbsolutePath> <v2:sizeOfDataChunkDownload>-1</v2:sizeOfDataChunkDownload> </v2:reportRequest> <v2:userID>ivan.austria</v2:userID> <v2:password>Posporuz1#</v2:password> </v2:runReport>'};                 
                             
     //SOAP Client Request
     var client = soap.createClient('https://bi-aufsn4x0cba.oracleoutsourcing.com/xmlpserver/services/PublicReportService?wsdl', { wsdl_headers: { } }, (err, client) => {
          if (err) {
          } else {
               return client.runReport( args, function(err, result) {
                    //return client.runReport( args, function(err, result, envelope, soapHeader) {
                    var decoded = new Buffer(result.runReportReturn.reportBytes, 'base64').toString('ascii');
                     var decoded = decoded.replace(new RegExp('"', 'g'), '');
                     annivArray = decoded.split('\n');
                     annivArray.shift();
                     callback(annivArray);
                });
          }
     });
 
}
module.exports.HCMGetAnniv = HCMGetAnniv;