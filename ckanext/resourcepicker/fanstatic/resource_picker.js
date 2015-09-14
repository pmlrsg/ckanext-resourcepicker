var m_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; //stores the days of the month

var days_in_month = function days_in_month(month,year) {// This returns the number of days in any given month and year
    return new Date(year, month, 0).getDate();
};

var add_years = function add_years(id, start, end) { // Adds years between the start and end given to the select with the given ID
    for (var i=start; i <= end ; i++){
      var option=$('<option></option>').val(i).html(i);
      $(id).append(option);
   }
};

var change_year = function change_year(id, start, end){ // This function is run when the year is changed.
   var prefix = id.split('_')[0]; // Gets the prefix of the id e.g. '#start' or '#end'
   if($(id).val() == start.getFullYear()){
      month_selector(prefix + "_month_select", start.getMonth()+1,12); // If the selected year is the first on the list it will change the months accordingly
   }
   else if($(id).val() == end.getFullYear()){
      month_selector(prefix + "_month_select", 1,end.getMonth()+1); // If the selected year is the last on the list it will change the months accordingly
   }
   else{
      month_selector(prefix + "_month_select", 1,12); // Otherwise it will put all the months in
   }
   var selected_month=parseInt($(prefix + "_month_select").val()); // Gets the selected month
   var selected_year=parseInt($(prefix + "_year_select").val()); // Gets the selected year
   day_selector(prefix + "_day_select", 1, days_in_month(selected_month, selected_year)); // Changes the day so that it displays the correct days
};

var month_selector=function month_selector(id, start, end) { // This function clears the month selector and re-populates it depending on the start and end values
   var selected_month=parseInt($(id).val());
   $(id).empty();
    for (var i=start; i <= end ; i++){
      var num = number_pad(i);
      var option=$('<option></option>').val(num).html(m_names[i-1]);
      $(id).append(option);
      if(selected_month === i){
         $(id).find('option[value="'+num+'"]').attr("selected",true); // If the month that was selected before is made it will select it
      }
   }
};

var change_month = function change_month(id){ // This function is run when the month is changed
   var prefix = id.split('_')[0]; // Gets the prefix of the id e.g. '#start' or '#end'
   var selected_month=parseInt($(prefix + "_month_select").val());
   var selected_year=parseInt($(prefix + "_year_select").val());
   day_selector(prefix + "_day_select", 1, days_in_month(selected_month, selected_year)); // Changes the day depending on the month and year
};

var day_selector=function day_selector(id, start, end) { // This function clears the day selector and re-populates it depending on the start and end values
   var selected_day=parseInt($(id).val());
   $(id).empty();
    for (var i=start; i <= end ; i++){
      var num = number_pad(i);
      var option=$('<option></option>').val(num).html(num);
      $(id).append(option);
      if(selected_day === i){
         $(id).find('option[value="'+num+'"]').attr("selected",true);// If the day that was selected before is made it will select it
      }
   }
};

var change_start = function change_start(){ // This is run when any of the start date values are changed, It verifies that the end date is after the start
   if(get_selected_start().getTime() > get_selected_end().getTime()){ // If the newly selected date is after the end date selected then iit maked the end date the same as the start date
      $("#end_year_select").val($("#start_year_select").val());
      $("#end_month_select").val($("#start_month_select").val());
      $("#end_day_select").val($("#start_day_select").val());
      $("#end_hour_select").val($("#start_hour_select").val());
   }
};

var get_selected_start = function get_selected_start(){ // This returns the selected start date
   return new Date($("#start_year_select").val(),$("#start_month_select").val()-1,$("#start_day_select").val(), $("#start_hour_select").val());
};

var get_selected_end = function get_selected_end(){ // This returns the selected end date
   return new Date($("#end_year_select").val(),$("#end_month_select").val()-1,$("#end_day_select").val(), $("#end_hour_select").val())
};

var number_pad = function number_pad(num){ // This adds a '0' to the front of single digit numbers that are input
   num = String(num);
   if(num.length ==1){
      num="0" + num;
   }
   return num
};

