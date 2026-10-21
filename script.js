
const API = "http://localhost:8080";

async function apiGet(path) {
    const response = await fetch(`${API}${path}`);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
}

function showMessage(text, isError = false) {
    document.getElementById("message").innerHTML =
        `<div class="alert ${isError ? "alert-danger" : "alert-info"}">
            ${text}
        </div>`;
}

function calculateDonorEligibility(age, gender, lastDonationDate) {
    if (age < 18 || age > 65) {
        return false;
    }

    // For this project, assume a blank date means a first-time donor.
    if (!lastDonationDate) {
        return true;
    }

    const lastDate = new Date(lastDonationDate + "T00:00:00Z");
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (Number.isNaN(lastDate.getTime()) || lastDate > today) {
        return false;
    }

    const daysSinceDonation = Math.floor(
        (today - lastDate) / (1000 * 60 * 60 * 24)
    );

    const requiredDays = gender === "Male" ? 90 : 120;

    return daysSinceDonation >= requiredDays;
}


function showAddDonorForm() {
    document.getElementById("workspace").innerHTML = `
        <h3 class="mb-4">Register New Donor</h3>

        <form id="addDonorForm" class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Full Name</label>
                <input type="text" id="donorName"
                       class="form-control" required>
            </div>

            <div class="col-md-6">
                <label class="form-label">Age</label>
                <input type="number" id="donorAgeInput"
                       class="form-control" min="1"
                       max="120" required>
            </div>

            <div class="col-md-6">
                <label class="form-label">Gender</label>
                <select id="donorGenderInput"
                        class="form-select" required>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div class="col-md-6">
                <label class="form-label">Blood Group</label>
                <select id="donorBloodGroup"
                        class="form-select" required>
                    <option value="">Select blood group</option>
                    ${bloodGroupOptions()}
                </select>
            </div>

            <div class="col-md-6">
                <label class="form-label">Phone Number</label>
                <input type="tel" id="donorPhone"
                       class="form-control" required>
            </div>

            <div class="col-md-6">
                <label class="form-label">Email</label>
                <input type="email" id="donorEmail"
                       class="form-control" required>
            </div>

            <div class="col-md-12">
                <label class="form-label">Address</label>
                <textarea id="donorAddress"
                          class="form-control" required></textarea>
            </div>

            <div class="col-md-6">
                <label class="form-label">
                    Last Donation Date (optional)
                </label>
                <input type="date" id="donorLastDonation"
                       class="form-control">
            </div>

            <div class="col-12">
                <button type="submit" class="btn btn-danger">
                    Register Donor
                </button>
                <button type="button" class="btn btn-secondary ms-2"
                        onclick="showDonors()">
                    Cancel
                </button>
            </div>
        </form>

        <div id="donorFormMessage" class="mt-3"></div>
    `;

    document.getElementById("addDonorForm")
        .addEventListener("submit", async function(event) {
            event.preventDefault();

            const donor = {
                name: document.getElementById("donorName").value.trim(),
                age: Number(document.getElementById("donorAgeInput").value),
                gender: document.getElementById("donorGenderInput").value,
                bloodGroup: document.getElementById("donorBloodGroup").value,
                phone: document.getElementById("donorPhone").value.trim(),
                email: document.getElementById("donorEmail").value.trim(),
                address: document.getElementById("donorAddress").value.trim(),
                lastDonationDate:
                    document.getElementById("donorLastDonation").value,
                eligible: calculateDonorEligibility(
    Number(document.getElementById("donorAgeInput").value),
    document.getElementById("donorGenderInput").value,
    document.getElementById("donorLastDonation").value
)
            };

            const message = document.getElementById("donorFormMessage");

            try {
                const response = await fetch(`${API}/donors`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(donor)
                });

                if (!response.ok) {
                    throw new Error(`Registration failed: ${response.status}`);
                }

                message.innerHTML =
                    '<div class="alert alert-success">' +
                    'Donor registered successfully!</div>';

                await loadDashboard();
                await showDonors();

            } catch (error) {
                message.innerHTML =
                    '<div class="alert alert-danger">' +
                    'Unable to register donor. Check that Spring Boot ' +
                    'is running and the backend accepts POST /donors.' +
                    '</div>';

                console.error(error);
            }
        });
}


async function loadDashboard() {
    try {
        const [donors, stock, requests] = await Promise.all([
            apiGet("/donors"),
            apiGet("/bloodstock"),
            apiGet("/bloodrequests")
        ]);

        document.getElementById("donorCount").textContent = donors.length;

        const totalUnits = stock.reduce(
            (total, item) => total + Number(item.availableUnits || 0), 0
        );

        document.getElementById("stockUnits").textContent = totalUnits;
        document.getElementById("requestCount").textContent = requests.length;

        showMessage("Dashboard data loaded successfully.");
    } catch (error) {
        showMessage(
            "Cannot connect to the backend. Make sure Spring Boot is running on port 8080 and CORS is enabled.",
            true
        );
        console.error(error);
    }
}

