const allIssues = document.getElementById('All-issues');

async function LoadIssues() {
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const result = await res.json();
    const issues = result.data;

    issues.forEach(issue => {
        const card = document.createElement('div');
        card.className = "w-[290px] bg-white border rounded-lg shadow-sm overflow-hidden font-sans";

        // Check status and set top border color
        let topBorderColor = issue.status.toLowerCase() === 'open' ? 'bg-green-500' : 'bg-blue-500';

        card.innerHTML = `
            <!-- top border line -->
            <div class="h-[3px] ${topBorderColor}"></div>

            <div class="p-4">

                <!-- Header -->
                <div class="flex items-center justify-between mb-3">

                    <div class="w-7 h-7 flex items-center justify-center rounded-full bg-green-50 border border-green-200">
                        <img src="./assets/Open-Status.png" alt="">
                    </div>

                    <span class="text-[11px] font-semibold bg-red-100 text-red-500 px-3 py-[3px] rounded-full">
                        ${issue.priority.toUpperCase()}
                    </span>

                </div>

                <!-- Title -->
                <h3 class="text-[16px] font-semibold text-gray-800 leading-snug mb-2">
                    ${issue.title}
                </h3>

                <!-- Description -->
                <p class="text-[13px] text-gray-500 leading-relaxed mb-3">
                    ${issue.description}
                </p>

                <!-- Tags -->
                <div class="flex gap-2 mb-4">
                    ${issue.labels.map(label => `
                        <span class="flex items-center gap-1 text-[11px] font-medium px-2.5 py-[3px] 
                        border border-red-300 text-red-500 bg-red-50 rounded-full">
                            ${label}
                        </span>
                    `).join('')}
                </div>

            </div>

            <!-- Footer -->
            <div class="border-t border-gray-200 px-4 py-2 text-[12px] text-gray-500">
                #${issue.id} by ${issue.author} <br>
                ${new Date(issue.createdAt).toLocaleDateString()}
            </div>
        `;

        allIssues.appendChild(card);
    });
}

LoadIssues();