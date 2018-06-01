const { shell, remote } = require('electron');
const systemPreferences = remote.systemPreferences;

console.log(remote, systemPreferences);

const newLinkUrl = document.querySelector('#new-link-url');
const newLinkSubmit = document.querySelector('.new-link-form--submit');
const newLinkForm = document.querySelector('.new-link-form');
const linkTemplate = document.querySelector('#link-template');
const linksSection = document.querySelector('.links');
const clearStorageButton = document.querySelector('.controls');


linksSection.addEventListener('click', (event) => {
    if(event.target.href){
        event.preventDefault();
        shell.openExternal(event.target.href)
    }
});

newLinkUrl.addEventListener('keyup', () => {
    newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

const parser = new DOMParser();
const parseResponse = (text) => parser.parseFromString(text, 'text/html');
const findTitle = (nodes) => nodes.querySelector('title').textContent;

const addToPage = ({ title, url }) => {
    const newLink = linkTemplate.content.cloneNode(true);
    const titleElement = newLink.querySelector('.link--title');
    const urlElement = newLink.querySelector('.link--url');
    
    titleElement.textContent = title;
    urlElement.href = url;
    urlElement.textContent = url;
    
    linksSection.appendChild(newLink);
    return { title, url };
};

const clearForm = () => {
    newLinkUrl.value = null;
};

const storeLink = ({ title, url }) => {
    localStorage.setItem(title, url);
    return { title, url };
};







newLinkForm.addEventListener('submit', () => {
    event.preventDefault();
    
    const url = newLinkUrl.value;
    
    // http request
    fetch(url)
    .then(response => response.text())
    .then(parseResponse)
    .then(findTitle)
    .then(title => ({ title, url }))
    .then(addToPage)
    .then(storeLink)
    .then(clearForm)
    .then(clearLink)
    .then(title, url => console.log(title, url))
    .catch(error => console.error(error));
});

window.addEventListener('load', () => {
     if(systemPreferences.isDarkMode()){
         document.querySelector('link').href = 'styles-dark.css';
     }
});

window.addEventListener('load', () => {
    for(let title of Object.keys(localStorage)){
        addToPage({ title, url: localStorage.getItem(title) });
    }
});

clearStorageButton.addEventListener('click', () => {
    localStorage.clear();
    linksSection.innerHTML = '';
});


