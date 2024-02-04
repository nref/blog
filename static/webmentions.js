// Fetches webmentions and appends them as list items to the specified element.
async function fetchWebmentions() {
  const endpoint = 'https://webmention.io/api/mentions?token=XLeyknxwZFJQ74Al2nsu2A';
  const responseElementId = 'webmentions'; // The ID of the element where webmentions will be displayed.

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json(); // Parses the JSON response.

    // Create a list to hold the webmentions.
    const list = document.createElement('ul');

    const status = document.createElement('p');
    status.style.fontStyle = 'italic';
    document.getElementById(responseElementId).appendChild(status);

    status.innerText = `Found ${data.links.length} links`;

    // Iterate through each webmention and append it to the list.
    data.links.forEach(mention => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = mention.source; // Assuming 'source' is the URL of the webmention.
      link.textContent = mention.source; // Set the link text (customize as needed).
      item.appendChild(link);
      
      // Add additional webmention details here as needed.

      list.appendChild(item);
    });

    // Append the list to the designated element.
    document.getElementById(responseElementId).appendChild(list);
  } catch (error) {
    console.error('Failed to fetch webmentions: ', error);
  }
}

// Run the fetch operation when the document is fully loaded.
document.addEventListener('DOMContentLoaded', fetchWebmentions);
