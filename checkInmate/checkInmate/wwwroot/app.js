// This function talks to your C# Get API and updates the HTML
async function fetchInmates() {
    const listDiv = document.getElementById('inmate-list');
    listDiv.innerHTML = '<p class="muted">// Fetching data...</p>';

    try {
        // Calls the Controller endpoint we built earlier
        const response = await fetch('/api/Inmate');
        const inmates = await response.json();

        // Clear the div
        listDiv.innerHTML = '';

        // Loop through the data and build HTML for each record
        inmates.forEach(inmate => {
            const card = document.createElement('div');
            card.className = 'inmate-card';
            card.innerHTML = `
                <strong>ID:</strong> ${inmate.id} | 
                <strong>NAME:</strong> ${inmate.lastName}, ${inmate.firstName} | 
                <strong>CHARGE:</strong> ${inmate.charge} | 
                <strong>STATUS:</strong> ${inmate.status}
            `;
            listDiv.appendChild(card);
        });
    } catch (error) {
        listDiv.innerHTML = '<p style="color: red;">// ERROR: Database connection failed.</p>';
    }
}