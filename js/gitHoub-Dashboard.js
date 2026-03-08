const allIssues = document.getElementById('All-issues');
const totalIssue = document.getElementById('Total-issue');
const searchInput = document.getElementById('search-input');




// Store all issues data from API
let issuesData = [];


async function LoadIssues() {
    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");

        // If response is not successful, throw error
        if (!res.ok) throw new Error("Failed to fetch issues");

        const result = await res.json();

        // Store API data
        issuesData = result.data;

        // Show all issue cards
        IssuesCarts(issuesData);

    } catch (error) {
        console.error("Error loading issues:", error);

        // Show error message in UI
        allIssues.innerHTML = `
        <p class="text-red-500 text-sm">
        Failed to load issues. Please try again later.
        </p>`;
    }
}







function IssuesCarts(data) {

    // Clear previous cards
    allIssues.innerHTML = '';

    data.forEach(issue => {

        const status = issue.status.toLowerCase();

        // Change color depending on issue status
        const topBorderColor = status === 'open'
            ? 'bg-green-500'
            : 'bg-blue-500';

        // Change icon depending on issue status
        const topImage = status === 'open'
            ? '<img src="./assets/Open-Status.png" alt="Open Status">'
            : '<img src="./assets/Closed- Status .png" alt="Closed Status">';

        // Create card element
        const card = document.createElement('div');

        card.className =
            "w-[290px] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden font-sans flex flex-col";

        // Card UI structure
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
                    ${issue.title}
                </h3>

                <p class="text-[13px] text-gray-500 leading-relaxed mb-3">
                    ${issue.description}
                </p>

                <div class="flex gap-2 mb-4">

                    ${issue.labels.map(label => `
                        <span class="flex items-center gap-1 text-[11px] font-medium px-2.5 py-[3px] 
                        border border-red-300 text-red-500 bg-red-50 rounded-full">
                        ${label}
                        </span>
                    `).join('')}

                </div>

            </div>

            <div class="border-t border-gray-200 px-4 py-2 text-[12px] text-gray-500">

                #${issue.id} by ${issue.author} <br>

                ${new Date(issue.createdAt).toLocaleDateString()}

            </div>
        `;

        // Add card to container
        allIssues.appendChild(card);

    });

    // Update visible issue count
    TotalIssue();
}






function TotalIssue() {

    // Count only visible cards
    const visibleCards = Array.from(allIssues.children)
        .filter(card => card.style.display !== 'none');

    // Update number in UI
    totalIssue.innerText = visibleCards.length;
}






function ButtonClasses() {

    const buttons = document.querySelectorAll('section button');

    buttons.forEach(btn => {

        // Remove active styles
        btn.classList.remove('bg-blue-600', 'text-white', 'border');

    });
}






function ButtonEvents() {

    // Show all issues
    document.getElementById('all').addEventListener('click', () => {

        ButtonClasses();

        document.getElementById('all')
            .classList.add('bg-blue-600', 'text-white');

        IssuesCarts(issuesData);

    });

    // Show only open issues
    document.getElementById('open').addEventListener('click', () => {

        ButtonClasses();

        document.getElementById('open')
            .classList.add('bg-blue-600', 'text-white');

        IssuesCarts(
            issuesData.filter(issue =>
                issue.status.toLowerCase() === 'open'
            )
        );

    });

    // Show only closed issues
    document.getElementById('close').addEventListener('click', () => {

        ButtonClasses();

        document.getElementById('close')
            .classList.add('bg-blue-600', 'text-white');

        IssuesCarts(
            issuesData.filter(issue =>
                issue.status.toLowerCase() === 'closed'
            )
        );

    });
}




searchInput.addEventListener('input', function searchBar(e) {

    const query = e.target.value.toLowerCase();

    const filtered = issuesData.filter(issue =>
        issue.title.toLowerCase().includes(query)
    );

    // Show filtered issues
    IssuesCarts(filtered);

});

// Load issues when page loads
LoadIssues();

// Setup filter buttons
ButtonEvents();