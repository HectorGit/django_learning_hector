const SIZE_CUTOFF = 767;
$(document).ready(function(){
  var graphRequests = null;
  var units_back = 0;
  var graphDates = 'daily';
  var graphMode = 'distance';
  var bike_btn = true;
  var desk_btn = true;

  $('#desk').click(function () {
    if(desk_btn == true){
      $('#desk').css('opacity', '0.3')
      desk_btn = false;
      dashboardGraph.data.datasets[1].hidden = true;
      dashboardGraph.update();
      get_data(graphDates, graphMode, units_back)
    }
    else {
      $('#desk').css('opacity', '1')
      desk_btn = true;
      dashboardGraph.data.datasets[1].hidden = false;
      dashboardGraph.update();
      get_data(graphDates, graphMode, units_back)
    }
  })
  
  $('#bike').click(function () {
    if (bike_btn == true) {
      $('#bike').css('opacity', '0.3')
      bike_btn = false;
      dashboardGraph.data.datasets[0].hidden = true;
      dashboardGraph.update();
      get_data(graphDates, graphMode, units_back)
    }
    else {
      $('#bike').css('opacity', '1')
      bike_btn = true;
      dashboardGraph.data.datasets[0].hidden = false;
      dashboardGraph.update();
      get_data(graphDates, graphMode, units_back)
    }
  })

  // BUTTON HANDLERS (START)
  $('#back_unit').click(function(){
    units_back += 1;
    get_data(graphDates, graphMode, units_back)
  })
  $('#forward_unit').click(function(){
    units_back -= 1;
    get_data(graphDates, graphMode, units_back)
  })
  $('#today').click(function(){
    units_back = 0;
    get_data(graphDates, graphMode, units_back)
  })
  $('#graphDistance').click(function(){
    if (!graphDates) graphDates = 'daily'
    $('#graphDistance').removeClass('graph-icon-toggle')
    $('#graphCalories').addClass('graph-icon-toggle')
    $('#graphUsage').addClass('graph-icon-toggle')
    $('#graphEnergy').addClass('graph-icon-toggle')
    $('#desk').attr('disabled', 'disabled')
    $('#desk').css('opacity', '0.3')
    desk_btn = false;
    dashboardGraph.data.datasets[1].hidden = true;
    dashboardGraph.update();
    graphMode = 'distance'
    get_data(graphDates, graphMode, units_back)
  })
  $('#graphCalories').click(function(){
    $('#graphDistance').addClass('graph-icon-toggle')
    $('#graphCalories').removeClass('graph-icon-toggle')
    $('#graphUsage').addClass('graph-icon-toggle')
    $('#graphEnergy').addClass('graph-icon-toggle')
    $('#desk').removeAttr('disabled', 'disabled')
    graphMode = 'calories'
    get_data(graphDates, graphMode, units_back)
  })
  $('#graphEnergy').click(function () {
    $('#graphDistance').addClass('graph-icon-toggle')
    $('#graphEnergy').removeClass('graph-icon-toggle')
    $('#graphUsage').addClass('graph-icon-toggle')
    $('#graphCalories').addClass('graph-icon-toggle')
    $('#desk').attr('disabled', 'disabled')
    $('#desk').css('opacity', '0.3')
    graphMode = 'total_power'
    desk_btn = false;
    dashboardGraph.data.datasets[1].hidden = true;
    dashboardGraph.update();
    get_data(graphDates, graphMode, units_back)
  })
  $('#graphUsage').click(function(){
    $('#graphDistance').addClass('graph-icon-toggle')
    $('#graphCalories').addClass('graph-icon-toggle')
    $('#graphEnergy').addClass('graph-icon-toggle')
    $('#graphUsage').removeClass('graph-icon-toggle')
    $('#desk').removeAttr('disabled', 'disabled')
    graphMode = 'usage'
    get_data(graphDates, graphMode, units_back)
  })
  
  $('#date-selector').change(function(){
    units_back = 0
    graphDates = $("#date-selector option:selected" ).attr('id')
    get_data(graphDates, graphMode, units_back)
  })
  // BUTTON HANDLERS (END)

  // This is to initialize the graph with some data on page load
  $('#graphDistance').click()
  $(window).resize(function(){
    window_width = $(window).width()
    dashboardGraph.data.labels = get_labels(graphDates, units_back)
    dashboardGraph.update();
  })
});

