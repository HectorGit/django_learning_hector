$(document).ready(function(){

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
  })

})
