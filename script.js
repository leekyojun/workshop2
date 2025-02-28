    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const consonants = 'bcdfghjklmnpqrstvwxyz'.split('');
    const firstSlotDigraphs = ['bl', 'br', 'ch', 'cl', 'cr', 'dr', 'dw', 'fl', 'fr', 'gh', 'gl', 'gr', 'kn', 'ph', 'pl', 'pr', 'qu', 'sc', 'scr', 'sh', 'sk', 'sl', 'sm', 'sn', 'sp', 'spl', 'spr', 'sq', 'st', 'str', 'sw', 'th', 'thr', 'tr', 'tw', 'wh', 'wr'];
    const vowelDigraphs = ['ai', 'ar', 'au', 'ay', 'aw', 'ea', 'ee', 'ei', 'eo', 'er', 'ie', 'ir', 'oa', 'oe', 'oi', 'oo', 'or', 'ou', 'ow', 'oy', 'ue', 'ui', 'ur'];
    const consonantDigraphs = ['ch', 'ck', 'dg', 'gh', 'gn', 'll', 'ng', 'nk', 'ph', 'rr', 'sh', 'ss', 'tch', 'th', 'tt'];
    const lastSlotDigraphs = ['ch', 'ck', 'ct', 'dge', 'ft', 'gh', 'gn', 'kb', 'ld', 'le', 'll', 'lt', 'mb', 'mp', 'nce', 'nd', 'ng', 'nk', 'nse', 'nt', 'ph', 'pt', 'rd', 'rn', 'sh', 'sk', 'ss', 'st', 'tch', 'th'];
    const lastSlotVowelDigraphs = ['ar', 'ay', 'aw', 'ea', 'ee', 'er', 'ey', 'ew', 'ie', 'ir', 'oe', 'oo', 'or', 'ow', 'oy', 'ue', 'ur'];
    const slotContainer = document.getElementById('slotContainer');
    let currentSlots = 3;
    const maxSlots = 6;
    const minSlots = 3;

    function createControlButton(text, onClick) {
        const button = document.createElement('button');
        button.classList.add('control-button');
        button.textContent = text;
        button.onclick = onClick;
        return button;
    }

    function createSlot(id) {
        const slot = document.createElement('select');
        slot.id = `slot${id}`;
        slot.onchange = updateWord;
        slot.innerHTML = `<option value="">-</option>`;

        vowels.forEach(vowel => slot.innerHTML += `<option value="${vowel}" style="color: #E54242;">${vowel}</option>`);
        consonants.forEach(consonant => slot.innerHTML += `<option value="${consonant}" style="color: black;">${consonant}</option>`);

        if (id === 1) {
            firstSlotDigraphs.forEach(digraph => slot.innerHTML += `<option value="${digraph}" style="color: #405BE1;">${digraph}</option>`);
        } else if (id === currentSlots) {
            lastSlotVowelDigraphs.forEach(digraph => slot.innerHTML += `<option value="${digraph}" style="color: #E54242;">${digraph}</option>`);
            lastSlotDigraphs.forEach(digraph => slot.innerHTML += `<option value="${digraph}" style="color: #405BE1;">${digraph}</option>`);                
        } else {
            vowelDigraphs.forEach(digraph => slot.innerHTML += `<option value="${digraph}" style="color: #E54242;">${digraph}</option>`);
            consonantDigraphs.forEach(digraph => slot.innerHTML += `<option value="${digraph}" style="color: #405BE1;">${digraph}</option>`);
        }

        return slot;
    }

    function renderSlots() {
        const defaultValues = ['c', 'a', 't']; 
        const selectedValues = {};
        for (let i = 1; i <= currentSlots; i++) {
            const slot = document.getElementById(`slot${i}`);
            if (slot) {
                selectedValues[i] = slot.value;
            }
        }

        slotContainer.innerHTML = '';
        const removeButton = createControlButton("-", removeSlot);
        const addButton = createControlButton("+", addSlot);

        removeButton.disabled = currentSlots <= minSlots;
        addButton.disabled = currentSlots >= maxSlots;

        slotContainer.appendChild(removeButton);

        for (let i = 1; i <= currentSlots; i++) {
            const slot = createSlot(i);
            slotContainer.appendChild(slot);
        
        if (selectedValues[i]) {
            slot.value = selectedValues[i];
        } else if (i <= defaultValues.length) {
            slot.value = defaultValues[i - 1]; 
        }
        }

        slotContainer.appendChild(addButton);
        updateWord();
    }

    function addSlot() {
        if (currentSlots < maxSlots) {
            currentSlots++;
            renderSlots();
        }
    }

    function removeSlot() {
        if (currentSlots > minSlots) {
            currentSlots--;
            renderSlots();
        }
    }

    function updateWord() {
        const wordResultElement = document.getElementById('wordResult');
        const listenButton = document.getElementById('listenButton');
        wordResultElement.innerHTML = '';

        let word = '';
        for (let i = 1; i <= currentSlots; i++) {
            const char = document.getElementById(`slot${i}`).value;
            word += char;

            const span = document.createElement('span');
            span.innerText = char;
            if (firstSlotDigraphs.includes(char) || lastSlotDigraphs.includes(char) || consonantDigraphs.includes(char)) {
                span.style.color = '#405BE1';
            } else if (vowels.includes(char) || vowelDigraphs.includes(char) || lastSlotVowelDigraphs.includes(char)) {
                span.style.color = '#E54242';
            } else {
                span.style.color = 'black';
            }
            wordResultElement.appendChild(span);
        }

        if (!word.trim()) { 
            wordResultElement.innerText = '\u200B'; 
            listenButton.disabled = true;
        } else if (wordList.includes(word)) {
            listenButton.disabled = false;
            listenButton.dataset.word = word;
        } else {
            listenButton.disabled = true;
        }
        
    }

    let wordList = [];
    let originalFileNames = {};  

    fetch('word.json')
        .then(response => response.json())
        .then(data => {
            console.log("Loaded data:", data); // 데이터 확인 로그
            data.forEach(word => {
                wordList.push(word.toLowerCase());
                originalFileNames[word.toLowerCase()] = word;
            });
    
            console.log("Word list initialized:", wordList);
            console.log("Original file names initialized:", originalFileNames);
    
            // 데이터 로드 완료 후 슬롯을 렌더링
            renderSlots();
        })
        .catch(error => console.error("word.json 파일을 불러오는 중 오류 발생:", error));


    document.getElementById('listenButton').addEventListener('click', function () {
        const word = this.dataset.word.toLowerCase();  
        if (word && originalFileNames[word]) {  
            const audioUrl = `https://app.yoons.com/smartbefly/contents/word/${originalFileNames[word]}.mp3`; 
            const audio = new Audio(audioUrl);
            audio.play().catch(error => console.error("오디오 재생 중 오류가 발생했습니다.", error));
        }
    });