function get_daily_bike_data(type, units_back) {
  check_if_today(units_back)

  $.ajax({
    type: "GET",
    url: "get_bike_daily",
    success: function(data){
      var hourly = "YYYY-MM-DD HH";
      var res = JSON.parse(data);
      var hourly_keys = Object.keys(res);
      var time = moment().utc().local().startOf('day').subtract(units_back, 'days');
      current_date = moment().utc().local()
      dashboardGraph.data.datasets[0].data = new Array(24).fill(0);
      dashboardGraph.data.datasets[0].title = new Array(24).fill('');
      initiate_data_type(type, 24)

      if (type == "calories" || type == "distance" || type == 'total_power') {
        for (var i = 0; i < 24; i++) {
          if (hourly_keys.includes(time.format(hourly))){
            dashboardGraph.data.datasets[0].data[i] = res[time.format(hourly)][type];
          }
          time.add(1, 'hours')
        }
      }
      else{
        var time = moment().utc().local().startOf('day').subtract(units_back, 'days');
        for (var i = 0; i < 24; i++) {
          if (hourly_keys.includes(time.format(hourly))) {
            dashboardGraph.data.datasets[0].data[i] = res[time.format(hourly)]["active_time_bike"];
          }
          time.add(1, 'hours')
        }
      }

      display_data(24, type)
      dashboardGraph.data.labels = get_labels('daily')
      var date = current_date.subtract(units_back, 'days').format("MMMM D")
      var day = date.slice(-2)
      if (day == 1 || day == 21 || day == 31) {
        $('#graph-title').html(date + "st");
      }
      else if (day == 2 || day == 22) {
        $('#graph-title').html(date + "nd");
      } 
      else if (day == 3 || day == 23) {
        $('#graph-title').html(date + "rd");
      }
      else {
        $('#graph-title').html(date + "th");
      }
      dashboardGraph.update();
    }
    })
}

function get_weekly_bike_data(type, units_back) {
  check_if_today(units_back)
  
  $.ajax({
    type: "GET",
    url: "get_bike_weekly",
    success: function(data) {
      var daily = "YYYY-MM-DD"
      var res = JSON.parse(data);
      var weekly_keys = Object.keys(res);
      var time = moment().utc().local().startOf('week').subtract(units_back, 'weeks');
      start_of_week = moment().utc().local().startOf('week');
      end_of_week = moment().utc().local().endOf('week');
      dashboardGraph.data.datasets[0].data = new Array(7).fill(0);
      dashboardGraph.data.datasets[0].title = new Array(7).fill('');
      initiate_data_type(type,7)
      
      if (type == "calories" || type == "distance" || type == 'total_power') {
        for( var i = 0; i < 7; i++){
          if (weekly_keys.includes(time.format(daily))){
            dashboardGraph.data.datasets[0].data[i] = res[time.format(daily)][type];
          }
          time.add(1, 'days');
        }
      }else{
        for (var i = 0; i < 7; i++) {
          if (weekly_keys.includes(time.format(daily))) {
            dashboardGraph.data.datasets[0].data[i] = res[time.format(daily)]["active_time_bike"];
          } 
          time.add(1, 'days');
        }
      }

      display_data(7, type)
      dashboardGraph.data.labels = get_labels('weekly', units_back)
      $('#graph-title').html((start_of_week.subtract(units_back, 'weeks').format('MMM D')) + " - " + end_of_week.subtract(units_back, 'weeks').format('MMM D'))
      dashboardGraph.update();
    }
  });
}

function get_monthly_bike_data(type, units_back){
  check_if_today(units_back)

  $.ajax({
    type: "GET",
    url: 'get_bike_monthly',
    success: function(data) {
      var monthly = "YYYY-MM-DD"
      var res = JSON.parse(data);
      var monthly_keys = Object.keys(res);
      var time = moment().utc().local().startOf('month').subtract(units_back, 'months');
      current_month = moment();
      days_in_month = moment().subtract(units_back, 'month').daysInMonth();
      dashboardGraph.data.datasets[0].data = new Array(days_in_month).fill(0);
      dashboardGraph.data.datasets[0].title = new Array(days_in_month).fill('');
      initiate_data_type(type,days_in_month)
      
      if (type == "calories" || type == "distance" || type == 'total_power') {
        for (var i = 0; i < days_in_month; i++) {
          if (monthly_keys.includes(time.format(monthly))) {
            dashboardGraph.data.datasets[0].data[i] = res[time.format(monthly)][type];
          }
          time.add(1, 'days');
        }
      } else {
        for (var i = 0; i < days_in_month; i++) {
          if (monthly_keys.includes(time.format(monthly))) {
            dashboardGraph.data.datasets[0].data[i] = res[time.format(monthly)]["active_time_bike"];
          }
          time.add(1, 'days');
        }
      }
      
      display_data(days_in_month, type)
      dashboardGraph.data.labels = get_labels('monthly', units_back)
      $('#graph-title').html(current_month.subtract(units_back, 'months').format('MMMM YYYY'))
      dashboardGraph.update();
    }
  });
}

