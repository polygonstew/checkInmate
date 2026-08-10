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

// --- API LOGIC (GET, POST, PUT, DELETE) ---

// 1. GET (Read Database)
async function fetchInmates() {
    const listDiv = document.getElementById('inmate-list');
    listDiv.innerHTML = '<p class="muted">// Querying database...</p>';
    printToConsole("Executing GET /api/Inmate...");

    try {
        const response = await fetch('/api/Inmate');
        const inmates = await response.json();
        listDiv.innerHTML = '';

        if (inmates.length === 0) {
            listDiv.innerHTML = '<p style="color: #ff0000; animation: blink 1s infinite;">[ NO ACTIVE RECORDS FOUND ]</p>';
            printToConsole("0 records returned.");
            return;
        }

        inmates.forEach(inmate => {
            const card = document.createElement('div');
            card.className = 'inmate-card';
            
            card.onclick = (e) => {
                if(e.target.tagName !== 'BUTTON') { 
                    printToConsole(`> VIEW RECORD: ${inmate.lastName}, ${inmate.firstName} [DOB: ${inmate.dateOfBirth.split('T')[0]}] [SEX: ${inmate.sex}]`, '#00ffff');
                }
            };

            // Added the [ EDIT ] button right next to [ RELEASE ]
            card.innerHTML = `
                <div style="display: flex; flex-grow: 1;">
                    <div class="inmate-photo">[ NO IMG ]</div>
                    <div class="inmate-details">
                        <span><strong>ID:</strong> ${inmate.id}</span>
                        <span><strong>NAME:</strong> ${inmate.lastName}, ${inmate.firstName}</span>
                        <span><strong>CHARGE:</strong> ${inmate.charge}</span>
                        <span><strong>STATUS:</strong> ${inmate.status}</span>
                    </div>
                </div>
                <div>
                    <button class="btn-edit" onclick="loadEditForm(${inmate.id})">[ EDIT ]</button>
                    <button class="btn-release" onclick="releaseInmate(${inmate.id})">[ RELEASE ]</button>
                </div>
            `;
            listDiv.appendChild(card);
        });
        printToConsole(`Success: ${inmates.length} records retrieved.`);
    } catch (error) {
        listDiv.innerHTML = '<p style="color: red;">// ERROR: Connection failed.</p>';
        printToConsole("ERROR: Connection refused.", 'red');
    }
}

// 2. PREPARE UPDATE (Load data into form)
async function loadEditForm(id) {
    printToConsole(`Fetching record ${id} for modification...`);
    try {
        const response = await fetch(`/api/Inmate/${id}`);
        if (response.ok) {
            const inmate = await response.json();
            
            // Populate the form fields
            document.getElementById('edit-inmate-id').value = inmate.id;
            document.getElementById('firstName').value = inmate.firstName;
            document.getElementById('lastName').value = inmate.lastName;
            // Format the date correctly for the HTML date picker
            document.getElementById('dob').value = inmate.dateOfBirth.split('T')[0];
            document.getElementById('sex').value = inmate.sex;
            document.getElementById('charge').value = inmate.charge;
            document.getElementById('status').value = inmate.status;

            // Shift the UI into "Edit Mode"
            document.getElementById('submit-intake').textContent = '[ EXECUTE UPDATE ]';
            document.getElementById('submit-intake').style.color = '#ffaa00';
            document.getElementById('submit-intake').style.borderColor = '#ffaa00';
            document.getElementById('cancel-edit').style.display = 'inline-block';
            
            window.scrollTo(0, 0); // Scroll to top so they see the form
        }
    } catch (error) {
        printToConsole(`ERROR: Could not load record ${id}.`, 'red');
    }
}

// 3. CANCEL UPDATE
function cancelEdit() {
    document.getElementById('intake-form').reset();
    document.getElementById('edit-inmate-id').value = '';
    document.getElementById('submit-intake').textContent = '[ EXECUTE BOOKING ]';
    document.getElementById('submit-intake').style.color = '#00ff00';
    document.getElementById('submit-intake').style.borderColor = '#00ff00';
    document.getElementById('cancel-edit').style.display = 'none';
    printToConsole("Update cancelled. Form cleared.");
}

// 4. POST / PUT (Create or Update Record)
document.getElementById('intake-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const editId = document.getElementById('edit-inmate-id').value;
    const isUpdate = editId !== ''; // If there is an ID, we are updating

    // Build the payload (Include ID if updating, as C# requires it to match the URL)
    const payload = {
        id: isUpdate ? parseInt(editId) : 0, 
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dateOfBirth: document.getElementById('dob').value,
        sex: document.getElementById('sex').value,
        charge: document.getElementById('charge').value,
        status: document.getElementById('status').value
    };

    const url = isUpdate ? `/api/Inmate/${editId}` : '/api/Inmate';
    const method = isUpdate ? 'PUT' : 'POST';

    printToConsole(`Executing ${method} ${url}...`);

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            printToConsole(isUpdate ? `Success: Record ${editId} updated.` : `Success: Record created.`, '#00ffff');
            cancelEdit(); // Clears form and resets buttons back to Intake mode
            fetchInmates(); // Refresh the UI
        } else {
            printToConsole("ERROR: Data validation failed.", 'red');
        }
    } catch (error) {
        printToConsole("ERROR: Server offline.", 'red');
    }
});

// 5. DELETE (Remove Record)
async function releaseInmate(id) {
    printToConsole(`Executing DELETE /api/Inmate/${id}...`);
    try {
        const response = await fetch(`/api/Inmate/${id}`, { method: 'DELETE' });
        if (response.ok) {
            printToConsole(`Success: Record ${id} purged from system.`, '#ff0000');
            fetchInmates(); 
        } else {
            printToConsole(`ERROR: Could not remove record ${id}.`, 'red');
        }
    } catch (error) {
        printToConsole("ERROR: Server offline.", 'red');
    }
}