var get_links = function get_links(start_date, end_date){ // This function makes a list of all the links the user has requested
   var link_list = []; // The list for storing objects
   var current_date = new Date(start_date); // Starts at the selected start date
   while(current_date <= end_date){ // Continues until the end date
      var new_path = path.replace(/yyyy/g, current_date.getFullYear()); // Replaces yyyy with the year in the loop
      new_path = new_path.replace(/mm/g, number_pad(current_date.getMonth()+1)); // Replaces mm with the month in the loop
      new_path = new_path.replace(/dd/g, number_pad(current_date.getDate())); // Replaces dd with the day in the loop
      new_path = new_path.replace(/hh/g, number_pad(current_date.getHours())); // Replaces hh with the hour in the loop
      new_path = new_path.replace(/&lt;model_name&gt;/g, "dk1"); // Replaces anything with model name in the url to dk1 (temporary thing)
      new_path = new_path.replace(/&lt;standard_name&gt;/g, $("#standard_name_select").val()); // Replaces the standard name with the selected value
      var format = $("#format_select").val(); // stores the link in a variable depending on the selected format seleceted
      if(format === "wms"){
         current_link = domain + "wms/" + new_path +"?service=WMS&version=1.3.0&request=GetCapabilities";
         }
      else if(format === "wcs"){
         current_link = domain + "wcs/" + new_path +"?service=WCS&version=1.0.0&request=GetCapabilities";
      }
      else if(format === "opendap"){
         current_link = domain + "dodsC/" + new_path +".html";
      }
      // This next block stores the date and link in the list, It also increments the date ready for the next step of the loop
      // it uses the hour, day, month and year variables to decide the date format and the amount to increment
      if(hour){
         link_list.push({date: number_pad(current_date.getDate()) + '/' + number_pad(current_date.getMonth()+1) + '/' + current_date.getFullYear() + ' ' + number_pad(current_date.getHours()) + ':00' , link: current_link});
         current_date.setHours(current_date.getHours()+3);
      }
      else if(day){
         link_list.push({date: number_pad(current_date.getDate()) + '/' + number_pad(current_date.getMonth()+1) + '/' + current_date.getFullYear(), link: current_link});
         current_date.setDate(current_date.getDate()+1);
      }
      else if(month){
         link_list.push({date: m_names[current_date.getMonth()] + ' ' + current_date.getFullYear(), link: current_link});
         current_date.setMonth(current_date.getMonth()+1);
      }
      else if(year){
         link_list.push({date: current_date.getFullYear(), link: current_link})
         current_date.setFullYear(current_date.getFullYear()+1);
      }
   }
   return link_list; // Returns the list of dates and links
}
// Boolean values to specify the degree of acuracy of the dates
var year=(url_get(resource_url, 'path').search("yyyy") > -1); // If the url given contains 'yyyy' then this is set to true
var month=(year && url_get(resource_url, 'path').search("mm") > -1); // If the url given contains 'mm' and year is true then this is set to true
var day=(month && url_get(resource_url, 'path').search("dd") > -1); // If the url given contains 'dd' and month is true then this is set to true
var hour=(day && url_get(resource_url, 'path').search("hh") > -1); // If the url given contains 'hh' and day is true then this is set to true
var start=new Date(url_get(resource_url, 'start')); // Gets the start date given in the url
var end=new Date(url_get(resource_url, 'end')); // Gets the end date given in the url
if(url_get(resource_url, 'standard_names')){
   var standard_names=url_get(resource_url, 'standard_names').split(','); // If there are any standard names given then it will add them to this variable
}
var path=url_get(resource_url, 'path'); // Gets the given URL
var domain=url_get(resource_url, 'domain'); // Gets the given domain

var print_hyperlinks = function print_hyperlinks(links){ // Prints out the dates and hyperlinks stored in the links array of objects
   var hyperlinks = []; // An array for storing all the '<a>' tags
   for(i = 0; i < links.length; i++){
      hyperlinks.push(links[i].date+": <a href='" + links[i].link + "'>" + links[i].link + "</a>"); // Adds each of the dates and corresponding links to the list
   }
   $("#hyperlinks").html(hyperlinks.join("<br/>")); // prints each date and link in the list into the 'hyperlinks' tag seperated by a break
}

