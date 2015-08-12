var m_names=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; //stores the days of the month

var url_get=function url_get(sParam) {
   resource_url = resource_url.replace("http://", "");

   //take this out eventually

   resource_url = resource_url.replace("resource_picker.html?", "");

   var sPageURL=resource_url,
      sURLVariables=sPageURL.split('&amp;'),
      sParameterName,
      i;

   for (i=0; i < sURLVariables.length; i++) {
      sParameterName=sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
         return sParameterName[1] === undefined ? true : sParameterName[1];
      }
   }
};

var days_in_month=function days_in_month(month,year) {
    return new Date(year, month, 0).getDate();
};

var add_years=function add_years(id, start, finish) {
    for (var i=start; i <= finish ; i++){
      var option=$('<option></option>').val(i).html(i);
      $(id).append(option);
   }
};

var change_year = function change_year(id, start, finish){
   var prefix = id.split('_')[0];
   if($(id).val() == start.getFullYear()){
      month_selector(prefix + "_month_select", start.getMonth()+1,12);
   }
   else if($(id).val() == finish.getFullYear()){
      month_selector(prefix + "_month_select", 1,finish.getMonth()+1);
   }
   else{
      month_selector(prefix + "_month_select", 1,12);
   }
   var selected_month=parseInt($(prefix + "_month_select").val());
   var selected_year=parseInt($(prefix + "_year_select").val());
   day_selector(1, days_in_month(selected_month, selected_year));
};

var month_selector=function month_selector(id, start, finish) {
   var selected_month=parseInt($(id).val());
   $(id).empty();
    for (var i=start; i <= finish ; i++){
      var num = number_pad(i);
      var option=$('<option></option>').val(num).html(m_names[i-1]);
      $(id).append(option);
      if(selected_month === i){
         $(id).find('option[value="'+num+'"]').attr("selected",true);
      }
   }
};

var change_month = function change_month(id){
   var prefix = id.split('_')[0];
   var selected_month=parseInt($(prefix + "_month_select").val());
   var selected_year=parseInt($(prefix + "_year_select").val());
   day_selector(prefix + "_day_select", 1, days_in_month(selected_month, selected_year));
   }

var day_selector=function day_selector(id, start, finish) {
   var selected_day=parseInt($(id).val());
   $(id).empty();
    for (var i=start; i <= finish ; i++){
      var num = number_pad(i);
      var option=$('<option></option>').val(num).html(num);
      $(id).append(option);
      if(selected_day === i){
         $(id).find('option[value="'+num+'"]').attr("selected",true);
      }
   }
};

var number_pad = function number_pad(num){
   num = String(num);
   if(num.length ==1){
      num="0" + num;
   }
   return num
}

var get_links = function get_links(start_date, end_date){
   var link_list = [];
   var current_date = new Date(start_date);
   while(current_date <= end_date){
      var new_url = url.replace(/yyyy/g, current_date.getFullYear());
      new_url = new_url.replace(/mm/g, number_pad(current_date.getMonth()+1));
      new_url = new_url.replace(/dd/g, number_pad(current_date.getDate()));
      new_url = new_url.replace(/hh/g, number_pad(current_date.getHours()));
      new_url = new_url.replace(/<model_name>/g, "dk1");
      new_url = new_url.replace(/<standard_name>/g, $("#standard_name_select").val());
      console.log(new_url);
      if(hour){
         current_date.setHours(current_date.getHours()+3);
      }
      else if(day){
         current_date.setDate(current_date.getDate()+1);
      }
      else if(month){
         current_date.setMonth(current_date.getMonth()+1);
      }
      else if(year){
         current_date.setFullYear(current_date.getFullYear()+1);
      }
      var format = $("#format_select").val();
      if(format === "wms"){
         link_list.push("https://wci.earth2observe.eu/thredds/wms/" + new_url +"?service=WMS&version=1.3.0&request=GetCapabilities");
         }
      else if(format === "wcs"){
         link_list.push("https://wci.earth2observe.eu/thredds/wcs/" + new_url +"?service=WCS&version=1.0.0&request=GetCapabilities");
      }
      else if(format === "opendap"){
         link_list.push("https://wci.earth2observe.eu/thredds/dodsC/" + new_url +".html");
      }
   }
   return link_list;
}