function get_yearly_bike_data(type, units_back){
  check_if_today(units_back)
  $.ajax({
    type: "GET",
    url: "get_bike_yearly",
    success: function(data) {
      var yearly = "YYYY-MM"
      var res = JSON.parse(data);
      var yearly_keys = Object.keys(res);
      var time = moment().startOf('year').subtract(units_back, 'years');
      current_year = moment()
      
      dashboardGraph.data.datasets[0].data = new Array(12).fill(0);
      dashboardGraph.data.datasets[0].title = new Array(12).fill('');
      initiate_data_type(type,12)
      
      if (type == "calories" || type == "distance" || type == 'total_power') {
        for (var i = 0; i < 12 ; i++){
          if (yearly_keys.includes(time.format(yearly))){
            dashboardGraph.data.datasets[0].data[i] = res[time.format(yearly)][type];
          }
          time.add(1, 'month')
        }
      } else {
        for (var i = 0; i < 12; i++) {
          if (yearly_keys.includes(time.format(yearly))) {
            dashboardGraph.data.datasets[0].data[i] = res[time.format(yearly)]["active_time_bike"];
          }
          time.add(1, 'month')
        }
      }
    
      display_data(12, type)
      dashboardGraph.data.labels = get_labels('yearly', units_back)
      $('#graph-title').html(current_year.subtract(units_back, 'years').format('YYYY'))
      dashboardGraph.update();
    }
  });
}

function get_daily_desk_data(type, units_back) {
  check_if_today(units_back)

  $.ajax({
    type: "GET",
    url: "get_desk_daily",
    success: function (data) {
      var hourly = "YYYY-MM-DD HH";
      var res = JSON.parse(data);
      var hourly_keys = Object.keys(res);
      var time = moment().utc().local().startOf('day').subtract(units_back, 'days');
      current_date = moment().utc().local()
      dashboardGraph.data.datasets[1].data = new Array(24).fill(0);
      dashboardGraph.data.datasets[1].title = new Array(24).fill('');
      initiate_data_type(type, 24)

      if (type == "calories") {
        for (var i = 0; i < 24; i++) {
          if (hourly_keys.includes(time.format(hourly))) {
            dashboardGraph.data.datasets[1].data[i] = res[time.format(hourly)][type];
          }
          time.add(1, 'hours')
        }
      }
      else {
        var time = moment().utc().local().startOf('day').subtract(units_back, 'days');
        for (var i = 0; i < 24; i++) {
          if (hourly_keys.includes(time.format(hourly))) {
            dashboardGraph.data.datasets[1].data[i] = res[time.format(hourly)]["active_time_desk"];
          }
          time.add(1, 'hours')
        }
      }

      display_data(24, type)
      dashboardGraph.data.labels = get_labels('daily')
      var date = current_date.subtract(units_back, 'days').format("MMMM D")
      var day = date.slice(-2)
      if (day == 1 || day == 21 || day == 31) {
        $('#graph-title').html(date + "st");
      }
      else if (day == 2 || day == 22) {
        $('#graph-title').html(date + "nd");
      }
      else if (day == 3 || day == 23) {
        $('#graph-title').html(date + "rd");
      }
      else {
        $('#graph-title').html(date + "th");
      }
      dashboardGraph.update();
    }
  })
}

function get_weekly_desk_data(type, units_back) {
  check_if_today(units_back)

  $.ajax({
    type: "GET",
    url: "get_desk_weekly",
    success: function (data) {
      var daily = "YYYY-MM-DD"
      var res = JSON.parse(data);
      var weekly_keys = Object.keys(res);
      var time = moment().utc().local().startOf('week').subtract(units_back, 'weeks');
      start_of_week = moment().utc().local().startOf('week');
      end_of_week = moment().utc().local().endOf('week');
      dashboardGraph.data.datasets[1].data = new Array(7).fill(0);
      dashboardGraph.data.datasets[1].title = new Array(7).fill('');
      initiate_data_type(type, 7)

      if (type == "calories") {
        for (var i = 0; i < 7; i++) {
          if (weekly_keys.includes(time.format(daily))) {
            dashboardGraph.data.datasets[1].data[i] = res[time.format(daily)][type];
          }
          time.add(1, 'days');
        }
      } else {
        for (var i = 0; i < 7; i++) {
          if (weekly_keys.includes(time.format(daily))) {
            dashboardGraph.data.datasets[1].data[i] = res[time.format(daily)]["active_time_desk"];
          }
          time.add(1, 'days');
        }
      }

      display_data(7, type)
      dashboardGraph.data.labels = get_labels('weekly', units_back)
      $('#graph-title').html((start_of_week.subtract(units_back, 'weeks').format('MMM D')) + " - " + end_of_week.subtract(units_back, 'weeks').format('MMM D'))
      dashboardGraph.update();
    }
  });
}

