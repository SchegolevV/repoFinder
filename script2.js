class SearchBar {
    constructor() {
        this.app = document.querySelector('#repo-finder')
        this.searchArea = this.createElement('ul', 'search')

        this.searchInput = this.createElement('input')
        this.searchInput.type = 'text'
        this.searchInput.placeholder = 'Hi there..'
        this.searchInput.autocomplete = 'off'

        this.searchArea.appendChild(this.searchInput)
        this.app.append(this.searchArea)
        
        
    }
    createElement(tag, className) {
        const element = document.createElement(tag);
        if (className) {
            element.classList.add(className);
        }
        return element;
    }
}

class Autocomplete {
    constructor(searchBar) {
        this.searchBar = searchBar;
        let searchRepositories = this.debounce(this.searchRepositories.bind(this), 1000);
        searchBar.searchArea.addEventListener('keyup', function(e) {
            searchRepositories()
            console.log('click')
        })
        
    }
    async searchRepositories() {
        let request = this.searchBar.searchInput.value.toLowerCase();
        let response = await fetch(`https://api.github.com/search/repositories?q=${request}`);
        console.log('hi')
        return await response.json(); 
    }
    debounce(fn, debounceTime) {
        let timer;
        return function(...args) {
            clearTimeout(timer)
            timer = setInterval(() => {
                fn.apply(this, args)
            }, debounceTime)
        }
    }
}


new Autocomplete(new SearchBar())