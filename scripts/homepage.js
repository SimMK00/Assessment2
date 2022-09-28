
$(document).ready(function(){
    $.get("articles")
        .done(function(data){
            let container = document.getElementById("mainContainer");
            let sortedArticle = [];

            // Map for retrieving numerical representation of each month
            const months = {
                Jan: '01',
                Feb: '02',
                Mar: '03',
                Apr: '04',
                May: '05',
                Jun: '06',
                Jul: '07',
                Aug: '08',
                Sep: '09',
                Oct: '10',
                Nov: '11',
                Dec: '12',
            }

            // Convert date to epoch time for comparison
            data.forEach((data)=>{
                let date = data.date.replaceAll(',','').split(' ');
                let month = months[date[0]];
                let day = date[1];
                let year = date[2];
                
                let newDate = new Date(`${month}/${day}/${year}`);
                data.date = newDate.getTime();

                let threshold = new Date('01/01/2022').getTime();

                if (data.date > threshold){
                    sortedArticle.push(data);
                }
            })

            // Sort based on epoch time
            sortedArticle.sort(function(a,b){
                if (a.date > b.date) return -1;
                if (a.date < b.date) return 1;
                return 0;
            })

            // Create html element for output display
            sortedArticle.forEach((data)=>{
                
                // Create heading
                const heading = document.createElement("h1");
                heading.innerText = data.title;

                // Create anchor
                const ahref = document.createElement("a");
                ahref.href = data.url;

                // Append to main container for display
                ahref.appendChild(heading);
                container.appendChild(ahref);
            })
        })
})
