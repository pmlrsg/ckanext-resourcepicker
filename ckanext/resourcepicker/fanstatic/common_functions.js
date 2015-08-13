var url_get=function url_get(url, sParam) { // A function for getting parameters from the url
   url = url.replace("http://", ""); // Takes the 'http://' from the start of the url (added by CKAN)
   url = url.replace(/&amp;/g, "&"); // Takes all '&amp;' from the the url and makes it a normal '&'
   var sPageURL = url,
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

   for (i=0; i < sURLVariables.length; i++) {
      sParameterName=sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
         return sParameterName[1] === undefined ? true : sParameterName[1];
      }
   }
};