function displayTable(title, records) {
    const workspace = document.getElementById("workspace");

    if (!records.length) {
        workspace.innerHTML = `<h3>${title}</h3><p>No records found.</p>`;
        return;
    }

    const columns = Object.keys(records[0]);

    const header = columns.map(
        column => `<th>${column}</th>`
    ).join("");

    const rows = records.map(record => `
        <tr>
            ${columns.map(column =>
                `<td>${record[column] ?? ""}</td>`
            ).join("")}
        </tr>
    `).join("");

    workspace.innerHTML = `
        <h3 class="mb-3">${title}</h3>
        <table class="table table-bordered table-striped">
            <thead><tr>${header}</tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

async function showDonors() {
    try {
        const donors = await apiGet("/donors");
        const workspace = document.getElementById("workspace");

        if (!donors.length) {
            workspace.innerHTML = `
                <h3>Registered Donors</h3>
                <p>No donors found.</p>
            `;
            return;
        }

        workspace.innerHTML = `
            <h3 class="mb-3">Registered Donors</h3>
            <div class="table-responsive">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Blood Group</th>
                            <th>Phone</th>
                            <th>Eligible</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${donors.map(donor => `
                            <tr>
                                <td>${donor.donorId}</td>
                                <td>${donor.name}</td>
                                <td>${donor.age}</td>
                                <td>${donor.gender}</td>
                                <td>${donor.bloodGroup}</td>
                                <td>${donor.phone}</td>
                                <td>${donor.eligible}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm"
                                        onclick="editDonor(${donor.donorId})">
                                        Edit
                                    </button>
                                    <button class="btn btn-danger btn-sm"
                                        onclick="deleteDonor(${donor.donorId})">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        showMessage("Unable to load donors.", true);
        console.error(error);
    }
}


async function showStock() {
    try {
        displayTable("Blood Stock", await apiGet("/bloodstock"));
    } catch (error) {
        showMessage("Unable to load blood stock.", true);
    }
}


async function showRequests() {
    try {
        const requests = await apiGet("/bloodrequests");
        const workspace = document.getElementById("workspace");

        if (!requests.length) {
            workspace.innerHTML = `
                <h3>Blood Requests</h3>
                <p>No requests found.</p>
            `;
            return;
        }

        workspace.innerHTML = `
            <h3 class="mb-3">Blood Requests</h3>
            <div class="table-responsive">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Hospital</th>
                            <th>Blood Group</th>
                            <th>Units</th>
                            <th>Date</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${requests.map(request => `
                            <tr>
                                <td>${request.requestId}</td>
                                <td>${request.patientName}</td>
                                <td>${request.hospitalName}</td>
                                <td>${request.bloodGroup}</td>
                                <td>${request.unitsRequired}</td>
                                <td>${request.requestDate}</td>
                                <td>${request.priority}</td>
                                <td>${request.status}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm mb-1"
                                        onclick="editBloodRequest(${request.requestId})">
                                        Edit
                                    </button>
                                    <button class="btn btn-danger btn-sm mb-1"
                                        onclick="deleteBloodRequest(${request.requestId})">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        showMessage("Unable to load blood requests.", true);
        console.error(error);
    }
}


async function showReports() {
    try {
        displayTable("Reports & Alerts", await apiGet("/reports"));
    } catch (error) {
        showMessage("Unable to load reports.", true);
    }
}

function showCompatibility() {
    document.getElementById("workspace").innerHTML = `
        <h3>Blood Compatibility Checker</h3>
        <form id="compatibilityForm" class="row g-3">
            <div class="col-md-5">
                <label class="form-label">Donor blood group</label>
                <select class="form-select" id="donorGroup" required>
                    ${bloodGroupOptions()}
                </select>
            </div>
            <div class="col-md-5">
                <label class="form-label">Recipient blood group</label>
                <select class="form-select" id="recipientGroup" required>
                    ${bloodGroupOptions()}
                </select>
            </div>
            <div class="col-md-2 d-flex align-items-end">
                <button class="btn btn-danger w-100">Check</button>
            </div>
        </form>
        <div id="checkResult" class="mt-3"></div>
    `;

    document.getElementById("compatibilityForm").addEventListener("submit", async event => {
        event.preventDefault();

        const donor = document.getElementById("donorGroup").value;
        const recipient = document.getElementById("recipientGroup").value;

        try {
            const query = new URLSearchParams({ donor, recipient });
            const response = await fetch(`${API}/blood-compatibility?${query}`);

            if (!response.ok) throw new Error("Compatibility check failed");

            const result = await response.text();
            document.getElementById("checkResult").textContent = result;
        } catch (error) {
            showMessage("Unable to check compatibility. Check the backend and CORS.", true);
        }
    });
}

function bloodGroupOptions() {
    return ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
        .map(group => `<option value="${group}">${group}</option>`)
        .join("");
}

function showEligibility() {
    document.getElementById("workspace").innerHTML = `
        <h3>Donor Eligibility Checker</h3>
        <form id="eligibilityForm" class="row g-3">
            <div class="col-md-3">
                <label class="form-label">Age</label>
                <input type="number" id="donorAge" class="form-control"
                       min="1" max="120" required>
            </div>
            <div class="col-md-3">
                <label class="form-label">Gender</label>
                <select id="donorGender" class="form-select" required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Last donation date (optional)</label>
                <input type="date" id="lastDonationDate" class="form-control">
            </div>
            <div class="col-md-2 d-flex align-items-end">
                <button class="btn btn-danger w-100">Check</button>
            </div>
        </form>
        <div id="checkResult" class="mt-3"></div>
    `;

    document.getElementById("eligibilityForm").addEventListener("submit", async event => {
        event.preventDefault();

        const params = new URLSearchParams({
            age: document.getElementById("donorAge").value,
            gender: document.getElementById("donorGender").value
        });

        const lastDate = document.getElementById("lastDonationDate").value;
        if (lastDate) params.set("lastDonationDate", lastDate);

        try {
            const response = await fetch(`${API}/donor-eligibility?${params}`);

            if (!response.ok) throw new Error("Eligibility check failed");

            const result = await response.text();
            document.getElementById("checkResult").textContent = result;
        } catch (error) {
            showMessage("Unable to check eligibility. Check the backend and CORS.", true);
        }
    });
}

async function deleteDonor(id) {
    const confirmed = confirm(
        `Are you sure you want to delete donor ID ${id}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API}/donors/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Delete failed: ${response.status}`);
        }

        alert("Donor deleted successfully!");

        await loadDashboard();
        await showDonors();

    } catch (error) {
        alert("Unable to delete donor. Please check the backend.");
        console.error(error);
    }
}

async function editDonor(id) {
    try {
        const donor = await apiGet(`/donors/${id}`);

        document.getElementById("workspace").innerHTML = `
            <h3 class="mb-4">Edit Donor #${donor.donorId}</h3>

            <form id="editDonorForm" class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Full Name</label>
                    <input id="editName" class="form-control"
                        value="${donor.name ?? ""}" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Age</label>
                    <input id="editAge" type="number"
                        class="form-control" min="1" max="120"
                        value="${donor.age ?? ""}" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Gender</label>
                    <select id="editGender" class="form-select" required>
                        ${["Male", "Female", "Other"].map(g =>
                            `<option value="${g}"
                                ${donor.gender === g ? "selected" : ""}>
                                ${g}
                            </option>`
                        ).join("")}
                    </select>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Blood Group</label>
                    <select id="editBloodGroup" class="form-select" required>
                        ${["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
                            .map(g => `<option value="${g}"
                                ${donor.bloodGroup === g ? "selected" : ""}>
                                ${g}
                            </option>`).join("")}
                    </select>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Phone</label>
                    <input id="editPhone" class="form-control"
                        value="${donor.phone ?? ""}" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Email</label>
                    <input id="editEmail" type="email"
                        class="form-control"
                        value="${donor.email ?? ""}" required>
                </div>

                <div class="col-md-12">
                    <label class="form-label">Address</label>
                    <textarea id="editAddress" class="form-control"
                        required>${donor.address ?? ""}</textarea>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Last Donation Date</label>
                    <input id="editLastDonation" type="date"
                        class="form-control"
                        value="${donor.lastDonationDate ?? ""}">
                </div>

                <div class="col-12">
                    <button type="submit" class="btn btn-danger">
                        Save Changes
                    </button>
                    <button type="button" class="btn btn-secondary ms-2"
                        onclick="showDonors()">Cancel</button>
                </div>
            </form>
            <div id="editMessage" class="mt-3"></div>
        `;

        document.getElementById("editDonorForm")
            .addEventListener("submit", async event => {
                event.preventDefault();

                const age = Number(
                    document.getElementById("editAge").value
                );
                const gender =
                    document.getElementById("editGender").value;
                const lastDonationDate =
                    document.getElementById("editLastDonation").value;

                const updatedDonor = {
                    donorId: donor.donorId,
                    name: document.getElementById("editName").value.trim(),
                    age,
                    gender,
                    bloodGroup:
                        document.getElementById("editBloodGroup").value,
                    phone: document.getElementById("editPhone").value.trim(),
                    email: document.getElementById("editEmail").value.trim(),
                    address:
                        document.getElementById("editAddress").value.trim(),
                    lastDonationDate,
                    eligible: calculateDonorEligibility(
                        age, gender, lastDonationDate
                    )
                };

                try {
                    const response = await fetch(`${API}/donors/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updatedDonor)
                    });

                    if (!response.ok) {
                        throw new Error(`Update failed: ${response.status}`);
                    }

                    alert("Donor updated successfully!");
                    await loadDashboard();
                    await showDonors();

                } catch (error) {
                    document.getElementById("editMessage").textContent =
                        "Unable to update donor. Check the backend.";
                    console.error(error);
                }
            });

    } catch (error) {
        alert("Unable to load donor details.");
        console.error(error);
    }
}