function get_monthly_desk_data(type, units_back) {
  check_if_today(units_back)

  $.ajax({
    type: "GET",
    url: 'get_desk_monthly',
    success: function (data) {
      var monthly = "YYYY-MM-DD"
      var res = JSON.parse(data);
      var monthly_keys = Object.keys(res);
      var time = moment().utc().local().startOf('month').subtract(units_back, 'months');
      current_month = moment();
      days_in_month = moment().subtract(units_back, 'month').daysInMonth();
      dashboardGraph.data.datasets[1].data = new Array(days_in_month).fill(0);
      dashboardGraph.data.datasets[1].title = new Array(days_in_month).fill('');
      initiate_data_type(type, days_in_month)

      if (type == "calories") {
        for (var i = 0; i < days_in_month; i++) {
          if (monthly_keys.includes(time.format(monthly))) {
            dashboardGraph.data.datasets[1].data[i] = res[time.format(monthly)][type];
          }
          time.add(1, 'days');
        }
      } else {
        for (var i = 0; i < days_in_month; i++) {
          if (monthly_keys.includes(time.format(monthly))) {
            dashboardGraph.data.datasets[1].data[i] = res[time.format(monthly)]["active_time_desk"];
          }
          time.add(1, 'days');
        }
      }

      display_data(days_in_month, type)
      dashboardGraph.data.labels = get_labels('monthly', units_back)
      $('#graph-title').html(current_month.subtract(units_back, 'months').format('MMMM YYYY'))
      dashboardGraph.update();
    }
  });
}

function get_yearly_desk_data(type, units_back) {
  check_if_today(units_back)

  $.ajax({
    type: "GET",
    url: "get_desk_yearly",
    success: function (data) {
      var yearly = "YYYY-MM"
      var res = JSON.parse(data);
      var yearly_keys = Object.keys(res);
      var time = moment().startOf('year').subtract(units_back, 'years');
      current_year = moment()

      dashboardGraph.data.datasets[1].data = new Array(12).fill(0);
      dashboardGraph.data.datasets[1].title = new Array(12).fill('');
      initiate_data_type(type, 12)

      if (type == "calories") {
        for (var i = 0; i < 12; i++) {
          if (yearly_keys.includes(time.format(yearly))) {
            dashboardGraph.data.datasets[1].data[i] = res[time.format(yearly)][type];
          }
          time.add(1, 'month')
        }
      } else {
        for (var i = 0; i < 12; i++) {
          if (yearly_keys.includes(time.format(yearly))) {
            dashboardGraph.data.datasets[1].data[i] = res[time.format(yearly)]["active_time_desk"];
          }
          time.add(1, 'month')
        }
      }

      display_data(12, type)
      dashboardGraph.data.labels = get_labels('yearly', units_back)
      $('#graph-title').html(current_year.subtract(units_back, 'years').format('YYYY'))
      dashboardGraph.update();
    }
  });
}
    
function check_if_today(units_back){
  if (units_back == 0) {
    $('#forward_unit').attr('disabled', 'disabled')
    $('#forward_unit').css('opacity', '0.3')
    $('#today').attr('disabled', 'disabled')
  }
  else {
    $('#forward_unit').removeAttr('disabled', 'disabled')
    $('#forward_unit').css('opacity', '1')
    $('#today').removeAttr('disabled', 'disabled')
  }
}

function get_data(graphDates, graphMode, units_back){

    if (graphDates == 'daily') {
      console.log("mode: ", graphMode)
      console.log("units_back: ", units_back)
      get_daily_bike_data(graphMode, units_back)
      get_daily_desk_data(graphMode, units_back)
    }
    if (graphDates == 'weekly') {
      console.log("mode: ", graphMode)
      console.log("units_back: ", units_back)
      get_weekly_bike_data(graphMode, units_back)
      get_weekly_desk_data(graphMode, units_back)
    }
    if (graphDates == 'monthly') {
      console.log("mode: ", graphMode)
      console.log("units_back: ", units_back)
      get_monthly_bike_data(graphMode, units_back)
      get_monthly_desk_data(graphMode, units_back)
    }
    if (graphDates == 'yearly') {
      console.log("mode: ", graphMode)
      console.log("units_back: ", units_back)
      get_yearly_bike_data(graphMode, units_back)
      get_yearly_desk_data(graphMode, units_back)
    }
}

