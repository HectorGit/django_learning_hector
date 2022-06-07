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
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );

  //CODE BY HECTOR
  $('#fetch-user-bike-data').on('click', function(){
    console.log("clicked fetch user bike data")

    // THIS IS JUST DUMMY , WE WOULD NEED TO FIX THIS TO ACTUALLY GET THE APPROPRIATE DATA
    $.ajax({

        'url' : 'http://localhost:5001/get_desk_data_django', //hardcoded my user ID on the API branch django-experiment
        'type' : 'GET',
        'data' : {},//no data needed
        'success' : function(data) {   
          
            // response = JSON.parse(data); //TRIED DOING THIS BUT IT DIDN'T ALLOW

            console.log('data : '+ data);// prints - data : [object Object],[object Object]

            //IF WE DID GET THE DATA, WE COULD 'UPDATE' 
            //THE CHART W THE NEW DATA 

            //(WOULD NEED TO SET LABELS)
            //For example, 24 hours (put 0 to 23 in an array ?) (or is it 1 to 24 ?)
            var newlabelsnumbers = Array.from(Array(24).keys())
            var newlabelsstrings = newlabelsnumbers.map(num => {
              return String(num);
            });
            console.log("\n Before - newlabelsstrings ", newlabelsstrings)

            //(WOULD NEED TO SET ACTUAL DATA ITSELF)
            //THE LENGHTS OF THOSE NEED TO MATCH SO THAT IT CAN BE GRAPHED. 🤔
            // data = zeroes unless there's data for that hour
            var new_data_for_graph  = new Array(24).fill(0);
            console.log("\n Before - new_data_for_graph ", new_data_for_graph)

            $.each(data , function(hourly_record_index) { 
              console.log("hourly_record :", data[hourly_record_index])
              hour_for_this_entry = data[hourly_record_index]['hour']
              new_data_for_graph[hour_for_this_entry]= data[hourly_record_index]['time_total']
            });

            console.log("After using the data fetched :")
            console.log("\n newlabels ", newlabelsstrings)
            console.log("\n new_data_for_graph ", new_data_for_graph)

            //not sure if this is the right way of doing this.
            myChart.labels = newlabelsstrings
            myChart.data.datasets[0].data = new_data_for_graph //I think this is how this should be accessed
            myChart.update()

        },
        'error' : function(error)
        {
          console.log('error: '+error);
        }
    });

  })

})
