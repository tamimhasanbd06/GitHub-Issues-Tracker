const allIssues = document.getElementById('All-issues');
const totalIssue = document.getElementById('Total-issue');
const searchInput = document.getElementById('search-input');
const spinner = document.getElementById('spinner');

// Store all issues data from API
let issuesData = [];

async function LoadIssues() {

    spinner.classList.remove("hidden");

    try {

        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");

        if (!res.ok) throw new Error("Failed to fetch issues");

        const result = await res.json();

        issuesData = result.data;

        IssuesCarts(issuesData);

    } catch (error) {

        console.error("Error loading issues:", error);

        allIssues.innerHTML = `
        <p class="text-red-500 text-sm">
        Failed to load issues. Please try again later.
        </p>`;

    } finally {

        spinner.classList.add("hidden");

    }
}

function IssuesCarts(data) {

    allIssues.innerHTML = '';

    data.forEach(issue => {

        const status = issue.status.toLowerCase();

        const topBorderColor =
            status === 'open'
                ? 'bg-green-500'
                : 'bg-blue-500';

        const topImage =
            status === 'open'
                ? '<img src="./assets/Open-Status.png" alt="Open Status">'
                : '<img src="./assets/Closed- Status .png" alt="Closed Status">';

        const card = document.createElement('div');

        card.className =
            "w-[290px] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden font-sans flex flex-col cursor-pointer";

        card.innerHTML = `
            <div class="h-[3px] ${topBorderColor}"></div>

            <div class="p-4 flex-1">

                <div class="flex items-center justify-between mb-3">

                    <div class="w-7 h-7 flex items-center justify-center rounded-full bg-green-50 border border-green-200">
                        ${topImage}
                    </div>

                    <span class="text-[11px] font-semibold bg-red-100 text-red-500 px-3 py-[3px] rounded-full">
                        ${issue.priority.toUpperCase()}
                    </span>

                </div>

                <h3 class="text-[16px] font-semibold text-gray-800 leading-snug mb-2">
                    ${issue.title} <br>
                </h3>

                <p class="text-[13px] text-gray-500 leading-relaxed mb-3">
                    ${issue.description}
                </p>

                <div class="flex gap-2 mb-4">
                    ${issue.labels.map(label => `
                        <span class="flex items-center gap-1 text-[11px] font-medium px-2.5 py-[3px] 
                        border border-red-300 text-black bg-yellow-300 rounded-full">
                        ${label}
                        </span>
                    `).join('')}
                </div>

            </div>

            <div class="border-t border-gray-200 px-4 py-2 text-[12px] text-gray-500">
                #${issue.id} by ${issue.author || 'N/A'} <br>
                ${new Date(issue.createdAt).toLocaleDateString()}
            </div>
        `;

        card.addEventListener("click", () => {

            document.getElementById("modal-date").innerText = new Date(issue.createdAt).toLocaleDateString();
            document.getElementById("modal-title").innerText = issue.title;
            document.getElementById("modal-description").innerText = issue.description;
            document.getElementById("modal-assignee").innerText = issue.assignee || 'N/A';
            document.getElementById("modal-priority").innerText = issue.priority;

            const statusEl = document.getElementById("modal-status");

            statusEl.innerText = issue.status;

            if (issue.status.toLowerCase() === "open") {

                statusEl.className =
                    "px-2 py-[2px] text-xs font-medium rounded-full bg-green-100 text-green-700";

            } else {

                statusEl.className =
                    "px-2 py-[2px] text-xs font-medium rounded-full bg-blue-100 text-blue-700";
            }

            const labelsContainer = document.getElementById("modal-labels");

            labelsContainer.innerHTML = issue.labels.map(label => `
                <span class="text-[11px] px-2 py-[2px] rounded  text-black bg-yellow-300 font-semibold">
                    ${label}
                </span>
            `).join('');

            document.getElementById("Issues_model").showModal();

        });

        allIssues.appendChild(card);

    });

    TotalIssue(data);
}

function TotalIssue(data) {
    totalIssue.innerText = data.length;
}

function ButtonClasses() {

    const buttons = document.querySelectorAll('section button');

    buttons.forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
    });

}

function ButtonEvents() {

    document.getElementById('all').addEventListener('click', () => {

        ButtonClasses();

        document.getElementById('all').classList.add('bg-blue-600', 'text-white');

        IssuesCarts(issuesData);

    });

    document.getElementById('open').addEventListener('click', () => {

        ButtonClasses();

        document.getElementById('open').classList.add('bg-blue-600', 'text-white');

        IssuesCarts(
            issuesData.filter(issue => issue.status.toLowerCase() === 'open')
        );

    });

    document.getElementById('close').addEventListener('click', () => {

        ButtonClasses();

        document.getElementById('close').classList.add('bg-blue-600', 'text-white');

        IssuesCarts(
            issuesData.filter(issue => issue.status.toLowerCase() === 'closed')
        );

    });

}

searchInput.addEventListener('input', function (e) {

    const query = e.target.value.toLowerCase();

    const filtered = issuesData.filter(issue =>
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query) ||
        issue.labels.some(label => label.toLowerCase().includes(query))
    );

    IssuesCarts(filtered);

});

LoadIssues();
ButtonEvents();