function get_labels(graphDates, units_back){
  labels = []
  window_width = $(window).width()
  if (graphDates == 'daily'){
    // This is when the normal labels start overlapping
    if (window_width < 716) {
      labels = ["12am","","2am","","4am","","6am","","8am","","10am","","12pm",
      "","2pm","","4pm","","6pm","","8pm","","10pm",""]
    }
    else{
      labels = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","12pm","1pm",
              "2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"]
    }
  }
  else if (graphDates == 'weekly') {
    labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  }
  else if (graphDates == 'monthly'){
    dates = []
    if (window_width < SIZE_CUTOFF) {
      for (var i = 1; i <= moment().subtract(units_back, 'month').daysInMonth(); i++){
        if (i % 2 == 1){
          dates.push(i)
        }
        else{
          dates.push('')
        }
      }
    }
    else{
      for (var i = 1; i <= moment().subtract(units_back, 'month').daysInMonth(); i++){
        dates.push(i)
      }
    }
    labels = dates
  }

  else if (graphDates == 'yearly'){
    labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  }
  return labels
}

function initiate_data_type(type, length){
  if (type == "calories"){  
    dashboardGraph.options.title.text = "Calories Burned"
    dashboardGraph.data.datasets[0].label = new Array(length).fill("Bike Calories Burned: ");
    dashboardGraph.data.datasets[1].label = new Array(length).fill("Desk Calories Burned: ");
  }
  if (type == "distance"){
    dashboardGraph.options.title.text = "Distance Pedalled"
    dashboardGraph.data.datasets[0].label = new Array(length).fill("Distance Pedalled: ");
  }
  if (type == "usage"){
    dashboardGraph.options.title.text = "Active Device Time"
    dashboardGraph.data.datasets[0].label = new Array(length).fill("Bike Usage: ");
    dashboardGraph.data.datasets[1].label = new Array(length).fill("Desk Usage: ");
  }
  if (type == "total_power") {
    dashboardGraph.options.title.text = "Power Generated"
    dashboardGraph.data.datasets[0].label = new Array(length).fill("Generated: ");
  }
}

function display_data(index, type){
  for (var j = 0; j < index; j++){
    if (type == 'calories'){
      dashboardGraph.data.datasets[0].label[j] += Math.round(dashboardGraph.data.datasets[0].data[j]) + " calories"
      dashboardGraph.data.datasets[1].label[j] += Math.round(dashboardGraph.data.datasets[1].data[j]) + " calories"
    }
    else if (type == "distance"){
      if (is_metric){
        var distance = Math.round(dashboardGraph.data.datasets[0].data[j])
        if (distance < 1000){
          dashboardGraph.data.datasets[0].label[j] += distance + " m"
        }
        else if (distance >= 1000){
          dashboardGraph.data.datasets[0].label[j] += (distance/1000) + "km";
        }
      }
      else{
        var distance = (dashboardGraph.data.datasets[0].data[j] * (3.28084/5280)).toFixed(2)
        dashboardGraph.data.datasets[0].label[j] += distance + " miles"
      }
    }
    else if (type == "usage"){
      var hour = 0;
      var min = dashboardGraph.data.datasets[0].data[j];
      if (min > 59){
        hour = min / 60;
        min = Math.round(min % 60);
        dashboardGraph.data.datasets[0].label[j] += Math.floor(hour) + 'h ' + min + 'm'
      }
      else if (min == 1){
        dashboardGraph.data.datasets[0].label[j] += min + ' minute'
      }
      else{
        dashboardGraph.data.datasets[0].label[j] += min + ' minutes'
      }

      hour = 0;
      min = dashboardGraph.data.datasets[1].data[j];
      if (min > 59) {
        hour = min / 60;
        min = Math.round(min % 60);
        dashboardGraph.data.datasets[1].label[j] += Math.floor(hour) + 'h ' + min + 'm'
      }
      else if (min == 1) {
        dashboardGraph.data.datasets[1].label[j] += min + ' minute'
      }
      else {
        dashboardGraph.data.datasets[1].label[j] += min + ' minutes'
      }
    }
    else if (type == "total_power"){
      var pow = Math.round(dashboardGraph.data.datasets[0].data[j]);
      dashboardGraph.data.datasets[0].label[j] += pow + " watts"
    }
  }
}