var save_links = function save_links(links){ // Similar to the printing of the hyperlinks but this promts the user with a save file with a list of the links (no dates)
   var links_to_write = [];
   for(i=0; i<links.length; i++){
      links_to_write.push(links[i].link)
   }
   var textToWrite = links_to_write.join("\n");
   var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
   var fileNameToSaveAs = "data_URLs.txt";

   var downloadLink = document.createElement("a");
   downloadLink.download = fileNameToSaveAs;
   downloadLink.innerHTML = "Download File";
   if (window.webkitURL != null){
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
   }
   else{
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
   }
   downloadLink.click();
}

var destroyClickedElement = function destroyClickedElement(event){ // A function used by the save_links function
   document.body.removeChild(event.target);
}

$(document).ready(function(){ // When the document is ready
   add_years("#start_year_select", start.getFullYear(), end.getFullYear()); // Adds the start years
   add_years("#end_year_select", start.getFullYear(), end.getFullYear()); // Adds the end years
   if(year){
      $(".year_select_div").show(); // If year is true then show the year selector divs
   }
   month_selector("#start_month_select", start.getMonth()+1,12); // Adds the start months
   month_selector("#end_month_select", start.getMonth()+1,12); // Adds the end months
   if(month){
      $(".month_select_div").show(); // If month is true then show the month selector divs
   }
   // This next block populates the day selectors with the correct dates
   var selected_start_month=parseInt($("#start_month_select").val());
   var selected_start_year=parseInt($("#start_year_select").val());
   var selected_end_month=parseInt($("#end_month_select").val());
   var selected_end_year=parseInt($("#end_year_select").val());
   day_selector("#start_day_select", 1, days_in_month(selected_start_month, selected_start_year));
   day_selector("#end_day_select", 1, days_in_month(selected_end_month, selected_end_year));
   if(day){
      $(".day_select_div").show(); // If day is true then show the day selector divs
   }
   if(hour){
      $(".hour_select_div").show(); // If hour is true then show the hour selector divs
   }
   if(standard_names){ // If there are any values in the standard_names vaiable
      $.each (standard_names, function( i, val){
         var option=$('<option></option>').val(val).html(val);
         $("#standard_name_select").append(option); // Adds the values to the standard name selector
      });
      $("#standard_name_select_div").show(); // Shows the standard name selector div
   }

   $('#submit').on('click', function(e){ // When you click submit
      var start_date;
      var end_date;
      start_date = get_selected_start(); // Stores the selected start date
      end_date = get_selected_end(); // Stores the selected end date
      if(start_date <= end_date){ // If the start date is on or before the end date
         links = get_links(start_date, end_date); // Get the links
         print_hyperlinks(links); // Print the links that were returned
         $("#error").html(""); // Clear any errors that may be there
      }
      else{
         $("#error").html("Please select an end date that is after the start date"); // Show an error to the user
      }
   });

   $('#save').on('click', function(e){ // Then you click save
      var start_date;
      var end_date;
      start_date = get_selected_start(); // Stores the selected start date
      end_date = get_selected_end(); // Stores the selected end date
      if(start_date <= end_date){ // If the start date is on or before the end date
         links = get_links(start_date, end_date); // Get the links
         save_links(links); // Save the links that were returned to a file
         $("#error").html(""); // Clear any errors that may be there
      }
      else{
         $("#error").html("Please select an end date that is after the start date"); // Show an error to the user
      }
   });

   $(".year_select").change(function(e){ // When you change the year run the change_year method
      change_year("#" + e.target.id, start, end);
   });

   $(".month_select").change(function(e){ // When you change the month run the change_ymonth method
      change_month("#" + e.target.id);
   });

   $("#start_times .date_control").change(function(e){ // When you change the start date run the change_start method
      change_start();
   });
});