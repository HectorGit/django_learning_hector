$(document).ready(function(){

  console.log("JS CONNECTED DASHBOARD GRAPH")

  //CODE THAT WAS IN CHART.JS GET STARTED.

  //configurations
  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
  ];

  const data = {
    labels: labels,
    datasets: [{
      label: 'My First dataset',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [0, 10, 5, 2, 20, 30, 45],
    }]
  };

  const config = {
    type: 'line',
    data: data,
    options: {}
  };

  //create the chart
  const mySecondChart = new Chart(
    document.getElementById('mySecondChart'),
    config
  );

  //CODE BY HECTOR
  $('#fetch-user-desk-monthly-data').on('click', function(){
    console.log("clicked fetch user bike data")

    // THIS IS JUST DUMMY , WE WOULD NEED TO FIX THIS TO ACTUALLY GET THE APPROPRIATE DATA
    $.ajax({

        'url' : 'http://localhost:5001/get_desk_data_monthly_django', //hardcoded my user ID on the API branch django-experiment
        'type' : 'GET',
        'data' : {},//no data needed
        'success' : function(data) {   
          
            // response = JSON.parse(data); //TRIED DOING THIS BUT IT DIDN'T ALLOW

            console.log('data : '+ data);// prints - data : [object Object],[object Object]

            //IF WE DID GET THE DATA, WE COULD 'UPDATE' 
            //THE CHART W THE NEW DATA 

            //(WOULD NEED TO SET LABELS)
            //For example, 12 Months in the year.
            // var newlabelsnumbers = Array.from(Array(12).keys())
            // var newlabelsstrings = newlabelsnumbers.map(num => {
            //   return String(num);
            // });
            newlabelsstrings = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December'
            ];

            console.log("\n Before - newlabelsstrings ", newlabelsstrings)

            //(WOULD NEED TO SET ACTUAL DATA ITSELF)
            //THE LENGHTS OF THOSE NEED TO MATCH SO THAT IT CAN BE GRAPHED. 🤔
            // data = zeroes unless there's data for that hour
            var new_data_for_graph  = new Array(12).fill(0);
            console.log("\n Before - new_data_for_graph ", new_data_for_graph)

            $.each(data , function(monthly_record_index) { 
              console.log("monthly_record :", data[monthly_record_index])
              timestamp = data[monthly_record_index]['timestamp']//can we get the month out of the timestamp?
              date = new Date(timestamp)
              month = date.getMonth()
              console.log("Got that the month is : ", month)
              month_for_this_entry = month //NOTE - gotta try to figure out the following:
              //THERE IS NO field that we can refer to here to figure things out... just the timestamp.
              new_data_for_graph[month_for_this_entry]= data[monthly_record_index]['time_total']
            });

            console.log("After using the data fetched :")
            console.log("\n newlabels ", newlabelsstrings)
            console.log("\n new_data_for_graph ", new_data_for_graph)

            //not sure if this is the right way of doing this.
            mySecondChart.data.labels = newlabelsstrings
            // mySecondChart.data.datasets[0].title = newlabelsstrings //I think this is how this should be accessed
            mySecondChart.data.datasets[0].data = new_data_for_graph //I think this is how this should be accessed
            mySecondChart.data.datasets[0].label = 'Sergio\'s Activity for this Month' //I think this is how this should be accessed
            mySecondChart.update()

        },
        'error' : function(error)
        {
          console.log('error: '+error);
        }
    });

  })

})
