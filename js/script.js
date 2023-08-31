$(document).ready(function() {
    
    // Assign onclick event to the "Table" button
    $('#btnTab').on('click', function() {
        // AJAX request to fetch country data
        $.ajax({
            url: "https://restcountries.com/v3.1/all",
            method: "GET",
            dataType: "json",
            success: function(data) {
                console.log(data);

                // Initialize the DataTable
                let table = $('#myTable').DataTable();

                // Loop through data to populate the table
                for (let i = 0; i < data.length; i++) {
                    const { region, subregion, name, area, population, maps } = data[i];
                    const { official, common } = name;
                    const { googleMaps } = maps;
                    let subregionControl = subregion ? subregion : region;
                    
                    // Construct row data for the table
                    const row = [
                        region,
                        subregionControl,
                        official,
                        common,
                        area,
                        population,
                        `<a href="${googleMaps}" target="_blank">Google Maps</a>`
                    ];

                    // Add the row to the DataTable
                    table.row.add(row);
                }

                // Draw the populated table
                table.draw();
            },
            error: function(error) {
                console.error("Error during API request:", error);
            }
        });

        // Show the "Table" section and hide other sections
        showElement('#tab', '#pie', '#bar');
        // Toggle button styles
        toggleButtonClasses($(this), $('#btnPie, #btnBar'));
    });

    // Assign onclick event to the "Pie" button
    $('#btnPie').on('click', function() {
        // AJAX request to fetch country data
        $.ajax({
            url: "https://restcountries.com/v3.1/all",
            method: "GET",
            dataType: "json",
            success: function(data) {
                console.log(data);

                const subregionData = {}; // Object to store subregion data
                let populationTotal = 0;

                // Calculate total population of all countries
                for (let i = 0; i < data.length; i++) {
                    const country = data[i];
                    populationTotal += country.population;
                }
                
                // Calculate subregion data
                for (let i = 0; i < data.length; i++) {
                    const country = data[i];
                    const subregion = country.subregion || country.region;
                    
                    if (!subregionData[subregion]) {
                        subregionData[subregion] = 0;
                    }  
                    subregionData[subregion] += country.population;
                }       
                
                // Prepare data for the pie chart
                const subregionLabels = Object.keys(subregionData);
                const subregionPopulation = [];
                const subregionPercentage = [];

                for (let i = 0; i < subregionLabels.length; i++) {
                    const subregion = subregionLabels[i];
                    subregionPopulation.push(subregionData[subregion]);
                }

                for (let i = 0; i < subregionPopulation.length; i++) {
                    const percentage = (subregionPopulation[i] / populationTotal) * 100;
                    subregionPercentage.push(percentage);
                }

                // Define background colors for the pie chart
                const backgroundColors = [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 0, 0)',
                    'rgb(0, 255, 0)',
                    'rgb(0, 0, 255)',
                    'rgb(128, 0, 128)',
                    'rgb(0, 128, 128)',
                    'rgb(128, 128, 0)',
                    'rgb(128, 0, 0)',
                    'rgb(0, 128, 0)',
                    'rgb(0, 0, 128)',
                    'rgb(255, 165, 0)',
                    'rgb(0, 255, 255)',
                    'rgb(255, 0, 255)',
                    'rgb(255, 192, 203)',
                    'rgb(255, 255, 0)',
                    'rgb(100, 155, 255)',
                    'rgb(0, 0, 0)',
                    'rgb(128, 128, 128)',
                    'rgb(192, 192, 192)',
                    'rgb(155, 0, 155)'
                ];
                
                console.log('subregionPopulation: ', subregionPopulation);
                console.log('subregionPercentage: ', subregionPercentage);

                const ctxPie = $('#myChartPie');
        
                // Create the pie chart using Chart.js
                new Chart(ctxPie, {
                    type: 'pie',
                    data: {
                        labels: subregionLabels,
                        datasets: [{
                            data: subregionPercentage,
                            backgroundColor: backgroundColors,
                            hoverOffset: 20
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            }
                        }
                    }
                });
            },
            error: function(error) {
                console.error("Error during API request:", error);
            }
        });

        // Show the "Pie" section and hide other sections
        showElement('#pie', '#tab', '#bar');
        // Toggle button styles
        toggleButtonClasses($(this), $('#btnTab, #btnBar'));
    });

    // Assign onclick event to the "Bar" button
    $('#btnBar').on('click', function() {
        // AJAX request to fetch country data
        $.ajax({
            url: "https://restcountries.com/v3.1/all",
            method: "GET",
            dataType: "json",
            success: function(data) {
                console.log(data);

                const regions = {}; // Object to store region counts

                // Count the number of countries per region
                for (let i = 0; i < data.length; i++) {
                    const region = data[i].region;
                    if (!regions[region]) {
                        regions[region] = 0;
                    }
                    regions[region]++;
                }
                
                // Prepare data for the bar chart
                const regionLabels = Object.keys(regions);
                const regionCounts = Object.values(regions);
                const backgroundColors = [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(100, 205, 86)',
                    'rgb(200, 99, 132)',
                    'rgb(100, 30, 235)',
                    'rgb(150, 150, 86)'
                ];

                console.log('regionLabels: ', regionLabels);
                console.log('regionCounts: ', regionCounts);
                

                const ctxBar = $('#myChartBar');

                // Create the bar chart using Chart.js
                new Chart(ctxBar, {
                    type: 'bar',
                    data: {
                        labels: regionLabels,
                        datasets: [{
                            label: 'Countries for regions',
                            data: regionCounts,
                            backgroundColor: backgroundColors,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            },
            error: function(error) {
                console.error("Error during API request:", error);
            }     
        });

        // Show the "Bar" section and hide other sections
        showElement('#bar', '#tab', '#pie');
        // Toggle button styles
        toggleButtonClasses($(this), $('#btnTab, #btnPie'));
    });

    // Utility functions
  
    // Toggle visibility of elements
    function showElement(showElement, hideElement1, hideElement2) {
        $(showElement).toggleClass('d-none', false);
        $(hideElement1).toggleClass('d-none', true);
        $(hideElement2).toggleClass('d-none', true);
        $('#initialMessage').toggleClass('d-none', true);
    }

    // Toggle button styles
    function toggleButtonClasses(clickedButton, otherButtons) {
        clickedButton.toggleClass('btn-outline-dark btn-dark');
        otherButtons.removeClass('btn-dark').addClass('btn-outline-dark');
    }

});
