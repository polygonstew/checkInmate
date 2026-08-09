// --- CONSOLE LOGIC ---
const consoleInput = document.getElementById('console-input');
const consoleOutput = document.getElementById('console-output');

function printToConsole(message, color = '#00ff00') {
    const p = document.createElement('p');
    p.textContent = message;
    p.style.color = color;
    consoleOutput.appendChild(p);
    consoleOutput.scrollTop = consoleOutput.scrollHeight; 
}

consoleInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const command = consoleInput.value.trim();
        if (command === '') return;
        printToConsole(`root@checkinmate ~> ${command}`);
        if (command.toLowerCase() === 'help') {
            printToConsole("COMMANDS: clear (clears screen), fetch (loads data)");
        } else if (command.toLowerCase() === 'clear') {
            consoleOutput.innerHTML = '';
        } else if (command.toLowerCase() === 'fetch') {
            fetchInmates();
        } else {
            printToConsole(`Command not found: ${command}`, 'red');
        }
        consoleInput.value = '';
    }
});

// --- API LOGIC (GET, POST, DELETE) ---

// 1. GET (Read Database)
async function fetchInmates() {
    const listDiv = document.getElementById('inmate-list');
    listDiv.innerHTML = '<p class="muted">// Querying database...</p>';
    printToConsole("Executing GET /api/Inmate...");

    try {
        const response = await fetch('/api/Inmate');
        const inmates = await response.json();
        listDiv.innerHTML = '';

        // Empty State Check
        if (inmates.length === 0) {
            listDiv.innerHTML = '<p style="color: #ff0000; animation: blink 1s infinite;">[ NO ACTIVE RECORDS FOUND ]</p>';
            printToConsole("0 records returned.");
            return;
        }

        // Build Cards
        inmates.forEach(inmate => {
            const card = document.createElement('div');
            card.className = 'inmate-card';
            
            // Allow clicking anywhere on the card to view details in the console
            card.onclick = (e) => {
                // Prevent clicking the release button from triggering the card click
                if(e.target.tagName !== 'BUTTON') { 
                    printToConsole(`> VIEW RECORD: ${inmate.lastName}, ${inmate.firstName} [DOB: ${inmate.dateOfBirth.split('T')[0]}] [SEX: ${inmate.sex}]`, '#00ffff');
                }
            };

            card.innerHTML = `
                <div style="display: flex;">
                    <div class="inmate-photo">[ NO IMG ]</div>
                    <div class="inmate-details">
                        <span><strong>ID:</strong> ${inmate.id}</span>
                        <span><strong>NAME:</strong> ${inmate.lastName}, ${inmate.firstName}</span>
                        <span><strong>CHARGE:</strong> ${inmate.charge}</span>
                        <span><strong>STATUS:</strong> ${inmate.status}</span>
                    </div>
                </div>
                <button class="btn-release" onclick="releaseInmate(${inmate.id})">[ RELEASE ]</button>
            `;
            listDiv.appendChild(card);
        });
        printToConsole(`Success: ${inmates.length} records retrieved.`);
    } catch (error) {
        listDiv.innerHTML = '<p style="color: red;">// ERROR: Connection failed.</p>';
        printToConsole("ERROR: Connection refused.", 'red');
    }
}

// 2. POST (Create New)
document.getElementById('intake-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Stops the page from refreshing on submit

    // Build the JSON payload from the form fields
    const payload = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dateOfBirth: document.getElementById('dob').value,
        sex: document.getElementById('sex').value,
        charge: document.getElementById('charge').value,
        status: document.getElementById('status').value
    };

    printToConsole(`Executing POST /api/Inmate for ${payload.lastName}...`);

    try {
        const response = await fetch('/api/Inmate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            printToConsole(`Success: Record created.`, '#00ffff');
            document.getElementById('intake-form').reset(); // Clear the form
            fetchInmates(); // Instantly refresh the UI
        } else {
            printToConsole("ERROR: Data validation failed.", 'red');
        }
    } catch (error) {
        printToConsole("ERROR: Server offline.", 'red');
    }
});

// 3. DELETE (Remove Record)
async function releaseInmate(id) {
    printToConsole(`Executing DELETE /api/Inmate/${id}...`);
    
    try {
        const response = await fetch(`/api/Inmate/${id}`, { method: 'DELETE' });
        
        if (response.ok) {
            printToConsole(`Success: Record ${id} purged from system.`, '#ff0000');
            fetchInmates(); // Refresh to show they are gone
        } else {
            printToConsole(`ERROR: Could not remove record ${id}.`, 'red');
        }
    } catch (error) {
        printToConsole("ERROR: Server offline.", 'red');
    }
}