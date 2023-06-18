function debounce(fn, debounceTime) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            await fn.apply(this, args);
        }, debounceTime);
    };
}

function createNodeItem(tagName, nodeItemClass) {
    const nodeItem = document.createElement(tagName);
    if (nodeItemClass) {
        nodeItem.classList.add(nodeItemClass);
    }
    return nodeItem;
}

async function searchRepositories() {
    let request = input.value.toLowerCase();
    let response = await fetch(`https://api.github.com/search/repositories?q=${request}`);
    return await response.json();
}




const app = document.querySelector('#repo-finder');
const search = createNodeItem('div', 'search');
const autocompleteList = createNodeItem('ul', 'autocomplete-list');

const input = createNodeItem('input');
input.type = 'text';
input.placeholder = 'Type here...';
input.autocomplete = 'off';

app.appendChild(search);

search.appendChild(input);
search.appendChild(autocompleteList);

input.addEventListener(
    'keyup',
    debounce(async function (e) {
        if (input.value.length == 0 || e.code == 'Space'){
            autocompleteList.innerHTML = ''
            return;
        };
        autocompleteList.innerHTML = ''
        searchRepositories()
            .then((parsedResponse) => {
                const repoInfoList = [];
                parsedResponse.items.map((repoInfo, i) => {
                    if (i > 4) {
                        return;
                    }
                    repoInfoList.push(repoInfo);
                });
                return repoInfoList;
            })
            .then((response) => {

                response.forEach((repoInfo) => {
                    const autocompleteListItem = createNodeItem('li', 'autocomplete-list-item')
                    autocompleteListItem.textContent = repoInfo.name;
                    autocompleteList.appendChild(autocompleteListItem);

                    autocompleteListItem.addEventListener('click', function() {
                        input.value = '';
                        let clickedItem = createNodeItem('li', 'clicked-item')
                        search.appendChild(clickedItem)
                        clickedItem.insertAdjacentHTML('afterbegin', `<div>stars: ${repoInfo.stargazers_count}</div>`)
                        clickedItem.insertAdjacentHTML('afterbegin', `<div>owner: ${repoInfo.owner.login}</div>`)
                        clickedItem.insertAdjacentHTML('afterbegin', `<div>name: ${repoInfo.name}</div>`)
                        const removalButton = createNodeItem('button', 'removal-button')
                        removalButton.textContent = 'Close'
                        clickedItem.appendChild(removalButton);

                        removalButton.addEventListener('click', function(e) {
                            e.preventDefault();
                            clickedItem.remove();
                        })
                    })
                })
            });
    }, 500)
);



