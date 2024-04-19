// Sample data for the chart
const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Actual Days",
      backgroundColor: "#645ff5",
      borderColor: "#645ff5",
      borderWidth: 1,
      data: [15, 25, 35, 30, 50, 55, 65]
    },
    {
      label: "Tentative Days",
      backgroundColor: "#f5805f",
      borderColor: "#f5805f",
      borderWidth: 1,
      data: [12, 28, 40, 26, 65, 62, 70]
    }
  ]
};

// Configuration for the chart
const config = {
  type: "line",
  data: data,
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
};

// Create the chart
const lineChart = new Chart(document.getElementById("lineChart"), config);
