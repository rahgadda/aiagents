// Array of component script files
const componentFiles = [
    '../components/aiagent-header/aiagent-header.js',
];

// Dynamically import each component file
componentFiles.forEach(file => {
    import(file).catch(error => {
        console.error(`Failed to load component: ${file}`, error);
    });
});