var year=(url_get('url').search("yyyy") > -1);
var month=(year && url_get('url').search("mm") > -1);
var day=(month && url_get('url').search("dd") > -1);
var hour=(day && url_get('url').search("hh") > -1);
var start=new Date(url_get('start'));
   var finish=new Date(url_get('finish'));
   if(url_get('standard_names')){
      var standard_names=url_get('standard_names').split(',');
   }
   var url=url_get('url');

var print_hyperlinks = function print_hyperlinks(links){
   var hyperlinks = [];
   for(i = 0; i < links.length; i++){
      hyperlinks.push("<a href='" + links[i] + "'>" + links[i] + "</a>");
   }
   $("#hyperlinks").html(hyperlinks.join("<br/>"));
}

var save_links = function save_links(links){
   var textToWrite = links.join("\n");
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

var destroyClickedElement = function destroyClickedElement(event){
   document.body.removeChild(event.target);
}

$(document).ready(function(){
   add_years("#start_year_select", start.getFullYear(), finish.getFullYear());
   add_years("#end_year_select", start.getFullYear(), finish.getFullYear());
   if(year){
      $(".year_select_div").show();
   }
   month_selector("#start_month_select", start.getMonth()+1,12);
   month_selector("#end_month_select", start.getMonth()+1,12);
   if(month){
      $(".month_select_div").show();
   }
   var selected_start_month=parseInt($("#start_month_select").val());
   var selected_start_year=parseInt($("#start_year_select").val());
   var selected_end_month=parseInt($("#end_month_select").val());
   var selected_end_year=parseInt($("#end_year_select").val());
   day_selector("#start_day_select", 1, days_in_month(selected_start_month, selected_start_year));
   day_selector("#end_day_select", 1, days_in_month(selected_end_month, selected_end_year));
   if(day){
      $(".day_select_div").show();
   }
   if(hour){
      $(".hour_select_div").show();
   }
   if(standard_names){
      $.each (standard_names, function( i, val){
         var option=$('<option></option>').val(val).html(val);
         $("#standard_name_select").append(option);
      });
      $("#standard_name_select_div").show();
   }

   $('#submit').on('click', function(e){
      $('#change_me').html("Submit Clicked");
      var start_date;
      var end_date;
      start_date = new Date($("#start_year_select").val(),$("#start_month_select").val()-1,$("#start_day_select").val(), $("#start_hour_select").val())
      end_date = new Date($("#end_year_select").val(),$("#end_month_select").val()-1,$("#end_day_select").val(), $("#end_hour_select").val())
      if(start_date <= end_date){
         links = get_links(start_date, end_date);
         print_hyperlinks(links);
         $("#error").html("");
      }
      else{
         $("#error").html("Please select an end date that is after the start date");
      }
   });

   $('#save').on('click', function(e){
      var start_date;
      var end_date;
      start_date = new Date($("#start_year_select").val(),$("#start_month_select").val()-1,$("#start_day_select").val(), $("#start_hour_select").val())
      end_date = new Date($("#end_year_select").val(),$("#end_month_select").val()-1,$("#end_day_select").val(), $("#end_hour_select").val())  
      if(start_date <= end_date){
         links = get_links(start_date, end_date);
         save_links(links);
         $("#error").html("");
      }
      else{
         $("#error").html("Please select an end date that is after the start date");
      }
   });

   $(".year_select").change(function(e){
      change_year("#" + e.target.id, start, finish);
   });

   $(".month_select").change(function(e){
      change_month("#" + e.target.id);
   });
});