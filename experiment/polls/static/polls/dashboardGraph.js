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
            console.log('data: '+data);
            //IF WE DID GET THE DATA, WE COULD 'UPDATE' 
            //THE CHART W THE NEW DATA 
            //(WOULD NEED TO SET LABELS)
            //(WOULD NEED TO SET ACTUAL DATA ITSELF)
            //THE LENGHTS OF THOSE NEED TO MATCH SO THAT IT CAN BE GRAPHED. 🤔
        },
        'error' : function(error)
        {
          console.log('error: '+error);
        }
    });

  })

})