function showAddRequestForm() {
    document.getElementById("workspace").innerHTML = `
        <h3 class="mb-4">Create Blood Request</h3>

        <form id="addRequestForm" class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Patient Name</label>
                <input type="text" id="patientName"
                       class="form-control" required>
            </div>

            <div class="col-md-6">
                <label class="form-label">Hospital Name</label>
                <input type="text" id="hospitalName"
                       class="form-control" required>
            </div>

            <div class="col-md-6">
                <label class="form-label">Blood Group</label>
                <select id="requestBloodGroup"
                        class="form-select" required>
                    <option value="">Select blood group</option>
                    ${bloodGroupOptions()}
                </select>
            </div>

            <div class="col-md-6">
                <label class="form-label">Units Required</label>
                <input type="number" id="unitsRequired"
                       class="form-control" min="1"
                       step="1" required>
            </div>

            <div class="col-md-6">
                <label class="form-label">Request Date</label>
                <input type="date" id="requestDate"
                       class="form-control" required>
            </div>

            <div class="col-md-6">
                <label class="form-label">Priority</label>
                <select id="requestPriority"
                        class="form-select" required>
                    <option value="Normal">Normal</option>
                    <option value="Emergency">Emergency</option>
                </select>
            </div>

            <div class="col-md-6">
                <label class="form-label">Status</label>
                <select id="requestStatus"
                        class="form-select" required>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Fulfilled">Fulfilled</option>
                </select>
            </div>

            <div class="col-12">
                <button type="submit" class="btn btn-danger">
                    Submit Request
                </button>
                <button type="button"
                        class="btn btn-secondary ms-2"
                        onclick="showRequests()">
                    Cancel
                </button>
            </div>
        </form>

        <div id="requestFormMessage" class="mt-3"></div>
    `;

    // Set today's date as the default.
    const today = new Date();
    const localDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    document.getElementById("requestDate").value = localDate;

    document.getElementById("addRequestForm")
        .addEventListener("submit", async function(event) {
            event.preventDefault();

            const units = Number(
                document.getElementById("unitsRequired").value
            );

            if (!Number.isInteger(units) || units < 1) {
                document.getElementById("requestFormMessage").textContent =
                    "Enter a whole number of units greater than zero.";
                return;
            }

            const request = {
                patientName: document.getElementById("patientName").value.trim(),
                hospitalName: document.getElementById("hospitalName").value.trim(),
                bloodGroup: document.getElementById("requestBloodGroup").value,
                unitsRequired: units,
                requestDate: document.getElementById("requestDate").value,
                priority: document.getElementById("requestPriority").value,
                status: document.getElementById("requestStatus").value
            };

            const message = document.getElementById("requestFormMessage");

            try {
                const response = await fetch(`${API}/bloodrequests`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(request)
                });

                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }

                message.innerHTML =
                    '<div class="alert alert-success">' +
                    'Blood request created successfully!</div>';

                await loadDashboard();
                await showRequests();

            } catch (error) {
                message.innerHTML =
                    '<div class="alert alert-danger">' +
                    'Unable to create the request. Check that Spring Boot ' +
                    'is running and the backend is available.' +
                    '</div>';

                console.error(error);
            }
        });
}

async function deleteBloodRequest(id) {
    const confirmed = confirm(
        `Are you sure you want to delete blood request ID ${id}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API}/bloodrequests/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Delete failed: ${response.status}`);
        }

        alert("Blood request deleted successfully!");

        await loadDashboard();
        await showRequests();

    } catch (error) {
        alert("Unable to delete blood request. Check the backend.");
        console.error(error);
    }
}




loadDashboard();
