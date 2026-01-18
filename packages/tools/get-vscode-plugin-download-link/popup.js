document.addEventListener('DOMContentLoaded', async () => {
    const resultDiv = document.getElementById('result');

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url || !tab.url.includes('marketplace.visualstudio.com')) {
            showError('Please navigate to a VS Code Marketplace extension page.');
            return;
        }

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: extractExtensionData,
        }, (results) => {
            if (chrome.runtime.lastError) {
                showError('Error: ' + chrome.runtime.lastError.message);
                return;
            }

            const data = results[0].result;
            if (data.error) {
                showError(data.error);
            } else {
                showSuccess(data);
            }
        });

    } catch (err) {
        showError('Unexpected error: ' + err.message);
    }

    function showError(message) {
        resultDiv.className = 'error';
        resultDiv.textContent = message;
    }

    function showSuccess(data) {
        resultDiv.className = 'success';
        resultDiv.innerHTML = `
            <div><strong>Publisher:</strong> ${data.publisher}</div>
            <div><strong>Extension:</strong> ${data.extensionName}</div>
            <div><strong>Version:</strong> ${data.version}</div>
            <a href="${data.downloadUrl}" class="download-btn" target="_blank">Download .vsix</a>
        `;
    }
});

// This function runs in the context of the page
function extractExtensionData() {
    try {
        const identifierEl = document.querySelector('[aria-labelledby="unique-identifier"]');
        const versionEl = document.querySelector('[aria-labelledby="version"]');

        if (!identifierEl) {
            return { error: 'Could not find unique identifier element. Are you on a valid extension page?' };
        }
        if (!versionEl) {
            return { error: 'Could not find version element.' };
        }

        const uniqueIdText = identifierEl.textContent.trim();
        const version = versionEl.textContent.trim();

        // uniqueIdText expected format: "publisher.extension-name"
        const parts = uniqueIdText.split('.');
        if (parts.length < 2) {
            return { error: `Invalid identifier format: "${uniqueIdText}". Expected "publisher.extension-name".` };
        }

        const publisher = parts[0];
        const extensionName = parts[1];

        const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extensionName}/${version}/vspackage`;

        return {
            publisher,
            extensionName,
            version,
            downloadUrl
        };
    } catch (e) {
        return { error: 'Extraction failed: ' + e.message };
    }
}
