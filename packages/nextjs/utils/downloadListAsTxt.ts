export const downloadListAsTxt = (list: readonly string[] | undefined, fileName: string) => {
    if (!list || list.length === 0) return;

    // Create the content for the txt file
    const content = list.join('\n');
    
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}